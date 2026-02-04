import { useState, useEffect } from "react";
import Scene0_Portal from "../scenes/Scene0_Portal";
import Scene1_Perception from "../scenes/Scene1_Perception";
import Scene2_Adaptive from "../scenes/Scene2_Adaptive";
import Scene3_Applications from "../scenes/Scene3_Applications";
import Scene4_Technical from "../scenes/Scene4_Technical";
import Scene5_Access from "../scenes/Scene5_Access";

const scenes = [
  Scene0_Portal,
  Scene1_Perception,
  Scene2_Adaptive,
  Scene3_Applications,
  Scene4_Technical,
  Scene5_Access,
];

export default function SceneManager() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAdvance = () => {
    setActiveIndex((prev) => Math.min(prev + 1, scenes.length - 1));
  };

  // Minor keyboard triggers for testing
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "n") handleAdvance(); // press 'n' to advance scene
      if (e.key === "p") setActiveIndex((prev) => Math.max(prev - 1, 0)); // press 'p' to go back
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {scenes.map((SceneComponent, idx) => (
        <div
          key={idx}
          style={{
            display: idx === activeIndex ? "block" : "none",
            width: "100%",
            height: "100%",
          }}
        >
          <SceneComponent isActive={idx === activeIndex} onAdvance={handleAdvance} />
        </div>
      ))}
    </>
  );
}
