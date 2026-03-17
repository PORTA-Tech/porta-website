export const videoTokens = {
  color: {
    ink: "#f4efe7",
    mutedInk: "rgba(244, 239, 231, 0.7)",
    softInk: "rgba(244, 239, 231, 0.48)",
    canvas: "#0b1117",
    canvasLift: "#121d24",
    accent: "#d7ff64",
    accentDeep: "#7fcf4f",
    coral: "#ff8c6b",
    cyan: "#7fe8ff",
    plum: "#8a78ff",
    line: "rgba(244, 239, 231, 0.12)",
    panel: "rgba(11, 17, 23, 0.58)",
    panelStrong: "rgba(11, 17, 23, 0.82)",
  },
  font: {
    display: '"Instrument Serif", Georgia, serif',
    sans: '"Space Grotesk", "Segoe UI", sans-serif',
    mono: '"IBM Plex Mono", Consolas, monospace',
  },
  radius: {
    xl: 42,
    lg: 28,
    md: 20,
    sm: 14,
  },
  shadow: {
    soft: "0 28px 90px rgba(0, 0, 0, 0.22)",
    crisp: "0 18px 42px rgba(0, 0, 0, 0.26)",
  },
} as const;
