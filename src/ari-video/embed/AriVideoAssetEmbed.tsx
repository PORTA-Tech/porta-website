import { videoTokens } from "../theme/tokens";
import { ARI_VIDEO_EXPORT_ASSETS } from "../data/exportManifest";

export function AriVideoAssetEmbed({
  variant = "full",
  autoplay = false,
  controls = true,
  loop = false,
  muted = true,
}: {
  variant?: "full" | "homepage";
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
}) {
  const sources = variant === "homepage"
    ? [{ src: ARI_VIDEO_EXPORT_ASSETS.homepageMp4PublicPath, type: "video/mp4" }]
    : [
        { src: ARI_VIDEO_EXPORT_ASSETS.webWebmPublicPath, type: "video/webm" },
        { src: ARI_VIDEO_EXPORT_ASSETS.webMp4PublicPath, type: "video/mp4" },
      ];

  return (
    <div
      style={{
        borderRadius: 30,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(6,10,14,0.78)",
        boxShadow: videoTokens.shadow.soft,
        overflow: "hidden",
      }}
    >
      <video
        autoPlay={autoplay}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline
        poster={ARI_VIDEO_EXPORT_ASSETS.posterPublicPath}
        preload="metadata"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "16 / 9",
          background: videoTokens.color.canvas,
        }}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
}
