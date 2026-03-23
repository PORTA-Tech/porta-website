import { useEffect, useRef, useState } from "react";
import OrbitalBriefing, { type OrbitalBriefingItem } from "../components/OrbitalBriefing";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

type SceneProps = { isActive: boolean };

const controls: OrbitalBriefingItem[] = [
  {
    title: "Pause or resume",
    detail: "Stop Ari anytime, turn it back on later, or revoke consent.",
    position: { x: 44, y: 32 },
  },
  {
    title: "Export or delete data",
    detail: "Download your local data or clear it from the device.",
    position: { x: 78, y: 42 },
  },
  {
    title: "Privacy basics",
    detail: "Ari does not read typed text, capture screenshots, or copy clipboard contents.",
    position: { x: 58, y: 78 },
  },
];

export default function Scene4_Integration({ isActive }: SceneProps) {
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
        eyebrow="Controls and trust"
        title="You stay in control."
        subtitle="Ari gives you controls, not lock-in. You can stop it, review what it stored locally, and keep clear privacy boundaries around what it does not collect."
        activeLabel="Active control"
        items={controls}
        activeIndex={activeIndex}
        isStacked={isStacked}
        onActiveIndexChange={setActiveIndex}
      />
    </div>
  );
}
