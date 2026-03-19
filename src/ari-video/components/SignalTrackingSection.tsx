import type { AriSignalSample } from "../lib/types";
import { formatPercent, humanizeToken } from "../lib/format";
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
        padding: "250px 140px 240px",
        display: "grid",
        gridTemplateColumns: "0.78fr 1.22fr",
        gap: 34,
        height: "100%",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto auto 1fr",
          gap: 26,
          alignContent: "start",
        }}
      >
        <SectionLead
          eyebrow="Observe"
          title="Ari starts with behavior patterns it can actually measure."
          body="Typing cadence, scroll energy, app switching, and idle fragmentation are tracked as behavioral telemetry. No content, no transcripts, no invented emotion layer."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
            alignContent: "start",
          }}
        >
          <SignalFact label="Signal Source" value={humanizeToken(currentSignal.signalKind)} />
          <SignalFact label="Typing Burst" value={formatNullablePercent(currentSignal.typingBurstIntensity)} />
          <SignalFact label="Scroll Velocity" value={formatNullablePercent(currentSignal.scrollVelocityIndex)} />
          <SignalFact label="Focus Switching" value={formatNullablePercent(currentSignal.focusSwitchRate)} />
        </div>
        <div
          style={{
            alignSelf: "end",
            padding: "20px 22px",
            borderRadius: 26,
            border: `1px solid ${videoTokens.color.line}`,
            background: "rgba(11,17,23,0.56)",
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: videoTokens.color.softInk,
              marginBottom: 8,
            }}
          >
            Telemetry boundary
          </div>
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              color: videoTokens.color.ink,
            }}
          >
            Recorded interaction patterns only. The system sees rhythm and change, not message content.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 22,
          minHeight: 0,
          padding: "30px 34px",
          borderRadius: videoTokens.radius.xl,
          border: `1px solid ${videoTokens.color.line}`,
          background: videoTokens.color.panel,
          boxShadow: videoTokens.shadow.soft,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: videoTokens.color.softInk,
            }}
          >
            Behavioral telemetry field
          </div>
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 14,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: videoTokens.color.accent,
            }}
          >
            {formatRange(currentSignal.tStartSec, currentSignal.tEndSec)}
          </div>
        </div>

        <div
          style={{
            minHeight: 0,
            display: "grid",
            alignItems: "stretch",
          }}
        >
          <SignalConstellation signals={signals} currentSec={currentSec} width={1450} height={820} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            alignItems: "center",
            paddingTop: 4,
          }}
        >
          <div
            style={{
              fontSize: 19,
              lineHeight: 1.5,
              color: videoTokens.color.mutedInk,
              maxWidth: 760,
            }}
          >
            Each vertical column is a recorded behavior window. The highlighted marker follows the current observed interval through the trace.
          </div>
          <div
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              background: "rgba(244,239,231,0.04)",
              color: videoTokens.color.ink,
              fontFamily: videoTokens.font.mono,
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            No content capture
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLead({
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
          fontSize: 18,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: videoTokens.color.accent,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          maxWidth: 840,
          fontFamily: videoTokens.font.display,
          fontSize: 90,
          lineHeight: 0.94,
          letterSpacing: "-0.03em",
          color: videoTokens.color.ink,
        }}
      >
        {title}
      </div>
      <div
        style={{
          maxWidth: 680,
          fontFamily: videoTokens.font.sans,
          fontSize: 24,
          lineHeight: 1.5,
          color: videoTokens.color.mutedInk,
        }}
      >
        {body}
      </div>
    </div>
  );
}

function SignalFact({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 9,
        padding: "20px 20px 18px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.6)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 13,
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
          fontSize: 28,
          lineHeight: 1.3,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const formatNullablePercent = (value: number | null) => {
  return typeof value === "number" ? formatPercent(value) : "Not captured";
};

const formatRange = (startSec: number, endSec: number) => {
  return `${startSec.toFixed(1)}s-${endSec.toFixed(1)}s`;
};
