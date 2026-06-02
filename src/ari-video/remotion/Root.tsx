import { Composition } from "remotion";
import { AriVideoComposition } from "../compositions/AriVideoComposition";
import { ProductDemoComposition } from "../compositions/ProductDemoComposition";
import { ARI_VIDEO_TRACE_MANIFEST } from "../data/traceManifest";
import "../theme/loadFonts";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id={ARI_VIDEO_TRACE_MANIFEST.compositionId}
        component={AriVideoComposition}
        width={ARI_VIDEO_TRACE_MANIFEST.width}
        height={ARI_VIDEO_TRACE_MANIFEST.height}
        fps={ARI_VIDEO_TRACE_MANIFEST.fps}
        durationInFrames={ARI_VIDEO_TRACE_MANIFEST.durationInFrames}
        defaultProps={{}}
      />
      <Composition
        id="AriProductDemo"
        component={ProductDemoComposition}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={900}
        defaultProps={{}}
      />
    </>
  );
}
