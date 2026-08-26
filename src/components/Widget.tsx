/**
 * The corner panel, rebuilt in HTML from the live widget.
 * Colours are the product's own (--w-*), not the page palette.
 */
type WidgetProps = {
  /** e.g. "FOCUSED · 31m 04s" */
  status: string;
  /** polyline points for the 280×22 sparkline */
  spark: string;
  work: string;
  pressure: string;
  /** amber pressure reading */
  pressureWarn?: boolean;
  task: { mark: string; name: string; tags: string[] };
  /** fill the column instead of sitting at the widget's natural width */
  full?: boolean;
};

export default function Widget({
  status,
  spark,
  work,
  pressure,
  pressureWarn = false,
  task,
  full = false,
}: WidgetProps) {
  return (
    <div className="widget" style={full ? { width: "100%" } : undefined}>
      <div className="wg-top">
        <span className="pip" />
        {status}
      </div>
      <svg className="wg-spark" viewBox="0 0 280 22" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={spark}
          fill="none"
          stroke="#3FBF7F"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <div className="wg-cols">
        <div>
          <div className="wg-l">Work</div>
          <div className="wg-v">{work}</div>
        </div>
        <div>
          <div className="wg-l">Pressure</div>
          <div className={pressureWarn ? "wg-v warn" : "wg-v"}>{pressure}</div>
        </div>
        <div>
          <div className="wg-l">Reminder</div>
          <div className="wg-btns">
            <span className="wg-round">+</span>
            <span className="wg-round">≡</span>
          </div>
        </div>
      </div>
      <div className="wg-rule" />
      <div className="wg-today">
        Today <span className="wg-add">+ task</span>
      </div>
      <div className="wg-task">
        <span className="tk">{task.mark}</span>
        <span className="nm">{task.name}</span>
        {task.tags.map((tag) => (
          <span className="wg-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
