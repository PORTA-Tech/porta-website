import { useRef } from "react";

export type ReportTab = {
  /** id of the button itself, referenced by the panel's aria-labelledby */
  id: string;
  /** id of the panel this tab controls */
  controls: string;
  label: string;
};

type ReportToggleProps = {
  tabs: ReportTab[];
  /** index of the selected tab */
  value: number;
  onChange: (index: number) => void;
  label: string;
};

/**
 * A real tablist: mouse, Tab, and arrow keys. Arrow left and right both move
 * to the next tab, which with two tabs means either arrow flips the view.
 */
export default function ReportToggle({ tabs, value, onChange, label }: ReportToggleProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const next = (index + 1) % tabs.length;
    onChange(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="seg" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={tab.id}
          ref={(node) => {
            buttons.current[index] = node;
          }}
          aria-controls={tab.controls}
          aria-selected={index === value}
          onClick={() => onChange(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
