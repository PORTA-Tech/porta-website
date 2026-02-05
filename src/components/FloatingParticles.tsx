import { Points, PointMaterial } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = new Float32Array(300 * 3);
  for (let i = 0; i < 300 * 3; i++) {
    particles[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.005;
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial color="#1a2cff" size={0.05} />
    </Points>
  );
}
