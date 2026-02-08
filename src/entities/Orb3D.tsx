// Orb3D.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type Orb3DProps = {
  active: boolean;          // ← comes from scene
  intensity?: number;       // ← scene-specific
};

export default function Orb3D({
  active,
  intensity = 0,
}: Orb3DProps) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    // ONLY react if scene is active
    if (active) {
      ref.current.rotation.y += intensity;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={active ? 1 : 0.3}
      />
    </mesh>
  );
}
