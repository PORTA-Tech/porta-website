import { ARI_VIDEO_EXPORT_ASSETS } from "../data/exportManifest";
import { ARI_VIDEO_TRACE_MANIFEST } from "../data/traceManifest";
import { AriVideoAssetEmbed } from "../embed/AriVideoAssetEmbed";
import "../theme/loadFonts";
import { videoTokens } from "../theme/tokens";

export default function AriVideoExportedPreviewApp() {
  return (
    <div
      style={{
        minHeight: "100%",
        background:
          "radial-gradient(circle at top, rgba(47,76,122,0.3) 0%, rgba(9,14,18,0) 36%), linear-gradient(180deg, #060b10 0%, #0b1217 100%)",
        color: videoTokens.color.ink,
        fontFamily: videoTokens.font.sans,
        overflowY: "auto",
      }}
    >
      <main
        style={{
          width: "min(1480px, calc(100vw - 64px))",
          margin: "0 auto",
          padding: "42px 0 64px",
          display: "grid",
          gap: 26,
        }}
      >
        <section
          style={{
            display: "grid",
            gap: 14,
            padding: "0 4px",
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 14,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: videoTokens.color.accent,
            }}
          >
            Ari exported website video
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: 10, maxWidth: 920 }}>
              <h1
                style={{
                  fontFamily: videoTokens.font.display,
                  fontSize: 76,
                  lineHeight: 0.94,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                }}
              >
                Ari, as an actual website video.
              </h1>
              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.55,
                  color: videoTokens.color.mutedInk,
                }}
              >
                This page is only for viewing the final encoded output. It uses the exported MP4/WebM files, not the Remotion composition runtime.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <ActionLink href={ARI_VIDEO_EXPORT_ASSETS.webMp4PublicPath} label="Open MP4" />
              <ActionLink href={ARI_VIDEO_EXPORT_ASSETS.homepageMp4PublicPath} label="Open 30s Cut" />
              <ActionLink href="/ari-video" label="Open Composition Review" />
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <AriVideoAssetEmbed autoplay controls loop muted objectFit="cover" />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <MetricCard label="Trace" value={ARI_VIDEO_TRACE_MANIFEST.label} />
          <MetricCard label="Duration" value={`${ARI_VIDEO_TRACE_MANIFEST.durationSec}s`} />
          <MetricCard label="Delivery" value="1080p MP4 + WebM" />
          <MetricCard label="Poster" value="Frame 828" />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <article
            style={{
              display: "grid",
              gap: 14,
              padding: "22px 24px",
              borderRadius: 28,
              border: `1px solid ${videoTokens.color.line}`,
              background: "rgba(11,17,23,0.58)",
            }}
          >
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 13,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: videoTokens.color.softInk,
              }}
            >
              What you are seeing
            </div>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.65,
                color: videoTokens.color.ink,
              }}
            >
              The full player above is the final website delivery file. The shorter cut below is the 30-second homepage asset. Both are encoded from the same recorded Ari trace.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <InlinePath path={ARI_VIDEO_EXPORT_ASSETS.webMp4PublicPath} />
              <InlinePath path={ARI_VIDEO_EXPORT_ASSETS.webWebmPublicPath} />
              <InlinePath path={ARI_VIDEO_EXPORT_ASSETS.homepageMp4PublicPath} />
            </div>
          </article>

          <section style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 13,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: videoTokens.color.softInk,
                paddingLeft: 4,
              }}
            >
              Homepage cut
            </div>
            <AriVideoAssetEmbed
              variant="homepage"
              autoplay
              controls
              loop
              muted
              objectFit="cover"
            />
          </section>
        </section>
      </main>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        padding: "0 18px",
        borderRadius: 999,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.54)",
        color: videoTokens.color.ink,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      {label}
    </a>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "18px 20px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.52)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: videoTokens.color.softInk,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          lineHeight: 1.4,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InlinePath({ path }: { path: string }) {
  return (
    <span
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.04)",
        color: videoTokens.color.softInk,
        fontFamily: videoTokens.font.mono,
        fontSize: 12,
      }}
    >
      {path}
    </span>
  );
}
