import { useEffect } from "react";
import { ARI_VIDEO_EXPORT_ASSETS } from "./ari-video/data/exportManifest";
import BetaRequestForm from "./components/BetaRequestForm";

const whatAriSees = [
  {
    title: "Keyboard activity",
    detail: "Typing pace and rhythm over time.",
  },
  {
    title: "Mouse activity",
    detail: "Movement, scrolling, and correction patterns.",
  },
  {
    title: "App switching",
    detail: "How often work jumps between tools and tabs.",
  },
  {
    title: "Idle time",
    detail: "Pauses, breaks, and stop-start stretches.",
  },
];

const whatAriFiguresOut = [
  {
    title: "Focus",
    detail: "Whether steady work is worth protecting.",
  },
  {
    title: "Overload",
    detail: "When work starts to look scattered.",
  },
  {
    title: "Trust",
    detail: "How reliable the current reading is.",
  },
  {
    title: "Calibration",
    detail: "How ready Ari is to step in more.",
  },
];

const howAriHelps = [
  {
    title: "Suggest a break",
    detail: "When overload keeps building, Ari can tell you it is time to step away for a bit.",
  },
  {
    title: "Suggest a stretch break",
    detail: "When fatigue builds up, Ari can suggest a short stretch break.",
  },
  {
    title: "Help you stay on one task",
    detail: "When focus is worth protecting, Ari can suggest staying with the task in front of you.",
  },
  {
    title: "Quiet notifications during deep work",
    detail: "Ari can turn notifications down during deep work, then turn them back on after.",
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
  "No typed text, screenshots, or clipboard",
];

export default function App() {
  useEffect(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (revealTargets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealTargets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

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
          <a className="landing-nav-link-accent" href="/#/experience">
            Immersive experience
          </a>
        </nav>
      </header>

      <section className="landing-shell landing-hero" id="hero">
        <div
          className="landing-hero-copy"
          data-reveal
          data-reveal-order="1"
          data-motion="hero-copy"
        >
          <p className="landing-eyebrow">Ari for computer work</p>
          <h1>See when work starts to get scattered.</h1>
          <p className="landing-lead">
            Ari looks at patterns in how you work on your computer and shows you when focus gets
            harder to hold.
          </p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-primary" href="#beta">
              Request Windows beta access
            </a>
            <a className="landing-button landing-button-secondary" href="/#/experience">
              Open immersive experience
            </a>
          </div>
        </div>

        <div
          className="landing-hero-aside"
          data-reveal
          data-reveal-order="2"
          data-motion="hero-card"
        >
          <div className="landing-hero-card">
            <p className="landing-card-copy">
              Ari can suggest a break, help you stay on one task, or quiet notifications during
              deep work.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="demo">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Short demo</p>
          <h2>Watch Ari in one real session.</h2>
        </div>

        <div
          className="landing-demo-frame"
          data-reveal
          data-reveal-order="2"
          data-motion="demo"
        >
          <video
            className="landing-demo-video"
            src={ARI_VIDEO_EXPORT_ASSETS.webMp4PublicPath}
            poster={ARI_VIDEO_EXPORT_ASSETS.posterPublicPath}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </section>

      <section className="landing-shell landing-section" id="signals">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">What Ari sees</p>
          <h2>It looks at how work moves through your day.</h2>
        </div>
        <div className="landing-grid landing-grid-four">
          {whatAriSees.map((item, index) => (
            <article
              key={item.title}
              className="landing-feature-card"
              data-reveal
              data-reveal-order={Math.min(index + 1, 4)}
              data-motion={["card-rise", "card-slide-right", "card-slide-left", "card-tilt"][index % 4]}
            >
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="inference">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">What Ari figures out</p>
          <h2>It turns those signals into a few clear states.</h2>
        </div>
        <div className="landing-grid landing-grid-four">
          {whatAriFiguresOut.map((item, index) => (
            <article
              key={item.title}
              className="landing-feature-card"
              data-reveal
              data-reveal-order={Math.min(index + 1, 4)}
              data-motion={["card-slide-left", "card-rise", "card-tilt", "card-slide-right"][index % 4]}
            >
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="regulation">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">How Ari helps</p>
          <h2>When it decides to step in, it does it in simple ways.</h2>
        </div>
        <div className="landing-grid landing-grid-four">
          {howAriHelps.map((item, index) => (
            <article
              key={item.title}
              className="landing-feature-card"
              data-reveal
              data-reveal-order={Math.min(index + 1, 4)}
              data-motion={["card-tilt", "card-rise", "card-slide-right", "card-slide-left"][index % 4]}
            >
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="audience">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Who it&apos;s for</p>
          <h2>For people who need clear thinking at a computer.</h2>
        </div>
        <div className="landing-chip-cloud">
          {audiences.map((audience, index) => (
            <span
              key={audience}
              className="landing-chip"
              data-reveal
              data-reveal-order={(index % 4) + 1}
              data-motion="chip-pop"
            >
              {audience}
            </span>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section" id="trust">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Controls and trust</p>
          <h2>You stay in control of Ari.</h2>
        </div>
        <div className="landing-grid landing-grid-two">
          <div
            className="landing-trust-card"
            data-reveal
            data-reveal-order="1"
            data-motion="card-slide-right"
          >
            <h3>What Ari can do</h3>
            <ul className="landing-list">
              {controls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div
            className="landing-trust-card"
            data-reveal
            data-reveal-order="2"
            data-motion="card-slide-left"
          >
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
        <div
          className="landing-section-heading landing-section-heading-tight"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Windows beta</p>
          <h2>Request Windows beta access.</h2>
        </div>

        <div data-reveal data-reveal-order="2" data-motion="beta-panel">
          <BetaRequestForm
            title="Request access to the Windows beta"
            description="Tell us what breaks focus most often. We will use that to shape the next beta group."
            panelClassName="landing-beta-card"
          />
        </div>
      </section>
    </main>
  );
}
