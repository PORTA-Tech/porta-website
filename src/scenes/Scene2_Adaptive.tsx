import { useEffect, useRef, useState } from "react";
import OrbitalBriefing, { type OrbitalBriefingItem } from "../components/OrbitalBriefing";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

type SceneProps = { isActive: boolean };

const processors: OrbitalBriefingItem[] = [
  {
    title: "Focus",
    detail: "Whether steady work is worth protecting.",
    position: { x: 42, y: 30 },
  },
  {
    title: "Overload",
    detail: "When work starts to look scattered.",
    position: { x: 78, y: 34 },
  },
  {
    title: "Trust",
    detail: "How reliable the current reading is.",
    position: { x: 40, y: 72 },
  },
  {
    title: "Calibration",
    detail: "How ready Ari is to step in more.",
    position: { x: 76, y: 76 },
  },
];

export default function Scene2_Processing({ isActive }: SceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);
  const { layout } = useResponsiveScale();
  const isStacked = layout === "stacked";

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }

    let frame = 0;
    let id: number;

    const driftBG = () => {
      if (bgRef.current) {
        const hue = ((frame % 360) / 360) * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }

      frame++;
      id = requestAnimationFrame(driftBG);
    };

    driftBG();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  return (
    <div
      ref={bgRef}
      className="scene scene-orbital-layout"
      data-layout={layout}
    >
      <OrbitalBriefing
        eyebrow="What Ari figures out"
        title="It turns those signals into a few clear states."
        subtitle="Ari does not guess wildly. It uses the pattern across your day to decide whether focus is holding, strain is building, and the reading is reliable enough to trust."
        activeLabel="Active state"
        items={processors}
        activeIndex={activeIndex}
        isStacked={isStacked}
        onActiveIndexChange={setActiveIndex}
      />
    </div>
  );
}
