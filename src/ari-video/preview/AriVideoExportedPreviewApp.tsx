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
        background: "linear-gradient(180deg, #071018 0%, #0c151b 100%)",
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
              Exported website video
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.display,
                fontSize: 62,
                lineHeight: 0.94,
                color: videoTokens.color.ink,
              }}
            >
              Delivery assets ready for embed
            </div>
            <div
              style={{
                maxWidth: 760,
                fontSize: 18,
                lineHeight: 1.55,
                color: videoTokens.color.mutedInk,
              }}
            >
              This route reviews the exported files the real website will use. It loads the poster and encoded delivery assets, not the Remotion composition runtime.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
              minWidth: 360,
              padding: "20px 22px",
              borderRadius: 24,
              border: `1px solid ${videoTokens.color.line}`,
              background: "rgba(11,17,23,0.56)",
            }}
          >
            <InfoLine label="Trace" value={ARI_VIDEO_TRACE_MANIFEST.label} />
            <InfoLine label="Master" value="4K H.264 45s" />
            <InfoLine label="Web" value="1080p MP4 + WebM" />
            <InfoLine label="Poster" value={ARI_VIDEO_EXPORT_ASSETS.posterPublicPath} />
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
          <div style={{ display: "grid", gap: 24 }}>
            <section style={{ display: "grid", gap: 14 }}>
              <SectionLabel>Full website delivery</SectionLabel>
              <AriVideoAssetEmbed controls />
            </section>

            <section style={{ display: "grid", gap: 14 }}>
              <SectionLabel>Homepage cut</SectionLabel>
              <AriVideoAssetEmbed
                variant="homepage"
                autoplay
                controls={false}
                loop
                muted
              />
            </section>
          </div>

          <aside
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <SidebarCard
              title="Asset paths"
              body={[
                ARI_VIDEO_EXPORT_ASSETS.webMp4PublicPath,
                ARI_VIDEO_EXPORT_ASSETS.webWebmPublicPath,
                ARI_VIDEO_EXPORT_ASSETS.homepageMp4PublicPath,
              ].join("\n")}
            />
            <SidebarCard
              title="Embed note"
              body="Use the exported files for the real website surface. Keep the Remotion composition and the preview route as production tooling, not live runtime dependencies."
            />
            <SidebarCard
              title="Preview routes"
              body="/ari-video for composition review\n/ari-video/exported for final asset review"
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: videoTokens.font.mono,
        fontSize: 14,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: videoTokens.color.softInk,
      }}
    >
      {children}
    </div>
  );
}

function SidebarCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "18px 20px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.56)",
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
        {title}
      </div>
      <div
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: videoTokens.color.ink,
          whiteSpace: "pre-line",
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
