import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

type SceneProps = {
  isActive: boolean;
};

const panels = [
  { name: "Perception Layer", desc: "Captures physiological and behavioral signals", pos: { x: 25, y: 25 } }, 
  { name: "Inference Layer", desc: "Processes signals to infer internal state", pos: { x: 75, y: 25 } },     
  { name: "Adaptive Control", desc: "Adjusts environments based on inferred state", pos: { x: 25, y: 70 } }, 
  { name: "Environment Modulation", desc: "Continuously shapes user experience in real time", pos: { x: 75, y: 70 } },
];

export default function Scene2_Adaptive({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Background subtle gradient
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;
    const driftBG = () => {
      if (bgRef.current) {
        const hue = (frame % 360) / 360 * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      id = requestAnimationFrame(driftBG);
    };
    driftBG();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // Panel gentle float
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;
    const drift = () => {
      panelRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetX = Math.sin(frame / 100 + idx) * 8;
        const offsetY = Math.cos(frame / 120 + idx) * 5;
        const scale = hovered === panels[idx].name
          ? PORTA_VISUAL_STYLE.ui.panelHoverScale
          : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  const handlePanelHover = (panelName: string) => setHovered(panelName);

  return (
    <div
      ref={bgRef}
      className="scene"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
        background: PORTA_VISUAL_STYLE.palette.background,
        color: PORTA_VISUAL_STYLE.palette.text,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <h2
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: PORTA_VISUAL_STYLE.font.family,
          fontWeight: PORTA_VISUAL_STYLE.font.weight,
        }}
      >
        Adaptive Intelligence
      </h2>

      {panels.map((p, idx) => (
        <div
          key={p.name}
          ref={(el) => { if (el) panelRefs.current[idx] = el; }}
          onMouseEnter={() => handlePanelHover(p.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            top: `${p.pos.y}%`,
            left: `${p.pos.x}%`,
            padding: "20px",
            borderRadius: "8px",
            background: PORTA_VISUAL_STYLE.palette.panelBg,
            border: "1px solid rgba(255,255,255,0.2)",
            color: PORTA_VISUAL_STYLE.palette.text,
            textAlign: "center",
            minWidth: "140px",
            cursor: "pointer",
            zIndex: 1,
            boxShadow: hovered === p.name
              ? `0 0 20px ${PORTA_VISUAL_STYLE.palette.panelGlow}, 0 0 40px ${PORTA_VISUAL_STYLE.palette.panelGlow}`
              : "0 0 8px rgba(68,68,255,0.2)",
            transition: `all ${PORTA_VISUAL_STYLE.ui.panelTransition}s`,
            fontFamily: PORTA_VISUAL_STYLE.font.family,
          }}
        >
          {p.name}
          {hovered === p.name && (
            <div
              style={{
                fontSize: "0.8em",
                color: PORTA_VISUAL_STYLE.palette.tooltip,
                marginTop: "5px",
              }}
            >
              {p.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
