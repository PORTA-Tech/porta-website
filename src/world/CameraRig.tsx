// src/world/CameraRig.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useDepth } from "../depth/DepthContext";
import * as THREE from "three"; // <-- add this

interface CameraRigProps {
  startZ?: number;
  maxZ?: number;
}

export default function CameraRig({ startZ = 6, maxZ = 0 }: CameraRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { depth } = useDepth();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = startZ + depth * (maxZ - startZ);
    }
  });

  return <group ref={groupRef} />;
}
