/**
 * The document. Light on purpose — it is the one thing on this page that
 * leaves your machine, so it looks like paper and not like an app.
 *
 * `client` is what lands in the client's inbox. `private` is the same week
 * with everything they never get to see.
 */
import EffortByDay, { type EffortDay } from "./EffortByDay";

const PT20 = { paddingTop: 20 } as const;

/**
 * The week, split by day AND by task. Every column sums to that day's hours and every task
 * sums to its row in the work table, so the chart, the table and the share bar all agree:
 *   Mon 5.2 · Tue 4.8 · Wed — · Thu 4.9 · Fri 3.5   =  18.4h
 *   t1 7.6 · t2 4.2 · t3 3.1 · t4 2.4 · t5 1.1      =  18.4h
 */
const EFFORT_DAYS: EffortDay[] = [
  {
    label: "MON",
    segments: [
      { token: "--t1", task: "Checkout flow rebuild", hours: 4.0 },
      { token: "--t2", task: "Payment error states", hours: 1.2 },
    ],
  },
  {
    label: "TUE",
    segments: [
      { token: "--t1", task: "Checkout flow rebuild", hours: 3.6 },
      { token: "--t2", task: "Payment error states", hours: 1.2 },
    ],
  },
  { label: "WED", segments: [] },
  {
    label: "THU",
    segments: [
      { token: "--t2", task: "Payment error states", hours: 1.8 },
      { token: "--t3", task: "Mobile navigation", hours: 3.1 },
    ],
  },
  {
    label: "FRI",
    segments: [
      { token: "--t4", task: "Account settings", hours: 2.4 },
      { token: "--t5", task: "Shipping rules", hours: 1.1 },
    ],
  },
];


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

const HEADING = "Harbor — website rebuild";
const PERIOD = "9 – 13 September 2026  ·  week 4";

const WORK_ROWS = [
  {
    token: "--t1",
    name: "Checkout flow rebuild",
    // The result line is the argument of the whole page: the hours are counted, but the
    // sentence is the freelancer's own, typed into the evening card.
    result: "Live on staging. Card, Apple Pay and one failure path all tested.",
    status: "✓ Done",
    statusClass: "st done",
    width: 100,
    hours: "7.6",
  },
  {
    token: "--t2",
    name: "Payment error states",
    result:
      "Every Stripe decline now says what to do next instead of “something went wrong”.",
    status: "✓ Done",
    statusClass: "st done",
    width: 55,
    hours: "4.2",
  },
  {
    token: "--t3",
    name: "Mobile navigation",
    result: "Rebuilt to work one-handed. Tested on a real phone, not a resized window.",
    status: "✓ Done",
    statusClass: "st done",
    width: 41,
    hours: "3.1",
  },
  {
    token: "--t4",
    name: "Account settings",
    result: "Email and password done. Notification preferences still to come.",
    status: "In progress",
    statusClass: "st",
    width: 32,
    hours: "2.4",
  },
  {
    token: "--t5",
    name: "Shipping rules",
    result: "Blocked since the 3rd, waiting on the zone list from Marc.",
    status: "Waiting on you",
    statusClass: "st blk",
    width: 14,
    hours: "1.1",
  },
];

const SHARE = [
  { token: "--t1", pct: 41.3, label: "41%", name: "Checkout flow rebuild" },
  { token: "--t2", pct: 22.8, label: "23%", name: "Payment error states" },
  { token: "--t3", pct: 16.8, label: "17%", name: "Mobile navigation" },
  { token: "--t4", pct: 13.1, label: "13%", name: "Account settings" },
  { token: "--t5", pct: 6, label: "6%", name: "Shipping rules" },
];

/**
 * The private strip, on the same geometry. The scores are out of 100 and drive the column
 * height against the best day, so a strong day and a choppy one are actually different
 * heights — they previously all collapsed to the same 35px.
 */
const FOCUS_DAYS: EffortDay[] = [
  { label: "MON", valueLabel: "strong", segments: [{ token: "--t3", task: "Focus", hours: 78 }] },
  { label: "TUE", valueLabel: "choppy", segments: [{ token: "--t4", task: "Focus", hours: 52 }] },
  { label: "WED", valueLabel: "—", segments: [] },
  { label: "THU", valueLabel: "strong", segments: [{ token: "--t3", task: "Focus", hours: 84 }] },
  { label: "FRI", valueLabel: "scattered", segments: [{ token: "--t2", task: "Focus", hours: 38 }] },
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
        <p className="stitle">Effort by day</p>
        <p className="ssub" style={{ paddingBottom: 16 }}>
          Each day split by the task worked on. Days with no work on this project are shown as
          gaps rather than removed.
        </p>
        <EffortByDay days={EFFORT_DAYS} />
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
        <table className="work work-client">
          <colgroup>
            <col style={{ width: "45%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
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
                  <span className="res">{row.result}</span>
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
        <span>Measured by Ari · useporta.com</span>
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
        <EffortByDay days={FOCUS_DAYS} />
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
