/**
 * The morning and evening check-in cards, rebuilt from the live card
 * constants (--c-*). Two fixed variants — these are portraits of the
 * real cards, not a card builder.
 */
type CheckInCardProps = { variant: "morning" | "evening" };

export default function CheckInCard({ variant }: CheckInCardProps) {
  if (variant === "morning") {
    return (
      <div className="card">
        <div className="ceb">
          <span>Porta</span>
          <span>✕</span>
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

  return (
    <div className="card">
      <div className="ceb">
        <span>Porta</span>
        <span>✕</span>
      </div>
      <div className="ct">Wrapping up</div>
      <div className="cm">You planned two things. You finished one.</div>
      <p className="cl">FINISHED</p>
      <div className="cr" />
      <div className="row">
        <span className="t">
          <span className="ck">✓ </span>Account settings<span className="pj"> · Harbor</span>
        </span>
        <span className="bar">
          <i style={{ width: 52, background: "var(--c-go)" }} />
        </span>
        <span className="v">2h 05m</span>
      </div>
      <p className="q" style={{ marginTop: 10 }}>
        What came of it?
      </p>
      <div className="inp">
        <span className="ph">Live on staging, ready for review</span>
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
