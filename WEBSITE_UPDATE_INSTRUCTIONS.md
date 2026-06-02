# Website Update Instructions — useporta.com

These are complete instructions for updating the porta-website codebase. All content changes go in `src/App.tsx`, styling in `src/styles/global.css`, form changes in `src/components/BetaRequestForm.tsx` and `src/lib/betaRequestApi.ts`. Do not touch anything in `src/ari-video/`, `src/scenes/`, `src/immersive/`, or `src/world/`.

---

## File: src/App.tsx

### 1. Remove two data arrays entirely

Delete the `whatAriSees` array (lines ~5–22) and the `whatAriFiguresOut` array (lines ~24–41). These sections are being removed from the site.

---

### 2. Update the `howAriHelps` array

Replace the existing items with exactly these three (remove "Suggest a stretch break"):

- Title: `Suggest a break` / Detail: `A short pause when overload keeps rising.`
- Title: `Quiet notifications` / Detail: `Silenced during deep work, turned back on after.`
- Title: `Stay on task` / Detail: `A nudge when your attention drifts.`

---

### 3. Update the `trustCards` array

Replace with exactly these three:

- Title: `No keylogging` / Detail: `Ari never reads what you type or copies clipboard contents.`
- Title: `No screenshots` / Detail: `Ari never captures your screen or records what you see.`
- Title: `No file names` / Detail: `Ari only sees the rhythm of your keyboard, mouse, and which app is in focus.`

---

### 4. Update the nav

Change the nav link text from `How Ari helps` to `How it works` and its href from `#regulation` to `#how-it-works`.

---

### 5. Update the Hero section

**Eyebrow:** keep as `Ari for computer work`

**Headline:** keep as `Protect Your Focus at Work.`

**Subheadline:** replace the existing `<p className="landing-lead">` text with:
> Ari runs silently on your Windows PC, tracks how your focus moves through the day, and sends you a clear summary every evening.

**Hero aside card:** replace the `<p className="landing-card-copy">` text with:
> A small floating panel shows your focus time, pressure level, and time worked — updated live, without opening anything.

Add an `<img>` tag below that paragraph inside the hero card. Use `src="/images/widget.png"`, `alt="Ari widget showing focus time, pressure, and hours worked"`, and apply a new CSS class `landing-hero-card-img`. Leave the src as a placeholder path — the screenshot will be added later.

---

### 6. Remove two sections entirely from the JSX

Delete the full `<section>` block with `id="signals"` (What Ari sees — 4 cards).
Delete the full `<section>` block with `id="inference"` (What Ari figures out — 4 cards).

---

### 7. Add four new sections after the demo section

Insert these four new sections after the `id="demo"` section and before the `id="regulation"` section. Each section follows the same structural pattern as the existing sections (landing-shell, landing-section, landing-section-heading with eyebrow + h2, then content area).

---

**Section A — Widget**

- `id="widget"`
- Eyebrow: `ALWAYS WITH YOU`
- Headline: `Always know where you stand.`
- Subheadline paragraph: `A small floating panel shows your focus time, pressure level, and time worked — updated live, without opening anything.`
- Content: a single `<div>` with class `landing-screenshot-frame`. Inside it, an `<img>` with `src="/images/widget.png"` and `alt="Ari widget"` and class `landing-screenshot-img`.

---

**Section B — History Calendar**

- `id="history"`
- Eyebrow: `YOUR DAY, VISUALIZED`
- Headline: `See exactly how your day moved.`
- Subheadline paragraph: `Ari builds a visual map of your day — focus blocks, distractions, breaks — by the hour. Day, week, or two weeks at a glance.`
- Content: a single `<div>` with class `landing-screenshot-frame landing-screenshot-frame-large`. Inside it, an `<img>` with `src="/images/history.png"` and `alt="Ari history calendar showing a full day of focus blocks"` and class `landing-screenshot-img`.

---

**Section C — Nightly Digest**

- `id="digest"`
- Eyebrow: `EVERY EVENING`
- Headline: `A clear recap lands in your inbox every night.`
- Subheadline paragraph: `At the end of each day, Ari emails you a summary of how you worked — total focus time, pressure moments, what pulled your attention. No app to open.`
- Content: a single `<div>` with class `landing-screenshot-frame`. Inside it, an `<img>` with `src="/images/digest.png"` and `alt="Ari nightly digest email"` and class `landing-screenshot-img`.

---

**Section D — Interventions (replaces the old "How Ari helps")**

- Keep the existing `id="regulation"` on this section so the nav link still works, but also add `id="how-it-works"` — use `id="how-it-works"` and remove `id="regulation"` since we updated the nav href.
- Eyebrow: `WHEN FOCUS SLIPS`
- Headline: `Ari quietly steps in.`
- Subheadline paragraph: `When overload builds or deep work is interrupted, Ari suggests a break, suppresses notifications, or nudges you back — without breaking your flow.`
- Keep the existing grid of cards using the updated `howAriHelps` array (3 cards now, use `landing-grid-three` instead of `landing-grid-four`).

---

### 8. Update the Trust section

- Keep `id="trust"`
- Eyebrow: keep `Controls and trust`
- Headline: change to `Your data stays on your device.`
- Add a subheadline paragraph after the headline: `Ari never reads what you type, never takes screenshots, never logs what files you open. It only sees the rhythm of your keyboard, mouse, and which app is in focus.`
- Keep the 3-card grid using the updated `trustCards` array.

---

### 9. Update "Who it's for" section

- Keep `id="audience"`
- Eyebrow: keep `Who it's for`
- Headline: change to `For anyone who does deep work at a computer.`
- Keep all the audience chips and interaction logic unchanged.

---

### 10. Update the Beta section

- Keep `id="beta"`
- Eyebrow: keep `Windows beta`
- Headline: keep `Ready to stay focused at work?`
- Subheadline: keep as is.

---

## File: src/components/BetaRequestForm.tsx

### Remove the "scatter source" field

1. Remove the `scatterSource` field from the `INITIAL_FORM` constant.
2. Remove the `<label>` block for "Biggest source of the day getting scattered" (the textarea field) from the JSX.
3. Remove the validation for `scatterSource` in `validateForm()` — the `if (!form.scatterSource.trim())` block.

The form should now have exactly 3 fields: Work email, Role, Hours per day on a computer.

---

## File: src/lib/betaRequestApi.ts

### Remove scatterSource from the type and payload

1. Remove `scatterSource: string` from the `BetaRequestPayload` type.
2. No other changes needed — the API will receive the object without that field and handle it gracefully.

---

## File: src/styles/global.css

### Screenshot visual treatment — Rize-style app window frame

Each screenshot section should display the image inside a **fake app window frame** — similar to how Rize.io presents their product screenshots. The frame gives the screenshot a "this is a real app" look rather than just an image dropped in a box.

Add these new classes at the end of the file, before the media query blocks:

**`.landing-app-window`**
This is the outer wrapper — a floating dark container with a subtle glow, rounded corners, and a window chrome bar at the top.
- `position: relative`
- `width: 100%`
- `max-width: 900px` (for history — the large one; use 480px for widget and digest)
- `margin-inline: auto`
- `border-radius: 16px`
- `overflow: hidden`
- `border: 1px solid rgba(255, 255, 255, 0.1)`
- `background: #0d0f18`
- `box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.06)`
- Transition: transform 300ms ease, box-shadow 300ms ease
- On hover: `transform: translateY(-4px)`, box-shadow gets slightly stronger

**`.landing-app-window-bar`**
The fake title bar at the top of the frame.
- `display: flex`
- `align-items: center`
- `gap: 7px`
- `padding: 12px 16px`
- `background: rgba(255, 255, 255, 0.04)`
- `border-bottom: 1px solid rgba(255, 255, 255, 0.07)`

**`.landing-app-window-dot`**
The three colored circles (macOS-style traffic lights) inside the bar.
- `width: 12px`, `height: 12px`
- `border-radius: 50%`
- First dot: `background: #ff5f57`
- Second dot: `background: #febc2e`
- Third dot: `background: #28c840`

**`.landing-app-window-img`**
The screenshot image inside the frame.
- `display: block`
- `width: 100%`
- `height: auto`

**`.landing-app-window--large`**
Modifier for the history screenshot (biggest one).
- `max-width: 100%` (full container width)

**`.landing-app-window--small`**
Modifier for the widget screenshot (smallest one).
- `max-width: 420px`

**`.landing-hero-card-img`**
- `display: block`
- `width: 100%`
- `height: auto`
- `border-radius: 14px`
- `margin-top: 14px`

### Update the screenshot JSX in App.tsx

Wherever the instructions say to use `<div className="landing-screenshot-frame">`, instead use this pattern:

```
<div className="landing-app-window [modifier]">
  <div className="landing-app-window-bar">
    <span className="landing-app-window-dot" />
    <span className="landing-app-window-dot" />
    <span className="landing-app-window-dot" />
  </div>
  <img src="/images/[name].png" alt="..." className="landing-app-window-img" />
</div>
```

- History section: use `landing-app-window landing-app-window--large`
- Digest section: use `landing-app-window` (default)
- Widget section: use `landing-app-window landing-app-window--small`

### Update media queries

In the `@media (max-width: 767px)` block, add `.landing-app-window` to get `border-radius: 14px` and ensure `max-width: 100%` on all variants.

---

## New page section order (final)

After all changes, the page sections from top to bottom should be:

1. Header / Nav
2. Hero (`id="hero"`)
3. Demo (`id="demo"`)
4. Widget (`id="widget"`)
5. History Calendar (`id="history"`)
6. Nightly Digest (`id="digest"`)
7. Interventions (`id="how-it-works"`)
8. Who it's for (`id="audience"`)
9. Trust (`id="trust"`)
10. Beta form (`id="beta"`)

---

## Image placeholders

The following image files will be added to `/public/images/` later. For now, use these src paths as placeholders — the `<img>` tags should exist in the code but the images don't exist yet:

- `/images/widget.png` — the floating widget screenshot
- `/images/history.png` — the history calendar day view screenshot
- `/images/digest.png` — the nightly digest email screenshot

---

## What NOT to change

- Do not touch `src/ari-video/`, `src/scenes/`, `src/immersive/`, `src/world/`, or `src/core/`
- Do not touch `src/main.tsx`
- Do not touch the immersive experience link at the bottom of the beta section
- Do not touch the audience chips data or interaction logic
- Do not touch the form submission logic or API endpoint
- Do not touch the reveal/animation system (`data-reveal`, `data-motion` attributes) — apply the same patterns to new sections as existing ones
