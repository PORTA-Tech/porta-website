import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";
import FloatingParticles from "../components/FloatingParticles";
import type { SceneProps } from "./SceneProps";
import * as THREE from "three";

export default function Scene0_3D({ onAdvance }: SceneProps) {
  const bgRef = useRef<THREE.Mesh>(null);

  // Animate background color drift
  useFrame(({ clock }) => {
    if (bgRef.current) {
      const mat = bgRef.current.material as THREE.MeshStandardMaterial;
      const hue = (clock.getElapsedTime() * 10) % 360;
      mat.color.setHSL(hue / 360, 0.3, 0.05);
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Background plane */}
      <mesh ref={bgRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#001" />
      </mesh>

      {/* Orb */}
      <group position={[0, 0.5, 0]}>
        <Orb3D onClick={onAdvance} />
      </group>

      {/* Floating background particles */}
      <FloatingParticles />
    </>
  );
}
