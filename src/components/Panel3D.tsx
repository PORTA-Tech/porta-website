// src/components/Panel3D.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDepth } from "../depth/DepthContext";

interface Panel3DProps {
  zOffset: number;     // where this panel lives in depth
  x?: number;
  y?: number;
}

export default function Panel3D({ zOffset, x = 0, y = 0 }: Panel3DProps) {
  const ref = useRef<THREE.Mesh>(null);
  const { depth } = useDepth();

  useFrame(() => {
    if (!ref.current) return;

    // Depth parallax: scroll moves panels relative to orb
    ref.current.position.z = zOffset + depth * -6;
  });

  return (
    <mesh ref={ref} position={[x, y, zOffset]}>
      <planeGeometry args={[1.2, 0.7]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#00ffff"
        emissiveIntensity={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}
