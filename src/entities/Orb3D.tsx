import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type OrbProps = {
  onClick: () => void;
  position?: [number, number, number];
  scale?: number;
};

export default function Orb3D({
  onClick,
  position = [0, 0, 0],
  scale = 1,
}: OrbProps) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;
    }
  });

  return (
    <mesh
      ref={ref}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={position}
      scale={hovered ? scale * 1.2 : scale}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="cyan"
        emissive="cyan"
        emissiveIntensity={hovered ? 1 : 0.4}
      />
    </mesh>
  );
}
