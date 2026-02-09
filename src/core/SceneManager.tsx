import { useState, useEffect, useCallback } from "react";
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

  // Advance to next scene
  const handleAdvance = useCallback(() => {
    setActiveIndex((prev) => {
      const next = Math.min(prev + 1, scenes.length - 1);
      onSceneChange(next);
      return next;
    });
  }, [onSceneChange]);

  // Go back to previous scene
  const handleBack = useCallback(() => {
    setActiveIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      onSceneChange(next);
      return next;
    });
  }, [onSceneChange]);

  // Dev keyboard navigation: n / p
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "n") handleAdvance();
      if (e.key === "p") handleBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance, handleBack]);

  // Automatic advance for scenes 1–4
  useEffect(() => {
    if (activeIndex === 0 || activeIndex === 5) return;

    const timer = setTimeout(() => handleAdvance(), 12000); // 12s max per scene
    return () => clearTimeout(timer);
  }, [activeIndex, handleAdvance]);

  const ActiveScene = scenes[activeIndex];

  // Pass isActive to the scene
  return (
    <ActiveScene
      isActive={true}        // ✅ Only current scene sees isActive
      onAdvance={handleAdvance}
    />
  );
}
