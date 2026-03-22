import { useEffect, useState } from "react";
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
    detail: "A short pause when overload keeps rising.",
  },
  {
    title: "Suggest a stretch break",
    detail: "A quick stretch when fatigue starts building.",
  },
  {
    title: "Help you stay on one task",
    detail: "A nudge to stay with the task in front of you.",
  },
  {
    title: "Quiet notifications during deep work",
    detail: "Notifications quieted during deep work, then turned back on after.",
  },
];

const audiences = [
  {
    title: "Founders",
    detail: "For days split across decisions, hiring, docs, meetings, and constant switching.",
  },
  {
    title: "Startup teams",
    detail: "For work that keeps jumping between chat, tickets, docs, and shifting priorities.",
  },
  {
    title: "PMs",
    detail: "For people balancing planning, writing, meetings, and cross-team follow-up.",
  },
  {
    title: "Engineers",
    detail: "For people trying to protect deep work while code, docs, and messages keep pulling.",
  },
  {
    title: "Consultants",
    detail: "For people moving between clients, calls, decks, notes, and analysis.",
  },
  {
    title: "Analysts",
    detail: "For long stretches of research, spreadsheets, reports, and context switching.",
  },
  {
    title: "Designers",
    detail: "For focused creative work mixed with reviews, feedback, and collaboration.",
  },
];

const trustCards = [
  {
    title: "Pause or resume",
    detail: "Stop Ari anytime, turn it back on later, or revoke consent.",
  },
  {
    title: "Export or delete data",
    detail: "Download your local data or clear it from the device.",
  },
  {
    title: "Privacy basics",
    detail: "Ari does not read typed text, capture screenshots, or copy clipboard contents.",
  },
];

export default function App() {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [hoveredAudience, setHoveredAudience] = useState<string | null>(null);

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

  const activeAudienceTitle = hoveredAudience ?? selectedAudience;
  const activeAudience = audiences.find((audience) => audience.title === activeAudienceTitle) ?? null;

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
          <a href="#regulation">How Ari helps</a>
          <a href="#trust">Trust</a>
          <a href="#beta">Windows beta</a>
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
          <h1>
            <span className="landing-hero-line">Protect Your Focus</span>
            <span className="landing-hero-line">at Work.</span>
          </h1>
          <p className="landing-lead">
            Ari watches activity on your computer for early signs that focus is slipping, then
            gently helps you stay on track.
          </p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-primary" href="#beta">
              Request Windows Beta
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
              Ari can suggest a break, suggest staying on task, or quiet notifications during deep
              work.
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
          <h2>When Ari steps in, it does it in simple ways.</h2>
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
        <div className="landing-audience-cloud" data-has-detail={activeAudience ? "true" : "false"}>
          <div className="landing-chip-cloud">
            {audiences.map((audience, index) => (
              <button
                key={audience.title}
                type="button"
                className="landing-chip"
                data-reveal
                data-reveal-order={(index % 4) + 1}
                data-motion="chip-pop"
                data-active={activeAudienceTitle === audience.title ? "true" : "false"}
                onMouseEnter={() => setHoveredAudience(audience.title)}
                onMouseLeave={() => setHoveredAudience((current) => (current === audience.title ? null : current))}
                onFocus={() => setHoveredAudience(audience.title)}
                onBlur={() => setHoveredAudience((current) => (current === audience.title ? null : current))}
                onClick={() =>
                  setSelectedAudience((current) => (current === audience.title ? null : audience.title))
                }
              >
                {audience.title}
              </button>
            ))}
          </div>
          {activeAudience ? (
            <div
              className="landing-audience-detail"
              data-reveal
              data-reveal-order="2"
              data-motion="card-rise"
            >
              <h3>{activeAudience.title}</h3>
              <p>{activeAudience.detail}</p>
            </div>
          ) : null}
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
          <h2>You stay in control.</h2>
        </div>
        <div className="landing-grid landing-grid-three">
          {trustCards.map((item, index) => (
            <article
              key={item.title}
              className="landing-trust-card"
              data-reveal
              data-reveal-order={Math.min(index + 1, 3)}
              data-motion={["card-slide-right", "card-rise", "card-slide-left"][index % 3]}
            >
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
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
          <h2>Ready to stay focused at work?</h2>
          <p>Join the closed beta. Tell us a bit about your work, and we will reach out when Ari is ready for you.</p>
        </div>

        <div data-reveal data-reveal-order="2" data-motion="beta-panel">
          <BetaRequestForm
            title="Request Windows Beta"
            description="This is a closed beta, not an instant download. Your answers help shape the next beta group."
            panelClassName="landing-beta-card"
          />
        </div>
        <div className="landing-beta-footnote" data-reveal data-reveal-order="3" data-motion="section">
          <p>Prefer the visual walkthrough?</p>
          <a className="landing-inline-link" href="/#/experience">
            Open the immersive experience
          </a>
        </div>
      </section>
    </main>
  );
}
