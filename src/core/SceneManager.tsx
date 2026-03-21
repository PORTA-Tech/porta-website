import { useState, useEffect, useCallback, useRef, type TouchEvent } from "react";
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
      }
      if (e.key === "p") {
        scrollLockRef.current = true;
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance, handleBack]);

  // Scroll navigation
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (scrollLockRef.current) return;

      if (e.deltaY > 0 && activeIndex < scenes.length - 1) {
        scrollLockRef.current = true;
        handleAdvance();
      } else if (e.deltaY < 0 && activeIndex > 0) {
        scrollLockRef.current = true;
        handleBack();
      }
    };

    const releaseLock = () => {
      scrollLockRef.current = false;
    };

    // Listen to wheel + release lock after scroll ends
    let wheelTimeout: number | null = null;
    const wrappedWheel = (e: WheelEvent) => {
      handleScroll(e);
      if (wheelTimeout !== null) {
        window.clearTimeout(wheelTimeout);
      }

      wheelTimeout = window.setTimeout(releaseLock, 200);
    };

    window.addEventListener("wheel", wrappedWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", wrappedWheel);
      if (wheelTimeout !== null) {
        window.clearTimeout(wheelTimeout);
      }
    };
  }, [activeIndex, handleAdvance, handleBack]);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
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
  }, [activeIndex]);

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const session = touchSessionRef.current;
    if (!touch || !session || session.ignoreSwipe) {
      return;
    }

    session.currentX = touch.clientX;
    session.currentY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent<HTMLDivElement>) => {
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

    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 200);
  }, [activeIndex, handleAdvance, handleBack]);

  const ActiveScene = scenes[activeIndex];

  return (
    <div
      className="scene-root"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ActiveScene isActive={true} onAdvance={handleAdvance} />
    </div>
  );
}
