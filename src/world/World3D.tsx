import Orb3D from "../components/Orb3D";
import Panel3D from "../components/Panel3D";

export default function World3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />

      {/* Orb */}
      <Orb3D />

      {/* Panels */}
      <Panel3D zOffset={-2} x={-1.5} y={0.5} />
      <Panel3D zOffset={-4} x={1.2} y={-0.3} />
      <Panel3D zOffset={-6} x={0.3} y={1.1} />
    </>
  );
}
