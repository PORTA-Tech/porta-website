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

type TouchSession = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
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
    target.closest("button, input, textarea, select, a, label, [role='button']")
  );
}

export default function SceneManager({ onSceneChange }: SceneManagerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
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

  const handleAdvance = useCallback(() => {
    setActiveIndex((prev) => {
      const next = Math.min(prev + 1, scenes.length - 1);
      onSceneChange(next);
      return next;
    });
  }, [onSceneChange]);

  const handleBack = useCallback(() => {
    setActiveIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      onSceneChange(next);
      return next;
    });
  }, [onSceneChange]);

  // Keyboard navigation (n / p)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (scrollLockRef.current) return;
      if (e.key === "n") {
        scrollLockRef.current = true;
        handleAdvance();
        scheduleNavigationUnlock();
      }
      if (e.key === "p") {
        scrollLockRef.current = true;
        handleBack();
        scheduleNavigationUnlock();
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

      if (e.deltaY > 0 && activeIndex < scenes.length - 1) {
        scrollLockRef.current = true;
        handleAdvance();
      } else if (e.deltaY < 0 && activeIndex > 0) {
        scrollLockRef.current = true;
        handleBack();
      }
    };

    const wrappedWheel = (e: WheelEvent) => {
      handleScroll(e);
      scheduleNavigationUnlock();
    };

    window.addEventListener("wheel", wrappedWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", wrappedWheel);
      if (navigationUnlockTimeoutRef.current !== null) {
        window.clearTimeout(navigationUnlockTimeoutRef.current);
        navigationUnlockTimeoutRef.current = null;
      }
      scrollLockRef.current = false;
    };
  }, [activeIndex, handleAdvance, handleBack, scheduleNavigationUnlock]);

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
        ignoreSwipe: activeIndex === 0 || isInteractiveTarget(event.target),
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

      scrollLockRef.current = true;

      const deltaY = session.currentY - session.startY;
      if (deltaY < 0 && activeIndex < scenes.length - 1) {
        handleAdvance();
      } else if (deltaY > 0 && activeIndex > 0) {
        handleBack();
      }

      scheduleNavigationUnlock();
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
  }, [activeIndex, handleAdvance, handleBack, scheduleNavigationUnlock]);

  const ActiveScene = scenes[activeIndex];
  return <ActiveScene isActive={true} onAdvance={handleAdvance} />;
}
