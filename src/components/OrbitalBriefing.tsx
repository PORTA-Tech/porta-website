import type { CSSProperties, KeyboardEvent } from "react";

export type OrbitalBriefingItem = {
  title: string;
  detail: string;
  position: {
    x: number;
    y: number;
  };
};

type OrbitalBriefingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  activeLabel: string;
  items: OrbitalBriefingItem[];
  activeIndex: number;
  isStacked: boolean;
  onActiveIndexChange: (index: number) => void;
};

function handleActivateWithKeyboard(
  event: KeyboardEvent<HTMLDivElement>,
  index: number,
  onActiveIndexChange: (index: number) => void
) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  onActiveIndexChange(index);
}

export default function OrbitalBriefing({
  eyebrow,
  title,
  subtitle,
  activeLabel,
  items,
  activeIndex,
  isStacked,
  onActiveIndexChange,
}: OrbitalBriefingProps) {
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div className="orbital-briefing">
      <section className="orbital-briefing-panel">
        <p className="orbital-briefing-eyebrow">{eyebrow}</p>
        <h2 className="orbital-briefing-title">{title}</h2>
        <p className="orbital-briefing-subtitle">{subtitle}</p>

        <div className="orbital-briefing-active">
          <p className="orbital-briefing-active-label">{activeLabel}</p>
          <div className="orbital-briefing-active-row">
            <span className="orbital-briefing-active-index">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="orbital-briefing-active-copy">
              <h3>{activeItem.title}</h3>
              <p>{activeItem.detail}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="orbital-briefing-node-cloud">
        {items.map((item, index) => {
          const style = isStacked
            ? undefined
            : ({
                "--orbital-node-x": `${item.position.x}%`,
                "--orbital-node-y": `${item.position.y}%`,
                "--orbital-node-delay": `${index * 70}ms`,
              } as CSSProperties);

          return (
            <div
              key={item.title}
              className="orbital-briefing-node"
              data-active={index === activeIndex ? "true" : "false"}
              style={style}
              tabIndex={0}
              onMouseEnter={() => onActiveIndexChange(index)}
              onFocus={() => onActiveIndexChange(index)}
              onClick={() => onActiveIndexChange(index)}
              onKeyDown={(event) => handleActivateWithKeyboard(event, index, onActiveIndexChange)}
            >
              <span className="orbital-briefing-node-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="orbital-briefing-node-label">{item.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
