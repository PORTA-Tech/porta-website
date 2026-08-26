/**
 * The morning and evening check-in cards, rebuilt from the live card constants (--c-*).
 *
 * The evening card always shows a sentence already typed into it. An empty box demonstrates
 * the feature; a filled one demonstrates the point, which is that the words in the client's
 * report are the ones the freelancer wrote.
 */
type CheckInCardProps = {
  /** "chain" is the evening card trimmed to the one exchange, for the side-by-side. */
  variant: "morning" | "evening" | "chain";
  /** evening + chain: the finished task and the sentence typed about it */
  task?: string;
  result?: string;
  hours?: string;
};

const DEFAULT_EVENING_TASK = "Account settings";
const DEFAULT_EVENING_RESULT = "Email and password done. Notification preferences still to come.";

export default function CheckInCard({
  variant,
  task = DEFAULT_EVENING_TASK,
  result = DEFAULT_EVENING_RESULT,
  hours = "2h 05m",
}: CheckInCardProps) {
  if (variant === "morning") {
    return (
      <div className="card">
        <div className="ceb">
          <span>Ari</span>
          <span aria-hidden="true">✕</span>
        </div>
        <div className="ct">Good morning</div>
        <div className="cm">Three things carried over from yesterday.</div>
        <p className="cl">TODAY</p>
        <div className="cr" />
        <div className="row">
          <span className="t">
            Account settings<span className="pj"> · Harbor</span>
          </span>
          <span className="bar">
            <i style={{ width: 26, background: "#5A626D" }} />
          </span>
          <span className="v">2h 24m</span>
        </div>
        <div className="row">
          <span className="t">
            Shipping rules<span className="pj"> · Harbor</span>
          </span>
          <span className="bar">
            <i style={{ width: 12, background: "#5A626D" }} />
          </span>
          <span className="v">1h 06m</span>
        </div>
        <div className="chips">
          <span className="chip sel">Both</span>
          <span className="chip">Just the first</span>
          <span className="chip">+ Add</span>
        </div>
        <span className="go">Start the day</span>
      </div>
    );
  }

  if (variant === "chain") {
    return (
      <div className="card">
        <div className="ceb">
          <span>Ari</span>
          <span aria-hidden="true">✕</span>
        </div>
        <div className="ct">Wrapping up</div>
        <p className="cl">FINISHED</p>
        <div className="cr" />
        <div className="row">
          <span className="t">
            <span className="ck">✓ </span>
            {task}
            <span className="pj"> · Harbor</span>
          </span>
          <span className="bar">
            <i style={{ width: 52, background: "var(--c-go)" }} />
          </span>
          <span className="v">{hours}</span>
        </div>
        <p className="q" style={{ marginTop: 12 }}>
          What came of it?
        </p>
        <div className="inp typed">
          <span>{result}</span>
        </div>
        <span className="go">Close the day</span>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="ceb">
        <span>Ari</span>
        <span aria-hidden="true">✕</span>
      </div>
      <div className="ct">Wrapping up</div>
      <div className="cm">You planned two things. You finished one.</div>
      <p className="cl">FINISHED</p>
      <div className="cr" />
      <div className="row">
        <span className="t">
          <span className="ck">✓ </span>
          {task}
          <span className="pj"> · Harbor</span>
        </span>
        <span className="bar">
          <i style={{ width: 52, background: "var(--c-go)" }} />
        </span>
        <span className="v">{hours}</span>
      </div>
      <p className="q" style={{ marginTop: 10 }}>
        What came of it?
      </p>
      <div className="inp typed">
        <span>{result}</span>
      </div>
      <p className="cl">STILL OPEN</p>
      <div className="cr" />
      <div className="row">
        <span className="t">
          Shipping rules<span className="pj"> · Harbor</span>
        </span>
        <span className="bar">
          <i style={{ width: 14, background: "#5A626D" }} />
        </span>
        <span className="v">18m</span>
      </div>
      <div className="chips">
        <span className="chip">Done</span>
        <span className="chip">Keep</span>
        <span className="chip sel">Blocked</span>
      </div>
      <span className="go">Close the day</span>
    </div>
  );
}
