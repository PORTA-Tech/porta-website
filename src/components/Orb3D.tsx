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
  color = "#00ffff", // cyan
  glowIntensity = 1.5,
}: Orb3DProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Animate rotation and pulsing scale
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Orb rotation
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2; // slow rotation
      const pulse = 1 + 0.05 * Math.sin(t * 1.5); // ambient pulse
      orbRef.current.scale.set(pulse, pulse, pulse);
    }

    // Inner rings rotation/pulse
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.4;
      ringsRef.current.rotation.x = t * 0.2;
    }
  });

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
        {[0.8, 1.0, 1.2].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.02, 16, 100]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={glowIntensity * 0.6}
              metalness={0.1}
              roughness={0.2}
              transparent
              opacity={0.6 - i * 0.15} // inner rings fade out
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
