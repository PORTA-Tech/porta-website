/**
 * The 11:30pm email, rebuilt from the real digest in porta-control-plane
 * (src/core/digestEmailBuilder.ts). Its sections, in the builder's own order:
 *
 *   the resume sentence (summarizeDay)
 *   THE DAY   — the timeline strip, legend Focused / At the machine / Away
 *   YOUR TASKS — title, bar, actual large, "planned …" small beneath
 *   the four figures — Worked · Focused · Best run · Away
 *
 * Not a paraphrase: the labels and the shape are the ones that ship.
 */

/** One hour of the strip. `f` focused, `m` at the machine, `a` away, `g` nothing recorded. */
const STRIP = "ggmffffmffffammffmffmmag".split("") as ReadonlyArray<string>;

const STRIP_COLOUR: Record<string, string> = {
  f: "var(--d-accent)",
  m: "var(--d-machine)",
  a: "var(--d-away)",
  g: "transparent",
};

const TASKS = [
  { title: "Account settings", done: true, actual: "2h 05m", planned: "planned 2h 24m", fill: 87 },
  { title: "Shipping rules", done: false, actual: "18m", planned: "planned 1h 06m", fill: 27 },
];

const FIGURES = [
  ["Worked", "6h 40m"],
  ["Focused", "4h 55m"],
  ["Best run", "1h 45m"],
  ["Away", "1h 12m"],
];

export default function DigestMail() {
  return (
    <div className="mail">
      <div className="mail-hd">
        <span className="sub">Thursday: 6h 40m, and the checkout is done</span>
        <span className="frm">Ari &lt;ari@useporta.com&gt; · to you</span>
      </div>

      <div className="mail-bd">
        <p className="mail-resume">You planned two things. You finished one.</p>

        <p className="mail-l">The day</p>
        <div className="strip" role="img" aria-label="Timeline of the day: focused, at the machine, and away">
          {STRIP.map((k, i) => (
            <i key={i} style={{ background: STRIP_COLOUR[k] }} />
          ))}
        </div>
        <div className="strip-hours num">
          <span>7am</span>
          <span>11</span>
          <span>3</span>
          <span>7pm</span>
        </div>
        <div className="strip-key">
          <span>
            <i style={{ background: "var(--d-accent)" }} />
            Focused
          </span>
          <span>
            <i style={{ background: "var(--d-machine)" }} />
            At the machine
          </span>
          <span>
            <i style={{ background: "var(--d-away)" }} />
            Away
          </span>
        </div>

        <p className="mail-l">Your tasks</p>
        {TASKS.map((t) => (
          <div className="mtask" key={t.title}>
            <div className="mtask-l">
              <p className={t.done ? "nm done" : "nm"}>
                {t.done ? <span className="ck">✓ </span> : null}
                {t.title}
              </p>
              <span className="mtask-bar">
                <i
                  style={{
                    width: `${t.fill}%`,
                    background: t.done ? "var(--d-accent)" : "var(--d-machine)",
                  }}
                />
              </span>
            </div>
            <div className="mtask-r">
              <p className={t.done ? "av num done" : "av num"}>{t.actual}</p>
              <p className="pl num">{t.planned}</p>
            </div>
          </div>
        ))}

        <div className="mail-fig">
          {FIGURES.map(([label, value]) => (
            <div key={label}>
              <span className="l">{label}</span>
              <span className="v num">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
