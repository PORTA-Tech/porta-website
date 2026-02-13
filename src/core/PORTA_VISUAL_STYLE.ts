export const PORTA_VISUAL_STYLE = {
  palette: {
    coreOrb: "#00FFFF",
    star: "#FFFFFF",
    rings: ["#00FFFF", "#00FFFF", "#00FFFF"],

    // UI text & panels
    text: "#FFFFFF",
    tooltip: "#AAAAAA",
    cta: "#00FFFF",
    background: "#000000",
    panelBg: "#111111",
    panelGlow: "rgba(68,68,255,0.8)",
  },
  font: {
    family: "system-ui, sans-serif",
    size: "16px",
    weight: 400,
  },
  orb: {
    rotationSpeedMultiplier: 0.001,
    ringsRotationX: 0.001,
    pulseAmplitude: 0.09,
  },
  starfield: {
    rotationY: 0.0003,
    rotationX: 0.0001,
    mouseInfluence: 0.0002,
  },
  ui: {
    panelHoverScale: 1.1,
    panelTransition: 0.3, // seconds
  },
};
