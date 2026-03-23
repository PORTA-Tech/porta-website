import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene0_Portal({ onAdvance, isActive }: SceneProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Background subtle hue shift
  useEffect(() => {
    if (!isActive) return;

    let frame = 0;
    let animationId: number;

    const driftBG = () => {
      if (bgRef.current) {
        const hue = (frame % 360) / 360 * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      animationId = requestAnimationFrame(driftBG);
    };

    driftBG();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <div
      ref={bgRef}
      className="scene scene-portal"
      style={{ overflow: "hidden", background: PORTA_VISUAL_STYLE.palette.background }}
    >
      {/* Canvas for lights or 3D elements */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
      </Canvas>

      {/* Overlay text + button */}
      <div className="scene-portal-copy">
        <p className="scene-portal-eyebrow">Ari for computer work</p>
        <h1 className="scene-portal-title">Protect your focus at work.</h1>
        <p className="scene-portal-subtitle">
          Ari watches activity on your computer for early signs that focus is slipping,
          then gently helps you stay on track.
        </p>
        <p className="scene-portal-description">
          It can suggest a break, suggest staying on task, or quiet notifications during
          deep work.
        </p>

        <button
          onClick={onAdvance}
          className="scene-portal-button"
          style={{
            fontFamily: PORTA_VISUAL_STYLE.font.family,
            fontSize: PORTA_VISUAL_STYLE.font.size,
            color: PORTA_VISUAL_STYLE.palette.background,
            backgroundColor: PORTA_VISUAL_STYLE.palette.cta,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = `0 0 15px ${PORTA_VISUAL_STYLE.palette.cta}`)
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          Enter Interface
        </button>
      </div>
    </div>
  );
}
