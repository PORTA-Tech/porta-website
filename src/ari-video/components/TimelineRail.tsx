import { videoTokens } from "../theme/tokens";
import type { AriBeat, AriChapter } from "../lib/types";

interface TimelineRailProps {
  chapters: AriChapter[];
  beats: AriBeat[];
  durationSec: number;
  currentSec: number;
}

export function TimelineRail({ chapters, beats, durationSec, currentSec }: TimelineRailProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        bottom: 94,
        display: "grid",
        gap: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 7,
          borderRadius: 999,
          background: "rgba(244, 239, 231, 0.08)",
          overflow: "hidden",
        }}
      >
        {chapters.map((chapter) => {
          const left = `${(chapter.startSec / durationSec) * 100}%`;
          const width = `${((chapter.endSec - chapter.startSec) / durationSec) * 100}%`;
          return (
            <div
              key={chapter.chapterId}
              style={{
                position: "absolute",
                left,
                width,
                top: 0,
                bottom: 0,
                borderRadius: 999,
                background:
                  chapter.chapterId === "regulate"
                    ? videoTokens.color.accent
                    : chapter.chapterId === "infer"
                      ? "rgba(127, 232, 255, 0.65)"
                      : "rgba(244, 239, 231, 0.22)",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: `calc(${(currentSec / durationSec) * 100}% - 10px)`,
            top: -7,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: videoTokens.color.ink,
            boxShadow: "0 0 28px rgba(244,239,231,0.38)",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${beats.length}, minmax(0, 1fr))`,
          gap: 12,
        }}
      >
        {beats.map((beat) => {
          const isActive = currentSec >= beat.startSec && currentSec < beat.endSec;
          return (
            <div
              key={beat.beatId}
              style={{
                display: "grid",
                gap: 6,
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  fontFamily: videoTokens.font.mono,
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isActive ? videoTokens.color.accent : videoTokens.color.softInk,
                }}
              >
                {beat.chapterId}
              </div>
              <div
                style={{
                  fontFamily: videoTokens.font.sans,
                  fontSize: 24,
                  fontWeight: 500,
                  color: isActive ? videoTokens.color.ink : videoTokens.color.mutedInk,
                }}
              >
                {beat.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
