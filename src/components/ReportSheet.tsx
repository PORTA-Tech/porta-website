/**
 * The document. Light on purpose — it is the one thing on this page that
 * leaves your machine, so it looks like paper and not like an app.
 *
 * `client` is what lands in the client's inbox. `private` is the same week
 * with everything they never get to see.
 */
const PT20 = { paddingTop: 20 } as const;

function Divider({ gap = 22 }: { gap?: number }) {
  return (
    <>
      <div style={{ height: gap }} />
      <div className="prule" />
    </>
  );
}

function Kpi({
  value,
  label,
  detail,
  critical = false,
}: {
  value: string;
  label: string;
  detail: string;
  critical?: boolean;
}) {
  return (
    <div className="kpi">
      <div className="v num" style={critical ? { color: "var(--crit)" } : undefined}>
        {value}
      </div>
      <div className="l">{label}</div>
      <div className="d">{detail}</div>
    </div>
  );
}

function Day({
  label,
  height,
  value,
  colour,
  numeric = true,
}: {
  label: string;
  height?: number;
  value: string;
  colour?: string;
  numeric?: boolean;
}) {
  if (height === undefined) {
    return (
      <div className="day zero">
        <div className="bar" />
        <div className="hv">{value}</div>
        <div className="lb">{label}</div>
      </div>
    );
  }

  return (
    <div className="day">
      <div
        className="bar"
        style={{ height: `${height}%`, ...(colour ? { background: colour } : null) }}
      />
      <div className={numeric ? "hv num" : "hv"}>{value}</div>
      <div className="lb">{label}</div>
    </div>
  );
}

const HEADING = "Harbor — website rebuild";
const PERIOD = "9 – 13 September 2026  ·  week 4";

const WORK_ROWS = [
  { token: "--t1", name: "Checkout flow rebuild", status: "✓ Done", statusClass: "st done", width: 100, hours: "7.6" },
  { token: "--t2", name: "Payment error states", status: "✓ Done", statusClass: "st done", width: 55, hours: "4.2" },
  { token: "--t3", name: "Mobile navigation", status: "✓ Done", statusClass: "st done", width: 41, hours: "3.1" },
  { token: "--t4", name: "Account settings", status: "In progress", statusClass: "st", width: 32, hours: "2.4" },
  { token: "--t5", name: "Shipping rules", status: "Waiting on you", statusClass: "st blk", width: 14, hours: "1.1" },
];

const SHARE = [
  { token: "--t1", pct: 41.3, label: "41%", name: "Checkout flow rebuild" },
  { token: "--t2", pct: 22.8, label: "23%", name: "Payment error states" },
  { token: "--t3", pct: 16.8, label: "17%", name: "Mobile navigation" },
  { token: "--t4", pct: 13.1, label: "13%", name: "Account settings" },
  { token: "--t5", pct: 6, label: "6%", name: "Shipping rules" },
];

function ClientSheet() {
  return (
    <article className="sheet">
      <div className="sh-head">
        <div>
          <p className="eyebrow">Progress report</p>
          <h2>{HEADING}</h2>
          <p className="sh-period">{PERIOD}</p>
        </div>
        <div className="sh-by">
          Prepared by<strong>Yadin</strong>Sent 13 Sep 2026
        </div>
      </div>
      <Divider gap={20} />

      <div className="pad" style={PT20}>
        <p className="eyebrow" style={{ paddingBottom: 10 }}>
          Summary
        </p>
        <p className="sh-sum">
          The checkout flow is rebuilt and live on staging, and the payment error states are
          done alongside it. Mobile navigation is finished. Account settings is underway and
          should land early next week. One thing is waiting on you: the shipping zones.
          Nothing further can be built on that until it&apos;s decided.
        </p>
      </div>

      <div className="pad" style={PT20}>
        <div className="kpis">
          <Kpi value="18.4h" label="Hours worked" detail="across 4 days" />
          <Kpi value="3" label="Finished" detail="of 5 tasks" />
          <Kpi value="1" label="In progress" detail="account settings" />
          <Kpi value="1" label="Waiting on you" detail="shipping zones" critical />
        </div>
      </div>

      <div className="pad" style={PT20}>
        <div className="mhead">
          <span className="stitle">Project progress</span>
          <span className="num" style={{ fontSize: 12, color: "var(--pink-2)" }}>
            3 of 5 tasks finished
          </span>
        </div>
        <div className="mtrack">
          <div className="mfill" style={{ width: "60%" }} />
        </div>
        <p className="ssub">
          Counted in tasks, not hours. Tasks aren&apos;t the same size, so this is a count and
          not a guess at what&apos;s left.
        </p>
      </div>

      <Divider />

      <div className="pad" style={PT20}>
        <p className="stitle">Hours by day</p>
        <p className="ssub" style={{ paddingBottom: 16 }}>
          Wednesday wasn&apos;t worked on this project.
        </p>
        <div className="days">
          <Day label="MON" height={66} value="5.2h" />
          <Day label="TUE" height={61} value="4.8h" />
          <Day label="WED" value="—" />
          <Day label="THU" height={62} value="4.9h" />
          <Day label="FRI" height={44} value="3.5h" />
        </div>
      </div>

      <Divider />

      <div className="pad" style={PT20}>
        <p className="stitle">Where the time went</p>
        <p className="ssub" style={{ paddingBottom: 14 }}>
          Share of the 18.4 hours, by task.
        </p>
        <div className="share">
          {SHARE.map((s) => (
            <span key={s.token} style={{ width: `${s.pct}%`, background: `var(${s.token})` }}>
              {s.label}
            </span>
          ))}
        </div>
        <div className="legend">
          {SHARE.map((s) => (
            <span className="lg" key={s.token}>
              <i className="sq" style={{ background: `var(${s.token})` }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <Divider />

      <div className="pad" style={PT20}>
        <p className="stitle" style={{ paddingBottom: 14 }}>
          The work
        </p>
        <table className="work">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th className="tbc" aria-label="Share of hours" />
              <th className="r">Hours</th>
            </tr>
          </thead>
          <tbody>
            {WORK_ROWS.map((row) => (
              <tr key={row.name}>
                <td>
                  <span className="tn">
                    <i className="sw" style={{ background: `var(${row.token})` }} />
                    {row.name}
                  </span>
                </td>
                <td>
                  <span className={row.statusClass}>{row.status}</span>
                </td>
                <td className="tbc">
                  <div
                    className="tbar"
                    style={{ width: `${row.width}%`, background: `var(${row.token})` }}
                  />
                </td>
                <td className="r">
                  <span className="hrs">{row.hours}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pad" style={PT20}>
        <p className="honesty">
          Hours are counted automatically while the work was actually happening. Breaks and
          time away aren&apos;t included, so this total is lower than the clock on the wall.
          Days not worked are shown as gaps.
        </p>
      </div>

      <Divider />
      <div className="sh-foot">
        <span>Measured by Porta · useporta.com</span>
        <span>Permanent link · not indexed</span>
      </div>
    </article>
  );
}

function PrivateSheet() {
  return (
    <article className="sheet">
      <div className="sh-head">
        <div>
          <p className="eyebrow">Your week · private</p>
          <h2>{HEADING}</h2>
          <p className="sh-period">{PERIOD}</p>
        </div>
        <div className="sh-by">
          <span className="pflag">On your machine only</span>
        </div>
      </div>
      <Divider gap={20} />

      <div className="pad" style={PT20}>
        <div className="kpis">
          <Kpi value="18.4h" label="Counted" detail="across 4 days" />
          <Kpi value="$1,380" label="At your rate" detail="18.4h × $75" />
          <Kpi value="28.7h" label="At the desk" detail="64% of it counted" />
          <Kpi value="4.1h" label="Other clients" detail="not in this report" />
        </div>
      </div>

      <Divider />

      <div className="pad" style={PT20}>
        <p className="stitle" style={{ paddingBottom: 4 }}>
          Your names for things
        </p>
        <p className="ssub" style={{ paddingBottom: 16 }}>
          You call a task whatever you like. Porta learns the client-facing name once and
          never asks again.
        </p>
        <table className="work">
          <thead>
            <tr>
              <th>What you called it</th>
              <th>What the client reads</th>
              <th className="r">Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="tn">
                  <i className="sw" style={{ background: "var(--t1)" }} />
                  checkout, finally
                </span>
                <span className="raw">2 restarts, worth it</span>
              </td>
              <td>Checkout flow rebuild</td>
              <td className="r">
                <span className="hrs">7.6</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="tn">
                  <i className="sw" style={{ background: "var(--t2)" }} />
                  the stripe error mess
                </span>
              </td>
              <td>Payment error states</td>
              <td className="r">
                <span className="hrs">4.2</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="tn">
                  <i className="sw" style={{ background: "var(--t5)" }} />
                  shipping — waiting on Marc AGAIN
                </span>
                <span className="raw">3rd week blocked</span>
              </td>
              <td>Shipping rules</td>
              <td className="r">
                <span className="hrs">1.1</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Divider />

      <div className="pad" style={PT20}>
        <p className="stitle">How the week actually went</p>
        <p className="ssub" style={{ paddingBottom: 16 }}>
          Focus, pressure, and what pulled you off. Yours alone.
        </p>
        <div className="days">
          <Day label="MON" height={78} value="strong" colour="var(--t3)" numeric={false} />
          <Day label="TUE" height={52} value="choppy" colour="var(--t4)" numeric={false} />
          <Day label="WED" value="—" />
          <Day label="THU" height={84} value="strong" colour="var(--t3)" numeric={false} />
          <Day label="FRI" height={38} value="scattered" colour="var(--t2)" numeric={false} />
        </div>
      </div>

      <div className="pad" style={PT20}>
        <p className="honesty">
          <b>None of this reaches your client.</b> Not your rate, not the pressure, not your
          names for things, not the hours you spent on someone else. They get an account of
          the work. Not a record of your week.
        </p>
      </div>

      <Divider />
      <div className="sh-foot">
        <span>Stored on your machine</span>
        <span>Never uploaded</span>
      </div>
    </article>
  );
}

export default function ReportSheet({ variant }: { variant: "client" | "private" }) {
  return variant === "client" ? <ClientSheet /> : <PrivateSheet />;
}
