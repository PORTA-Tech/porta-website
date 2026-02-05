import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Scene0_3D from "../Scenes3D/Scene0_3D";
import Scene1_3D from "../Scenes3D/Scene1_3D";

const scenes = [Scene0_3D, Scene1_3D];

export default function SceneManager3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveScene = scenes[activeIndex];

  const handleAdvance = () => {
    setActiveIndex((prev) => Math.min(prev + 1, scenes.length - 1));
  };

  // Keyboard nav: n → next, p → previous
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "n") handleAdvance();
      if (e.key === "p") setActiveIndex((prev) => Math.max(prev - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
      <ActiveScene onAdvance={handleAdvance} />
    </Canvas>
  );
}
