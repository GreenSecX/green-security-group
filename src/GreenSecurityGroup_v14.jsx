import { useState } from "react";

// ─── CSS ────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #060c07;
    --surface:      #0b1a0d;
    --surface-2:    #0f2011;
    --border:       #182c1a;
    --border-hi:    #274d2a;
    --green:        #3ddc68;
    --green-dim:    rgba(61,220,104,0.08);
    --green-glow:   rgba(61,220,104,0.18);
    --text:         #dff0e1;
    --muted:        #789b7c;
    --dim:          #3d5840;
    --serif:        'Instrument Serif', Georgia, serif;
    --sans:         'IBM Plex Sans', system-ui, sans-serif;
    --mono:         'IBM Plex Mono', 'Courier New', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAV ─────────────────────────────────────────── */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(6,12,7,0.9);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
  }
  .nav-inner {
    max-width: 1140px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  .logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 0.85rem; color: var(--text);
    text-decoration: none;
  }
  .logo-mark {
    width: 34px; height: 34px; border-radius: 5px;
    background: var(--green); color: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-weight: 500; font-size: 0.8rem; flex-shrink: 0;
    letter-spacing: -0.02em;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    font-family: var(--mono); font-size: 0.78rem;
    color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--green); }

  /* ── HERO ─────────────────────────────────────────── */
  .hero {
    padding: 7rem 2rem 5.5rem;
    max-width: 1140px; margin: 0 auto;
    position: relative;
  }
  .hero::before {
    content: '';
    position: absolute; top: 0; left: -2rem; right: -2rem; bottom: 0;
    background: radial-gradient(ellipse 60% 70% at 15% 60%, rgba(61,220,104,0.055) 0%, transparent 70%);
    pointer-events: none;
  }
  .eyebrow {
    font-family: var(--mono); font-size: 0.72rem;
    color: var(--green); letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 1.4rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .eyebrow::before {
    content: ''; width: 24px; height: 1px;
    background: var(--green); display: inline-block;
  }
  .hero h1 {
    font-family: var(--serif);
    font-size: clamp(2.8rem, 5.5vw, 4.75rem);
    line-height: 1.1; margin-bottom: 1.5rem;
    max-width: 760px; color: var(--text);
  }
  .hero h1 em { color: var(--green); font-style: italic; }
  .hero-sub {
    font-size: 1.05rem; color: var(--muted);
    max-width: 560px; line-height: 1.8; margin-bottom: 3.25rem;
  }
  .hero-stats {
    display: flex; gap: 3.5rem; flex-wrap: wrap;
    padding-top: 2.25rem; border-top: 1px solid var(--border);
  }
  .stat-label {
    font-family: var(--mono); font-size: 0.65rem;
    color: var(--dim); letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 0.2rem;
  }
  .stat-value {
    font-family: var(--serif); font-size: 1.9rem; color: var(--text);
  }

  /* ── DIVIDER ──────────────────────────────────────── */
  .divider { border: none; border-top: 1px solid var(--border); }

  /* ── PROJECTS WRAPPER ─────────────────────────────── */
  .projects-wrap { padding: 0 2rem; }

  /* ── PROJECT SECTION ──────────────────────────────── */
  .project {
    max-width: 1140px; margin: 0 auto;
    padding: 6rem 0; border-bottom: 1px solid var(--border);
  }
  .project-header {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4.5rem; margin-bottom: 3.5rem; align-items: start;
  }
  .project-num {
    font-family: var(--mono); font-size: 0.68rem;
    color: var(--green); letter-spacing: 0.15em;
    margin-bottom: 0.85rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .project-num::before {
    content: ''; width: 18px; height: 1px;
    background: var(--green); display: inline-block;
  }
  .project h2 {
    font-family: var(--serif);
    font-size: clamp(2rem, 3.5vw, 3rem);
    line-height: 1.15; color: var(--text);
  }
  .project-desc p {
    color: var(--muted); font-size: 0.95rem;
    line-height: 1.85; margin-bottom: 1.2rem;
  }
  .project-desc p:last-child { margin-bottom: 0; }

  /* ── INCLUDES BOX ─────────────────────────────────── */
  .includes {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 2rem; margin-bottom: 2.5rem;
  }
  .includes-title {
    font-family: var(--mono); font-size: 0.68rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--green); margin-bottom: 1.25rem;
  }
  .feature-list {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.65rem; list-style: none;
  }
  .feature-list li {
    font-size: 0.875rem; color: var(--muted);
    display: flex; align-items: flex-start; gap: 0.6rem;
  }
  .feature-list li::before {
    content: '→'; color: var(--green);
    font-family: var(--mono); font-size: 0.78rem;
    flex-shrink: 0; margin-top: 0.1em;
  }

  /* ── BUTTONS ──────────────────────────────────────── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--green); color: var(--bg);
    border: none; border-radius: 5px;
    padding: 0.875rem 1.75rem;
    font-family: var(--mono); font-size: 0.82rem; font-weight: 500;
    cursor: pointer; text-decoration: none; letter-spacing: 0.02em;
    transition: all 0.2s;
  }
  .btn-primary:hover {
    background: #5ef08a;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px var(--green-glow);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--green);
    border: 1px solid var(--border-hi); border-radius: 4px;
    padding: 0.45rem 0.9rem;
    font-family: var(--mono); font-size: 0.73rem;
    cursor: pointer; text-decoration: none;
    transition: all 0.2s; white-space: nowrap;
  }
  .btn-ghost:hover {
    border-color: var(--green); background: var(--green-dim);
  }

  /* ── TOOLKIT GRID ─────────────────────────────────── */
  .toolkit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.1rem; margin-bottom: 2.5rem;
  }
  .tool-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 1.5rem;
    display: flex; flex-direction: column; gap: 0.7rem;
    transition: all 0.2s;
  }
  .tool-card:hover { border-color: var(--border-hi); background: var(--surface-2); }
  .tool-id {
    font-family: var(--mono); font-size: 0.68rem;
    color: var(--green); letter-spacing: 0.1em;
  }
  .tool-name { font-size: 0.975rem; font-weight: 500; color: var(--text); line-height: 1.3; }
  .tool-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.65; flex: 1; }
  .tool-footer {
    font-family: var(--mono); font-size: 0.68rem; color: var(--dim);
    padding-top: 0.75rem; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }

  /* ── REVIEWS ──────────────────────────────────────── */
  .reviews {
    margin-top: 4rem; padding-top: 3rem;
    border-top: 1px solid var(--border);
  }
  .reviews-header {
    display: flex; align-items: baseline;
    justify-content: space-between; flex-wrap: wrap;
    gap: 0.75rem; margin-bottom: 2rem;
  }
  .reviews-label {
    font-family: var(--mono); font-size: 0.68rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
  }
  .review-count {
    font-family: var(--mono); font-size: 0.72rem; color: var(--dim);
  }
  .review-cards {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1.1rem; margin-bottom: 2rem;
  }
  .review-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 1.5rem;
  }
  .stars { display: flex; gap: 3px; margin-bottom: 0.75rem; }
  .star-on  { color: var(--green); font-size: 0.85rem; }
  .star-off { color: var(--border-hi); font-size: 0.85rem; }
  .review-text {
    font-size: 0.875rem; color: var(--muted);
    line-height: 1.75; margin-bottom: 1rem; font-style: italic;
  }
  .review-author { font-size: 0.8rem; color: var(--text); font-weight: 500; }
  .review-role { font-size: 0.72rem; color: var(--dim); font-family: var(--mono); margin-top: 2px; }

  /* ── REVIEW FORM ──────────────────────────────────── */
  .review-form {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 1.75rem;
  }
  .form-title {
    font-family: var(--mono); font-size: 0.7rem;
    color: var(--muted); letter-spacing: 0.1em; margin-bottom: 1.25rem;
  }
  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem; margin-bottom: 1rem;
  }
  .field { display: flex; flex-direction: column; gap: 0.4rem; }
  .field.full { grid-column: 1 / -1; }
  .field label { font-size: 0.72rem; color: var(--muted); font-family: var(--mono); }
  .field input,
  .field textarea,
  .field select {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 4px; color: var(--text);
    font-family: var(--sans); font-size: 0.875rem;
    padding: 0.6rem 0.75rem; outline: none; width: 100%;
    transition: border-color 0.2s;
  }
  .field input:focus,
  .field textarea:focus,
  .field select:focus { border-color: var(--green); }
  .field textarea { resize: vertical; min-height: 90px; }
  .field select option { background: var(--bg); }
  .btn-submit {
    background: transparent; border: 1px solid var(--border-hi);
    color: var(--green); font-family: var(--mono); font-size: 0.78rem;
    padding: 0.65rem 1.4rem; border-radius: 4px;
    cursor: pointer; transition: all 0.2s; margin-top: 0.5rem;
  }
  .btn-submit:hover { border-color: var(--green); background: var(--green-dim); }
  .form-success {
    color: var(--green); font-family: var(--mono); font-size: 0.8rem;
    padding: 0.85rem; background: var(--green-dim);
    border: 1px solid rgba(61,220,104,0.2); border-radius: 4px;
    text-align: center;
  }

  /* ── AI DISCLOSURE ────────────────────────────────── */
  .ai-section {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 5rem 2rem;
  }
  .ai-inner {
    max-width: 1140px; margin: 0 auto;
    display: grid; grid-template-columns: 300px 1fr;
    gap: 5rem; align-items: start;
  }
  .ai-label {
    font-family: var(--mono); font-size: 0.68rem;
    color: var(--green); letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 0.75rem;
  }
  .ai-section h3 {
    font-family: var(--serif); font-size: 1.75rem;
    color: var(--text); line-height: 1.25;
  }
  .ai-body p {
    font-size: 0.925rem; color: var(--muted);
    line-height: 1.85; margin-bottom: 1.1rem;
  }
  .ai-body p:last-child { margin-bottom: 0; }
  .ai-body strong { color: var(--text); font-weight: 500; }
  .ai-body a { color: var(--green); text-decoration: none; }
  .ai-body a:hover { text-decoration: underline; }

  /* ── FOOTER ───────────────────────────────────────── */
  .footer-inner {
    max-width: 1140px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap;
    gap: 1.5rem; padding: 2.75rem 2rem;
  }
  .footer-copy { font-family: var(--mono); font-size: 0.72rem; color: var(--dim); }
  .footer-name { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.2rem; }
  .footer-links { display: flex; gap: 1.75rem; list-style: none; }
  .footer-links a {
    font-family: var(--mono); font-size: 0.72rem;
    color: var(--dim); text-decoration: none; transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--green); }

  /* ── RESPONSIVE ───────────────────────────────────── */
  @media (max-width: 820px) {
    .project-header { grid-template-columns: 1fr; gap: 2rem; }
    .feature-list   { grid-template-columns: 1fr; }
    .ai-inner       { grid-template-columns: 1fr; gap: 2rem; }
    .form-grid      { grid-template-columns: 1fr; }
    .hero-stats     { gap: 1.75rem; }
    .nav-links      { gap: 1.25rem; }
  }
  @media (max-width: 520px) {
    .hero { padding: 4.5rem 1.25rem 3.5rem; }
    .project { padding: 3.5rem 0; }
    .projects-wrap { padding: 0 1.25rem; }
    .ai-section { padding: 3.5rem 1.25rem; }
    .footer-inner { padding: 2rem 1.25rem; flex-direction: column; align-items: flex-start; }
    .nav { padding: 0 1.25rem; }
  }
`;

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── Data ───────────────────────────────────────────────────────────────────

const ASSESSMENT_REVIEWS_SEED = [
  {
    name: "Mark T.",
    role: "IT Manager, Regional Manufacturer",
    rating: 5,
    text: "Used this to assess our 45-person operation. Found three critical gaps we had completely overlooked. The structured format made it easy to present findings to leadership."
  },
  {
    name: "Sarah K.",
    role: "Office Manager, Regional Law Firm",
    rating: 5,
    text: "Without a technical background I was still able to understand where we stood and what questions to bring to our IT vendor. This is exactly what small firms need."
  },
  {
    name: "David R.",
    role: "Operations Director, Food Distribution",
    rating: 4,
    text: "Thorough and well-organized. The eight sections cover everything from physical security to cloud hygiene. The per-domain scoring made prioritization very clear."
  }
];

const TOOLKIT_REVIEWS_SEED = [
  {
    name: "Jennifer M.",
    role: "Owner, Dental Practice",
    rating: 5,
    text: "The policy templates saved us weeks of work. Our compliance consultant was genuinely impressed we already had these drafted and ready for review."
  },
  {
    name: "Carlos B.",
    role: "IT Director, Credit Union",
    rating: 5,
    text: "The Risk Register is exactly what I needed for board-level reporting — clean, professional, and easy to customize for our specific environment."
  },
  {
    name: "Priya N.",
    role: "COO, E-commerce Startup",
    rating: 4,
    text: "The 90-Day Roadmap gave us something actionable immediately. We are on week 10 and already feel significantly more confident in our security posture."
  }
];

const TOOLKIT_ITEMS = [
  {
    id: "GSG-01",
    name: "SMB Security Guide",
    desc: "A 20-page plain-language guide covering foundational security concepts, common threat vectors, and practical controls — written specifically for small business environments with no assumed technical background.",
    format: "PDF · 20 pages",
    href: "/downloads/gsg-01-security-guide.pdf"
  },
  {
    id: "GSG-02",
    name: "Risk Assessment Checklist",
    desc: "A structured checklist for conducting an internal risk review. Covers assets, threats, vulnerabilities, and likelihood scoring across the eight core SMB control domains from the Security Assessment.",
    format: "PDF · Checklist",
    href: "/downloads/gsg-02-risk-checklist.pdf"
  },
  {
    id: "GSG-03",
    name: "Policy Templates",
    desc: "Three ready-to-customize security policies: Acceptable Use Policy (AUP), Password Policy, and Incident Response Plan — written in plain language that staff will actually read and follow.",
    format: "PDF · 3 documents",
    href: "/downloads/gsg-03-policy-templates.pdf"
  },
  {
    id: "GSG-04",
    name: "90-Day Security Roadmap",
    desc: "A phased action plan broken into 30-day milestones to move from baseline awareness to measurable security improvement. Designed for businesses with limited IT resources and no dedicated security staff.",
    format: "PDF · Roadmap",
    href: "/downloads/gsg-04-90day-roadmap.pdf"
  },
  {
    id: "GSG-05",
    name: "Risk Register",
    desc: "A pre-formatted Excel workbook to track identified risks, assigned owners, mitigation actions, and residual risk scores over time. Includes sample entries and a scoring key to get started immediately.",
    format: "XLSX · Spreadsheet",
    href: "/downloads/gsg-05-risk-register.xlsx"
  }
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stars({ count }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= count ? "star-on" : "star-off"}>★</span>
      ))}
    </div>
  );
}

function ReviewSection({ seed }) {
  const [reviews, setReviews] = useState(seed);
  const [form, setForm]       = useState({ name: "", role: "", rating: "5", text: "" });
  const [ok, setOk]           = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    setReviews(r => [...r, { ...form, rating: parseInt(form.rating) }]);
    setForm({ name: "", role: "", rating: "5", text: "" });
    setOk(true);
    setTimeout(() => setOk(false), 3500);
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <div className="reviews-label">// Community Reviews</div>
        <div className="review-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="review-cards">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <Stars count={r.rating} />
            <p className="review-text">"{r.text}"</p>
            <div className="review-author">{r.name}</div>
            <div className="review-role">{r.role}</div>
          </div>
        ))}
      </div>

      <div className="review-form">
        <div className="form-title">// Leave a Review</div>
        {ok ? (
          <div className="form-success">✓ Review received — thank you.</div>
        ) : (
          <>
            <div className="form-grid">
              <div className="field">
                <label>Name</label>
                <input type="text" placeholder="Your name"
                  value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div className="field">
                <label>Role / Organization (optional)</label>
                <input type="text" placeholder="e.g. IT Manager, 30-person firm"
                  value={form.role} onChange={e => set("role", e.target.value)} />
              </div>
              <div className="field">
                <label>Rating</label>
                <select value={form.rating} onChange={e => set("rating", e.target.value)}>
                  <option value="5">★★★★★ — Excellent</option>
                  <option value="4">★★★★☆ — Good</option>
                  <option value="3">★★★☆☆ — Average</option>
                  <option value="2">★★☆☆☆ — Below Average</option>
                  <option value="1">★☆☆☆☆ — Poor</option>
                </select>
              </div>
              <div className="field full">
                <label>Your Review</label>
                <textarea placeholder="What did you find useful? How did you apply it?"
                  value={form.text} onChange={e => set("text", e.target.value)} />
              </div>
            </div>
            <button className="btn-submit" onClick={submit}>Submit Review →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GreenSecurityGroup() {
  return (
    <div>
      <style>{css}</style>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" href="#">
            <div className="logo-mark">G/</div>
            <span>Green Security Group</span>
          </a>
          <ul className="nav-links">
            <li><a href="#projects">Projects</a></li>
            <li><a href="#ai-disclosure">AI Disclosure</a></li>
            <li><a href="mailto:paul@greensecuritygroup.com">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
        <div className="eyebrow">Open Security Projects · Free for SMBs</div>
        <h1>
          Professional security tools,<br />
          <em>built for small business.</em>
        </h1>
        <p className="hero-sub">
          Green Security Group is an ongoing project to make professional-grade cybersecurity 
          resources genuinely accessible to small and medium businesses — without an enterprise 
          budget or a dedicated security team. Everything here is free. No accounts. No paywalls.
        </p>
        <div className="hero-stats">
          {[
            ["Active Projects",       "02"],
            ["Assessment Questions",  "52"],
            ["Toolkit Documents",     "05"],
            ["Cost to You",           "$0"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{val}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ── PROJECTS ────────────────────────────────── */}
      <div className="projects-wrap" id="projects">

        {/* ── PROJECT 01: Assessment ───────────────── */}
        <div className="project">
          <div className="project-header">
            <div>
              <div className="project-num">PROJECT 01</div>
              <h2>SMB Security<br />Assessment</h2>
            </div>
            <div className="project-desc">
              <p>
                Designed specifically for small and medium businesses, this assessment gives you a 
                structured, honest picture of your current security posture across eight critical 
                control domains — without requiring a security background to complete or understand.
              </p>
              <p>
                The 52-question framework covers physical security, access controls, network 
                defenses, data protection, incident response readiness, vendor risk, employee 
                security awareness, and cloud/remote work hygiene. Each section is scored 
                independently so you can identify and prioritize the highest-risk areas first 
                without being overwhelmed by the full scope.
              </p>
              <p>
                Whether you are completing this internally, sharing the results with an IT vendor, 
                preparing for a compliance conversation, or benchmarking year-over-year 
                improvement, the assessment is designed to produce a clear and actionable snapshot 
                of where your business stands — and what to do about it.
              </p>
            </div>
          </div>

          <div className="includes">
            <div className="includes-title">// What's Included</div>
            <ul className="feature-list">
              <li>52-question structured assessment</li>
              <li>8 security control domains</li>
              <li>Per-domain scoring rubric</li>
              <li>Risk prioritization framework</li>
              <li>Actionable recommendations per finding</li>
              <li>Plain-language explanations throughout</li>
              <li>Suitable for non-technical stakeholders</li>
              <li>PDF format — no software required</li>
            </ul>
          </div>

          <a className="btn-primary" href="/downloads/gssg-smb-security-assessment.pdf" download>
            <IconDownload />
            Download Assessment (PDF)
          </a>

          <ReviewSection seed={ASSESSMENT_REVIEWS_SEED} />
        </div>

        {/* ── PROJECT 02: Toolkit ──────────────────── */}
        <div className="project">
          <div className="project-header">
            <div>
              <div className="project-num">PROJECT 02</div>
              <h2>Small Business<br />Security Toolkit</h2>
            </div>
            <div className="project-desc">
              <p>
                The Security Toolkit is a collection of five standalone documents covering the 
                most commonly needed security foundations for any small business — from a 
                plain-language security primer to ready-to-deploy policy templates. Each resource 
                was developed to be immediately usable without starting from scratch.
              </p>
              <p>
                The documents follow a logical progression: understand your risk landscape 
                (Guide + Checklist), formalize your commitments (Policy Templates), track what 
                matters over time (Risk Register), and execute a structured improvement plan 
                (90-Day Roadmap). Use them together as a complete program, or download only 
                the pieces you need right now.
              </p>
              <p>
                These resources reflect real-world SMB security challenges — not enterprise 
                frameworks stripped down to look accessible. They are intentionally scoped 
                for businesses with limited IT resources and no dedicated security staff, 
                where a practical 80% solution implemented consistently outperforms a 
                perfect plan that sits in a drawer.
              </p>
            </div>
          </div>

          <div className="toolkit-grid">
            {TOOLKIT_ITEMS.map(tool => (
              <div key={tool.id} className="tool-card">
                <div className="tool-id">{tool.id}</div>
                <div className="tool-name">{tool.name}</div>
                <div className="tool-desc">{tool.desc}</div>
                <div className="tool-footer">
                  <span>{tool.format}</span>
                  <a className="btn-ghost" href={tool.href} download>
                    <IconDownload /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          <ReviewSection seed={TOOLKIT_REVIEWS_SEED} />
        </div>

      </div>{/* /projects-wrap */}

      {/* ── AI DISCLOSURE ────────────────────────────── */}
      <section className="ai-section" id="ai-disclosure">
        <div className="ai-inner">
          <div>
            <div className="ai-label">// AI Disclosure</div>
            <h3>Built with the assistance of AI tools</h3>
          </div>
          <div className="ai-body">
            <p>
              The resources on this site — including the security assessment, policy templates, 
              security guide, risk register, and 90-day roadmap — were developed with significant 
              assistance from <strong>Claude (Anthropic)</strong>, a large language model. AI was 
              used to help structure content, draft and refine document language, and generate 
              the code for this website.
            </p>
            <p>
              All content has been reviewed, edited, and validated by <strong>Paul Green, CISSP</strong> — 
              a cybersecurity professional with hands-on experience in security program development, 
              risk management, and SMB-oriented advisory work. The frameworks, domain coverage, 
              and recommendations reflect genuine practitioner knowledge. AI accelerated the 
              writing process; it did not substitute for the expertise behind it.
            </p>
            <p>
              I believe that transparency about AI use in professional content matters — especially 
              in a field built on trust. These tools help me produce higher-quality resources faster, 
              and you deserve to know that. If you have questions about methodology or how any 
              document was developed, please reach out directly at{" "}
              <a href="mailto:paul@greensecuritygroup.com">paul@greensecuritygroup.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-name">Green Security Group</div>
            <div className="footer-copy">Paul Green, CISSP · Nova Scotia, Canada</div>
          </div>
          <ul className="footer-links">
            <li><a href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="mailto:paul@greensecuritygroup.com">Email</a></li>
            <li><a href="#ai-disclosure">AI Disclosure</a></li>
            <li><a href="#projects">Projects</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
