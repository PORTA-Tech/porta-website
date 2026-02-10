import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene5_Access({ onAdvance }: SceneProps) {
  const [email, setEmail] = useState("");
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Optional: pulse the button slightly for more dynamic feedback
  useEffect(() => {
    if (!hovered || !buttonRef.current) return;
    let angle = 0;
    let id: number;

    const pulse = () => {
      angle += 0.1;
      const scale = 1 + Math.sin(angle) * 0.03;
      buttonRef.current!.style.transform = `scale(${scale})`;
      id = requestAnimationFrame(pulse);
    };

    pulse();
    return () => {
      cancelAnimationFrame(id);
      if (buttonRef.current) buttonRef.current.style.transform = "scale(1)";
    };
  }, [hovered]);

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
      <h2 style={{ position: "relative", zIndex: 1 }}>Early Access</h2>
      <p style={{ textAlign: "center", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        Early testers and collaborators. Not mass-market users.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        style={{
          padding: "10px",
          margin: "10px",
          width: "250px",
          position: "relative",
          zIndex: 1,
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          textAlign: "center",
        }}
      />

      <button
        ref={buttonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onAdvance()}
        style={{
          padding: "12px 24px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
          background: "#ff8844",
          color: "#fff",
          boxShadow: hovered
            ? "0 0 20px #ff8844, 0 0 40px rgba(255,136,68,0.4)"
            : "0 0 8px rgba(255,136,68,0.2)",
          transition: "all 0.3s",
          fontWeight: "bold",
          position: "relative",
          zIndex: 1,
        }}
      >
        Request Access
      </button>
    </div>
  );
}
