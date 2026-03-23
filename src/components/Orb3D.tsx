import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";
import { useResponsiveScale } from "../hooks/useResponsiveScale";
import type { OrbInteractionState } from "../world/World3D";

interface Orb3DProps {
  mode: number;
  radius?: number;
  position?: [number, number, number];
  interactionRef: RefObject<OrbInteractionState>;
}

export default function Orb3D({
  mode,
  radius = 3.5,
  position = [0, 0, 0],
  interactionRef,
}: Orb3DProps) {
  const rootRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Points>(null);
  const starGroupRef = useRef<THREE.Group>(null);
  const smoothedPointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const { orb: orbScale } = useResponsiveScale();

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

  const starLayers = useMemo(() => {
    const layers: { positions: Float32Array; sizes: Float32Array }[] = [];
    for (let layerIndex = 0; layerIndex < 3; layerIndex++) {
      const positions: number[] = [];
      const sizes: number[] = [];
      const count = 500 + layerIndex * 200;

      for (let i = 0; i < count; i++) {
        const radiusStar = (Math.random() + 0.5) * (10 + layerIndex * 10);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        positions.push(
          radiusStar * Math.sin(phi) * Math.cos(theta),
          radiusStar * Math.sin(phi) * Math.sin(theta),
          radiusStar * Math.cos(phi)
        );
        sizes.push(Math.random() * 0.05 + 0.02 + (Math.random() < 0.02 ? 0.1 : 0));
      }

      layers.push({
        positions: new Float32Array(positions),
        sizes: new Float32Array(sizes),
      });
    }

    return layers;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const interaction = interactionRef.current;
    const smoothedPointer = smoothedPointerRef.current;

    smoothedPointer.x += (interaction.normalizedX - smoothedPointer.x) * 0.1;
    smoothedPointer.y += (interaction.normalizedY - smoothedPointer.y) * 0.1;
    smoothedPointer.vx += (interaction.velocityX - smoothedPointer.vx) * 0.12;
    smoothedPointer.vy += (interaction.velocityY - smoothedPointer.vy) * 0.12;

    if (rootRef.current) {
      const modeTilt = mode * 0.012;
      const targetTiltX = -smoothedPointer.y * 0.16;
      const targetTiltY = smoothedPointer.x * 0.2 + modeTilt;
      rootRef.current.rotation.y += 0.00045;
      rootRef.current.rotation.x += 0.00016;
      rootRef.current.rotation.x += (targetTiltX - rootRef.current.rotation.x) * 0.08;
      rootRef.current.rotation.y += (targetTiltY - rootRef.current.rotation.y) * 0.06;
      rootRef.current.rotation.z += (-smoothedPointer.x * 0.05 - rootRef.current.rotation.z) * 0.05;
    }

    if (orbRef.current) {
      const pulse = 1 + PORTA_VISUAL_STYLE.orb.pulseAmplitude * Math.sin(t * 3);
      const dragLift = interaction.isDragging ? 0.06 : 0;
      const velocityLift = Math.min(
        0.08,
        Math.abs(smoothedPointer.vx) * 0.25 + Math.abs(smoothedPointer.vy) * 0.18
      );
      const scale = pulse + dragLift + velocityLift;
      orbRef.current.scale.set(scale, scale, scale);
      orbRef.current.rotation.y += 0.002 + smoothedPointer.vx * 0.12;
      orbRef.current.rotation.x += 0.0008 + smoothedPointer.vy * 0.08;
    }

    if (starGroupRef.current) {
      const targetStarX = smoothedPointer.y * 0.24;
      const targetStarY = smoothedPointer.x * 0.32;
      starGroupRef.current.rotation.x +=
        (targetStarX - starGroupRef.current.rotation.x) * 0.04;
      starGroupRef.current.rotation.y +=
        (targetStarY - starGroupRef.current.rotation.y) * 0.05;
      starGroupRef.current.rotation.x +=
        PORTA_VISUAL_STYLE.starfield.rotationX + smoothedPointer.vy * 0.05;
      starGroupRef.current.rotation.y +=
        PORTA_VISUAL_STYLE.starfield.rotationY + smoothedPointer.vx * 0.07;
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
