import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene5_Access({ onAdvance, }: SceneProps) {
  const [email, setEmail] = useState("");
  const [hovered, setHovered] = useState(false);

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
      {/* 3D Orb */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Orb3D mode={5} color="#ff8844" /> {/* Scene5 mode + warm color */}
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Early Access</h2>
      <p style={{ textAlign: "center", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        Early testers and collaborators. Not mass-market users.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        style={{ padding: "10px", margin: "10px", width: "250px", position: "relative", zIndex: 1 }}
      />
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onAdvance()}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          boxShadow: hovered ? "0 0 10px #ff8844" : "none",
          transition: "all 0.2s",
          position: "relative",
          zIndex: 1,
        }}
      >
        Request Access
      </button>
    </div>
  );
}
