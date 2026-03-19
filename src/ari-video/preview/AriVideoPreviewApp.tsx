import { Player } from "@remotion/player";
import { startTransition, useEffect, useState } from "react";
import { AriVideoComposition } from "../compositions/AriVideoComposition";
import { ARI_VIDEO_TRACE_MANIFEST } from "../data/traceManifest";
import { loadAriVideoData } from "../lib/loadAriVideoData";
import type { AriVideoSummary } from "../lib/types";
import "../theme/loadFonts";
import { videoTokens } from "../theme/tokens";
import { formatPercent, humanizeToken } from "../lib/format";

export default function AriVideoPreviewApp() {
  const [summary, setSummary] = useState<AriVideoSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAriVideoData()
      .then((data) => {
        startTransition(() => {
          setSummary(data.summary);
        });
      })
      .catch((reason: unknown) => {
        const message = reason instanceof Error ? reason.message : String(reason);
        setError(message);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100%",
        background: "linear-gradient(180deg, #081017 0%, #0d151c 100%)",
        color: videoTokens.color.ink,
        fontFamily: videoTokens.font.sans,
      }}
    >
      <div
        style={{
          minHeight: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 28,
          padding: "36px 42px 42px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 28,
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 14,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: videoTokens.color.accent,
              }}
            >
              Ari video preview
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.display,
                fontSize: 62,
                lineHeight: 0.94,
                color: videoTokens.color.ink,
              }}
            >
              Offline cinematic renderer
            </div>
            <div
              style={{
                maxWidth: 760,
                fontSize: 18,
                lineHeight: 1.55,
                color: videoTokens.color.mutedInk,
              }}
            >
              This preview uses the curated recorded dataset synced from the Ari trace pipeline. It is separate from the homepage scene stack and uses the same composition that Remotion will export.
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
              minWidth: 340,
              padding: "20px 22px",
              borderRadius: 24,
              border: `1px solid ${videoTokens.color.line}`,
              background: "rgba(11,17,23,0.56)",
            }}
          >
            <InfoLine label="Trace" value={ARI_VIDEO_TRACE_MANIFEST.label} />
            <InfoLine label="Duration" value={`${ARI_VIDEO_TRACE_MANIFEST.durationSec}s`} />
            <InfoLine label="Frame Rate" value={`${ARI_VIDEO_TRACE_MANIFEST.fps} fps`} />
          </div>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              borderRadius: 28,
              border: `1px solid ${videoTokens.color.line}`,
              background: "rgba(5, 8, 10, 0.55)",
              boxShadow: videoTokens.shadow.soft,
              padding: 18,
            }}
          >
            <Player
              component={AriVideoComposition}
              durationInFrames={ARI_VIDEO_TRACE_MANIFEST.durationInFrames}
              compositionWidth={ARI_VIDEO_TRACE_MANIFEST.width}
              compositionHeight={ARI_VIDEO_TRACE_MANIFEST.height}
              fps={ARI_VIDEO_TRACE_MANIFEST.fps}
              controls
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 18,
                overflow: "hidden",
              }}
            />
          </div>

          <aside
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <SidebarCard
              title="Browser Review"
              body="The composition review route is /ari-video. After running npm run video:render, review the encoded delivery assets on /ari-video/exported."
            />
            {summary ? (
              <SidebarCard
                title="Locked Event"
                body={`${humanizeToken(summary.selectedEvent.action)}  ${formatPercent(summary.selectedEvent.confidence, 1)}  ${summary.selectedEvent.timestampUtc}`}
              />
            ) : null}
            {summary ? (
              <SidebarCard
                title="Why This Cut"
                body={`Selected from ${summary.selectedCapture} with curation mode ${summary.curationMode}.`}
              />
            ) : null}
            {error ? (
              <SidebarCard title="Asset Error" body={error} tone="warning" />
            ) : null}
          </aside>
        </main>
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: "default" | "warning";
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "18px 20px",
        borderRadius: 24,
        border: `1px solid ${tone === "warning" ? "rgba(255,140,107,0.35)" : videoTokens.color.line}`,
        background: tone === "warning" ? "rgba(64, 19, 14, 0.44)" : "rgba(11,17,23,0.56)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 13,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: tone === "warning" ? videoTokens.color.coral : videoTokens.color.softInk,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: videoTokens.color.ink,
        }}
      >
        {body}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <span style={{ color: videoTokens.color.softInk }}>{label}</span>
      <span style={{ color: videoTokens.color.ink, fontFamily: videoTokens.font.mono }}>{value}</span>
    </div>
  );
}
