import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

interface Orb3DProps {
  mode: number;
  radius?: number;
  position?: [number, number, number];
}

export default function Orb3D({
  radius = 3.5,
  position = [0, 0, 0],
}: Orb3DProps) {
  const rootRef = useRef<THREE.Group>(null); // Scene-level rotation
  const orbRef = useRef<THREE.Points>(null);
  const starGroupRef = useRef<THREE.Group>(null);

  const { orb: orbScale } = useResponsiveScale();

  // Orb particles
  const orbParticles = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
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
      color: PORTA_VISUAL_STYLE.palette.coreOrb,
      size: 0.025,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geometry, material);
  }, [radius]);

  // Starfield
  const starLayers = useMemo(() => {
    const layers: { positions: Float32Array; sizes: Float32Array }[] = [];
    for (let l = 0; l < 3; l++) {
      const positions: number[] = [];
      const sizes: number[] = [];
      const count = 500 + l * 200;
      for (let i = 0; i < count; i++) {
        const radiusStar = (Math.random() + 0.5) * (10 + l * 10);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        positions.push(
          radiusStar * Math.sin(phi) * Math.cos(theta),
          radiusStar * Math.sin(phi) * Math.sin(theta),
          radiusStar * Math.cos(phi)
        );
        sizes.push(
          Math.random() * 0.05 + 0.02 + (Math.random() < 0.02 ? 0.1 : 0)
        );
      }
      layers.push({
        positions: new Float32Array(positions),
        sizes: new Float32Array(sizes),
      });
    }
    return layers;
  }, []);

  // Animations
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    // Subtle scene rotation
    if (rootRef.current) {
      rootRef.current.rotation.y += 0.0001; // 1–2° drift
      rootRef.current.rotation.x += 0.0001;
    }

    // Orb pulse
    if (orbRef.current) {
      const scale = 1 + PORTA_VISUAL_STYLE.orb.pulseAmplitude * Math.sin(t * 3);
      orbRef.current.scale.set(scale, scale, scale);
    }

    // Starfield
    if (starGroupRef.current) {
      starGroupRef.current.rotation.y += PORTA_VISUAL_STYLE.starfield.rotationY;
      starGroupRef.current.rotation.x += PORTA_VISUAL_STYLE.starfield.rotationX;
      starGroupRef.current.rotation.y +=
        mouse.x * PORTA_VISUAL_STYLE.starfield.mouseInfluence;
      starGroupRef.current.rotation.x +=
        mouse.y * PORTA_VISUAL_STYLE.starfield.mouseInfluence;
    }
  });

  return (
    <group
      ref={rootRef}
      position={position}
      scale={[orbScale, orbScale, orbScale]}
    >
      <group ref={starGroupRef}>
        {starLayers.map((layer, idx) => (
          <points key={idx}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
              <bufferAttribute attach="attributes-size" args={[layer.sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
              color={PORTA_VISUAL_STYLE.palette.star}
              size={0.03 + idx * 0.02}
              sizeAttenuation
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </points>
        ))}
      </group>

      <primitive object={orbParticles} ref={orbRef} />
    </group>
  );
}