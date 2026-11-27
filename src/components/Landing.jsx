import { useEffect, useRef, useState } from 'react'

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
    color: var(--chalk); margin: 0 auto 20px; max-width: 16ch;
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

  /* ---------- festive layer ---------- */
  .itl-landing { --berry: #E5484D; --frost: #DCEBFF; }

  /* string of lights under the top bar */
  .itl-landing .lights {
    position: relative; height: 26px; background: var(--ink); overflow: hidden;
    display: flex; justify-content: space-around; align-items: flex-start; padding: 0 10px;
  }
  .itl-landing .lights::before {
    content: ""; position: absolute; left: -2%; right: -2%; top: -9px; height: 16px;
    border-bottom: 1px solid rgba(246,245,239,.16); border-radius: 0 0 50% 50%;
  }
  .itl-landing .lights i {
    position: relative; display: block; width: 7px; height: 10px; margin-top: 6px;
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    background: var(--c); box-shadow: 0 0 10px 1px var(--c);
    animation: itlTwinkle 2.8s ease-in-out infinite; animation-delay: var(--d);
  }
  .itl-landing .lights i:nth-child(odd) { margin-top: 3px; }
  .itl-landing .lights i::before {
    content: ""; position: absolute; left: 2px; top: -3px; width: 3px; height: 3px;
    background: #2a302b; border-radius: 1px;
  }
  @media (max-width: 560px) { .itl-landing .lights i:nth-child(n+13) { display: none; } }
  @keyframes itlTwinkle { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }

  /* snow under the floodlights */
  .itl-landing .snow { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .itl-landing .snow i {
    position: absolute; top: -12px; left: var(--x); width: var(--s); height: var(--s);
    border-radius: 50%; background: var(--frost); opacity: var(--o);
    animation: itlSnow var(--t) linear infinite; animation-delay: var(--d);
  }
  @keyframes itlSnow {
    0%   { transform: translate3d(0, -12px, 0); }
    50%  { transform: translate3d(var(--w), 55vh, 0); }
    100% { transform: translate3d(0, 115vh, 0); }
  }

  /* countdown to Boxing Day */
  .itl-landing .countdown {
    display: inline-flex; align-items: stretch; gap: 8px; margin: 0 auto 26px;
    padding: 10px 12px; border: 1px solid var(--ink-line); border-radius: 16px;
    background: rgba(14,18,15,.6);
  }
  .itl-landing .cd-label {
    display: flex; flex-direction: column; justify-content: center; text-align: left;
    padding: 0 8px 0 4px; font-family: var(--display); font-weight: 700; font-size: 11px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted-on-ink); line-height: 1.5;
  }
  .itl-landing .cd-label b { color: var(--amber); font-weight: 800; }
  .itl-landing .cd-unit {
    min-width: 54px; padding: 8px 6px 6px; border-radius: 10px; background: var(--ink-soft);
    text-align: center;
  }
  .itl-landing .cd-unit .n {
    font-family: var(--mono); font-weight: 700; font-size: 22px; color: var(--chalk);
    font-variant-numeric: tabular-nums; line-height: 1;
  }
  .itl-landing .cd-unit .u {
    font-size: 9px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted-on-ink); margin-top: 5px;
  }
  .itl-landing .cd-live {
    display: inline-block; margin: 0 auto 26px; padding: 9px 16px; border-radius: 999px;
    border: 1px solid var(--ink-line); font-family: var(--display); font-weight: 700;
    font-size: 13px; color: var(--amber);
  }

  /* four rounds, four doors */
  .itl-landing .rounds { background: var(--ink); padding: 64px 0 72px; position: relative; }
  .itl-landing .rounds-head { text-align: center; margin-bottom: 30px; }
  .itl-landing .rounds-head .coupon-eyebrow { color: var(--berry); margin-bottom: 12px; }
  .itl-landing .rounds-foot { position: relative; }
  .itl-landing .rounds-head h2 {
    font-family: var(--display); font-weight: 900; color: var(--chalk);
    font-size: clamp(28px, 7vw, 44px); line-height: 1.02; letter-spacing: -0.02em;
  }
  .itl-landing .rounds-head p { color: var(--muted-on-ink); font-size: 15px; margin-top: 12px; }
  /* the advent calendar */
  .itl-landing .calendar {
    position: relative; max-width: 860px; margin: 0 auto; padding: 34px 16px 20px;
    border-radius: 20px; border: 1px solid rgba(244,179,44,.35);
    background:
      radial-gradient(circle at 12% 18%, rgba(244,179,44,.16) 0 1.5px, transparent 2px),
      radial-gradient(circle at 78% 12%, rgba(246,245,239,.14) 0 1.5px, transparent 2px),
      radial-gradient(circle at 34% 82%, rgba(246,245,239,.12) 0 1.5px, transparent 2px),
      radial-gradient(circle at 90% 70%, rgba(244,179,44,.14) 0 1.5px, transparent 2px),
      linear-gradient(180deg, #123a22 0%, #0c2616 100%);
    background-size: 140px 140px, 180px 180px, 160px 160px, 200px 200px, auto;
    box-shadow: 0 30px 60px -30px rgba(0,0,0,.8);
  }
  .itl-landing .calendar::before { /* snow settled on top */
    content: ""; position: absolute; left: 10px; right: 10px; top: -9px; height: 22px;
    background:
      radial-gradient(circle at 12px 0, #F6F5EF 11px, transparent 12px) 0 9px / 26px 22px repeat-x,
      linear-gradient(#F6F5EF, #F6F5EF) 0 0 / 100% 10px no-repeat;
    border-radius: 12px 12px 0 0;
  }
  .itl-landing .cal-title {
    text-align: center; font-family: var(--mono); font-size: 11px; letter-spacing: .18em;
    text-transform: uppercase; color: var(--amber); margin-bottom: 16px;
  }
  .itl-landing .doors { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  @media (min-width: 760px) { .itl-landing .doors { grid-template-columns: repeat(4, 1fr); gap: 14px; } .itl-landing .calendar { padding: 36px 20px 22px; } }
  .itl-landing .door {
    position: relative; min-height: 196px; perspective: 1200px; border: 0; background: none;
    padding: 0; text-align: left; cursor: pointer; font: inherit; color: inherit; display: block; width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .itl-landing .door:focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; border-radius: 12px; }
  .itl-landing .door .inside {
    position: absolute; inset: 0; border-radius: 12px; padding: 16px 14px 14px 48px;
    background: var(--coupon-card); box-shadow: inset 0 0 0 1px var(--coupon-line), inset 0 6px 18px rgba(0,0,0,.18);
    display: flex; flex-direction: column; justify-content: center;
  }
  .itl-landing .door .when {
    font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: #B4232C;
  }
  .itl-landing .door .name {
    font-family: var(--display); font-weight: 900; font-size: 19px; color: var(--news-ink); margin-top: 4px; line-height: 1.1;
  }
  .itl-landing .door .note { font-size: 12.5px; color: var(--muted-on-coupon); margin-top: 7px; line-height: 1.45; }
  .itl-landing .door .flap {
    position: absolute; inset: 0; border-radius: 12px; transform-origin: left center;
    transition: transform .8s cubic-bezier(.3,.9,.3,1), box-shadow .8s ease;
    background: linear-gradient(160deg, #B4232C 0%, #7E141C 100%);
    box-shadow: 0 8px 18px -8px rgba(0,0,0,.7);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .itl-landing .door:nth-child(even) .flap { background: linear-gradient(160deg, #1E7D37 0%, #12501F 100%); }
  .itl-landing .door .flap::before { /* stitched edge */
    content: ""; position: absolute; inset: 7px; border-radius: 8px; border: 1.5px dashed rgba(244,179,44,.65);
  }
  .itl-landing .door .flap::after { /* knob */
    content: ""; position: absolute; right: 16px; top: 50%; width: 9px; height: 9px; margin-top: -4px;
    border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A3, var(--amber) 60%, #9A6B0E);
  }
  .itl-landing .door .star { color: var(--amber); font-size: 13px; letter-spacing: .5em; margin-right: -.5em; }
  .itl-landing .door .num {
    font-family: var(--screamer); font-size: 76px; line-height: .95; color: #FFE7A3;
    text-shadow: 0 3px 0 rgba(0,0,0,.25);
  }
  .itl-landing .door .hint {
    font-family: var(--mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(255,231,163,.75); margin-top: 6px;
  }
  .itl-landing .door.open .flap { transform: rotateY(-80deg); box-shadow: 12px 0 22px -6px rgba(0,0,0,.5); }
  .itl-landing .door.open .hint { opacity: 0; }
  @media (prefers-reduced-motion: reduce) { .itl-landing .door .flap { transition: none; } }
  .itl-landing .rounds-foot {
    text-align: center; margin-top: 26px; font-family: var(--display); font-weight: 700;
    font-size: 14px; color: var(--chalk);
  }
  .itl-landing .rounds-foot span { color: var(--amber); }

  @media (prefers-reduced-motion: reduce) {
    .itl-landing .lights i, .itl-landing .snow i { animation: none; }
    .itl-landing .snow i { top: var(--y); }
  }

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

// Boxing Day, first kick-off of the Festive League (12:30 GMT)
const KICKOFF = Date.UTC(2026, 11, 26, 12, 30)
const LIGHTS = ['#2CE86A', '#F4B32C', '#E5484D', '#F6F5EF']
// Deterministic "random" so flakes don't jump between renders
const FLAKES = Array.from({ length: 26 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1
  return {
    '--x': (r(1) * 100).toFixed(1) + '%', '--y': (r(6) * 90).toFixed(0) + '%',
    '--s': (2 + r(2) * 3).toFixed(1) + 'px', '--o': (0.25 + r(3) * 0.5).toFixed(2),
    '--t': (9 + r(4) * 10).toFixed(1) + 's', '--d': (-r(5) * 18).toFixed(1) + 's',
    '--w': (r(7) * 40 - 20).toFixed(0) + 'px',
  }
})
const DOORS = [
  { when: '26–27 Dec', name: 'Boxing Day', note: 'Seven games on the day itself. Picks in before the leftovers.' },
  { when: '29–30 Dec', name: 'Twixmas', note: 'Nobody knows what day it is. The table does.' },
  { when: '1–3 Jan', name: 'New Year', note: 'New year, same mate who forgets his picks.' },
  { when: '5–7 Jan', name: 'The Decider', note: 'Last round. Winner takes the bragging rights.' },
]
function timeLeft(now) {
  const ms = KICKOFF - now
  if (ms <= 0) return null
  return { d: Math.floor(ms / 864e5), h: Math.floor((ms % 864e5) / 36e5), m: Math.floor((ms % 36e5) / 6e4) }
}

export default function Landing({ onGetStarted }) {
  const [left, setLeft] = useState(() => timeLeft(Date.now()))
  useEffect(() => {
    const iv = setInterval(() => setLeft(timeLeft(Date.now())), 30000)
    return () => clearInterval(iv)
  }, [])
  // Advent doors start closed; each opens (and closes) on tap
  const [open, setOpen] = useState([false, false, false, false])
  const daysOut = left ? left.d + (left.h || left.m ? 1 : 0) : 0
  const lockText = left ? `locks in ${daysOut} day${daysOut === 1 ? '' : 's'}` : 'under way'
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
    const lk = root.dataset.lock || ''
    const fixtures = [
      { h: 'Aston Villa', a: 'Leeds',       dt: 'Sat 26 Dec \u00b7 12:30', lk },
      { h: 'Everton',     a: 'Sunderland',  dt: 'Sat 26 Dec \u00b7 15:00', lk },
      { h: 'Spurs',       a: 'Bournemouth', dt: 'Sat 26 Dec \u00b7 15:00', lk },
      { h: 'Fulham',      a: 'Brighton',    dt: 'Sat 26 Dec \u00b7 15:00', lk },
      { h: 'Hull',        a: 'Liverpool',   dt: 'Sat 26 Dec \u00b7 17:30', lk },
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
    <div className="itl-landing" ref={rootRef} data-lock={lockText}>
      <style>{CSS}</style>

      <header className="topbar">
        <div className="wordmark">InThe<span>League</span></div>
        <div className="nav-right">
          <button type="button" className="nav-login" onClick={() => onGetStarted('in')}>Log in</button>
          <button type="button" className="nav-cta" onClick={() => onGetStarted('up')}>Start a pool</button>
        </div>
      </header>
      <div className="lights" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} style={{ '--c': LIGHTS[i % LIGHTS.length], '--d': (i % 5) * -0.55 + 's' }} />
        ))}
      </div>

      <section className="hero">
        <div className="pitch"></div>
        <div className="floodglow"></div>
        <div className="snow" aria-hidden="true">{FLAKES.map((f, i) => <i key={i} style={f} />)}</div>
        <div className="wrap hero-inner">
          <div className="eyebrow"><span className="dot"></span> The Festive League · 26 Dec – 7 Jan</div>
          <h1>Top of the tree<br /><span className="keep">at Christmas.</span></h1>
          <p className="sub">Four matchdays, thirteen days, one table of mates. Predict every score from Boxing Day to the new year. <b>Everyone starts on zero</b>, and one of you gets to be unbearable until next December.</p>
          {left ? (
            <div className="countdown" role="timer" aria-label={`Kick-off in ${left.d} days, ${left.h} hours`}>
              <div className="cd-label">Kick-off<b>Boxing Day</b></div>
              <div className="cd-unit"><div className="n">{String(left.d).padStart(2, '0')}</div><div className="u">Days</div></div>
              <div className="cd-unit"><div className="n">{String(left.h).padStart(2, '0')}</div><div className="u">Hrs</div></div>
              <div className="cd-unit"><div className="n">{String(left.m).padStart(2, '0')}</div><div className="u">Min</div></div>
            </div>
          ) : (
            <div className="cd-live">The Festive League is under way</div>
          )}
          <div className="cta-row">
            <button type="button" className="btn btn-primary" onClick={() => onGetStarted('up')}>Start your Festive League</button>
            <a className="btn btn-ghost" href="#how" onClick={scrollToHow}>See how it works</a>
          </div>
          <p className="meta-line">Free to play · Set up in a minute · Invite the group chat with one link</p>

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
                  <div className="dash-sub"><b>Rob</b> · Festive League · 40 fixtures</div>
                  <div className="dash-hr"></div>

                  <div className="dash-stats">
                    <div className="stat-big"><div className="n">{left ? daysOut : 0}</div><div className="stat-lbl">Days to kickoff</div></div>
                    <div className="stat-mid">
                      <div className="r"><b>0</b><span>Exact scores</span></div>
                      <div className="r"><b>4</b><span>Picks made</span></div>
                    </div>
                    <div className="stat-rank"><div className="n">2<sup>nd</sup></div><div className="stat-lbl">Your rank</div></div>
                  </div>
                </div>

                <div className="nextpick">
                  <div className="np-label">⏱ Next to pick</div>
                  <div className="np-fade" id="npFade">
                    <div className="np-teams">
                      <b id="npHome">Aston Villa</b>
                      <span className="np-mid">
                        <span className="dt" id="npDt">Sat 26 Dec · 12:30</span>
                        <span className="lk" id="npLk">{lockText}</span>
                      </span>
                      <b className="away" id="npAway">Leeds</b>
                    </div>
                  </div>
                  <div className="np-btn">Pick this match →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounds">
        <div className="wrap">
          <div className="rounds-head">
            <div className="coupon-eyebrow">Open the doors</div>
            <h2>Four rounds. One winner.</h2>
            <p>Every round is a full set of Premier League fixtures. Miss one and the table will remind you.</p>
          </div>
          <div className="calendar" id="calendar">
            <div className="cal-title">★ The football advent calendar ★</div>
            <div className="doors">
              {DOORS.map((d, i) => (
                <button type="button" key={d.name} className={'door' + (open[i] ? ' open' : '')}
                  aria-expanded={open[i]} aria-label={`Round ${i + 1}: ${d.name}, ${d.when}`}
                  onClick={() => setOpen(o => o.map((v, k) => (k === i ? !v : v)))}>
                  <span className="inside">
                    <span className="when">{d.when}</span>
                    <span className="name">{d.name}</span>
                    <span className="note">{d.note}</span>
                  </span>
                  <span className="flap" aria-hidden="true">
                    <span className="star">★★★</span>
                    <span className="num">{i + 1}</span>
                    <span className="hint">Tap to open</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounds-foot">Champion crowned <span>7 January</span></div>
        </div>
      </section>

      <section className="coupon" id="how">
        <div className="wrap">
          <div className="rise" id="coupon-copy">
            <div className="coupon-eyebrow">Between the leftovers and the football</div>
            <h2>We do the admin.<br />You do the bragging.</h2>
            <p className="lede">No spreadsheets, no chasing, no arguments about who won. InTheLeague handles the scoring so the group chat can get on with the important part — the bragging.</p>
            <p className="kicker">Set it up in a minute. <span>Rule it all Christmas.</span></p>
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
              <span className="txt"><b>Chips &amp; streaks</b><span>Save a 2× Multiplier, Banker or Half-Time Hero for the round that counts, and let form streaks build automatically.</span></span>
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
            <div className="coupon-eyebrow">After every round</div>
            <h2>The back page writes itself.</h2>
            <p className="lede">The second full time hits, InTheLeague turns your pool's results into a proper matchday back page — headlines, table, star man and all. One tap drops it into the group chat.</p>
          </div>

          <div className="paper" id="backpage-paper">
            <div className="masthead">
              <div className="mh-name">The <b>Back Page</b></div>
              <div className="mh-date">The Lads · Example<br />Round 1 · Boxing Day</div>
            </div>
            <div className="rule-thin"></div>

            <div className="paper-grid">
              <div className="lead">
                <span className="kicker-tag">Boxing Day</span>
                <div className="screamer">Leon strikes<br />first</div>
                <p className="deck">Leon tops The Lads after Boxing Day — but Rob's within a single result and it's all still to play for.</p>
                <div className="byline">The Back Page · Generated by InTheLeague</div>
                <div className="col-body">
                  <p>Boxing Day in The Lads went the way of Leon, who called two scorelines on the nose to edge ahead in what's shaping up to be a proper two-horse race.</p>
                  <p>Rob wasn't far behind, banking a tidy haul to keep the gap down to a single result. On this evidence the title's going to the wire — and there are three rounds still to play.</p>
                  <p className="pullquote">"Two mates, one table, zero mercy."</p>
                </div>
              </div>

              <aside className="sidebar">
                <div className="side-block">
                  <div className="side-h">Table Toppers</div>
                  <div className="mini-row"><span className="mp">1</span><span className="mn">Leon</span><span className="mpts">24</span></div>
                  <div className="mini-row"><span className="mp">2</span><span className="mn">Rob</span><span className="mpts">21</span></div>
                </div>
                <div className="side-block">
                  <div className="side-h">Star Man</div>
                  <p className="side-note"><b>Leon</b>Two exact scores and a Banker chip that paid off. Ominous.</p>
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
        <h3 className="rise" id="closing-copy">Your mates. Your calls. <em>Your Christmas bragging rights.</em></h3>
        <button type="button" className="btn btn-primary" onClick={() => onGetStarted('up')}>Start your Festive League</button>
        <p className="fine">The Festive League is free for everyone · 26 Dec – 7 Jan</p>
      </section>
    </div>
  )
}
