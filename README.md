# Rohit Dixit — Portfolio

A premium, **dark-mode-only** developer portfolio built with React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion. Includes a live GitHub dashboard, real visitor analytics, an EmailJS-powered contact form, a custom cursor, a command palette (⌘K), an interactive terminal, and a fully playable 3D isometric Stack game embedded right on the homepage ("Playroom").

## Stack

- **React 18 + TypeScript + Vite 6**
- **Tailwind CSS v4** with fluid `clamp()`-based typography and spacing (large editorial scale, 1700px container)
- **Framer Motion** (`motion/react`) for animation, tilt, and the custom cursor
- **EmailJS** for the contact form
- **GitHub REST API** for live open-source stats — profile, repos, languages, stars (no auth required, public data only)

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint       # ESLint
```

Requires Node.js 18+.

## Project structure

```
src/
  app/App.tsx          # app root
  layouts/              # MainLayout (navbar + footer + GA/visitor-insights init)
  pages/HomePage.tsx     # composes all homepage sections
  features/              # one folder per section (hero, terminal, about, projects, playroom, skills,
                          # github, journey, certificates, futureLab, analytics, contact)
  components/
    shared/               # CustomCursor, CommandPalette, LoadingScreen, BackToTop, TiltCard...
    ui/                   # Button, Badge, GlassCard, SectionHeader...
    layout/               # Navbar, Footer
  data/                   # your content — personal info, projects, skills, timeline
  hooks/                  # useLenis, useActiveSection, useCountUp, useScrollDepthTracking...
  lib/                    # env.ts (reads VITE_ vars), analytics.ts (GA4 + local stats),
                          # visitorInsights.ts (device/session/section engagement)
  styles/                 # theme.css (design tokens + large fluid type scale), index.css
public/
  profile.jpg / profile.webp
  rohit-dixit-resume.pdf
  projects/*.jpg /*.webp   # real project screenshots
```

## Interactive Terminal

A hacker-style terminal sits right below the hero (`#terminal`), styled like Warp/Hyper/VS Code's integrated terminal. Type `help` for the full command list — `about`, `projects`, `skills`, `resume`, `github`, `play`, `analytics`, `contact`, `experience`/`journey`, `futurelab`, `certificates`, `clear`. Arrow Up/Down recalls command history, the input auto-focuses when the terminal scrolls into view, and every command fires a `terminal_command` GA4 event.

## Playroom

A full 3D isometric Stack game lives directly on the homepage between **Projects** and **Skills** (`#playroom`) — no separate route or page load required. Left panel shows live score, high score, best combo, an achievements checklist, and your 5 most recent runs (all via `localStorage`); right side is a large glass-framed canvas (up to 880×880 on desktop, 700px on tablet) with Start/Restart/Mute/Fullscreen controls. Mouse, touch, and keyboard (Space to drop, Escape to pause, M to mute) are all supported. All sound effects are synthesized at runtime via the Web Audio API — no external audio files are bundled.

## Custom cursor & command palette

- A dual-layer custom cursor (inner dot + outer glass ring) replaces the system cursor on fine-pointer desktop devices only — it's automatically disabled on touch devices and when `prefers-reduced-motion` is set. Hovering elements with a `data-cursor="LABEL"` attribute shows contextual text (VIEW, LIVE, PROJECT, CODE, PDF, EMAIL, OPEN, PLAY); elements with `data-magnetic` get a subtle pull-toward-cursor effect.
- Press **⌘K / Ctrl+K** (or the search button in the navbar) to open a command palette for jumping to any section, project, your resume, or GitHub profile.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. Every variable is optional — nothing breaks if you skip a section, each feature just falls back gracefully (see comments in `.env.example`).

### Google Analytics 4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → add a Web stream for your deployed domain.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Set `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in `.env.local`.
4. Rebuild/redeploy. Real pageviews and the events below now flow into GA4 (only in production builds — GA never initializes in `npm run dev`):
   - `resume_download`, `project_click`, `github_click`, `contact_submit`
   - `game_start`, `game_over`, `high_score`
   - `nav_click`, `scroll_depth` (25/50/75/100%), `section_view`
   - `command_palette_open`, `command_palette_select`, `terminal_command`

**Important limitation:** GA4's *reporting* API needs a private service-account backend — it can't be securely queried from a static frontend. The on-page **Analytics** section therefore shows two honest things instead of invented numbers:
- **This device's** visit/engagement stats, tracked in `localStorage` (clearly labeled as such in the UI)
- Whether GA4 is connected and receiving real events

For a real cross-visitor dashboard, either check the GA4 web console directly, or publish a [Looker Studio](https://lookerstudio.google.com) report connected to your GA4 property and embed/link it.

### EmailJS (contact form)

1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. Add an **Email Service** (e.g. Gmail) → note the **Service ID**.
3. Create an **Email Template** with variables `from_name`, `reply_to`, `subject`, `message`, `to_name` → note the **Template ID**.
4. Go to Account → General → copy your **Public Key**.
5. Set all three in `.env.local`:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
   ```
6. Rebuild. Until these are set, the form falls back to opening the visitor's own email client (`mailto:`) so messages still reach you — it never fails silently.

### GitHub live stats

Set `VITE_GITHUB_USERNAME` if it's not `Rohitdixitcs`. No API key needed — this uses GitHub's public REST API, which is rate-limited to 60 requests/hour per IP for unauthenticated calls. That's more than enough for a portfolio's traffic.

## Deployment (Netlify / Vercel / any static host)

This project builds to a fully static single-page site (`npm run build` → `dist/`) — no client-side routing, so no SPA rewrite rules are needed.

Set the `VITE_*` variables in your host's **Environment variables** before building — Vite bakes them in at build time, so they must be present during the build step, not just at runtime.

## SEO

`index.html` includes a canonical tag, Open Graph/Twitter tags, and a JSON-LD `Person` schema, and `public/robots.txt` + `public/sitemap.xml` are included. **All three currently point to a placeholder domain (`https://rohitdixit.dev/`)** — update the `<link rel="canonical">` in `index.html`, `public/robots.txt`, and `public/sitemap.xml` to your real deployed URL once you know it.

## Performance notes

- Images are pre-optimized to WebP with JPEG fallback via `<picture>`, resized to sensible max dimensions
- Fluid typography (`clamp()`) avoids layout jumps across breakpoints instead of relying on many fixed breakpoint overrides
- `loading="lazy"` on below-the-fold images; the first project screenshot loads eagerly for a faster LCP
- Scroll-driven effects (navbar hide/show, back-to-top, scroll-depth tracking) are throttled to one update per animation frame rather than running on every native scroll event
- The custom cursor's hit-testing (`elementFromPoint`) is throttled to animation frames rather than running on every raw pointer-move event
