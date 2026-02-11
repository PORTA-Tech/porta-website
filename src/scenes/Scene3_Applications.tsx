import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

type SceneProps = {
  isActive: boolean;
};

const apps = [
  { name: "Immersive Training", desc: "For high-focus skill building" },
  { name: "High-Stakes Performance", desc: "Optimizes critical execution" },
  { name: "Therapeutic Environments", desc: "Supports emotional regulation" },
  { name: "Research / Experimental Interfaces", desc: "Exploration in controlled settings" },
];

// Explicit offsets around the orb
const OFFSETS = [
  { x: -300, y: -200 },
  { x: 200, y: -80 },
  { x: -200, y: 150 },
  { x: 200, y: 80 },
];

export default function Scene3_Applications({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [entranceProgress, setEntranceProgress] = useState(0);
  const appRefs = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const depthRef = useRef<number[]>(apps.map(() => Math.random() * 20 + 10));

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

  // Float + parallax + entrance
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      appRefs.current.forEach((el, idx) => {
        if (!el) return;

        const depth = depthRef.current[idx];
        const depthFactor = depth / 20;

        const floatX = Math.sin(frame / 50 + idx) * 8 * depthFactor;
        const floatY = Math.cos(frame / 60 + idx) * 5 * depthFactor;

        const entranceOffsetY = (1 - entranceProgress) * -100;
        const entranceScale = 0.6 + 0.4 * entranceProgress;

        const parallaxX = mouseRef.current.x * depthFactor * 15;
        const parallaxY = mouseRef.current.y * depthFactor * 15;

        const scale =
          hovered === apps[idx].name
            ? PORTA_VISUAL_STYLE.ui.panelHoverScale * entranceScale
            : entranceScale;

        el.style.transform = `translate(calc(50% + ${OFFSETS[idx].x + floatX + parallaxX}px), calc(50% + ${OFFSETS[idx].y + floatY + entranceOffsetY + parallaxY}px)) scale(${scale})`;

        el.style.boxShadow =
          hovered === apps[idx].name
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
        Platform Applications
      </h2>

      {apps.map((a, idx) => (
        <div
          key={a.name}
          ref={(el) => { if (el) appRefs.current[idx] = el; }}
          onMouseEnter={() => setHovered(a.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            padding: "20px",
            borderRadius: "8px",
            background: PORTA_VISUAL_STYLE.palette.panelBg,
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: "140px",
            textAlign: "center",
            cursor: "pointer",
            transition: `all ${PORTA_VISUAL_STYLE.ui.panelTransition}s`,
            fontFamily: PORTA_VISUAL_STYLE.font.family,
          }}
        >
          {a.name}
          {hovered === a.name && (
            <div
              style={{
                fontSize: "0.8em",
                color: PORTA_VISUAL_STYLE.palette.tooltip,
                marginTop: "5px",
              }}
            >
              {a.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
