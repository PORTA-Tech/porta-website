import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";

export default function Scene5_Access({ onAdvance }: { onAdvance: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Pulse effect on hover
  useEffect(() => {
    if (!hovered || !buttonRef.current) return;
    let angle = 0;
    let id: number;

    const pulse = () => {
      angle += 0.1;
      const scale = 1 + PORTA_VISUAL_STYLE.ui.panelHoverScale * Math.sin(angle);
      buttonRef.current!.style.transform = `scale(${scale})`;
      id = requestAnimationFrame(pulse);
    };

    pulse();
    return () => {
      cancelAnimationFrame(id);
      if (buttonRef.current) buttonRef.current.style.transform = "scale(1)";
    };
  }, [hovered]);

  // Submit email to backend
  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("Please enter a valid email.");
      return;
    }
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message || "Sent successfully!");
        setEmail("");
      } else {
        setStatus(data.error || "Failed to send.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error.");
    }
  };

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
      <p
        style={{
          textAlign: "center",
          maxWidth: "400px",
          position: "relative",
          zIndex: 1,
        }}
      >
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
        onClick={handleSubmit}
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
          transition: `all ${PORTA_VISUAL_STYLE.ui.panelTransition}s`,
          fontWeight: "bold",
          position: "relative",
          zIndex: 1,
        }}
      >
        Request Access
      </button>

      {status && (
        <p style={{ marginTop: "12px", position: "relative", zIndex: 1 }}>
          {status}
        </p>
      )}
    </div>
  );
}