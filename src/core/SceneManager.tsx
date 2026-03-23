import { useState, useEffect, useCallback, useRef } from "react";
import Scene0_Portal from "../scenes/Scene0_Portal";
import Scene1_Perception from "../scenes/Scene1_Perception";
import Scene2_Adaptive from "../scenes/Scene2_Adaptive";
import Scene3_Applications from "../scenes/Scene3_Applications";
import Scene4_Technical from "../scenes/Scene4_Technical";
import Scene5_Access from "../scenes/Scene5_Access";

interface SceneManagerProps {
  onSceneChange: (index: number) => void;
}

const scenes = [
  Scene0_Portal,
  Scene1_Perception,
  Scene2_Adaptive,
  Scene3_Applications,
  Scene4_Technical,
  Scene5_Access,
];

const SWIPE_TRIGGER_PX = 72;
const SWIPE_HORIZONTAL_TOLERANCE = 1.15;
const KEYBOARD_NAV_LOCK_MS = 220;
const TOUCH_NAV_LOCK_MS = 240;
const WHEEL_NAV_LOCK_MS = 460;
const WHEEL_TRIGGER_DELTA = 28;

type TouchSession = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  scrollContainer: HTMLElement | null;
  ignoreSwipe: boolean;
};

function canUseTouchNavigation(touch: TouchSession | null) {
  if (!touch) {
    return false;
  }

  const deltaX = touch.currentX - touch.startX;
  const deltaY = touch.currentY - touch.startY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  return absY >= SWIPE_TRIGGER_PX && absY > absX * SWIPE_HORIZONTAL_TOLERANCE;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest("button, input, textarea, select, a, label, [role='button'], [contenteditable='true']")
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  );
}

function getScrollableFormContainer(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest(".scene-access-panel-scrollable") as HTMLElement | null;
}

function canScrollContainer(container: HTMLElement | null, gestureDeltaY: number) {
  if (!container || container.scrollHeight <= container.clientHeight + 1) {
    return false;
  }

  if (gestureDeltaY < 0) {
    return container.scrollTop + container.clientHeight < container.scrollHeight - 1;
  }

  if (gestureDeltaY > 0) {
    return container.scrollTop > 0;
  }

  return false;
}

export default function SceneManager({ onSceneChange }: SceneManagerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const scrollLockRef = useRef(false);
  const touchSessionRef = useRef<TouchSession | null>(null);
  const navigationUnlockTimeoutRef = useRef<number | null>(null);

  const scheduleNavigationUnlock = useCallback((delayMs = 200) => {
    if (navigationUnlockTimeoutRef.current !== null) {
      window.clearTimeout(navigationUnlockTimeoutRef.current);
    }

    navigationUnlockTimeoutRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
      navigationUnlockTimeoutRef.current = null;
    }, delayMs);
  }, []);

  const navigateToIndex = useCallback((nextIndex: number) => {
    const clamped = Math.max(0, Math.min(nextIndex, scenes.length - 1));
    if (clamped === activeIndexRef.current) {
      return false;
    }

    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
    onSceneChange(clamped);
    return true;
  }, [onSceneChange]);

  const handleAdvance = useCallback(() => {
    return navigateToIndex(activeIndexRef.current + 1);
  }, [navigateToIndex]);

  const handleBack = useCallback(() => {
    return navigateToIndex(activeIndexRef.current - 1);
  }, [navigateToIndex]);

  // Keyboard navigation (n / p)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (scrollLockRef.current) return;
      if (isEditableTarget(e.target) || isEditableTarget(document.activeElement)) return;
      if (e.key === "n") {
        if (handleAdvance()) {
          scrollLockRef.current = true;
          scheduleNavigationUnlock(KEYBOARD_NAV_LOCK_MS);
        }
      }
      if (e.key === "p") {
        if (handleBack()) {
          scrollLockRef.current = true;
          scheduleNavigationUnlock(KEYBOARD_NAV_LOCK_MS);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance, handleBack, scheduleNavigationUnlock]);

  // Vertical wheel navigation only. Horizontal trackpad movement is reserved for orb rotation.
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (scrollLockRef.current) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < WHEEL_TRIGGER_DELTA) return;
      if (canScrollContainer(getScrollableFormContainer(e.target), e.deltaY)) return;

      if (e.deltaY > 0) {
        if (!handleAdvance()) return;
        scrollLockRef.current = true;
        scheduleNavigationUnlock(WHEEL_NAV_LOCK_MS);
      } else if (e.deltaY < 0) {
        if (!handleBack()) return;
        scrollLockRef.current = true;
        scheduleNavigationUnlock(WHEEL_NAV_LOCK_MS);
      }
    };
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      if (navigationUnlockTimeoutRef.current !== null) {
        window.clearTimeout(navigationUnlockTimeoutRef.current);
        navigationUnlockTimeoutRef.current = null;
      }
      scrollLockRef.current = false;
    };
  }, [handleAdvance, handleBack, scheduleNavigationUnlock]);

  // Phone swipe navigation starts only after scene 0.
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      touchSessionRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        scrollContainer: getScrollableFormContainer(event.target),
        ignoreSwipe: activeIndexRef.current === 0 || isInteractiveTarget(event.target),
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const session = touchSessionRef.current;
      if (!touch || !session || session.ignoreSwipe) {
        return;
      }

      session.currentX = touch.clientX;
      session.currentY = touch.clientY;
      const gestureDeltaY = session.currentY - session.startY;

      if (canScrollContainer(session.scrollContainer, gestureDeltaY)) {
        return;
      }

      if (canUseTouchNavigation(session) && event.cancelable) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const session = touchSessionRef.current;
      touchSessionRef.current = null;

      const finalTouch = event.changedTouches[0];
      if (session && finalTouch) {
        session.currentX = finalTouch.clientX;
        session.currentY = finalTouch.clientY;
      }

      if (!session || session.ignoreSwipe || scrollLockRef.current || !canUseTouchNavigation(session)) {
        return;
      }

      const deltaY = session.currentY - session.startY;
      if (canScrollContainer(session.scrollContainer, deltaY)) {
        return;
      }

      const didNavigate = deltaY < 0
        ? handleAdvance()
        : deltaY > 0
          ? handleBack()
          : false;

      if (!didNavigate) {
        return;
      }

      scrollLockRef.current = true;
      scheduleNavigationUnlock(TOUCH_NAV_LOCK_MS);
    };

    const handleTouchCancel = () => {
      touchSessionRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [handleAdvance, handleBack, scheduleNavigationUnlock]);

  const ActiveScene = scenes[activeIndex];
  return <ActiveScene isActive={true} onAdvance={handleAdvance} />;
}
