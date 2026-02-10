import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Orb3DProps {
  mode: number; // scene index
  radius?: number;
  position?: [number, number, number];
}

export default function Orb3D({
  mode,
  radius = 3.5, // base radius for particles
  position = [0, 0, 0],
}: Orb3DProps) {
  const orbRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Particle orb
  const orbParticles = useMemo(() => {
    const particleCount = 1400;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * 0.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }, [radius]);

  // Ring geometry
  const ringGeometries = useMemo(() => {
    const rings = [];
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
      const inner = radius * (0.65 + i * 0.15);
      const outer = radius * (0.66 + i * 0.15);
      const geometry = new THREE.RingGeometry(inner, outer, 64);
      rings.push(geometry);
    }
    return rings;
  }, [radius]);

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x00ffe0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Breathing orb
    if (orbRef.current) {
      let scale = 1;
      switch (mode) {
        case 0:
          scale = 1 + 0.02 * Math.sin(t * 2);
          break;
        case 1:
          scale = 1 + 0.05 * Math.sin(t * 3);
          break;
        case 2:
          scale = 1 + 0.03 * Math.sin(t * 2.5);
          break;
        case 3:
          scale = 1 + 0.04 * Math.sin(t * 3.2);
          break;
        case 4:
          scale = 1 + 0.02 * Math.sin(t * 1.8);
          break;
        case 5:
          scale = 1 + 0.03 * Math.sin(t * 2.2);
          break;
      }
      orbRef.current.scale.set(scale, scale, scale);
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y += 0.0012 * (mode + 1);
      ringsRef.current.rotation.x += 0.0007 * (mode + 1);
    }
  });

  return (
    // <-- Parent group scaled 2× smaller
    <group position={position} scale={[0.5, 0.5, 0.5]}>
      {/* Particle orb */}
      <primitive object={orbParticles} ref={orbRef} />

      {/* Rings */}
      <group ref={ringsRef}>
        {ringGeometries.map((geo, i) => (
          <mesh key={i} geometry={geo} material={ringMaterial} />
        ))}
      </group>
    </group>
  );
}
