/**
 * "Effort by day", drawn the way the real report draws it.
 *
 * Ported from renderEffortByDay in porta-control-plane/src/core/reportPageBuilder.ts, including
 * its arithmetic, so the picture on the marketing page cannot claim a chart the product does not
 * produce:
 *
 *   - a column's height is that day's hours against the PEAK day, not a flat bar, so 5.2h and
 *     3.5h are visibly different;
 *   - the column is stacked in the locked task colours, showing where the day's hours went;
 *   - a day with nothing on it is a 2px line and an em-dash, never a removed column — a chart
 *     that hides an empty day is the kind of thing a client notices;
 *   - the day's own total sits above it, the day label below.
 */

const MAX_COLUMN_PX = 150;

export type EffortSegment = {
  /** one of --t1..--t5, the locked task palette */
  token: string;
  task: string;
  hours: number;
};

export type EffortDay = {
  label: string;
  segments: EffortSegment[];
  /** Replaces the hours total above the column, for a chart measuring something else. */
  valueLabel?: string;
};

function hoursLabel(hours: number) {
  return `${hours.toFixed(1)}h`;
}

export default function EffortByDay({ days }: { days: EffortDay[] }) {
  const totals = days.map((d) => d.segments.reduce((sum, s) => sum + s.hours, 0));
  const peak = Math.max(...totals, 0);

  return (
    <div className="eff-wrap">
      <div className="eff">
        {days.map((day, i) => {
          const total = totals[i];

          if (total <= 0 || peak <= 0) {
            return (
              <div className="eff-col" key={day.label}>
                <div className="eff-tot zero">—</div>
                <div className="eff-stack" style={{ height: 2 }}>
                  <div className="eff-zero" />
                </div>
                <div className="eff-lab">{day.label}</div>
              </div>
            );
          }

          // The column is always as tall as the day's OWN hours, so it can never contradict
          // the table.
          const columnPx = Math.max(4, Math.round((total / peak) * MAX_COLUMN_PX));

          return (
            <div className="eff-col" key={day.label}>
              <div className={day.valueLabel ? "eff-tot" : "eff-tot num"}>
                {day.valueLabel ?? hoursLabel(total)}
              </div>
              <div className="eff-stack" style={{ height: columnPx }}>
                {day.segments
                  .filter((s) => s.hours > 0)
                  .map((s) => (
                    <div
                      className="eff-seg"
                      key={s.token}
                      style={{
                        height: Math.max(2, Math.round((s.hours / total) * columnPx)),
                        background: `var(${s.token})`,
                      }}
                      title={`${day.label} · ${s.task} · ${hoursLabel(s.hours)}`}
                    />
                  ))}
              </div>
              <div className="eff-lab">{day.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
