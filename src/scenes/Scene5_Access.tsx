import { useState, useRef, useEffect } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

export default function Scene5_Access({ onAdvance }: { onAdvance?: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { panel, spacing, isPhone } = useResponsiveScale();

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
      const res = await fetch("https://porta-api-yywn.onrender.com/send-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message || "Sent successfully!");
        setEmail("");
        // Optional: advance to next scene if onAdvance exists
        onAdvance?.();
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
      className="scene scene-access-layout"
      style={{
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
      <div
        className="scene-access-panel"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          width: isPhone ? "100%" : `min(100%, ${Math.round(520 * panel)}px)`,
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${Math.max(12, spacing)}px`,
        }}
      >
        <h2 style={{ position: "relative", zIndex: 1 }}>Request Access</h2>
        <p
          style={{
            textAlign: "center",
            maxWidth: "32rem",
            position: "relative",
            zIndex: 1,
            lineHeight: 1.5,
          }}
        >
          Submit interest for experimental use and collaboration.
        </p>

        <input
          className="scene-access-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            textAlign: "center",
            width: "100%",
            maxWidth: isPhone ? "100%" : "28rem",
          }}
        />

        <button
          className="scene-access-button"
          ref={buttonRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleSubmit}
          style={{
            cursor: "pointer",
            borderRadius: "14px",
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
      </div>

      {status && (
        <p className="scene-access-status" style={{ marginTop: "12px", position: "relative", zIndex: 1 }}>
          {status}
        </p>
      )}
    </div>
  );
}
