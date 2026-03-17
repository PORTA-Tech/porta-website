import { Composition } from "remotion";
import { AriVideoComposition } from "../compositions/AriVideoComposition";
import { ARI_VIDEO_TRACE_MANIFEST } from "../data/traceManifest";
import "../theme/loadFonts";

export function RemotionRoot() {
  return (
    <Composition
      id={ARI_VIDEO_TRACE_MANIFEST.compositionId}
      component={AriVideoComposition}
      width={ARI_VIDEO_TRACE_MANIFEST.width}
      height={ARI_VIDEO_TRACE_MANIFEST.height}
      fps={ARI_VIDEO_TRACE_MANIFEST.fps}
      durationInFrames={ARI_VIDEO_TRACE_MANIFEST.durationInFrames}
      defaultProps={{}}
    />
  );
}
