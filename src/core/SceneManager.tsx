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

export default function SceneManager({ onSceneChange }: SceneManagerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollLockRef = useRef(false);

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
    let wheelTimeout: any = null;
    const wrappedWheel = (e: WheelEvent) => {
      handleScroll(e);
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(releaseLock, 200); // 200ms after last wheel event
    };

    window.addEventListener("wheel", wrappedWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", wrappedWheel);
      clearTimeout(wheelTimeout);
    };
  }, [activeIndex, handleAdvance, handleBack]);

  const ActiveScene = scenes[activeIndex];
  return <ActiveScene isActive={true} onAdvance={handleAdvance} />;
}
