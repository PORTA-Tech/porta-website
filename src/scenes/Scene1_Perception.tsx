import { useEffect, useRef, useState } from "react";
import OrbitalBriefing, { type OrbitalBriefingItem } from "../components/OrbitalBriefing";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

type SceneProps = { isActive: boolean };

const signals: OrbitalBriefingItem[] = [
  {
    title: "Keyboard activity",
    detail: "Typing pace and rhythm over time.",
    position: { x: 24, y: 32 },
  },
  {
    title: "Mouse activity",
    detail: "Movement, scrolling, and correction patterns.",
    position: { x: 77, y: 36 },
  },
  {
    title: "App switching",
    detail: "How often work jumps between tools and tabs.",
    position: { x: 28, y: 72 },
  },
  {
    title: "Idle time",
    detail: "Pauses, breaks, and stop-start stretches.",
    position: { x: 72, y: 76 },
  },
];

export default function Scene1_Perception({ isActive }: SceneProps) {
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
        eyebrow="What Ari sees"
        title="It looks at how work moves through your day."
        subtitle="Each signal is simple on its own. Together they show whether your day is staying steady or starting to break apart."
        activeLabel="Active signal"
        items={signals}
        activeIndex={activeIndex}
        isStacked={isStacked}
        onActiveIndexChange={setActiveIndex}
      />
    </div>
  );
}
