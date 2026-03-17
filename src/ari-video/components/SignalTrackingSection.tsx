import type { AriSignalSample } from "../lib/types";
import { formatMs, formatPercent, humanizeToken } from "../lib/format";
import { videoTokens } from "../theme/tokens";
import { SignalConstellation } from "./SignalConstellation";

interface SignalTrackingSectionProps {
  signals: AriSignalSample[];
  currentSignal: AriSignalSample | null;
  currentSec: number;
  opacity: number;
  translateY: number;
}

export function SignalTrackingSection({
  signals,
  currentSignal,
  currentSec,
  opacity,
  translateY,
}: SignalTrackingSectionProps) {
  if (!currentSignal) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "170px 120px 160px",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: 32,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 24,
          alignContent: "start",
        }}
      >
        <SectionHeading
          eyebrow="Observe"
          title="The film starts with behavior patterns Ari can actually measure."
          body="Typing cadence, scroll energy, app switching, and idle fragmentation are recorded as behavioral telemetry. No content, no transcripts, no fabricated emotion readout."
        />
        <div
          style={{
            borderRadius: videoTokens.radius.xl,
            border: `1px solid ${videoTokens.color.line}`,
            background: videoTokens.color.panel,
            boxShadow: videoTokens.shadow.soft,
            padding: 30,
          }}
        >
          <SignalConstellation signals={signals} currentSec={currentSec} />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gap: 18,
          alignContent: "start",
        }}
      >
        <DetailCard
          label="Signal Source"
          value={humanizeToken(currentSignal.signalKind)}
          accent={videoTokens.color.accent}
        />
        <DetailCard
          label="Typing Burst"
          value={formatNullablePercent(currentSignal.typingBurstIntensity)}
          accent={videoTokens.color.cyan}
        />
        <DetailCard
          label="Scroll Velocity"
          value={formatNullablePercent(currentSignal.scrollVelocityIndex)}
          accent={videoTokens.color.plum}
        />
        <DetailCard
          label="IKI Mean"
          value={currentSignal.keyboardIkiMeanMs ? formatMs(currentSignal.keyboardIkiMeanMs) : "Bucketed historical trace"}
          accent={videoTokens.color.coral}
        />
        <DetailCard
          label="Telemetry Boundary"
          value="Behavioral signals only"
          accent={videoTokens.color.ink}
        />
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 22,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: videoTokens.color.accent,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          maxWidth: 1020,
          fontFamily: videoTokens.font.display,
          fontSize: 110,
          lineHeight: 0.92,
          color: videoTokens.color.ink,
        }}
      >
        {title}
      </div>
      <div
        style={{
          maxWidth: 760,
          fontFamily: videoTokens.font.sans,
          fontSize: 30,
          lineHeight: 1.44,
          color: videoTokens.color.mutedInk,
        }}
      >
        {body}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "24px 26px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.66)",
        boxShadow: videoTokens.shadow.crisp,
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 18,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: videoTokens.color.softInk,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: videoTokens.font.sans,
          fontSize: 36,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
      <div
        style={{
          width: 96,
          height: 3,
          borderRadius: 999,
          background: accent,
        }}
      />
    </div>
  );
}

const formatNullablePercent = (value: number | null) => {
  return typeof value === "number" ? formatPercent(value) : "Not captured in this trace";
};
