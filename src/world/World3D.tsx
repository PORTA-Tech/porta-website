import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Orb3D from "../components/Orb3D";

interface World3DProps {
  sceneIndex: number;
}

// Positive Z = world comes closer
const SCENE_Z = [0, 1, 2.5, 4, 5.50, 7];

export default function World3D({ sceneIndex }: World3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const currentZ = groupRef.current.position.z;
    const targetZ = SCENE_Z[sceneIndex]; 
    // Smooth interpolation
    groupRef.current.position.z += (targetZ - currentZ) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Orb3D mode={sceneIndex} />
      {/* Add other world objects here if needed */}
    </group>
  );
}
