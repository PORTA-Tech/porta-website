import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Orb3D from "../components/Orb3D";

interface World3DProps {
  sceneIndex: number;
}

const SCENE_Z = [0, 1, 2.5, 4, 5.5, 7];

export default function World3D({ sceneIndex }: World3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [targetRotationY, setTargetRotationY] = useState(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only horizontal scroll affects rotation
      const deltaX = e.deltaX;
      const ROTATION_STEP = 0.05; // radian per scroll event
      if (deltaX > 0) setTargetRotationY((prev) => prev + ROTATION_STEP);
      if (deltaX < 0) setTargetRotationY((prev) => prev - ROTATION_STEP);
      // Vertical scroll deltaY is ignored here (scene Z movement handled elsewhere)
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // Scene Z interpolation (unchanged, still controlled by sceneIndex)
    const currentZ = groupRef.current.position.z;
    const targetZ = SCENE_Z[sceneIndex];
    groupRef.current.position.z += (targetZ - currentZ) * 0.1;

    // Smooth horizontal rotation interpolation
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Orb3D mode={sceneIndex} />
    </group>
  );
}
