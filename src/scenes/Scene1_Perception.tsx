import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

type SceneProps = { isActive: boolean };

const signals = [
  {
    title: "Keyboard activity",
    detail: "Typing pace and rhythm over time.",
  },
  {
    title: "Mouse activity",
    detail: "Movement, scrolling, and correction patterns.",
  },
  {
    title: "App switching",
    detail: "How often work jumps between tools and tabs.",
  },
  {
    title: "Idle time",
    detail: "Pauses, breaks, and stop-start stretches.",
  },
];

export default function Scene1_Perception({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [entranceProgress, setEntranceProgress] = useState(0);
  const signalRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const depthRef = useRef<number[]>(signals.map(() => Math.random() * 20 + 10));
  const { layout } = useResponsiveScale();
  const isStacked = layout === "stacked";
  const activeSignal = signals.find((signal) => signal.title === hovered) ?? null;

  // Mouse tracking for parallax
  useEffect(() => {
    if (isStacked) {
      return;
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isStacked]);

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
        if (isStacked) {
          el.style.transform = "none";
          el.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.28)";
          el.style.zIndex = "auto";
          return;
        }

        const depth = depthRef.current[idx];
        const depthFactor = depth / 20;
        const floatX = Math.sin(frame / (50 + idx * 5)) * 15 * depthFactor;
        const floatY = Math.cos(frame / (70 + idx * 7)) * 10 * depthFactor;
        const entranceOffsetY = (1 - entranceProgress) * -100;
        const entranceScale = 0.6 + 0.4 * entranceProgress;
        const parallaxX = mouseRef.current.x * depthFactor * 20;
        const parallaxY = mouseRef.current.y * depthFactor * 20;
        const scale = hovered === signals[idx].title
          ? PORTA_VISUAL_STYLE.ui.panelHoverScale * entranceScale
          : entranceScale;

        el.style.transform = `translate(${floatX + parallaxX}%, ${floatY + entranceOffsetY + parallaxY}%) scale(${scale}) translate(-50%, -50%)`;
        el.style.boxShadow = hovered === signals[idx].title
          ? `0 0 ${10 + depth}px ${PORTA_VISUAL_STYLE.palette.panelGlow}, 0 0 ${20 + depth}px ${PORTA_VISUAL_STYLE.palette.panelGlow}`
          : `0 0 ${4 + depth}px rgba(68,68,255,0.2)`;
        el.style.zIndex = `${Math.floor(100 - depth)}`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered, entranceProgress, isStacked]);

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
    <div
      ref={bgRef}
      className="scene scene-floating-layout scene-perception-layout"
      data-layout={layout}
    >
      <div className="scene-header">
        <div className="scene-header-copy">
          <h2>What Ari sees</h2>
          <p className="scene-subtitle">It looks at how work moves through your day.</p>
        </div>
      </div>

      {isStacked && activeSignal ? (
        <div className="scene-mobile-detail">
          <h3>{activeSignal.title}</h3>
          <p>{activeSignal.detail}</p>
        </div>
      ) : null}

      {signals.map((signal, idx) => (
        <div
          key={signal.title}
          ref={(el) => { if (el) signalRefs.current[idx] = el; }}
          onMouseEnter={() => setHovered(signal.title)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            if (!isStacked) {
              return;
            }
            setHovered((prev) => (prev === signal.title ? null : signal.title));
          }}
          className="scene-floating-card scene-perception-card"
          data-slot={idx}
          data-active={hovered === signal.title ? "true" : "false"}
        >
          {signal.title}
          {!isStacked && hovered === signal.title && (
            <div className="scene-floating-card-detail">
              {signal.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
