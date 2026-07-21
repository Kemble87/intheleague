import { useEffect, useRef } from 'react'

// InTheLeague — landing / front door.
// Self-contained: all styles are scoped under .itl-landing so they can't
// collide with the app's global CSS. CTAs call onGetStarted (opens Login).
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Anton&family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700;800&family=Space+Mono:wght@700&display=swap');

.itl-landing {
    --ink: #0E120F;
    --ink-soft: #171D18;
    --ink-line: #23291F;
    --chalk: #F6F5EF;
    --coupon: #F3EFE4;
    --coupon-card: #FBFAF5;
    --coupon-line: #E4DECD;
    --turf: #2CE86A;
    --turf-deep: #1E7D37;
    --amber: #F4B32C;
    --muted-on-ink: #8B928A;
    --muted-on-coupon: #6E7266;

    --display: "Archivo", system-ui, sans-serif;
    --body: "Inter", system-ui, sans-serif;
    --mono: "Space Mono", ui-monospace, monospace;
    --screamer: "Anton", "Archivo", sans-serif;
    --news-serif: Georgia, "Times New Roman", serif;

    --news: #ECE8DC;
    --news-ink: #17140D;
    --news-line: #C7C0AE;
    --news-muted: #6A6455;
  }

  .itl-landing, .itl-landing * { box-sizing: border-box; margin: 0; padding: 0; }

  
  @media (prefers-reduced-motion: reduce) {  }

  .itl-landing {
    min-height: 100vh; width: 100%;
    font-family: var(--body);
    background: var(--ink);
    color: var(--chalk);
    line-height: 1.5;
    overflow-x: hidden;
  }

  .itl-landing .wrap { max-width: 1120px; margin: 0 auto; padding: 0 22px; }

  /* ---------- top bar ---------- */
  .itl-landing .topbar {
    position: relative; z-index: 5;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 22px;
    max-width: 1120px; margin: 0 auto;
  }
  .itl-landing .wordmark {
    font-family: var(--display); font-weight: 900;
    font-size: 22px; letter-spacing: -0.02em; color: var(--chalk);
  }
  .itl-landing .wordmark span { color: var(--turf); }
  .itl-landing .nav-cta {
    font-family: var(--display); font-weight: 700; font-size: 14px;
    color: var(--ink); background: var(--chalk);
    padding: 9px 16px; border-radius: 999px; text-decoration: none;
    transition: transform .15s ease;
  }
  .itl-landing .nav-cta:hover { transform: translateY(-1px); }
  .itl-landing .nav-right { display: flex; align-items: center; gap: 6px; }
  .itl-landing .nav-login {
    font-family: var(--display); font-weight: 700; font-size: 14px;
    color: var(--chalk); background: transparent; text-decoration: none;
    padding: 9px 12px; border-radius: 999px; transition: color .15s ease;
  }
  .itl-landing .nav-login:hover { color: var(--turf); }

  /* ---------- hero ---------- */
  .itl-landing .hero {
    position: relative;
    padding: 34px 0 72px;
    background: radial-gradient(120% 90% at 50% -10%, #1c2a1e 0%, var(--ink) 55%);
    overflow: hidden;
  }
  /* floodlit pitch markings, very subtle */
  .itl-landing .pitch {
    position: absolute; inset: 0; pointer-events: none; opacity: .5;
  }
  .itl-landing .pitch::before { /* centre circle */
    content: ""; position: absolute; left: 50%; top: 8%;
    width: 340px; height: 340px; transform: translateX(-50%);
    border: 1px solid rgba(246,245,239,.06); border-radius: 50%;
  }
  .itl-landing .pitch::after { /* halfway line */
    content: ""; position: absolute; left: 0; right: 0; top: calc(8% + 170px);
    height: 1px; background: rgba(246,245,239,.06);
  }
  .itl-landing .floodglow {
    position: absolute; left: 50%; top: -6%; width: 620px; height: 380px;
    transform: translateX(-50%);
    background: radial-gradient(closest-side, rgba(244,179,44,.10), transparent 70%);
    pointer-events: none;
  }

  .itl-landing .hero-inner { position: relative; z-index: 2; text-align: center; }

  .itl-landing .eyebrow {
    font-family: var(--display); font-weight: 700; font-size: 12px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--turf);
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 18px;
  }
  .itl-landing .eyebrow .dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--turf);
    box-shadow: 0 0 0 0 rgba(43,168,74,.6); animation: itlPulse 2.2s infinite;
  }

  .itl-landing h1 {
    font-family: var(--display); font-weight: 900;
    font-size: clamp(40px, 11vw, 74px);
    line-height: .96; letter-spacing: -0.03em;
    color: var(--chalk); margin: 0 auto 20px; max-width: 12ch;
  }
  .itl-landing h1 .keep { color: var(--turf); }

  .itl-landing .sub {
    font-size: clamp(15px, 4vw, 18px); color: var(--muted-on-ink);
    max-width: 40ch; margin: 0 auto 28px; line-height: 1.55;
  }
  .itl-landing .sub b { color: var(--chalk); font-weight: 600; }

  .itl-landing .cta-row {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .itl-landing .btn {
    font-family: var(--display); font-weight: 700; font-size: 16px;
    padding: 14px 26px; border-radius: 999px; text-decoration: none;
    display: inline-block; transition: transform .15s ease, box-shadow .15s ease;
  }
  .itl-landing .btn-primary {
    background: var(--turf); color: #06210F;
    box-shadow: 0 8px 30px -8px rgba(43,168,74,.6);
  }
  .itl-landing .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px -10px rgba(43,168,74,.7); }
  .itl-landing .btn-ghost {
    background: transparent; color: var(--chalk);
    border: 1px solid var(--ink-line);
  }
  .itl-landing .btn-ghost:hover { border-color: var(--muted-on-ink); }

  .itl-landing .meta-line {
    font-size: 13px; color: var(--muted-on-ink); margin-bottom: 44px;
  }
  .itl-landing .meta-line b { color: var(--amber); font-weight: 600; }

  /* ---------- phone ---------- */
  .itl-landing .phone-stage {
    display: flex; justify-content: center;
    perspective: 1400px;
  }
  .itl-landing .phone {
    width: 300px; max-width: 82vw;
    background: #05070599; border: 9px solid #050705;
    border-radius: 42px;
    box-shadow:
      0 0 0 2px #262c26,
      0 40px 80px -24px rgba(0,0,0,.8),
      0 0 90px -20px rgba(44,232,106,.20);
    overflow: hidden;
    opacity: 0; transform: translateY(40px) scale(.98);
    transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1);
  }
  .itl-landing .phone.in { opacity: 1; transform: translateY(0) scale(1); }
  .itl-landing .notch {
    height: 26px; background: #050705; position: relative;
  }
  .itl-landing .notch::after {
    content: ""; position: absolute; left: 50%; top: 8px; transform: translateX(-50%);
    width: 96px; height: 6px; background: #1a1f1a; border-radius: 999px;
  }
  .itl-landing .screen {
    background: #0A0B0A; color: #E7EAE5;
    padding: 13px 12px 15px;
    font-family: "Poppins", var(--display);
    --pg: #2CE86A; --pgold: #F5B301; --pred: #FF4D6A;
    --pmuted: #7E847B; --pline: #23271F; --pdim: #5A5F55;
  }

  .itl-landing .dash-card {
    background: linear-gradient(158deg, #1c1b24 0%, #141613 42%);
    border: 1px solid #23271F; border-radius: 16px;
    padding: 13px 13px 14px; margin-bottom: 10px;
  }
  .itl-landing .dash-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }
  .itl-landing .dash-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--pg);
  }
  .itl-landing .dash-eyebrow .d { width: 5px; height: 5px; border-radius: 50%; background: var(--pg); }
  .itl-landing .players-pill {
    display: flex; align-items: center; gap: 6px;
    background: #0e100d; border: 1px solid #262a22; border-radius: 999px;
    padding: 3px 9px 3px 4px; font-size: 10px; font-weight: 600; color: #c7ccc3;
  }
  .itl-landing .players-pill .avs { display: flex; }
  .itl-landing .players-pill .avs i {
    width: 17px; height: 17px; border-radius: 50%; margin-left: -6px;
    border: 1.5px solid #0e100d; font-size: 7px; font-weight: 800; color: #fff;
    display: grid; place-items: center;
  }
  .itl-landing .dash-title { font-weight: 700; font-size: 27px; line-height: 1; letter-spacing: -0.01em; color: #fff; margin-bottom: 5px; }
  .itl-landing .dash-sub { font-size: 10px; color: var(--pmuted); font-weight: 500; margin-bottom: 11px; }
  .itl-landing .dash-sub b { color: #c7ccc3; font-weight: 600; }
  .itl-landing .dash-hr { height: 1px; background: var(--pline); margin-bottom: 12px; }

  .itl-landing .dash-stats { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: start; margin-bottom: 13px; }
  .itl-landing .stat-lbl { font-size: 8px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--pmuted); margin-top: 4px; }
  .itl-landing .stat-big .n { font-weight: 800; font-size: 36px; line-height: .85; color: var(--pg); }
  .itl-landing .stat-mid { display: flex; flex-direction: column; gap: 7px; padding-top: 3px; }
  .itl-landing .stat-mid .r { display: flex; align-items: baseline; gap: 8px; }
  .itl-landing .stat-mid .r b { font-weight: 700; font-size: 15px; color: #fff; min-width: 11px; }
  .itl-landing .stat-mid .r span { font-size: 8px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--pmuted); }
  .itl-landing .stat-rank { text-align: right; }
  .itl-landing .stat-rank .n { font-weight: 800; font-size: 22px; line-height: .85; color: var(--pgold); }
  .itl-landing .stat-rank .n sup { font-size: 11px; }

  .itl-landing .prog-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .itl-landing .prog-top .l { font-size: 8px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--pmuted); }
  .itl-landing .prog-top .r { font-size: 9px; font-weight: 600; color: #c7ccc3; }
  .itl-landing .prog-bar { height: 3px; border-radius: 2px; background: var(--pline); position: relative; overflow: hidden; margin-bottom: 5px; }
  .itl-landing .prog-bar .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 4%; background: var(--pg); }
  .itl-landing .prog-bar .runin { position: absolute; right: 0; top: 0; bottom: 0; width: 15%; background: var(--pred); opacity: .85; }
  .itl-landing .prog-ticks { display: flex; justify-content: space-between; font-size: 7px; color: var(--pdim); margin-bottom: 5px; }
  .itl-landing .prog-runin { text-align: right; font-size: 8px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--pred); }

  .itl-landing .nextpick { background: #0f130e; border: 1px solid #1f3320; border-radius: 14px; padding: 11px 12px; overflow: hidden; }
  .itl-landing .np-label {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 8.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--pg); margin-bottom: 10px;
  }
  .itl-landing .np-fade { transition: opacity .35s ease; }
  .itl-landing .np-fade.fade { opacity: 0; }
  .itl-landing .np-teams { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 11px; }
  .itl-landing .np-teams b { font-weight: 700; font-size: 14px; color: #fff; flex: 1; }
  .itl-landing .np-teams b.away { text-align: right; }
  .itl-landing .np-mid { flex: none; display: flex; flex-direction: column; align-items: center; }
  .itl-landing .np-mid .dt { font-weight: 700; font-size: 11px; color: #fff; white-space: nowrap; }
  .itl-landing .np-mid .lk { font-size: 9px; color: var(--pg); font-weight: 600; }
  .itl-landing .np-btn {
    display: block; background: var(--pg); color: #052610; text-align: center;
    font-weight: 700; font-size: 13px; padding: 12px; margin: 0 -12px -11px;
    border-radius: 0 0 13px 13px;
  }

  /* ---------- coupon / checklist section ---------- */
  .itl-landing .coupon {
    background: var(--coupon); color: var(--ink);
    padding: 78px 0 84px; position: relative;
  }
  .itl-landing .coupon .wrap { display: grid; gap: 40px; }
  @media (min-width: 860px) {
    .itl-landing .coupon .wrap { grid-template-columns: 0.9fr 1.1fr; align-items: center; gap: 56px; }
  }
  .itl-landing .coupon-eyebrow {
    font-family: var(--display); font-weight: 700; font-size: 12px;
    letter-spacing: .16em; text-transform: uppercase; color: var(--turf-deep);
    margin-bottom: 16px;
  }
  .itl-landing .coupon h2 {
    font-family: var(--display); font-weight: 900;
    font-size: clamp(30px, 7vw, 46px); line-height: 1.0; letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
  .itl-landing .coupon .lede { font-size: 16px; color: var(--muted-on-coupon); max-width: 34ch; }
  .itl-landing .coupon .kicker {
    margin-top: 22px; font-family: var(--display); font-weight: 800;
    font-size: 15px; color: var(--ink);
  }
  .itl-landing .coupon .kicker span { color: var(--turf-deep); }

  .itl-landing .checklist { display: grid; gap: 12px; }
  .itl-landing .check {
    background: var(--coupon-card); border: 1px solid var(--coupon-line);
    border-radius: 16px; padding: 16px 18px;
    display: flex; align-items: center; gap: 15px;
    box-shadow: 0 1px 0 rgba(0,0,0,.02);
    opacity: 0; transform: translateY(18px);
    transition: opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1);
  }
  .itl-landing .check.in { opacity: 1; transform: translateY(0); }
  .itl-landing .tick {
    flex: none; width: 34px; height: 34px; border-radius: 50%;
    background: #E9F6EC; color: var(--turf-deep);
    display: grid; place-items: center;
    transform: scale(.4); transition: transform .4s cubic-bezier(.3,1.5,.5,1) .12s;
  }
  .itl-landing .check.in .tick { transform: scale(1); }
  .itl-landing .tick svg { width: 17px; height: 17px; }
  .itl-landing .check .txt b {
    font-family: var(--display); font-weight: 800; font-size: 15px; display: block; margin-bottom: 2px;
  }
  .itl-landing .check .txt span { font-size: 13.5px; color: var(--muted-on-coupon); line-height: 1.4; }

  /* ---------- back page ---------- */
  .itl-landing .backpage-sec {
    background: var(--ink); position: relative; overflow: hidden;
    padding: 78px 0 84px;
  }
  .itl-landing .backpage-sec .floodglow { top: -14%; }
  .itl-landing .backpage-intro { position: relative; z-index: 2; text-align: center; margin-bottom: 40px; }
  .itl-landing .backpage-intro .coupon-eyebrow { color: var(--turf); margin-bottom: 14px; }
  .itl-landing .backpage-intro h2 {
    font-family: var(--display); font-weight: 900; color: var(--chalk);
    font-size: clamp(30px, 7vw, 46px); line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 14px;
  }
  .itl-landing .backpage-intro .lede { color: var(--muted-on-ink); max-width: 42ch; margin: 0 auto; font-size: 16px; }

  .itl-landing .paper {
    position: relative; z-index: 2;
    background: var(--news); color: var(--news-ink);
    max-width: 760px; margin: 0 auto;
    border-radius: 4px;
    padding: 22px 22px 16px;
    box-shadow: 0 40px 90px -30px rgba(0,0,0,.85), 0 0 70px -30px rgba(244,179,44,.25);
    opacity: 0; transform: translateY(26px) rotate(-.6deg);
    transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);
  }
  .itl-landing .paper.in { opacity: 1; transform: translateY(0) rotate(0); }

  .itl-landing .masthead {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 10px; border-bottom: 3px solid var(--news-ink); padding-bottom: 8px; margin-bottom: 4px;
  }
  .itl-landing .masthead .mh-name {
    font-family: var(--screamer); font-size: clamp(22px, 6vw, 34px);
    letter-spacing: .01em; text-transform: uppercase; line-height: 1;
  }
  .itl-landing .masthead .mh-name b { color: var(--turf-deep); }
  .itl-landing .masthead .mh-date {
    font-family: var(--body); font-size: 10.5px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .06em; color: var(--news-muted); text-align: right;
  }
  .itl-landing .rule-thin { height: 1px; background: var(--news-line); margin: 4px 0 16px; }

  .itl-landing .paper-grid { display: grid; gap: 22px; }
  @media (min-width: 720px) { .itl-landing .paper-grid { grid-template-columns: 1.7fr 1fr; } }

  .itl-landing .kicker-tag {
    display: inline-block; font-family: var(--display); font-weight: 800;
    font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
    background: var(--news-ink); color: var(--news); padding: 4px 8px; border-radius: 3px; margin-bottom: 10px;
  }
  .itl-landing .screamer {
    font-family: var(--screamer); text-transform: uppercase;
    font-size: clamp(38px, 10vw, 62px); line-height: .9; letter-spacing: .005em; margin-bottom: 10px;
  }
  .itl-landing .deck { font-family: var(--news-serif); font-size: 16px; font-style: italic; color: #33302a; margin-bottom: 12px; line-height: 1.35; }
  .itl-landing .byline {
    font-family: var(--body); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--news-muted); border-top: 1px solid var(--news-line); border-bottom: 1px solid var(--news-line);
    padding: 6px 0; margin-bottom: 14px;
  }
  .itl-landing .col-body { font-family: var(--news-serif); font-size: 14px; line-height: 1.55; color: #24221c; }
  .itl-landing .col-body p { margin-bottom: 11px; }
  .itl-landing .col-body p:first-of-type::first-letter {
    font-family: var(--screamer); float: left; font-size: 46px; line-height: .8;
    padding: 4px 8px 0 0; color: var(--news-ink);
  }
  .itl-landing .pullquote {
    font-family: var(--display); font-weight: 800; font-size: 17px; line-height: 1.2;
    border-left: 3px solid var(--turf); padding-left: 12px; margin: 14px 0 4px; color: var(--news-ink);
  }

  .itl-landing .sidebar { border-top: 3px solid var(--news-ink); padding-top: 10px; }
  @media (min-width: 720px) { .itl-landing .sidebar { border-top: none; border-left: 1px solid var(--news-line); padding-top: 0; padding-left: 20px; } }
  .itl-landing .side-h {
    font-family: var(--display); font-weight: 900; font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
    margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid var(--news-ink);
  }
  .itl-landing .side-block { margin-bottom: 16px; }
  .itl-landing .mini-row {
    display: flex; align-items: center; gap: 8px; font-family: var(--news-serif); font-size: 13px;
    padding: 4px 0; border-bottom: 1px dotted var(--news-line);
  }
  .itl-landing .mini-row .mp { font-family: var(--mono); font-weight: 700; font-size: 11px; width: 14px; color: var(--news-muted); }
  .itl-landing .mini-row .mn { flex: 1; font-weight: 600; }
  .itl-landing .mini-row .mpts { font-family: var(--mono); font-weight: 700; }
  .itl-landing .side-note { font-family: var(--news-serif); font-size: 13px; line-height: 1.45; color: #24221c; }
  .itl-landing .side-note b { font-family: var(--display); font-weight: 800; display: block; font-size: 13px; margin-bottom: 2px; }

  .itl-landing .paper-foot {
    margin-top: 16px; padding-top: 10px; border-top: 3px double var(--news-ink);
    display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
    font-family: var(--body); font-size: 11px; color: var(--news-muted);
  }
  .itl-landing .paper-foot .gen b { color: var(--turf-deep); font-weight: 700; }
  .itl-landing .paper-foot .share {
    font-family: var(--display); font-weight: 800; font-size: 12px;
    background: var(--turf); color: #06210F; padding: 6px 12px; border-radius: 999px;
  }

  /* ---------- closing ---------- */
  .itl-landing .closing {
    background: var(--ink); text-align: center; padding: 86px 22px 96px;
    position: relative; overflow: hidden;
  }
  .itl-landing .closing .floodglow { top: -20%; }
  .itl-landing .closing h3 {
    position: relative; z-index: 2;
    font-family: var(--display); font-weight: 900;
    font-size: clamp(30px, 8vw, 52px); line-height: 1.0; letter-spacing: -0.025em;
    color: var(--chalk); max-width: 16ch; margin: 0 auto 26px;
  }
  .itl-landing .closing h3 em { font-style: normal; color: var(--turf); }
  .itl-landing .closing .btn-primary { position: relative; z-index: 2; }
  .itl-landing .closing .fine { position: relative; z-index: 2; margin-top: 18px; font-size: 13px; color: var(--muted-on-ink); }

  /* reveal helper for text blocks */
  .itl-landing .rise { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); }
  .itl-landing .rise.in { opacity: 1; transform: translateY(0); }

  @keyframes itlPulse {
    0% { box-shadow: 0 0 0 0 rgba(43,168,74,.5); }
    70% { box-shadow: 0 0 0 8px rgba(43,168,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(43,168,74,0); }
  }
  @keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(255,107,94,.6); }
    70% { box-shadow: 0 0 0 6px rgba(255,107,94,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,107,94,0); }
  }

  .itl-landing a:focus-visible, .itl-landing .btn:focus-visible { outline: 3px solid var(--amber); outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) {
    .itl-landing, .itl-landing * { animation: none !important; transition: none !important; }
    .itl-landing .phone, .itl-landing .check, .itl-landing .rise, .itl-landing .tick, .itl-landing .paper { opacity: 1 !important; transform: none !important; }
  }

  /* button resets (CTAs are <button> so they trigger onGetStarted) */
  .itl-landing .nav-cta, .itl-landing .nav-login, .itl-landing .btn { border: 0; cursor: pointer; }
`

export default function Landing({ onGetStarted }) {
  const rootRef = useRef(null)

  const scrollToHow = (e) => {
    e.preventDefault()
    const el = rootRef.current?.querySelector('#how')
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // scroll-triggered reveals (no scroll-jacking)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target
        if (el.id === 'checklist') {
          el.querySelectorAll('.check').forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 140)
          })
        } else {
          el.classList.add('in')
        }
        io.unobserve(el)
      })
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' })

    ;['phone', 'coupon-copy', 'checklist', 'backpage-copy', 'backpage-paper', 'closing-copy']
      .forEach((id) => { const el = root.querySelector('#' + id); if (el) io.observe(el) })

    // rotating "Next to pick" fixture (mirrors the dashboard card)
    const fixtures = [
      { h: 'Everton',   a: 'Crystal Palace', dt: 'Sat 22 Aug \u00b7 15:00', lk: 'locks in 32 days' },
      { h: 'Arsenal',   a: 'Spurs',          dt: 'Sun 23 Aug \u00b7 16:30', lk: 'locks in 33 days' },
      { h: 'Man City',  a: 'Liverpool',      dt: 'Sat 29 Aug \u00b7 12:30', lk: 'locks in 39 days' },
      { h: 'Newcastle', a: 'Chelsea',        dt: 'Sat 22 Aug \u00b7 17:30', lk: 'locks in 32 days' },
      { h: 'Brighton',  a: 'Aston Villa',    dt: 'Sun 23 Aug \u00b7 14:00', lk: 'locks in 33 days' },
    ]
    const q = (id) => root.querySelector('#' + id)
    const npHome = q('npHome'), npAway = q('npAway'), npDt = q('npDt'), npLk = q('npLk'), npFade = q('npFade')
    let timer
    if (npHome) {
      let idx = 0
      const paint = (f) => { npHome.textContent = f.h; npAway.textContent = f.a; npDt.textContent = f.dt; npLk.textContent = f.lk }
      paint(fixtures[0])
      timer = setInterval(() => {
        idx = (idx + 1) % fixtures.length
        if (reduce) { paint(fixtures[idx]); return }
        npFade.classList.add('fade')
        setTimeout(() => { paint(fixtures[idx]); npFade.classList.remove('fade') }, 360)
      }, 3200)
    }

    return () => { io.disconnect(); if (timer) clearInterval(timer) }
  }, [])

  return (
    <div className="itl-landing" ref={rootRef}>
      <style>{CSS}</style>

      <header className="topbar">
        <div className="wordmark">InThe<span>League</span></div>
        <div className="nav-right">
          <button type="button" className="nav-login" onClick={() => onGetStarted('in')}>Log in</button>
          <button type="button" className="nav-cta" onClick={() => onGetStarted('up')}>Start a pool</button>
        </div>
      </header>

      <section className="hero">
        <div className="pitch"></div>
        <div className="floodglow"></div>
        <div className="wrap hero-inner">
          <div className="eyebrow"><span className="dot"></span> Free founding season</div>
          <h1>Run the pool.<br /><span className="keep">Top the table.</span></h1>
          <p className="sub">InTheLeague scores every prediction and ranks your mates in real time. <b>Every result moves the table</b> — and the group chat.</p>
          <div className="cta-row">
            <button type="button" className="btn btn-primary" onClick={() => onGetStarted('up')}>Start a pool</button>
            <a className="btn btn-ghost" href="#how" onClick={scrollToHow}>See how it works</a>
          </div>
          <p className="meta-line">Free to play · Championship kicks off <b>Aug 14</b> · Premier League <b>Aug 21</b></p>

          <div className="phone-stage">
            <div className="phone" id="phone">
              <div className="notch"></div>
              <div className="screen">
                <div className="dash-card">
                  <div className="dash-top">
                    <div className="dash-eyebrow"><span className="d"></span> Premier League</div>
                    <div className="players-pill">
                      <span className="avs"><i style={{ background: '#3B7BE0' }}>LE</i><i style={{ background: '#2CE86A', color: '#062610' }}>RO</i></span>
                      2 players
                    </div>
                  </div>
                  <div className="dash-title">The Lads</div>
                  <div className="dash-sub"><b>Rob</b> · Season 2026/27 · 380 fixtures</div>
                  <div className="dash-hr"></div>

                  <div className="dash-stats">
                    <div className="stat-big"><div className="n">32</div><div className="stat-lbl">Days to kickoff</div></div>
                    <div className="stat-mid">
                      <div className="r"><b>0</b><span>Exact scores</span></div>
                      <div className="r"><b>4</b><span>Picks made</span></div>
                    </div>
                    <div className="stat-rank"><div className="n">2<sup>nd</sup></div><div className="stat-lbl">Your rank</div></div>
                  </div>

                  <div className="prog-top"><span className="l">Season progress</span><span className="r">Matchday 1 of 38</span></div>
                  <div className="prog-bar"><span className="fill"></span><span className="runin"></span></div>
                  <div className="prog-ticks"><span>MD1</span><span>MD10</span><span>MD19</span><span>MD29</span><span>MD38</span></div>
                  <div className="prog-runin">The run-in · 2× points</div>
                </div>

                <div className="nextpick">
                  <div className="np-label">⏱ Next to pick</div>
                  <div className="np-fade" id="npFade">
                    <div className="np-teams">
                      <b id="npHome">Everton</b>
                      <span className="np-mid">
                        <span className="dt" id="npDt">Sat 22 Aug · 15:00</span>
                        <span className="lk" id="npLk">locks in 32 days</span>
                      </span>
                      <b className="away" id="npAway">Crystal Palace</b>
                    </div>
                  </div>
                  <div className="np-btn">Pick this match →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="coupon" id="how">
        <div className="wrap">
          <div className="rise" id="coupon-copy">
            <div className="coupon-eyebrow">While you watch the football</div>
            <h2>We do the admin.<br />You do the bragging.</h2>
            <p className="lede">No spreadsheets, no chasing, no arguments about who won. InTheLeague handles the scoring so the group chat can get on with the important part — the bragging.</p>
            <p className="kicker">Set it up in a minute. <span>Rule it all season.</span></p>
          </div>

          <div className="checklist" id="checklist">
            <div className="check">
              <span className="tick">✓</span>
              <span className="txt"><b>Predict every score</b><span>Call the exact scoreline for every fixture, every matchday. Nail it and you clean up — get close and you still bank points.</span></span>
            </div>
            <div className="check">
              <span className="tick">✓</span>
              <span className="txt"><b>Scoring, done for you</b><span>Results sync automatically the moment full time hits. No spreadsheets, no manual tallying, no arguments about who actually won.</span></span>
            </div>
            <div className="check">
              <span className="tick">✓</span>
              <span className="txt"><b>Live standings</b><span>Your table reshuffles in real time, match by match — so the lead can change hands while the games are still on.</span></span>
            </div>
            <div className="check">
              <span className="tick">✓</span>
              <span className="txt"><b>Chips &amp; streaks</b><span>Save a 2× Multiplier, Banker or Half-Time Hero for the weeks that count, and let form streaks build automatically.</span></span>
            </div>
            <div className="check">
              <span className="tick">✓</span>
              <span className="txt"><b>WhatsApp nudges</b><span>One tap fires a reminder straight into your group chat for the mate who always forgets to get their picks in.</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="backpage-sec">
        <div className="floodglow"></div>
        <div className="wrap">
          <div className="backpage-intro rise" id="backpage-copy">
            <div className="coupon-eyebrow">Every matchday</div>
            <h2>The back page writes itself.</h2>
            <p className="lede">The second full time hits, InTheLeague turns your pool's results into a proper matchday back page — headlines, table, star man and all. One tap drops it into the group chat.</p>
          </div>

          <div className="paper" id="backpage-paper">
            <div className="masthead">
              <div className="mh-name">The <b>Back Page</b></div>
              <div className="mh-date">The Lads · Example<br />Matchday 1 · Sat 22 Aug</div>
            </div>
            <div className="rule-thin"></div>

            <div className="paper-grid">
              <div className="lead">
                <span className="kicker-tag">Opening weekend</span>
                <div className="screamer">Leon strikes<br />first</div>
                <p className="deck">Leon Allard tops The Lads after the opening weekend — but Rob's within a single result and it's all still to play for.</p>
                <div className="byline">The Back Page · Generated by InTheLeague</div>
                <div className="col-body">
                  <p>The opening weekend of The Lads went the way of Leon Allard, who called two scorelines on the nose to edge ahead in what's shaping up to be a proper two-horse race.</p>
                  <p>Rob wasn't far behind, banking a tidy haul to keep the gap down to a single result. On this evidence the title's going to the wire — and there are 37 matchdays still to play.</p>
                  <p className="pullquote">"Two mates, one table, zero mercy."</p>
                </div>
              </div>

              <aside className="sidebar">
                <div className="side-block">
                  <div className="side-h">Table Toppers</div>
                  <div className="mini-row"><span className="mp">1</span><span className="mn">Leon A</span><span className="mpts">24</span></div>
                  <div className="mini-row"><span className="mp">2</span><span className="mn">Rob K</span><span className="mpts">21</span></div>
                </div>
                <div className="side-block">
                  <div className="side-h">Star Man</div>
                  <p className="side-note"><b>Leon Allard</b>Two exact scores and a Banker chip that paid off. Ominous.</p>
                </div>
                <div className="side-block">
                  <div className="side-h">Howler of the Week</div>
                  <p className="side-note"><b>Anonymous</b>Played a 2× multiplier on a 0–0. Brave.</p>
                </div>
              </aside>
            </div>

            <div className="paper-foot">
              <span className="gen">Written the moment full time hits · <b>InTheLeague</b></span>
              <span className="share">Share to the chat →</span>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="floodglow"></div>
        <h3 className="rise" id="closing-copy">Your mates. Your calls. <em>Your bragging rights.</em></h3>
        <button type="button" className="btn btn-primary" onClick={() => onGetStarted('up')}>Start your pool free</button>
        <p className="fine">Founding season is free for everyone · 2026/27</p>
      </section>
    </div>
  )
}
