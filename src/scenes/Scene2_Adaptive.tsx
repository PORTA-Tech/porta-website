import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

type SceneProps = {
  isActive: boolean;
};

const panels = [
  { name: "Perception Layer", desc: "Captures physiological and behavioral signals", pos: { x: 20, y: 25 } }, 
  { name: "Inference Layer", desc: "Processes signals to infer internal state", pos: { x: 75, y: 20 } },     
  { name: "Adaptive Control", desc: "Adjusts environments based on inferred state", pos: { x: 25, y: 70 } }, 
  { name: "Environment Modulation", desc: "Continuously shapes user experience in real time", pos: { x: 70, y: 75 } },
];

export default function Scene2_Adaptive({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [entranceProgress, setEntranceProgress] = useState(0);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // --- Pseudo-Z-depth per panel ---
  const depthRef = useRef<number[]>(
    panels.map(() => Math.random() * 20 + 10)
  );

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isActive) {
      setEntranceProgress(0);
      return;
    }
    let progress = 0;
    let id: number;
    const animate = () => {
      progress += 0.02;
      if (progress > 1) progress = 1;
      setEntranceProgress(progress);
      if (progress < 1) id = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

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

  // Panels float + entrance + parallax
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      panelRefs.current.forEach((el, idx) => {
        if (!el) return;

        const depth = depthRef.current[idx];
        const depthFactor = depth / 20;

        // floating offsets
        const floatX = Math.sin(frame / (60 + idx * 10)) * 10 * depthFactor;
        const floatY = Math.cos(frame / (80 + idx * 12)) * 6 * depthFactor;

        // entrance effect
        const entranceOffsetY = (1 - entranceProgress) * -100;
        const entranceScale = 0.6 + 0.4 * entranceProgress;

        // parallax
        const parallaxX = mouseRef.current.x * depthFactor * 15;
        const parallaxY = mouseRef.current.y * depthFactor * 15;

        const scale =
          hovered === panels[idx].name
            ? PORTA_VISUAL_STYLE.ui.panelHoverScale * entranceScale
            : entranceScale;

        el.style.transform = `translate(${floatX + parallaxX}px, ${floatY + entranceOffsetY + parallaxY}px) scale(${scale})`;

        el.style.boxShadow =
          hovered === panels[idx].name
            ? `0 0 ${10 + depth}px ${PORTA_VISUAL_STYLE.palette.panelGlow}, 0 0 ${20 + depth}px ${PORTA_VISUAL_STYLE.palette.panelGlow}`
            : `0 0 ${4 + depth}px rgba(68,68,255,0.2)`;

        el.style.zIndex = `${Math.floor(100 - depth)}`;
      });

      frame++;
      id = requestAnimationFrame(drift);
    };

    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered, entranceProgress]);

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
          ref={(el) => {
            if (el) panelRefs.current[idx] = el;
          }}
          onMouseEnter={() => setHovered(p.name)}
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
            fontFamily: PORTA_VISUAL_STYLE.font.family,
            transition: `all ${PORTA_VISUAL_STYLE.ui.panelTransition}s`,
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
