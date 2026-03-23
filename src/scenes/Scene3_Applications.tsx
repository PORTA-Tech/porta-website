import { useEffect, useRef, useState } from "react";
import OrbitalBriefing, { type OrbitalBriefingItem } from "../components/OrbitalBriefing";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

type SceneProps = { isActive: boolean };

const actions: OrbitalBriefingItem[] = [
  {
    title: "Suggest a break",
    detail: "A short pause when overload keeps rising.",
    position: { x: 44, y: 29 },
  },
  {
    title: "Suggest a stretch break",
    detail: "A quick stretch when fatigue starts building.",
    position: { x: 78, y: 34 },
  },
  {
    title: "Help you stay on one task",
    detail: "A nudge to stay with the task in front of you.",
    position: { x: 40, y: 72 },
  },
  {
    title: "Quiet notifications during deep work",
    detail: "Notifications quieted during deep work, then turned back on after.",
    position: { x: 76, y: 76 },
  },
];

export default function Scene3_Response({ isActive }: SceneProps) {
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
        eyebrow="How Ari helps"
        title="When Ari steps in, it does it in simple ways."
        subtitle="The goal is not to add more noise. Ari uses small actions that help protect focus, ease strain, or make deep work easier to keep."
        activeLabel="Active action"
        items={actions}
        activeIndex={activeIndex}
        isStacked={isStacked}
        stackedNodeColumns={1}
        onActiveIndexChange={setActiveIndex}
      />
    </div>
  );
}
