import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import SceneManager from "../core/SceneManager";
import World3D from "../world/World3D";

export default function ImmersiveExperienceApp() {
  const [sceneIndex, setSceneIndex] = useState(0);

  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <World3D sceneIndex={sceneIndex} />
      </Canvas>

      <SceneManager onSceneChange={setSceneIndex} />
    </>
  );
}
