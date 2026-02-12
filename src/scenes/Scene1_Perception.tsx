import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

type SceneProps = { isActive: boolean };

const signals = [
  "EEG",
  "Heart Rate",
  "Electrodermal Activity (EDA)",
  "Behavioral Signals",
  "Emotional Inference Engine",
];

const positions = [
  { x: 25, y: 25 },
  { x: 70, y: 20 },
  { x: 20, y: 65 },
  { x: 75, y: 70 },
  { x: 50, y: 80 },
];

export default function Scene1_Perception({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [entranceProgress, setEntranceProgress] = useState(0);
  const signalRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const depthRef = useRef<number[]>(signals.map(() => Math.random() * 20 + 10));

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isActive) { setEntranceProgress(0); return; }
    let progress = 0, id: number;
    const animate = () => {
      progress += 0.02;
      if (progress > 1) progress = 1;
      setEntranceProgress(progress);
      if (progress < 1) id = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // Background drift
  useEffect(() => {
    if (!isActive) return;
    let frame = 0, id: number;
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

  // Signal drift + parallax
  useEffect(() => {
    if (!isActive) return;
    let frame = 0, id: number;
    const drift = () => {
      signalRefs.current.forEach((el, idx) => {
        if (!el) return;
        const depth = depthRef.current[idx];
        const depthFactor = depth / 20;
        const floatX = Math.sin(frame / (50 + idx * 5)) * 15 * depthFactor;
        const floatY = Math.cos(frame / (70 + idx * 7)) * 10 * depthFactor;
        const entranceOffsetY = (1 - entranceProgress) * -100;
        const entranceScale = 0.6 + 0.4 * entranceProgress;
        const parallaxX = mouseRef.current.x * depthFactor * 20;
        const parallaxY = mouseRef.current.y * depthFactor * 20;
        const scale = hovered === signals[idx]
          ? PORTA_VISUAL_STYLE.ui.panelHoverScale * entranceScale
          : entranceScale;

        el.style.transform = `translate(${floatX + parallaxX}px, ${floatY + entranceOffsetY + parallaxY}px) scale(${scale})`;
        el.style.boxShadow = hovered === signals[idx]
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

  // Close tooltip on outside tap (mobile)
  useEffect(() => {
    const handleOutside = (e: TouchEvent) => {
      if (!signalRefs.current.some(el => el && el.contains(e.target as Node))) {
        setHovered(null);
      }
    };
    document.addEventListener("touchstart", handleOutside);
    return () => document.removeEventListener("touchstart", handleOutside);
  }, []);

  return (
    <div ref={bgRef} className="scene" style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      <div className="scene-header">
        <h2>Perception</h2>
      </div>

      {signals.map((s, idx) => (
        <div
          key={s}
          ref={(el) => { if (el) signalRefs.current[idx] = el; }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          onTouchStart={(e) => {
            e.preventDefault();
            setHovered(prev => (prev === s ? null : s));
          }}
          style={{
            position: "absolute",
            top: `${positions[idx].y}%`,
            left: `${positions[idx].x}%`,
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
            touchAction: "manipulation",
          }}
        >
          {s}
          {hovered === s && (
            <div style={{ fontSize: "0.85em", color: PORTA_VISUAL_STYLE.palette.tooltip, marginTop: "5px" }}>
              {s === "EEG" && "Electrical patterns associated with cognitive load, attention, and neural dynamics."}
              {s === "Heart Rate" && "Cardiovascular indicators related to arousal and stress response."}
              {s === "Electrodermal Activity (EDA)" && "Skin conductance changes reflecting sympathetic nervous system activity."}
              {s === "Behavioral Signals" && "Interaction timing, motion patterns, and response dynamics."}
              {s === "Emotional Inference Engine" && "Integrates multimodal signals to estimate internal cognitive and emotional state."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}