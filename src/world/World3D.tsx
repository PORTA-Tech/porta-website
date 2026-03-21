import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Orb3D from "../components/Orb3D";

interface World3DProps {
  sceneIndex: number;
}

export type OrbInteractionState = {
  normalizedX: number;
  normalizedY: number;
  velocityX: number;
  velocityY: number;
  isDragging: boolean;
};

type DragAxis = "pending" | "horizontal" | "vertical";

type DragSession = {
  pointerId: number;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
  axis: DragAxis;
};

const SCENE_Z = [0, 1, 2.5, 4, 5.5, 7];
const DRAG_ROTATION_FACTOR = 0.0095;
const DRAG_VELOCITY_FACTOR = 0.0013;
const DRAG_AXIS_LOCK_PX = 14;
const INERTIA_DAMPING = 0.92;
const IDLE_POINTER_DAMPING = 0.92;
const AMBIENT_ROTATION_Y = 0.0011;

function clampNormalized(value: number) {
  return THREE.MathUtils.clamp(value, -1, 1);
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "button, input, textarea, select, a, label, [role='button'], .scene-mobile-nav"
    )
  );
}

export default function World3D({ sceneIndex }: World3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationYRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const dragSessionRef = useRef<DragSession | null>(null);
  const interactionRef = useRef<OrbInteractionState>({
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
  });

  useEffect(() => {
    const updatePointerPosition = (clientX: number, clientY: number) => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const normalizedX = clampNormalized((clientX / width) * 2 - 1);
      const normalizedY = clampNormalized(-((clientY / height) * 2 - 1));
      const interaction = interactionRef.current;

      interaction.velocityX = normalizedX - interaction.normalizedX;
      interaction.velocityY = normalizedY - interaction.normalizedY;
      interaction.normalizedX = normalizedX;
      interaction.normalizedY = normalizedY;
    };

    const recenterPointerPosition = () => {
      const interaction = interactionRef.current;
      interaction.normalizedX = 0;
      interaction.normalizedY = 0;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || isInteractiveTarget(event.target)) {
        return;
      }

      dragSessionRef.current = {
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        axis: "pending",
      };

      interactionRef.current.isDragging = true;
      updatePointerPosition(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragSessionRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      updatePointerPosition(event.clientX, event.clientY);

      const deltaXFromStart = event.clientX - drag.startX;
      const deltaYFromStart = event.clientY - drag.startY;
      const absStartX = Math.abs(deltaXFromStart);
      const absStartY = Math.abs(deltaYFromStart);

      if (
        drag.axis === "pending"
        && (absStartX >= DRAG_AXIS_LOCK_PX || absStartY >= DRAG_AXIS_LOCK_PX)
      ) {
        drag.axis = absStartX >= absStartY ? "horizontal" : "vertical";
      }

      const deltaX = event.clientX - drag.lastX;
      const deltaY = event.clientY - drag.lastY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;

      if (drag.axis !== "horizontal") {
        return;
      }

      targetRotationYRef.current += deltaX * DRAG_ROTATION_FACTOR;
      angularVelocityRef.current = THREE.MathUtils.clamp(
        deltaX * DRAG_VELOCITY_FACTOR,
        -0.12,
        0.12
      );

      interactionRef.current.velocityX = THREE.MathUtils.clamp(deltaX / 240, -0.18, 0.18);
      interactionRef.current.velocityY = THREE.MathUtils.clamp(-deltaY / 240, -0.18, 0.18);
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragSessionRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      dragSessionRef.current = null;
      interactionRef.current.isDragging = false;
      recenterPointerPosition();
    };

    const handlePointerCancel = (event: PointerEvent) => {
      endDrag(event);
    };

    const handlePointerLeave = () => {
      if (dragSessionRef.current !== null) {
        return;
      }

      interactionRef.current.isDragging = false;
      recenterPointerPosition();
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", endDrag, { passive: true });
    window.addEventListener("pointercancel", handlePointerCancel, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const interaction = interactionRef.current;
    const currentZ = groupRef.current.position.z;
    const targetZ = SCENE_Z[sceneIndex];
    groupRef.current.position.z += (targetZ - currentZ) * 0.1;

    targetRotationYRef.current += AMBIENT_ROTATION_Y;

    if (!interaction.isDragging) {
      targetRotationYRef.current += angularVelocityRef.current;
      angularVelocityRef.current *= INERTIA_DAMPING;
      if (Math.abs(angularVelocityRef.current) < 0.00008) {
        angularVelocityRef.current = 0;
      }
    }

    groupRef.current.rotation.y +=
      (targetRotationYRef.current - groupRef.current.rotation.y) * 0.14;

    interaction.velocityX *= IDLE_POINTER_DAMPING;
    interaction.velocityY *= IDLE_POINTER_DAMPING;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Orb3D mode={sceneIndex} interactionRef={interactionRef} />
    </group>
  );
}
