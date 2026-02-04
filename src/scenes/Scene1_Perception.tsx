import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const signals = [
  "EEG",
  "Heart Rate",
  "Electrodermal Activity (EDA)",
  "Behavioral Signals",
  "Emotional Inference Engine",
];

export default function Scene1_Perception({ onAdvance: _onAdvance, isActive: _isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const signalRefs = useRef<HTMLDivElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Orb rotation + pulse
  useEffect(() => {
    if (!_isActive) return;
    let animationId: number;
    let angle = 0;
    const animateOrb = () => {
      if (orbRef.current) {
        angle += 0.2;
        const scale = 1 + Math.sin(angle / 50) * 0.02; // subtle pulse
        orbRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
      }
      animationId = requestAnimationFrame(animateOrb);
    };
    animateOrb();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive]);

  // Signal drift with horizontal wiggle
  useEffect(() => {
    if (!_isActive) return;
    let frame = 0;
    let animationId: number;

    const drift = () => {
      signalRefs.current.forEach((el, idx) => {
        if (el) {
          const offsetY = Math.sin(frame / 20 + idx) * 1; // ±1px vertical
          const offsetX = Math.sin(frame / 30 + idx) * 0.5; // ±0.5px horizontal
          const scale = hovered === signals[idx] ? 1.05 : 1;
          el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
      });
      frame++;
      animationId = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive, hovered]);

  // Optional subtle background gradient shift
  useEffect(() => {
    if (!_isActive) return;
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
  }, [_isActive]);

  return (
    <div
      ref={bgRef}
      className="scene"
      onClick={() => _onAdvance()}
      style={{
        height: "100vh",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(180deg, #000000, #111111)",
        color: "white",
        paddingTop: "50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orb */}
      <div
        ref={orbRef}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4444ff, #000000)",
          marginBottom: "30px",
        }}
      />

      <h2>Neuro-Scanning / Perception</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px", width: "90%" }}>
        {signals.map((s, idx) => (
          <div
            key={s}
            ref={(el) => {
              if (el) signalRefs.current[idx] = el;
            }}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "20px",
              border: "1px solid gray",
              borderRadius: "5px",
              background: "#111111",
              transition: "all 0.2s",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            {s}
            {hovered === s && (
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
                {s === "EEG" && "Measures brain electrical activity"}
                {s === "Heart Rate" && "Tracks heartbeat"}
                {s === "Electrodermal Activity (EDA)" && "Tracks skin conductance"}
                {s === "Behavioral Signals" && "Monitors gestures and movement"}
                {s === "Emotional Inference Engine" && "Computes inferred emotional state"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
