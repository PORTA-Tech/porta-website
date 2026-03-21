import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
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

const SCENE_NAV_LOCK_MS = 420;
const SWIPE_TRIGGER_PX = 72;
const SWIPE_HORIZONTAL_TOLERANCE = 1.15;
const MOBILE_MEDIA_QUERY = "(max-width: 900px), (pointer: coarse)";

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
  const [isMobileNavigation, setIsMobileNavigation] = useState(false);
  const scrollLockRef = useRef(false);
  const touchSessionRef = useRef<TouchSession | null>(null);
  const lockTimerRef = useRef<number | null>(null);

  const releaseNavigationLock = useCallback(() => {
    scrollLockRef.current = false;
    if (lockTimerRef.current !== null) {
      window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, []);

  const armNavigationLock = useCallback(() => {
    scrollLockRef.current = true;
    if (lockTimerRef.current !== null) {
      window.clearTimeout(lockTimerRef.current);
    }

    lockTimerRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
      lockTimerRef.current = null;
    }, SCENE_NAV_LOCK_MS);
  }, []);

  const setSceneIndex = useCallback((nextIndex: number) => {
    setActiveIndex(() => Math.max(0, Math.min(nextIndex, scenes.length - 1)));
  }, []);

  const navigateToIndex = useCallback((nextIndex: number) => {
    if (scrollLockRef.current) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(nextIndex, scenes.length - 1));
    if (boundedIndex === activeIndex) {
      return;
    }

    armNavigationLock();
    setSceneIndex(boundedIndex);
  }, [activeIndex, armNavigationLock, setSceneIndex]);

  const handleAdvance = useCallback(() => {
    navigateToIndex(activeIndex + 1);
  }, [activeIndex, navigateToIndex]);

  const handleBack = useCallback(() => {
    navigateToIndex(activeIndex - 1);
  }, [activeIndex, navigateToIndex]);

  useEffect(() => {
    onSceneChange(activeIndex);
  }, [activeIndex, onSceneChange]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const syncMobileNavigation = (query: MediaQueryList | MediaQueryListEvent) => {
      setIsMobileNavigation(query.matches);
    };

    syncMobileNavigation(mediaQuery);
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", syncMobileNavigation);
      return () => mediaQuery.removeEventListener("change", syncMobileNavigation);
    }

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (query: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (query: MediaQueryListEvent) => void) => void;
    };

    legacyMediaQuery.addListener?.(syncMobileNavigation);
    return () => legacyMediaQuery.removeListener?.(syncMobileNavigation);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (scrollLockRef.current) {
        return;
      }

      if (event.key === "n" || event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        handleAdvance();
      } else if (event.key === "p" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance, handleBack]);

  useEffect(() => {
    let wheelTimeout: number | null = null;

    const handleWheel = (event: WheelEvent) => {
      if (scrollLockRef.current) {
        return;
      }

      if (Math.abs(event.deltaY) < 18 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }

      if (event.deltaY > 0) {
        handleAdvance();
      } else {
        handleBack();
      }

      if (wheelTimeout !== null) {
        window.clearTimeout(wheelTimeout);
      }

      wheelTimeout = window.setTimeout(releaseNavigationLock, SCENE_NAV_LOCK_MS);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout !== null) {
        window.clearTimeout(wheelTimeout);
      }
    };
  }, [handleAdvance, handleBack, releaseNavigationLock]);

  useEffect(() => {
    return () => {
      releaseNavigationLock();
    };
  }, [releaseNavigationLock]);

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
      ignoreSwipe: isInteractiveTarget(event.target),
    };
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const session = touchSessionRef.current;
    if (!touch || !session) {
      return;
    }

    if (session.ignoreSwipe) {
      return;
    }

    session.currentX = touch.clientX;
    session.currentY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const session = touchSessionRef.current;
    touchSessionRef.current = null;

    if (session?.ignoreSwipe || scrollLockRef.current || !canUseTouchNavigation(session)) {
      return;
    }

    const deltaY = (session?.currentY ?? 0) - (session?.startY ?? 0);
    if (deltaY < 0) {
      handleAdvance();
    } else {
      handleBack();
    }
  }, [handleAdvance, handleBack]);

  const ActiveScene = scenes[activeIndex];
  const sceneDots = useMemo(() => scenes.map((_, index) => index), []);

  return (
    <div
      className="scene-root"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ActiveScene isActive={true} onAdvance={handleAdvance} />

      <div
        className={`scene-mobile-nav${isMobileNavigation && activeIndex > 0 ? " is-visible" : ""}`}
      >
        <div className="scene-mobile-nav__buttons">
          <button
            type="button"
            className="scene-mobile-nav__button"
            onClick={handleBack}
            disabled={activeIndex === 0}
            aria-label="Go to previous scene"
          >
            Back
          </button>

          <div className="scene-mobile-nav__dots" aria-label="Scene navigation">
            {sceneDots.map((index) => (
              <button
                key={index}
                type="button"
                className={`scene-mobile-nav__dot${index === activeIndex ? " is-active" : ""}`}
                onClick={() => navigateToIndex(index)}
                aria-label={`Go to scene ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="scene-mobile-nav__button"
            onClick={handleAdvance}
            disabled={activeIndex === scenes.length - 1}
            aria-label="Go to next scene"
          >
            Next
          </button>
        </div>

        <div className="scene-mobile-nav__hint">
          Swipe up or down to move through Ari.
        </div>
      </div>
    </div>
  );
}
