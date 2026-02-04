import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene5_Access({ onAdvance: _onAdvance, isActive: _isActive }: SceneProps) {
  const [email, setEmail] = useState("");
  const [hovered, setHovered] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  // Orb slow pulse
  useEffect(() => {
    if (!_isActive) return; // ✅ use _isActive
    let animationId: number;
    let angle = 0;
    const pulseOrb = () => {
      if (orbRef.current) {
        angle += 0.1;
        orbRef.current.style.transform = `rotate(${angle}deg) scale(${1 + Math.sin(angle / 20) * 0.02})`;
      }
      animationId = requestAnimationFrame(pulseOrb);
    };
    pulseOrb();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive]); // ✅ dependency array

  return (
    <div
      className="scene"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #222, #333)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orb placeholder */}
      <div
        ref={orbRef}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff8844, #222)",
          marginBottom: "30px",
        }}
      />

      <h2>Early Access</h2>
      <p style={{ textAlign: "center", maxWidth: "400px" }}>
        Early testers and collaborators. Not mass-market users.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => _onAdvance()}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          boxShadow: hovered ? "0 0 10px #ff8844" : "none",
          transition: "all 0.2s",
        }}
      >
        Request Access
      </button>
    </div>
  );
}
