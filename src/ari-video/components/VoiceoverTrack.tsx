import { Audio, Sequence, staticFile } from "remotion";
import type { AriVoiceoverManifest } from "../lib/types";

interface VoiceoverTrackProps {
  voiceover: AriVoiceoverManifest | null;
  fps: number;
}

export function VoiceoverTrack({ voiceover, fps }: VoiceoverTrackProps) {
  if (!voiceover || voiceover.segments.length === 0) {
    return null;
  }

  return (
    <>
      {voiceover.segments.map((segment) => {
        const from = Math.max(0, Math.round(segment.startSec * fps));
        return (
          <Sequence key={segment.segmentId} from={from}>
            <Audio
              src={staticFile(`ari-video/voice/${segment.segmentId}.mp3`)}
              volume={segment.volume}
            />
          </Sequence>
        );
      })}
    </>
  );
}
