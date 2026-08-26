import { useEffect, useState } from "react";
import BetaRequestForm from "./components/BetaRequestForm";
import CheckInCard from "./components/CheckInCard";
import DigestMail from "./components/DigestMail";
import PlanCard from "./components/PlanCard";
import ReportSheet from "./components/ReportSheet";
import ReportToggle, { type ReportTab } from "./components/ReportToggle";
import Widget from "./components/Widget";
import {
  CONTACT_EMAIL,
  DOWNLOAD_HREF,
  DOWNLOAD_URL,
  REPORT_DEMO_HREF,
  REPORT_DEMO_LABEL,
  talkToUs,
} from "./lib/links";

const HERO_SPARK =
  "0,15 14,13 28,14 42,10 56,12 70,8 84,11 98,7 112,9 126,6 140,8 154,5 168,7 182,4 196,6 210,5 224,7 238,4 252,6 266,5 280,6";
const DAY_SPARK =
  "0,17 16,14 32,15 48,11 64,13 80,9 96,10 112,6 128,8 144,5 160,7 176,4 192,6 208,3 224,5 240,4 256,6 280,4";

const REPORT_TABS: ReportTab[] = [
  { id: "tab-client", controls: "v-client", label: "What your client sees" },
  { id: "tab-you", controls: "v-you", label: "What you see" },
];

const REPORT_HINTS = [
  "One week of work, exactly as it lands in your client's inbox.",
  "The same week, with everything your client never gets to see.",
];

const PROBLEMS = [
  {
    n: "01",
    title: "You spend Friday remembering",
    body: "Scrolling back through your own week to work out what you actually did, because nothing wrote it down while you were doing it.",
  },
  {
    n: "02",
    title: "Your invoice has nothing behind it",
    body: "A number and one line of description. If the client questions it, all you have is what you remember. Memory loses that argument.",
  },
  {
    n: "03",
    title: "Silence worries people",
    body: "They can't see you working, so they check in. You reply. Now they've learned that asking works, so they ask again.",
  },
];

const RULES = [
  ["Nothing is guessed", "Every hour was counted while you were working."],
  [
    "It counts low, never high",
    "Breaks aren't included, so the total sits under the clock on the wall.",
  ],
  [
    "Days off show as gaps",
    "Didn't work Wednesday? The chart says so. Hiding it is how you lose someone.",
  ],
  [
    'No "time remaining"',
    "A guess you made for yourself turns into a promise the second they read it.",
  ],
  ["3 of 5 tasks, not 60%", "Tasks aren't the same size. A percentage pretends they are."],
  [
    "Once sent, it's frozen",
    "Tidying your notes later changes the next report, never one they already have.",
  ],
  [
    "You keep a copy of what was sent",
    "The numbers, the wording, who got it, and when.",
  ],
  [
    "It never claims a win you didn't confirm",
    "The summary comes from what you said, never from which apps were open.",
  ],
];

const NEVER = [
  ["Takes screenshots", "Not on a timer. Not ever."],
  ["Reads what you type", "Keystrokes are counted, never recorded."],
  ["Sees your files", "It knows you were in an editor. Not which file."],
  ["Scores you to your client", "They get hours and outcomes. No grade."],
  ["Sends on its own", "Every report leaves because you pressed send."],
  ["Shows them money", "Your rate stays on your machine."],
];

const FAQ = [
  [
    "What if the hours look wrong?",
    "Drop any line from the report and the total moves with it. You can't push an hour up, and that's the point. A number you can edit is worth nothing.",
  ],
  [
    "What if I forget to tell it what I'm doing?",
    "The counting doesn't need you. The evening card catches up.",
  ],
  [
    "Can one client see another?",
    "No. A report covers one project, and the link holds that report and nothing else.",
  ],
  [
    "Does it work offline?",
    "Yes. Everything is counted and kept on your machine. Only sending needs a connection.",
  ],
  ["Who does the email come from?", "Your name. If your client hits reply, it reaches you, not us."],
  [
    "What if I stop paying?",
    "Links you already sent keep working. Your client's copy shouldn't break over something between you and us.",
  ],
];

export default function App() {
  const [view, setView] = useState(0);

  // The document is empty until React renders, so the browser's own fragment
  // scroll finds nothing and a shared /#pricing link lands at the top. Run it
  // once the page actually exists.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) {
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    target?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <>
      <header className="nav">
        <div className="shell nav-in">
          <a className="brand" href="#top">
            <span className="dot" />
            Porta
          </a>
          <nav className="nav-links" aria-label="Main">
            <a href="#report">The report</a>
            <a href="#day">A day with Porta</a>
            <a href="#trust">Why it's believed</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <a className="btn btn-primary btn-sm" href="#pricing">
            Try it free
          </a>
        </div>
      </header>

      <main id="top">
        {/* ══ 1. HERO ═══════════════════════════════════════════ */}
        <section className="shell hero">
          <div className="hero-copy">
            <p className="eyebrow">For freelancers and contractors · Windows</p>
            <h1>
              Stop writing
              <br />
              the update.
            </h1>
            <p className="lede">
              Porta counts your work while you do it. At the end of the week it writes the
              progress report your client is waiting for. You read it and press send.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={DOWNLOAD_HREF}>
                Download for Windows
              </a>
              <a className="btn btn-ghost" href={REPORT_DEMO_HREF}>
                {REPORT_DEMO_LABEL}
              </a>
            </div>
            <p className="hint">14 days free · No card · Windows 10 and 11</p>
          </div>

          <div>
            <Widget
              status="FOCUSED · 31m 04s"
              spark={HERO_SPARK}
              work="6h 44m 10s"
              pressure="68%"
              pressureWarn
              task={{ mark: "✓", name: "Checkout flow rebuild", tags: ["Harbor", "planned"] }}
            />
            <p className="wg-cap">Sits in the corner. Nothing to open.</p>
          </div>
        </section>

        {/* ══ 2. THE REPORT ═════════════════════════════════════ */}
        <section className="shell stage" id="report">
          <div className="stage-bar">
            <ReportToggle
              tabs={REPORT_TABS}
              value={view}
              onChange={setView}
              label="Report view"
            />
            <p className="stage-hint">{REPORT_HINTS[view]}</p>
          </div>

          <div
            className="view"
            id="v-client"
            role="tabpanel"
            aria-labelledby="tab-client"
            hidden={view !== 0}
          >
            <ReportSheet variant="client" />
            <p className="cap">
              <span className="ar" aria-hidden="true">
                →
              </span>
              Your client clicks a link. Nothing to install, no account, no password. What they
              see is frozen the moment you send it, so it says the same thing in six months.
            </p>
          </div>

          <div
            className="view"
            id="v-you"
            role="tabpanel"
            aria-labelledby="tab-you"
            hidden={view !== 1}
          >
            <ReportSheet variant="private" />
            <p className="cap">
              <span className="ar" aria-hidden="true">
                →
              </span>
              Same week, two views. You draw the line once, and Porta never moves it.
            </p>
          </div>
        </section>

        {/* ══ 3. STATEMENT ══════════════════════════════════════ */}
        <section className="statement">
          <div className="shell">
            <p>
              They stop asking how it's going, <em>because they can already see.</em>
            </p>
          </div>
        </section>

        {/* ══ 4. THE PROBLEM ════════════════════════════════════ */}
        <section className="shell band" id="why">
          <div className="split">
            <div className="split-head">
              <p className="eyebrow">Why this exists</p>
              <h2>The work is the easy part.</h2>
              <p style={{ fontSize: "15.5px", color: "var(--ink-3)" }}>
                Proving it is what costs you every week.
              </p>
            </div>
            <div className="probs">
              {PROBLEMS.map((problem) => (
                <div className="prob" key={problem.n}>
                  <span className="prob-n">{problem.n}</span>
                  <div>
                    <h3>{problem.title}</h3>
                    <p>{problem.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. A DAY WITH PORTA ═══════════════════════════════ */}
        <section className="shell band" id="day">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "60ch" }}>
            <p className="eyebrow">A day with Porta</p>
            <h2>You do the work. It does the paperwork.</h2>
            <p className="lede">
              Four moments in a day. You only touch one of them, and it takes about a minute.
            </p>
          </div>

          <div className="day-rail">
            <div className="stop">
              <p className="stop-when">Morning</p>
              <h3>It asks what today is for</h3>
              <p>One card. Pick what you're working on, or add something new.</p>
              <div className="stop-ui">
                <CheckInCard variant="morning" />
              </div>
            </div>

            <div className="stop">
              <p className="stop-when">All day</p>
              <h3>It counts, quietly</h3>
              <p>
                No timer to start. No timer to forget to stop. The corner panel shows what's
                being counted.
              </p>
              <div className="stop-ui">
                <Widget
                  full
                  status="FOCUSED · 52m 18s"
                  spark={DAY_SPARK}
                  work="4h 12m 30s"
                  pressure="41%"
                  task={{ mark: "◷", name: "Account settings", tags: ["Harbor"] }}
                />
              </div>
            </div>

            <div className="stop">
              <p className="stop-when">Evening</p>
              <h3>Four taps and the day is closed</h3>
              <p>
                It shows what it counted. You say what came of it. That sentence is the one your
                client reads.
              </p>
              <div className="stop-ui">
                <CheckInCard variant="evening" />
              </div>
            </div>

            <div className="stop">
              <p className="stop-when">11:30 pm</p>
              <h3>Your day lands in your inbox</h3>
              <p>Just for you. Nobody else gets this one, and it never mentions a client.</p>
              <div className="stop-ui">
                <DigestMail />
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6. THE CHAIN ══════════════════════════════════════ */}
        <section className="shell band" id="chain">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "58ch" }}>
            <p className="eyebrow">Where the words come from</p>
            <h2>One tap becomes one line.</h2>
            <p className="lede">
              Nothing in the report is a machine guessing at your work. The hours were counted.
              The words are yours.
            </p>
          </div>

          <div className="chain">
            <div className="ch-side">
              <p className="ch-l">You typed this, Thursday 6:40 pm</p>
              <div className="ch-tap">
                <p className="q">What came of it?</p>
                <p className="a">Live on staging, ready for review</p>
              </div>
            </div>
            <div className="ch-ar" aria-hidden="true">
              →
            </div>
            <div className="ch-side">
              <p className="ch-l">Your client reads this, Friday</p>
              <div className="ch-out">
                <p className="l">In the summary</p>
                <p className="x">
                  "The checkout flow is rebuilt and live on staging, ready for review. 7.6 hours
                  across Monday and Tuesday."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. WHY IT'S BELIEVED ══════════════════════════════ */}
        <section className="shell band" id="trust">
          <div className="split">
            <div className="split-head">
              <p className="eyebrow">Why a client believes it</p>
              <h2>Counted, not remembered.</h2>
              <p style={{ fontSize: "15.5px", color: "var(--ink-3)" }}>
                Anyone can argue with an invoice. These rules mean your answer is the
                measurement, not your word.
              </p>
            </div>
            <div className="rules">
              {RULES.map(([title, body], index) => (
                <div className="ri" key={title}>
                  <span className="mk">{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <b>{title}</b>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. PRIVACY ════════════════════════════════════════ */}
        <section className="shell band" id="privacy">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "60ch" }}>
            <p className="eyebrow">Privacy</p>
            <h2>Other tools prove your work by watching you.</h2>
            <p className="lede">
              Screenshots every ten minutes. Keystroke counts. A score your client can read. It
              works, and it costs you your dignity. Porta counts the shape of the work, never
              what's in it.
            </p>
          </div>

          <div className="never">
            <p className="eyebrow">Porta never</p>
            <div className="ng">
              {NEVER.map(([title, body]) => (
                <div className="ni" key={title}>
                  <span className="x" aria-hidden="true">
                    ✕
                  </span>
                  <p>
                    <b>{title}</b>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 9. FIT ════════════════════════════════════════════ */}
        <section className="shell band" id="fit">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "56ch" }}>
            <p className="eyebrow">Fit</p>
            <h2>Who this is for, and who it isn't.</h2>
          </div>
          <div className="fit">
            <div className="fc yes">
              <h3>You'll get it straight away if</h3>
              <ul>
                {[
                  "You bill by the hour, the day, or on a retainer",
                  "Your client can't see you work, and asks how it's going",
                  "You work on a Windows PC",
                  "Jobs run for weeks or months, not an afternoon",
                ].map((item) => (
                  <li key={item}>
                    <span className="mk" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="fc no">
              <h3>Give it a miss if</h3>
              <ul>
                {[
                  "You're on a Mac. There's no Mac version, and we won't pretend there is.",
                  "You work fixed-price and hours never come up",
                  "You need invoicing. Porta hands you the hours; your invoicing tool keeps its job.",
                  "You want to watch a team. This is bought by the person doing the work.",
                ].map((item) => (
                  <li key={item}>
                    <span className="mk" aria-hidden="true">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ 10. PRICING ═══════════════════════════════════════ */}
        <section className="shell band" id="pricing">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "56ch" }}>
            <p className="eyebrow">Pricing</p>
            <h2>Start on your own. Bring people when you need to.</h2>
            <p className="lede">
              If one report saves you an hour of writing, it's paid for the month twice over.
            </p>
          </div>

          <div className="plans">
            <PlanCard
              lead
              name="Solo"
              audience="One person, as many clients as you like."
              amount="$19"
              per="a month"
              hint="or $15 a month paid yearly"
              features={[
                "Unlimited reports and clients",
                "Counted automatically, no timers",
                "A permanent link per report, plus PDF",
                "Daily and weekly email, just for you",
                "Sent in your name, replies come to you",
              ]}
              cta={{ label: "Start 14 days free", href: DOWNLOAD_URL, primary: true }}
              note="No card. Send a real report first."
            />
            <PlanCard
              name="Team"
              audience="Three or more of you, on shared projects."
              amount="$15"
              amountSmall
              per="per person, a month"
              hint="3 people minimum"
              features={[
                "Everything in Solo",
                "Shared projects and clients",
                "One report covering the whole team's week",
                "Each person's private view stays private",
              ]}
              cta={{ label: "Talk to us", href: talkToUs("Team") }}
              note="Tell us how you work and we'll set it up."
            />
            <PlanCard
              name="Agency"
              audience="A studio or agency reporting to many clients."
              amount="Let's talk"
              amountSmall
              amountNumeric={false}
              hint="priced on how many of you there are"
              features={[
                "Everything in Team",
                "Set up with you, machine by machine",
                "Someone you can call",
              ]}
              cta={{ label: "Talk to us", href: talkToUs("Agency") }}
              note="Usually a 20 minute call."
            />
          </div>
        </section>

        {/* ══ 11. DOWNLOAD ══════════════════════════════════════ */}
        <section className="shell band" id="download">
          <div className="split">
            <div className="split-head">
              <p className="eyebrow">Download</p>
              <h2>Put it on your machine.</h2>
              <p style={{ fontSize: "15.5px", color: "var(--ink-3)" }}>
                Windows 10 and 11. Fourteen days free, no card. We'll email you the link.
              </p>
            </div>
            <BetaRequestForm
              title="Where should we send it?"
              description="Two fields, and one question we'd genuinely like the answer to."
            />
          </div>
        </section>

        {/* ══ 12. FAQ ═══════════════════════════════════════════ */}
        <section className="shell band" id="faq">
          <div className="split">
            <div className="split-head">
              <p className="eyebrow">Before you ask</p>
              <h2>The usual questions.</h2>
            </div>
            <div className="faq">
              {FAQ.map(([question, answer]) => (
                <div className="qa" key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 13. CLOSE ═════════════════════════════════════════ */}
        <section className="shell band close">
          <h2>Send the week. Not an email about it.</h2>
          <p className="lede">
            Install it on a Monday. By Friday there's a report waiting, and you didn't write a
            word of it.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href={DOWNLOAD_HREF}>
              Download for Windows
            </a>
            <a className="btn btn-ghost" href={REPORT_DEMO_HREF}>
              {REPORT_DEMO_LABEL}
            </a>
          </div>
          <p className="hint">Windows 10 and 11 · 14 days free · No card</p>
        </section>
      </main>

      <footer className="foot">
        <div className="shell foot-in">
          <a className="brand" href="#top">
            <span className="dot" />
            Porta
          </a>
          <nav className="foot-links" aria-label="Footer">
            <a href="#day">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#privacy">Privacy</a>
            <a href="#faq">Questions</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          </nav>
          <p className="hint">useporta.com</p>
        </div>
      </footer>
    </>
  );
}
