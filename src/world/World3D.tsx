import Orb3D from "../components/Orb3D";

interface World3DProps {
  sceneIndex: number;
}

export default function World3D({ sceneIndex }: World3DProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Orb3D mode={sceneIndex} />
    </>
  );
}
