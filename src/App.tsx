import { useEffect, useRef, useState } from "react";

const audiences = [
  { title: "Founders", detail: "For days split across decisions, hiring, docs, meetings, and constant switching." },
  { title: "Startup teams", detail: "For work that keeps jumping between chat, tickets, docs, and shifting priorities." },
  { title: "PMs", detail: "For people balancing planning, writing, meetings, and cross-team follow-up." },
  { title: "Engineers", detail: "For people trying to protect deep work while code, docs, and messages keep pulling." },
  { title: "Consultants", detail: "For people moving between clients, calls, decks, notes, and analysis." },
  { title: "Analysts", detail: "For long stretches of research, spreadsheets, reports, and context switching." },
  { title: "Designers", detail: "For focused creative work mixed with reviews, feedback, and collaboration." },
];

// ── SVG icons ─────────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
  </svg>
);

// ── Screenshot frame ───────────────────────────────────────────────────────
function ScreenshotFrame({ src, alt, modifier = "" }: { src: string; alt: string; modifier?: string }) {
  return (
    <div className={`screenshot-frame ${modifier}`}>
      <div className="screenshot-titlebar">
        <span className="screenshot-dot screenshot-dot--red" />
        <span className="screenshot-dot screenshot-dot--yellow" />
        <span className="screenshot-dot screenshot-dot--green" />
      </div>
      <img className="screenshot-img" src={src} alt={alt} />
    </div>
  );
}

// ── Ari feature card ───────────────────────────────────────────────────────
function AriCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="ari-card">
      <div className="ari-card-icon">{icon}</div>
      <h3 className="ari-card-title">{title}</h3>
      <p className="ari-card-desc">{desc}</p>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [selectedAudienceTitle, setSelectedAudienceTitle] = useState<string | null>(null);
  const [hoveredAudienceTitle, setHoveredAudienceTitle] = useState<string | null>(null);
  const [supportsHover, setSupportsHover] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Nav scroll state
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const onScroll = () => setNavScrolled(page.scrollTop > 40);
    page.addEventListener("scroll", onScroll, { passive: true });
    return () => page.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    const targets = document.querySelectorAll(".reveal");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hover detection
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsHover(mq.matches);
    update();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const activeAudienceTitle = hoveredAudienceTitle ?? selectedAudienceTitle;
  const activeAudience = audiences.find((a) => a.title === activeAudienceTitle) ?? null;

  return (
    <div className="landing-page" ref={pageRef}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className={`site-nav${navScrolled ? " nav-scrolled" : ""}`}>
        <a href="/" className="nav-logo">Ari</a>
        <ul className="nav-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#trust">Trust</a></li>
          <li>
            <a href="#download" className="btn-nav">
              <DownloadIcon />
              Download
            </a>
          </li>
        </ul>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              AI Focus Agent · Windows
            </div>
            <h1 className="hero-h1">Protect Your <em>Focus</em> at Work.</h1>
            <p className="hero-sub">
              Ari runs silently on your Windows PC, tracks how your focus moves through the day, and sends you a clear summary every evening.
            </p>
            <div className="hero-ctas">
              <a href="#download" className="btn-primary">
                <DownloadIcon />
                Download for Windows
              </a>
              <a href="#how-it-works" className="btn-ghost">See how it works →</a>
            </div>
            <div className="hero-meta">
              <div className="hero-meta-item"><CheckIcon />Free beta</div>
              <div className="hero-meta-item"><CheckIcon />Windows 10 &amp; 11</div>
              <div className="hero-meta-item"><CheckIcon />No account required</div>
            </div>
          </div>

          {/* Widget mockup */}
          <div className="hero-visual">
            <div className="widget-glow-ring" />
            <div className="widget-wrap">
              <div className="widget-main">
                <div className="widget-topbar">
                  <div className="widget-logo-row">
                    <div className="widget-logo-icon"><LogoIcon /></div>
                    <span className="widget-logo-text">Ari</span>
                  </div>
                  <div className="widget-status-badge">
                    <span className="status-dot" />
                    Focused
                  </div>
                </div>
                <div className="widget-focus-score">
                  <div className="score-ring">
                    <svg viewBox="0 0 80 80">
                      <circle className="score-ring-bg" cx="40" cy="40" r="33" />
                      <circle className="score-ring-fill" cx="40" cy="40" r="33" />
                    </svg>
                    <div className="score-number">80</div>
                  </div>
                  <div className="score-label">Focus Score</div>
                </div>
                <div className="widget-stats">
                  <div className="widget-stat">
                    <div className="widget-stat-val">2h <span>14m</span></div>
                    <div className="widget-stat-lbl">Deep Work</div>
                  </div>
                  <div className="widget-stat">
                    <div className="widget-stat-val">4 <span>sessions</span></div>
                    <div className="widget-stat-lbl">Today</div>
                  </div>
                </div>
                <div className="widget-ari-card">
                  <div className="ari-avatar">A</div>
                  <div className="ari-message">
                    You&apos;ve been focused for <strong>47 min</strong>. Consider a short break — you&apos;ll come back sharper.
                  </div>
                </div>
              </div>

              <div className="float-card float-card-1">
                <div className="float-title">This week</div>
                {[["Mon","85%"],["Tue","60%"],["Wed","92%"],["Today","45%"]].map(([d,w]) => (
                  <div key={d} className="float-bar-row">
                    <div className="float-bar-label">{d}</div>
                    <div className="float-bar-track"><div className="float-bar-fill" style={{width:w}} /></div>
                  </div>
                ))}
              </div>

              <div className="float-card float-card-2">
                <div className="float-title">Focus Streak</div>
                <div className="float-streak">7</div>
                <div className="float-streak-label">days in a row 🔥</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num"><em>0</em> tabs</div>
          <div className="stat-label">needed to track</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">&lt; <em>1 min</em></div>
          <div className="stat-label">to install &amp; run</div>
        </div>
        <div className="stat-item">
          <div className="stat-num"><em>100%</em></div>
          <div className="stat-label">runs on your machine</div>
        </div>
        <div className="stat-item">
          <div className="stat-num"><em>0</em></div>
          <div className="stat-label">screenshots or keylogging</div>
        </div>
      </div>

      {/* ── WIDGET SECTION ──────────────────────────────────────────── */}
      <section className="site-section" id="widget">
        <div className="section-tag">Always with you</div>
        <h2 className="section-h2">Always know where you stand.</h2>
        <p className="section-sub">A small floating panel shows your focus time, pressure level, and time worked — updated live, without opening anything.</p>
        <div className="reveal">
          <ScreenshotFrame src="/images/widget.png" alt="Ari widget" modifier="screenshot-frame--narrow" />
        </div>
      </section>

      {/* ── HISTORY SECTION ─────────────────────────────────────────── */}
      <section className="site-section" id="history">
        <div className="section-tag">Your day, visualized</div>
        <h2 className="section-h2">See exactly how your <em>day moved.</em></h2>
        <p className="section-sub">Ari builds a visual map of your day — focus blocks, distractions, breaks — by the hour. Day, week, or two weeks at a glance.</p>
        <div className="reveal">
          <ScreenshotFrame src="/images/history.png" alt="Ari history calendar showing a full day of focus blocks" />
        </div>
      </section>

      {/* ── DIGEST SECTION ──────────────────────────────────────────── */}
      <section className="site-section" id="digest">
        <div className="section-tag">Every evening</div>
        <h2 className="section-h2">A clear recap lands in your <em>inbox</em> every night.</h2>
        <p className="section-sub">At the end of each day, Ari emails you a summary of how you worked — total focus time, pressure moments, what pulled your attention. No app to open.</p>
        <div className="reveal">
          <ScreenshotFrame src="/images/digest.png" alt="Ari nightly digest email" modifier="screenshot-frame--mid" />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="site-section" id="how-it-works">
        <div className="section-tag">When focus slips</div>
        <h2 className="section-h2">Ari quietly <em>steps in.</em></h2>
        <p className="section-sub">When overload builds or deep work is interrupted, Ari suggests a break, suppresses notifications, or nudges you back — without breaking your flow.</p>
        <div className="cards-grid reveal">
          <AriCard icon={<IconEye />}    title="Suggest a break"    desc="A short pause when overload keeps rising." />
          <AriCard icon={<IconBell />}   title="Quiet notifications" desc="Silenced during deep work, turned back on after." />
          <AriCard icon={<IconTarget />} title="Stay on task"       desc="A nudge when your attention drifts." />
        </div>
      </section>

      {/* ── TRUST SECTION ───────────────────────────────────────────── */}
      <section className="site-section" id="trust">
        <div className="section-tag">Privacy</div>
        <h2 className="section-h2">Your data stays <em>on your device.</em></h2>
        <p className="section-sub">Ari never reads what you type, never takes screenshots, never logs what files you open. It only sees the rhythm of your keyboard, mouse, and which app is in focus.</p>
        <div className="cards-grid reveal">
          <AriCard icon={<IconKey />}    title="No keylogging"  desc="Ari never reads what you type or copies clipboard contents." />
          <AriCard icon={<IconCamera />} title="No screenshots" desc="Ari never captures your screen or records what you see." />
          <AriCard icon={<IconShield />} title="No file names"  desc="Ari only sees the rhythm of your keyboard, mouse, and which app is in focus." />
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="site-section" id="for">
        <div className="section-tag">Who it&apos;s for</div>
        <h2 className="section-h2">For anyone who does <em>deep work</em> at a computer.</h2>
        <div
          onMouseLeave={() => { if (supportsHover) setHoveredAudienceTitle(null); }}
        >
          <div className="chips-cloud">
            {audiences.map((audience, i) => (
              <button
                key={audience.title}
                type="button"
                className="audience-chip reveal"
                style={{ transitionDelay: `${i * 40}ms` }}
                data-active={activeAudienceTitle === audience.title ? "true" : "false"}
                onMouseEnter={() => { if (supportsHover) setHoveredAudienceTitle(audience.title); }}
                onFocus={() => setHoveredAudienceTitle(audience.title)}
                onBlur={() => { if (supportsHover) setHoveredAudienceTitle(null); }}
                onClick={() => {
                  if (!supportsHover) {
                    setSelectedAudienceTitle((c) => c === audience.title ? null : audience.title);
                  }
                }}
              >
                {audience.title}
              </button>
            ))}
          </div>
          {activeAudience && (
            <div className="audience-detail">
              <div className="audience-detail-title">{activeAudience.title}</div>
              <p className="audience-detail-text">{activeAudience.detail}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────────────────── */}
      <div className="cta-section" id="download">
        <div className="cta-box reveal">
          <div className="section-tag">Free during beta</div>
          <h2 className="cta-h2">Your best work is waiting.</h2>
          <p className="cta-sub">Download Ari and stay in focus — runs silently on Windows 10 &amp; 11, no account needed.</p>
          <div className="cta-buttons">
            <a href="#" className="btn-primary">
              <DownloadIcon />
              Download for Windows
            </a>
          </div>
          <div className="cta-note">
            <span>Windows 10 &amp; 11</span>
            <span className="cta-note-sep">·</span>
            <span>Free beta</span>
            <span className="cta-note-sep">·</span>
            <span>No account required</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <a href="/" className="footer-logo">Ari</a>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="mailto:hello@useporta.com">Contact</a></li>
        </ul>
        <div className="footer-copy">© 2026 Porta</div>
      </footer>

    </div>
  );
}
