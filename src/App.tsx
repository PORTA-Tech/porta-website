import BetaRequestForm from "./components/BetaRequestForm";

const whatAriSees = [
  {
    title: "Keyboard activity",
    detail: "Typing speed, rhythm, and how steady your input looks over time.",
  },
  {
    title: "Mouse activity",
    detail: "Movement, scrolling, and quick correction patterns during work.",
  },
  {
    title: "App switching",
    detail: "How often attention jumps between tools, tabs, and windows.",
  },
  {
    title: "Idle time",
    detail: "Short pauses, longer breaks, and stop-start patterns through the day.",
  },
];

const whatAriFiguresOut = [
  {
    title: "Focus",
    detail: "Whether work looks steady enough to protect.",
  },
  {
    title: "Overload",
    detail: "When the day starts looking scattered or hard to sustain.",
  },
  {
    title: "Trust",
    detail: "How reliable the current reading looks.",
  },
  {
    title: "Calibration",
    detail: "How ready Ari is to make stronger suggestions.",
  },
];

const audiences = [
  "Founders",
  "Startup teams",
  "PMs",
  "Engineers",
  "Consultants",
  "Analysts",
  "Designers",
];

const controls = [
  "Pause or resume Ari",
  "Export local data",
  "Delete local data",
  "Revoke consent",
  "No typed text, screenshots, or clipboard capture",
];

export default function App() {
  return (
    <main className="landing-page">
      <div className="landing-background" aria-hidden="true">
        <div className="landing-glow landing-glow-left" />
        <div className="landing-glow landing-glow-right" />
        <div className="landing-orb" />
      </div>

      <header className="landing-shell landing-topbar">
        <a className="landing-brand" href="/">
          Ari
        </a>
        <nav className="landing-nav" aria-label="Primary">
          <a href="#demo">Demo</a>
          <a href="#trust">Trust</a>
          <a href="#beta">Windows beta</a>
          <a className="landing-nav-link-accent" href="/experience">
            Immersive experience
          </a>
        </nav>
      </header>

      <section className="landing-shell landing-hero" id="hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">Ari for focused computer work</p>
          <h1>See when the day starts slipping out of focus.</h1>
          <p className="landing-lead">
            Ari watches activity patterns on your computer so you can catch focus slipping and
            overload rising before the day gets fully scattered.
          </p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-primary" href="#beta">
              Request Windows beta access
            </a>
            <a className="landing-button landing-button-secondary" href="/experience">
              Open immersive experience
            </a>
          </div>
          <ul className="landing-proof-list">
            <li>Watches activity patterns, not content</li>
            <li>Shows focus, overload, trust, and calibration</li>
            <li>Lets you pause, export, delete local data, and revoke consent</li>
          </ul>
        </div>

        <div className="landing-hero-aside">
          <div className="landing-hero-card">
            <p className="landing-card-label">Fast product read</p>
            <p className="landing-card-copy">
              Ari helps people who need to think clearly on a computer notice earlier when the
              day is drifting, then suggests simple steps to protect focus or take a break.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="demo">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">Short demo</p>
          <h2>See a recorded Ari session in under a minute.</h2>
          <p>
            This is the same recorded Ari trace used in the coded video pipeline, exported for the
            website as a lightweight homepage cut.
          </p>
        </div>

        <div className="landing-demo-frame">
          <video
            className="landing-demo-video"
            src="/ari-video/exports/ari-recorded-story-homepage.mp4"
            poster="/ari-video/exports/ari-recorded-story-poster.png"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </section>

      <section className="landing-shell landing-section" id="signals">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">What Ari sees</p>
          <h2>It watches the rhythm of work, not the content.</h2>
        </div>
        <div className="landing-grid landing-grid-four">
          {whatAriSees.map((item) => (
            <article key={item.title} className="landing-feature-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="inference">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">What Ari figures out</p>
          <h2>Simple signals you can understand at a glance.</h2>
        </div>
        <div className="landing-grid landing-grid-four">
          {whatAriFiguresOut.map((item) => (
            <article key={item.title} className="landing-feature-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="audience">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">Who it&apos;s for</p>
          <h2>Built for people whose work depends on thinking clearly on a computer.</h2>
        </div>
        <div className="landing-chip-cloud">
          {audiences.map((audience) => (
            <span key={audience} className="landing-chip">
              {audience}
            </span>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="trust">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">Controls and trust</p>
          <h2>You stay in control of Ari.</h2>
        </div>
        <div className="landing-grid landing-grid-two">
          <div className="landing-trust-card">
            <h3>What Ari can do</h3>
            <ul className="landing-list">
              {controls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="landing-trust-card">
            <h3>What Ari does not do</h3>
            <ul className="landing-list">
              <li>Does not read typed text</li>
              <li>Does not capture screenshots</li>
              <li>Does not copy clipboard contents</li>
              <li>Does not claim to read thoughts or feelings directly</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section landing-beta-section" id="beta">
        <div className="landing-section-heading landing-section-heading-tight">
          <p className="landing-eyebrow">Windows beta</p>
          <h2>Request access and tell us where your day gets scattered.</h2>
        </div>

        <BetaRequestForm
          title="Request access to the Windows beta"
          description="Tell us a bit about your work and what breaks focus most often. We will use that to prioritize the next beta group."
          panelClassName="landing-beta-card"
        />
      </section>
    </main>
  );
}
