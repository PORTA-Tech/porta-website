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
      className="scene"
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
      <div
        className="scene-hero-panel"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: PORTA_VISUAL_STYLE.font.family,
          color: PORTA_VISUAL_STYLE.palette.text,
        }}
      >
        <h1 className="scene-hero-title" style={{ marginBottom: "0.2em" }}>Ari</h1>
        <h3 className="scene-hero-subtitle" style={{ marginBottom: "0.5em", fontWeight: 400, maxWidth: "22em" }}>
          See when your day starts slipping out of focus.
        </h3>
        <p className="scene-hero-copy" style={{ marginBottom: "2em", maxWidth: "34rem", lineHeight: 1.5 }}>
          Ari helps you catch the moment focus starts to slip and overload starts to rise,
          then suggests simple steps to protect focus or take a break.
        </p>

        <button
          className="scene-hero-button"
          onClick={onAdvance}
          style={{
            cursor: "pointer",
            transition: "all 0.3s",
            fontFamily: PORTA_VISUAL_STYLE.font.family,
            color: PORTA_VISUAL_STYLE.palette.background,
            backgroundColor: PORTA_VISUAL_STYLE.palette.cta,
            border: "none",
            borderRadius: "10px",
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
