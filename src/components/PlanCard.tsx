type PlanCardProps = {
  name: string;
  /** who the plan is for, one line */
  audience: string;
  /** the headline figure, e.g. "$19" or "Let's talk" */
  amount: string;
  /** the smaller type size, used when the figure is not a single price */
  amountSmall?: boolean;
  /** tabular figures — off for wordy amounts like "Let's talk" */
  amountNumeric?: boolean;
  /** what the amount is per, e.g. "a month" */
  per?: string;
  hint: string;
  features: string[];
  cta: { label: string; href: string; primary?: boolean };
  note: string;
  /** draws the lime border and the "Start here" tab */
  lead?: boolean;
};

export default function PlanCard({
  name,
  audience,
  amount,
  amountSmall = false,
  amountNumeric = true,
  per,
  hint,
  features,
  cta,
  note,
  lead = false,
}: PlanCardProps) {
  const amountClass = ["amt", amountNumeric && "num", amountSmall && "sm"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={lead ? "plan lead" : "plan"}>
      <div>
        <p className="plan-name">{name}</p>
      </div>
      <p className="plan-for">{audience}</p>
      <div className="tag">
        <span className={amountClass}>{amount}</span>
        {per ? <span className="per">{per}</span> : null}
      </div>
      <p className="hint">{hint}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <span className="mk" aria-hidden="true">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <a
        className={cta.primary ? "btn btn-primary" : "btn btn-ghost"}
        href={cta.href}
        // An absolute href here is the installer itself. rel is set because the link leaves our
        // origin; no target, because a download should start and leave the page where it is.
        {...(cta.href.startsWith("http") ? { rel: "noopener noreferrer" } : {})}
      >
        {cta.label}
      </a>
      <p className="plan-note">{note}</p>
    </div>
  );
}
