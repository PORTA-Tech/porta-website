// src/App.tsx
import { Canvas } from "@react-three/fiber";
import { DepthProvider } from "./depth/DepthContext";
import DepthController from "./depth/DepthController";
import CameraRig from "./world/CameraRig";
import World3D from "./world/World3D";

function App() {
  return (
    <DepthProvider>
      <DepthController />

      <Canvas
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 6] }}
        style={{ width: "100%", height: "100vh" }}
      >
        {/* CameraRig just holds the group, no children yet */}
        <CameraRig startZ={6} maxZ={0} />

        {/* Your orb + panels */}
        <World3D />
      </Canvas>

      {/* scroll space */}
      <div style={{ height: "300vh" }} />
    </DepthProvider>
  );
}

export default App;
