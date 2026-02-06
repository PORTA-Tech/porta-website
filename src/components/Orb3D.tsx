// src/components/Orb3D.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Orb3DProps {
  radius?: number;
  color?: string;
  glowIntensity?: number;
}

export default function Orb3D({
  radius = 1.5,
  color = "#00ffff",
  glowIntensity = 1.5,
}: Orb3DProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Orb rotation and pulse
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      const pulse = 1 + 0.05 * Math.sin(t * 1.5);
      orbRef.current.scale.set(pulse, pulse, pulse);
    }

    // Inner rings rotation
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.8;
      ringsRef.current.rotation.x = t * 0.4;
    }
  });

  // Radii for rings (slightly larger than orb)
  const ringRadii = [radius + 0.1, radius + 0.3, radius + 0.5];
  const ringOpacity = [0.9, 0.7, 0.5];
  const ringGlow = [glowIntensity * 1.2, glowIntensity, glowIntensity * 0.8];

  return (
    <group>
      {/* Main orb */}
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

      {/* Inner rings */}
      <group ref={ringsRef}>
        {ringRadii.map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.12, 16, 100]} /> {/* thicker and bigger rings */}
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
