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
  radius = 3.5,
  position = [0, 0, 0],
}: Orb3DProps) {
  const orbRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const starGroupRef = useRef<THREE.Group>(null);

  // --- Original orb particles ---
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

  // --- Rings ---
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

  // --- Starfield behind the orb ---
  const starLayers = useMemo(() => {
    const Layers = 3;
    const result: { positions: Float32Array; sizes: Float32Array }[] = [];
    for (let l = 0; l < Layers; l++) {
      const positions: number[] = [];
      const sizes: number[] = [];
      const count = 500 + l * 200;
      for (let i = 0; i < count; i++) {
        const radiusStar = (Math.random() + 0.5) * (10 + l * 10);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        const x = radiusStar * Math.sin(phi) * Math.cos(theta);
        const y = radiusStar * Math.sin(phi) * Math.sin(theta);
        const z = radiusStar * Math.cos(phi);
        positions.push(x, y, z);
        sizes.push(Math.random() * 0.05 + 0.02 + Math.random() < 0.02 ? 0.1 : 0);
      }
      result.push({ positions: new Float32Array(positions), sizes: new Float32Array(sizes) });
    }
    return result;
  }, []);

  // --- Animations ---
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    // Breathing orb
    if (orbRef.current) {
      let scale = 1;
      switch (mode) {
        case 0: scale = 1 + 0.02 * Math.sin(t * 2); break;
        case 1: scale = 1 + 0.05 * Math.sin(t * 3); break;
        case 2: scale = 1 + 0.03 * Math.sin(t * 2.5); break;
        case 3: scale = 1 + 0.04 * Math.sin(t * 3.2); break;
        case 4: scale = 1 + 0.02 * Math.sin(t * 1.8); break;
        case 5: scale = 1 + 0.03 * Math.sin(t * 2.2); break;
      }
      orbRef.current.scale.set(scale, scale, scale);
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y += 0.0012 * (mode + 1);
      ringsRef.current.rotation.x += 0.0007 * (mode + 1);
    }

    // Rotate starfield subtly
    if (starGroupRef.current) {
      starGroupRef.current.rotation.y += 0.0003;
      starGroupRef.current.rotation.x += 0.0001;
      starGroupRef.current.rotation.y += mouse.x * 0.0002;
      starGroupRef.current.rotation.x += mouse.y * 0.0002;
    }
  });

  return (
    <group position={position} scale={[0.5, 0.5, 0.5]}>
      {/* Starfield */}
      <group ref={starGroupRef}>
        {starLayers.map((layer, idx) => (
          <points key={idx}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
              <bufferAttribute attach="attributes-size" args={[layer.sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
              color={`hsl(0,0%,${50 + idx * 20}%)`}
              size={0.03 + idx * 0.02}
              sizeAttenuation
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </points>
        ))}
      </group>

      {/* Original orb particles */}
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
