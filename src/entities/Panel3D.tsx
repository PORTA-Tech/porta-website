import { Float, Text } from "@react-three/drei";
import { useState } from "react";

type Panel3DProps = {
  title: string;
  position?: [number, number, number];
};

export default function Panel3D({
  title,
  position = [0, 0, 0],
}: Panel3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.4}
    >
      <group
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
        rotation={hovered ? [0.05, 0.1, 0] : [0, 0, 0]}
      >
        {/* Panel body */}
        <mesh>
          <planeGeometry args={[2.8, 1.6]} />
          <meshPhysicalMaterial
            color="#0b1020"
            transmission={0.85}
            thickness={0.4}
            roughness={0.15}
            metalness={0.05}
            ior={1.4}
            clearcoat={0.2}
            emissive="#1a2cff"
            emissiveIntensity={hovered ? 0.35 : 0.12}
/>
        </mesh>

        {/* Text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      </group>
    </Float>
  );
}
