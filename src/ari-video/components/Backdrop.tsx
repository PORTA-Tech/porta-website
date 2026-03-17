import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoTokens } from "../theme/tokens";

export function Backdrop() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at ${18 + (drift * 10)}% ${20 + (drift * 6)}%, rgba(127, 232, 255, 0.16), transparent 22%),
          radial-gradient(circle at ${78 - (drift * 8)}% ${18 + (drift * 10)}%, rgba(138, 120, 255, 0.18), transparent 24%),
          radial-gradient(circle at ${74 - (drift * 6)}% ${76 - (drift * 8)}%, rgba(215, 255, 100, 0.14), transparent 26%),
          linear-gradient(145deg, #0b1117 0%, #0e151b 42%, #121d24 100%)
        `,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.34,
          backgroundImage: `
            linear-gradient(rgba(244,239,231,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,239,231,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
          maskImage: "linear-gradient(180deg, transparent, black 12%, black 88%, transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,17,23,0.24), rgba(11,17,23,0) 22%, rgba(11,17,23,0) 78%, rgba(11,17,23,0.48))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 60,
          borderRadius: 56,
          border: `1px solid ${videoTokens.color.line}`,
          boxShadow: videoTokens.shadow.soft,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
}
