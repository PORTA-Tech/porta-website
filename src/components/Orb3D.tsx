import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Orb3DProps {
  mode: number; // scene index
  radius?: number;
  color?: string;
  glowIntensity?: number;
  position?: [number, number, number];
}

export default function Orb3D({
  mode,
  radius = 1.5,
  color = "#00ffff",
  glowIntensity = 1.5,
  position = [0, 0, 0],
}: Orb3DProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      let scale = 1;
      switch (mode) {
        case 0:
          scale = 1 + 0.02 * Math.sin(t * 2); // subtle idle
          break;
        case 1:
          scale = 1 + 0.05 * Math.sin(t * 3); // more intense
          break;
        case 2:
          scale = 1 + 0.1 * Math.sin(t * 4); // structural change
          break;
      }
      orbRef.current.scale.set(scale, scale, scale);
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.8;
      ringsRef.current.rotation.x = t * 0.4;
    }
  });

  const ringRadii = [radius + 0.1, radius + 0.3, radius + 0.5];
  const ringOpacity = [0.9, 0.7, 0.5];
  const ringGlow = [glowIntensity * 1.2, glowIntensity, glowIntensity * 0.8];

  return (
    <group position={position}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
      <group ref={ringsRef}>
        {ringRadii.map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.12, 16, 100]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={ringGlow[i]}
              metalness={0.1}
              roughness={0.2}
              transparent
              opacity={ringOpacity[i]}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
