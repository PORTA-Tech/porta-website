import { useEffect, useState } from "react";
import BetaRequestForm from "./components/BetaRequestForm";

const howAriHelps = [
  {
    title: "Suggest a break",
    detail: "A short pause when overload keeps rising.",
  },
  {
    title: "Quiet notifications",
    detail: "Silenced during deep work, turned back on after.",
  },
  {
    title: "Stay on task",
    detail: "A nudge when your attention drifts.",
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
    title: "No keylogging",
    detail: "Ari never reads what you type or copies clipboard contents.",
  },
  {
    title: "No screenshots",
    detail: "Ari never captures your screen or records what you see.",
  },
  {
    title: "No file names",
    detail: "Ari only sees the rhythm of your keyboard, mouse, and which app is in focus.",
  },
];

export default function App() {
  const [selectedAudienceTitle, setSelectedAudienceTitle] = useState<string | null>(null);
  const [hoveredAudienceTitle, setHoveredAudienceTitle] = useState<string | null>(null);
  const [supportsHover, setSupportsHover] = useState(false);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSupportsHover = () => setSupportsHover(mediaQuery.matches);

    updateSupportsHover();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSupportsHover);
      return () => mediaQuery.removeEventListener("change", updateSupportsHover);
    }

    mediaQuery.addListener(updateSupportsHover);
    return () => mediaQuery.removeListener(updateSupportsHover);
  }, []);

  const activeAudienceTitle = hoveredAudienceTitle ?? selectedAudienceTitle;
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
          <a href="#how-it-works">How it works</a>
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
            Ari runs silently on your Windows PC, tracks how your focus moves through the day, and sends you a clear summary every evening.
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
              A small floating panel shows your focus time, pressure level, and time worked — updated live, without opening anything.
            </p>
            <img
              className="landing-hero-card-img"
              src="/images/widget.png"
              alt="Ari widget showing focus time, pressure, and hours worked"
            />
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="widget">
        <div className="landing-feature-row">
          <div
            className="landing-section-heading landing-section-heading--no-margin"
            data-reveal
            data-reveal-order="1"
            data-motion="section"
          >
            <p className="landing-eyebrow">Always with you</p>
            <h2>Always know where you stand.</h2>
            <p>A small floating panel shows your focus time, pressure level, and time worked — updated live, without opening anything.</p>
          </div>
          <div className="app-window-wrap" data-reveal data-reveal-order="2" data-motion="demo">
            <div className="app-window app-window--narrow">
              <div className="app-window-titlebar">
                <div className="app-window-dots">
                  <span className="app-window-dot app-window-dot--red" />
                  <span className="app-window-dot app-window-dot--yellow" />
                  <span className="app-window-dot app-window-dot--green" />
                </div>
              </div>
              <div className="app-window-body">
                <img className="app-window-img" src="/images/widget.png" alt="Ari widget" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="history">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Your day, visualized</p>
          <h2>See exactly how your day moved.</h2>
          <p>Ari builds a visual map of your day — focus blocks, distractions, breaks — by the hour. Day, week, or two weeks at a glance.</p>
        </div>
        <div className="app-window-wrap" data-reveal data-reveal-order="2" data-motion="demo">
          <div className="app-window">
            <div className="app-window-titlebar">
              <div className="app-window-dots">
                <span className="app-window-dot app-window-dot--red" />
                <span className="app-window-dot app-window-dot--yellow" />
                <span className="app-window-dot app-window-dot--green" />
              </div>
            </div>
            <div className="app-window-body">
              <img className="app-window-img" src="/images/history.png" alt="Ari history calendar showing a full day of focus blocks" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="digest">
        <div className="landing-feature-row landing-feature-row--reverse">
          <div
            className="landing-section-heading landing-section-heading--no-margin"
            data-reveal
            data-reveal-order="1"
            data-motion="section"
          >
            <p className="landing-eyebrow">Every evening</p>
            <h2>A clear recap lands in your inbox every night.</h2>
            <p>At the end of each day, Ari emails you a summary of how you worked — total focus time, pressure moments, what pulled your attention. No app to open.</p>
          </div>
          <div className="app-window-wrap" data-reveal data-reveal-order="2" data-motion="demo">
            <div className="app-window app-window--email">
              <div className="app-window-titlebar">
                <div className="app-window-dots">
                  <span className="app-window-dot app-window-dot--red" />
                  <span className="app-window-dot app-window-dot--yellow" />
                  <span className="app-window-dot app-window-dot--green" />
                </div>
              </div>
              <div className="app-window-body">
                <img className="app-window-img" src="/images/digest.png" alt="Ari nightly digest email" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" id="how-it-works">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">When focus slips</p>
          <h2>Ari quietly steps in.</h2>
          <p>When overload builds or deep work is interrupted, Ari suggests a break, suppresses notifications, or nudges you back — without breaking your flow.</p>
        </div>
        <div className="landing-grid landing-grid-three">
          {howAriHelps.map((item, index) => (
            <article
              key={item.title}
              className="landing-feature-card"
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

      <section className="landing-shell landing-section" id="audience">
        <div
          className="landing-section-heading"
          data-reveal
          data-reveal-order="1"
          data-motion="section"
        >
          <p className="landing-eyebrow">Who it&apos;s for</p>
          <h2>For anyone who does deep work at a computer.</h2>
        </div>
        <div
          className="landing-audience-cloud"
          data-has-detail={activeAudience ? "true" : "false"}
          onMouseLeave={() => {
            if (supportsHover) {
              setHoveredAudienceTitle(null);
            }
          }}
        >
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
                onMouseEnter={() => {
                  if (supportsHover) {
                    setHoveredAudienceTitle(audience.title);
                  }
                }}
                onFocus={() => setHoveredAudienceTitle(audience.title)}
                onBlur={() => {
                  if (supportsHover) {
                    setHoveredAudienceTitle(null);
                  }
                }}
                onClick={() => {
                  if (!supportsHover) {
                    setSelectedAudienceTitle((current) =>
                      current === audience.title ? null : audience.title
                    );
                  }
                }}
              >
                {audience.title}
              </button>
            ))}
          </div>
          {activeAudience ? (
            <div className="landing-audience-detail">
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
          <h2>Your data stays on your device.</h2>
          <p>Ari never reads what you type, never takes screenshots, never logs what files you open. It only sees the rhythm of your keyboard, mouse, and which app is in focus.</p>
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
          <p>Tell us a bit about your work, and we will reach out when Ari is ready for you.</p>
        </div>

        <div data-reveal data-reveal-order="2" data-motion="beta-panel">
          <BetaRequestForm
            title="Request Windows Beta"
            description="Tell us a bit about your work. Your answers help shape the next beta group."
            panelClassName="landing-beta-card"
          />
        </div>
      </section>
    </main>
  );
}
