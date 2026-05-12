import { useState, useEffect } from "react";

// ── QUESTIONS ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1,  section: "Network Security",   q: "Do you have a firewall protecting your network perimeter?" },
  { id: 2,  section: "Network Security",   q: "Is your Wi-Fi protected with WPA2 or WPA3 encryption?" },
  { id: 3,  section: "Network Security",   q: "Do you have a separate guest Wi-Fi network for visitors?" },
  { id: 4,  section: "Network Security",   q: "Are remote connections secured with a VPN?" },
  { id: 5,  section: "Network Security",   q: "Do you monitor network traffic for unusual activity?" },
  { id: 6,  section: "Network Security",   q: "Is your router firmware kept up to date?" },
  { id: 7,  section: "Network Security",   q: "Are unused network ports disabled?" },
  { id: 8,  section: "Network Security",   q: "Do you have network segmentation separating critical systems?" },
  { id: 9,  section: "Access Control",     q: "Does every user have a unique username and password?" },
  { id: 10, section: "Access Control",     q: "Is MFA enabled on all email accounts?" },
  { id: 11, section: "Access Control",     q: "Is MFA enabled on all cloud services?" },
  { id: 12, section: "Access Control",     q: "Do you have a formal process to remove access when staff leave?" },
  { id: 13, section: "Access Control",     q: "Are admin accounts used only when necessary?" },
  { id: 14, section: "Access Control",     q: "Do you enforce passwords of 12+ characters minimum?" },
  { id: 15, section: "Access Control",     q: "Is a password manager used across the organization?" },
  { id: 16, section: "Access Control",     q: "Do you review user access levels at least quarterly?" },
  { id: 17, section: "Data Backup",        q: "Are critical business files backed up at least daily?" },
  { id: 18, section: "Data Backup",        q: "Are backups stored offsite or in the cloud?" },
  { id: 19, section: "Data Backup",        q: "Have you tested backup restoration in the last 6 months?" },
  { id: 20, section: "Data Backup",        q: "Are backups encrypted to protect sensitive data?" },
  { id: 21, section: "Data Backup",        q: "Are backups protected from ransomware?" },
  { id: 22, section: "Data Backup",        q: "Do you have a documented recovery time objective?" },
  { id: 23, section: "Email and Phishing", q: "Do you use email filtering to block spam and phishing?" },
  { id: 24, section: "Email and Phishing", q: "Have all staff received phishing awareness training in the last 12 months?" },
  { id: 25, section: "Email and Phishing", q: "Is your email domain protected with SPF, DKIM, and DMARC?" },
  { id: 26, section: "Email and Phishing", q: "Do you have a process for staff to report suspicious emails?" },
  { id: 27, section: "Email and Phishing", q: "Are financial transactions verified via a second channel?" },
  { id: 28, section: "Email and Phishing", q: "Do you scan email attachments for malware before opening?" },
  { id: 29, section: "Endpoint Security",  q: "Is antivirus or EDR software installed on all company devices?" },
  { id: 30, section: "Endpoint Security",  q: "Are all operating systems set to receive automatic updates?" },
  { id: 31, section: "Endpoint Security",  q: "Are all applications kept patched and up to date?" },
  { id: 32, section: "Endpoint Security",  q: "Are company devices encrypted (BitLocker or FileVault)?" },
  { id: 33, section: "Endpoint Security",  q: "Is there a policy governing personal device use for work?" },
  { id: 34, section: "Endpoint Security",  q: "Are mobile devices enrolled in an MDM solution?" },
  { id: 35, section: "Endpoint Security",  q: "Are USB ports restricted on sensitive systems?" },
  { id: 36, section: "Physical Security",  q: "Are server rooms and network equipment locked?" },
  { id: 37, section: "Physical Security",  q: "Do employees lock screens when leaving workstations?" },
  { id: 38, section: "Physical Security",  q: "Is a clean desk policy enforced?" },
  { id: 39, section: "Physical Security",  q: "Are visitor access logs maintained?" },
  { id: 40, section: "Physical Security",  q: "Is there camera coverage of key areas?" },
  { id: 41, section: "Compliance",         q: "Do you have a written Acceptable Use Policy signed by all staff?" },
  { id: 42, section: "Compliance",         q: "Do you have a documented Incident Response Plan?" },
  { id: 43, section: "Compliance",         q: "Do you have a written Password Policy?" },
  { id: 44, section: "Compliance",         q: "Have you identified what personal data you collect and how it is stored?" },
  { id: 45, section: "Compliance",         q: "Do vendor contracts include security requirements?" },
  { id: 46, section: "Compliance",         q: "Have you reviewed PIPEDA or applicable privacy law obligations?" },
  { id: 47, section: "Compliance",         q: "Do you conduct annual security risk assessments?" },
  { id: 48, section: "Compliance",         q: "Is cybersecurity insurance in place?" },
  { id: 49, section: "Vendor Risk",        q: "Do you maintain an inventory of all third-party software?" },
  { id: 50, section: "Vendor Risk",        q: "Have key vendors been assessed for their security practices?" },
  { id: 51, section: "Vendor Risk",        q: "Do vendor contracts include breach notification requirements?" },
  { id: 52, section: "Vendor Risk",        q: "Is vendor access limited to only what they need?" },
];

const SECTIONS = [...new Set(QUESTIONS.map(q => q.section))];

const SECTION_COLORS = {
  "Network Security":   "#3b82f6",
  "Access Control":     "#8b5cf6",
  "Data Backup":        "#10b981",
  "Email and Phishing": "#f59e0b",
  "Endpoint Security":  "#ef4444",
  "Physical Security":  "#06b6d4",
  "Compliance":         "#ec4899",
  "Vendor Risk":        "#84cc16",
};

const SECTION_ICONS = {
  "Network Security":   "🌐",
  "Access Control":     "🔐",
  "Data Backup":        "💾",
  "Email and Phishing": "📧",
  "Endpoint Security":  "💻",
  "Physical Security":  "🏢",
  "Compliance":         "📋",
  "Vendor Risk":        "🤝",
};

// ── MONTHLY PASSWORD — UPDATE ON THE 1ST OF EACH MONTH ──────────────────────
const VALID_PASSWORD = "GSG-MAY-2026";

// ── SCORING ──────────────────────────────────────────────────────────────────
function calcScore(answers) {
  return QUESTIONS.reduce((total, q) => {
    const a = answers[q.id];
    if (a === "no")     return total + 2;
    if (a === "unsure") return total + 1;
    return total;
  }, 0);
}

function calcPct(score) {
  return Math.round((score / (QUESTIONS.length * 2)) * 100);
}

function getRiskLevel(pct) {
  if (pct >= 80) return { label: "CRITICAL", color: "#ef4444", bg: "#fef2f2", emoji: "🔴", desc: "Immediate action required. Your business faces serious breach exposure." };
  if (pct >= 60) return { label: "HIGH",     color: "#f97316", bg: "#fff7ed", emoji: "🟠", desc: "Significant security gaps. Act within 60 days." };
  if (pct >= 40) return { label: "MEDIUM",   color: "#f59e0b", bg: "#fffbeb", emoji: "🟡", desc: "Some controls in place but notable vulnerabilities remain." };
  if (pct >= 20) return { label: "LOW",       color: "#22c55e", bg: "#f0fdf4", emoji: "🟢", desc: "Good foundation. Focus on closing the remaining gaps." };
  return           { label: "MINIMAL",   color: "#10b981", bg: "#ecfdf5", emoji: "✅", desc: "Strong security posture. Keep it up and review annually." };
}

function getSectionScore(section, answers) {
  const qs = QUESTIONS.filter(q => q.section === section);
  const score = qs.reduce((t, q) => {
    const a = answers[q.id];
    if (a === "no")     return t + 2;
    if (a === "unsure") return t + 1;
    return t;
  }, 0);
  const max = qs.length * 2;
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return { score, max, pct };
}

// ── SIMPLE FREE REPORT ───────────────────────────────────────────────────────
function makeFreeReport(company, answers) {
  const score = calcScore(answers);
  const pct   = calcPct(score);
  const risk  = getRiskLevel(pct);
  const biz   = company || "Your Business";
  const date  = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const failed  = QUESTIONS.filter(q => answers[q.id] === "no");
  const unsure  = QUESTIONS.filter(q => answers[q.id] === "unsure");

  const rows = SECTIONS.map(sec => {
    const { score: s, max: m, pct: p } = getSectionScore(sec, answers);
    const col = p >= 70 ? "#ef4444" : p >= 40 ? "#f59e0b" : "#22c55e";
    return `<tr>
      <td style="padding:8px 12px;font-weight:600;">${SECTION_ICONS[sec]} ${sec}</td>
      <td style="padding:8px 12px;text-align:center;font-weight:700;color:${col};">${s}/${m}</td>
      <td style="padding:8px 12px;">
        <div style="height:8px;background:#e2e8f0;border-radius:4px;">
          <div style="width:${p}%;height:100%;background:${col};border-radius:4px;"></div>
        </div>
      </td>
    </tr>`;
  }).join("");

  const findings = [...failed, ...unsure].slice(0, 10).map(q => {
    const isNo = answers[q.id] === "no";
    return `<tr>
      <td style="padding:8px 12px;">
        <span style="background:${isNo ? "#fef2f2" : "#fffbeb"};color:${isNo ? "#ef4444" : "#f59e0b"};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">
          ${isNo ? "FAILED" : "REVIEW"}
        </span>
      </td>
      <td style="padding:8px 12px;font-size:12px;color:#1e3a5f;font-weight:600;">${q.section}</td>
      <td style="padding:8px 12px;font-size:12px;">${q.q}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>GSG Summary Report — ${biz}</title>
<style>
  body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #0b1628; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
  td { border-bottom: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div style="max-width:800px;margin:0 auto;">

  <div style="background:#0b1628;padding:40px;color:#fff;">
    <div style="font-size:13px;color:#22c55e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Green Security Group · Summary Report</div>
    <div style="font-size:32px;font-weight:800;margin-bottom:6px;">Cybersecurity Risk Summary</div>
    <div style="color:#94a3b8;font-size:15px;">${biz} · ${date}</div>
    <div style="color:#64748b;font-size:12px;margin-top:6px;">Prepared by Paul Green, CISSP · paul@greensecuritygroup.com</div>
  </div>

  <div style="background:${risk.bg};border-left:5px solid ${risk.color};padding:24px 40px;display:flex;gap:32px;align-items:center;flex-wrap:wrap;">
    <div style="text-align:center;">
      <div style="font-size:72px;font-weight:800;color:${risk.color};line-height:1;">${pct}</div>
      <div style="font-size:11px;color:#64748b;text-transform:uppercase;">Risk Score / 100</div>
    </div>
    <div>
      <div style="display:inline-block;background:${risk.color}22;color:${risk.color};padding:6px 16px;border-radius:100px;font-weight:800;font-size:16px;margin-bottom:8px;">
        ${risk.emoji} ${risk.label} RISK
      </div>
      <div style="font-size:14px;color:#475569;line-height:1.6;">${risk.desc}</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:28px;font-weight:800;color:#ef4444;">${failed.length}</div>
      <div style="font-size:11px;color:#64748b;text-transform:uppercase;">Failed</div>
      <div style="font-size:28px;font-weight:800;color:#f59e0b;margin-top:8px;">${unsure.length}</div>
      <div style="font-size:11px;color:#64748b;text-transform:uppercase;">Need Review</div>
    </div>
  </div>

  <div style="padding:28px 40px;">
    <h2 style="font-size:16px;margin:0 0 14px;">Risk by Category</h2>
    <table><thead><tr><th>Category</th><th style="text-align:center;">Score</th><th>Bar</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </div>

  ${findings ? `
  <div style="padding:0 40px 28px;">
    <h2 style="font-size:16px;margin:0 0 14px;">Top Findings</h2>
    <table><thead><tr><th>Status</th><th>Category</th><th>Finding</th></tr></thead>
    <tbody>${findings}</tbody></table>
  </div>` : ""}

  <div style="margin:0 40px 32px;background:#f0fdf4;border:1px solid #22c55e44;border-radius:10px;padding:24px;text-align:center;">
    <div style="font-size:18px;font-weight:800;margin-bottom:8px;color:#0b1628;">Take Action On Your Results</div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
      <a href="https://greensecure.gumroad.com/l/jtrkdq" style="display:inline-block;padding:11px 22px;background:#22c55e;color:#000;border-radius:7px;font-weight:700;text-decoration:none;font-size:13px;">
        Get Professional Report — $97
      </a>
      <a href="https://greensecure.gumroad.com/l/fmxotn" style="display:inline-block;padding:11px 22px;background:#0b1628;color:#22c55e;border:1px solid #22c55e;border-radius:7px;font-weight:700;text-decoration:none;font-size:13px;">
        Get Security Toolkit — $67
      </a>
    </div>
    <div style="font-size:11px;color:#94a3b8;margin-top:10px;">greensecuritygroup.com · Instant download · CISSP-certified</div>
  </div>

  <div style="background:#0b1628;padding:16px 40px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
    <div style="color:#fff;font-weight:700;">Green Security Group</div>
    <div style="color:#475569;font-size:11px;">paul@greensecuritygroup.com · greensecuritygroup.com · CISSP</div>
  </div>

</div>
</body>
</html>`;
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07090f; --surface: #111827; --surf2: #1a2332;
    --green: #22c55e; --green2: #16a34a;
    --border: rgba(34,197,94,0.15); --border2: rgba(34,197,94,0.25);
    --text: #e8edf5; --muted: #6b7fa3; --dim: #2d3f58;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased; }

  /* NAV */
  .nav { position: sticky; top: 0; z-index: 100; background: rgba(7,9,15,0.96); border-bottom: 1px solid var(--border); height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--green2), var(--green)); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .logo-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .logo-sub  { font-size: 9px; color: var(--green); text-transform: uppercase; letter-spacing: 0.08em; }
  .nav-cta { padding: 7px 16px; border-radius: 6px; background: var(--green); color: #000; font-weight: 600; font-size: 12px; border: none; cursor: pointer; }
  .nav-cta:hover { background: var(--green2); color: #fff; }

  /* HERO */
  .hero { min-height: calc(100vh - 56px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
  .hero-title { font-size: clamp(36px, 7vw, 80px); font-weight: 800; line-height: 1.05; margin-bottom: 18px; }
  .hero-title .g { color: var(--green); }
  .hero-title .d { color: var(--dim); }
  .hero-sub { font-size: 15px; color: var(--muted); max-width: 440px; line-height: 1.7; margin: 0 auto 32px; }
  .company-input { display: block; width: 100%; max-width: 320px; margin: 0 auto 14px; padding: 11px 16px; border-radius: 7px; background: var(--surface); border: 1px solid var(--border2); color: var(--text); font-size: 14px; outline: none; text-align: center; }
  .company-input::placeholder { color: var(--dim); }
  .btn-primary { padding: 13px 28px; border-radius: 7px; background: var(--green); color: #000; font-weight: 700; font-size: 14px; border: none; cursor: pointer; margin-bottom: 48px; }
  .btn-primary:hover { background: var(--green2); color: #fff; }
  .stats { display: flex; gap: 0; border: 1px solid var(--border2); border-radius: 8px; overflow: hidden; background: var(--surface); margin-bottom: 32px; }
  .stat { padding: 14px 24px; text-align: center; border-right: 1px solid var(--border); }
  .stat:last-child { border-right: none; }
  .stat-v { font-size: 26px; font-weight: 800; color: var(--green); line-height: 1; }
  .stat-l { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .certs { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; max-width: 600px; }
  .cert-pill { padding: 3px 10px; border-radius: 100px; font-size: 9px; font-weight: 500; border: 1px solid var(--border2); color: var(--green); background: rgba(34,197,94,0.06); }

  /* ASSESSMENT */
  .assess { max-width: 720px; margin: 0 auto; padding: 28px 20px 60px; }
  .progress-wrap { margin-bottom: 24px; }
  .progress-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; color: var(--muted); }
  .progress-pct { font-weight: 700; color: var(--green); font-size: 16px; }
  .progress-bar { height: 3px; background: var(--surf2); border-radius: 3px; }
  .progress-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 0.3s; }
  .sec-tabs { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 22px; }
  .sec-tab { padding: 5px 10px; border-radius: 5px; font-size: 11px; font-weight: 500; border: 1px solid var(--border); background: var(--surface); color: var(--muted); cursor: pointer; }
  .sec-tab.active { color: #fff; }
  .sec-tab.done { color: var(--green); border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.06); }
  .sec-heading { margin-bottom: 18px; }
  .sec-name { font-size: 24px; font-weight: 800; margin-bottom: 3px; }
  .sec-meta { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .q-card { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 14px 16px; margin-bottom: 7px; }
  .q-card.answered { border-color: rgba(34,197,94,0.2); }
  .q-card.needs-answer { border-color: rgba(245,158,11,0.3); }
  .q-num { font-size: 9px; color: var(--dim); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
  .q-text { font-size: 13px; line-height: 1.55; color: var(--text); margin-bottom: 12px; }
  .q-opts { display: flex; gap: 5px; }
  .q-opt { flex: 1; padding: 8px 4px; border-radius: 5px; border: 1px solid var(--border); background: var(--surf2); color: var(--muted); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; text-align: center; }
  .q-opt.yes.sel   { background: rgba(34,197,94,0.12); border-color: #22c55e; color: #22c55e; }
  .q-opt.no.sel    { background: rgba(239,68,68,0.12);  border-color: #ef4444; color: #ef4444; }
  .q-opt.unsure.sel{ background: rgba(245,158,11,0.12); border-color: #f59e0b; color: #f59e0b; }
  .nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; gap: 10px; }
  .btn-back { padding: 9px 18px; border-radius: 6px; background: transparent; border: 1px solid var(--border); color: var(--muted); font-size: 12px; cursor: pointer; }
  .btn-next { padding: 9px 22px; border-radius: 6px; background: var(--green); color: #000; font-weight: 700; font-size: 12px; border: none; cursor: pointer; }
  .btn-next:disabled { opacity: 0.3; cursor: not-allowed; }
  .nav-status { font-size: 11px; color: var(--muted); text-align: center; }

  /* RESULTS */
  .results { max-width: 800px; margin: 0 auto; padding: 28px 20px 60px; }
  .results-eyebrow { font-size: 10px; color: var(--green); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
  .results-title { font-size: clamp(28px, 5vw, 42px); font-weight: 800; line-height: 1.05; margin-bottom: 24px; }

  .score-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; padding: 28px; margin-bottom: 18px; display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
  .score-num { font-size: 80px; font-weight: 800; line-height: 1; }
  .score-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  .risk-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; font-weight: 800; font-size: 16px; margin-bottom: 8px; }
  .risk-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .score-bar-track { height: 5px; background: var(--surf2); border-radius: 5px; overflow: hidden; }
  .score-bar-fill  { height: 100%; border-radius: 5px; }

  .section-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 18px; }
  .sec-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
  .sec-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .sec-card-name { font-size: 11px; font-weight: 600; }
  .sec-card-score { font-size: 10px; font-weight: 700; }
  .sec-bar-track { height: 3px; background: var(--surf2); border-radius: 3px; overflow: hidden; }
  .sec-bar-fill  { height: 100%; border-radius: 3px; }

  .findings-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 18px; }
  .findings-title { font-size: 18px; font-weight: 800; margin-bottom: 14px; }
  .finding-row { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: flex-start; }
  .finding-row:last-child { border-bottom: none; }
  .finding-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .finding-cat { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  .finding-text { font-size: 12px; color: var(--muted); line-height: 1.5; }

  .report-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px; }
  .report-card { border-radius: 12px; padding: 22px; }
  .report-card.free { background: var(--surface); border: 1px solid var(--border); }
  .report-card.paid { background: rgba(34,197,94,0.06); border: 1px solid var(--border2); }
  .report-badge { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
  .report-title { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
  .report-desc  { font-size: 11px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .report-includes { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
  .report-include-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
  .report-price { font-size: 28px; font-weight: 800; margin-bottom: 10px; }
  .btn-download { width: 100%; padding: 10px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; border: none; text-align: center; display: block; text-decoration: none; }
  .btn-download.free-btn { background: var(--surf2); color: var(--text); border: 1px solid var(--border2); margin-bottom: 0; }
  .btn-download.paid-btn { background: var(--green); color: #000; margin-bottom: 8px; }
  .btn-download.paid-btn:hover { background: var(--green2); color: #fff; }
  .btn-unlock { width: 100%; padding: 10px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; background: transparent; border: 1px solid var(--border2); color: var(--green); }
  .btn-note { text-align: center; font-size: 9px; color: var(--dim); margin-top: 7px; line-height: 1.5; text-transform: uppercase; letter-spacing: 0.06em; }

  /* PASSWORD MODAL */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: 14px; padding: 28px; max-width: 400px; width: 100%; }
  .modal-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .modal-sub { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 18px; }
  .modal-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 5px; }
  .modal-input { width: 100%; padding: 11px 14px; border-radius: 6px; background: var(--surf2); border: 1px solid var(--border2); color: var(--text); font-size: 15px; outline: none; margin-bottom: 6px; letter-spacing: 0.05em; }
  .modal-input.err { border-color: #ef4444; }
  .modal-error { font-size: 11px; color: #ef4444; margin-bottom: 12px; }
  .modal-hint { font-size: 10px; color: var(--dim); margin-bottom: 16px; line-height: 1.6; padding: 8px 10px; background: var(--surf2); border-radius: 5px; }
  .modal-btns { display: flex; gap: 8px; }
  .modal-ok  { flex: 1; padding: 11px; border-radius: 6px; background: var(--green); color: #000; font-weight: 700; font-size: 13px; border: none; cursor: pointer; }
  .modal-ok:disabled { opacity: 0.35; cursor: not-allowed; }
  .modal-cancel { padding: 11px 16px; border-radius: 6px; background: transparent; color: var(--muted); font-size: 13px; border: 1px solid var(--border); cursor: pointer; }

  .restart-btn { display: block; margin: 20px auto 0; padding: 8px 18px; border-radius: 100px; background: transparent; border: 1px solid var(--border); color: var(--dim); font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; }

  .footer { border-top: 1px solid var(--border); padding: 20px; text-align: center; background: #0d1117; }
  .footer-name { font-size: 14px; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
  .footer-sub  { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.08em; }

  @media (max-width: 600px) {
    .stats { flex-direction: column; }
    .stat { border-right: none; border-bottom: 1px solid var(--border); }
    .stat:last-child { border-bottom: none; }
    .score-card { flex-direction: column; text-align: center; }
    .q-opts { flex-direction: column; }
    .nav-row { flex-direction: column; }
    .report-grid { grid-template-columns: 1fr; }
  }
`;

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]       = useState("hero");
  const [secIdx, setSecIdx]     = useState(0);
  const [answers, setAnswers]   = useState({});
  const [company, setCompany]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError]   = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("gsg_unlocked") === "true") setUnlocked(true);
  }, []);

  // ── derived ─────────────────────────────────────────────────────────────────
  const secQs      = QUESTIONS.filter(q => q.section === SECTIONS[secIdx]);
  const secAnswered = secQs.filter(q => answers[q.id]).length;
  const secDone    = secAnswered === secQs.length;
  const isLast     = secIdx === SECTIONS.length - 1;
  const totalAnswered = Object.keys(answers).length;
  const progress   = Math.round((totalAnswered / QUESTIONS.length) * 100);

  const score   = calcScore(answers);
  const pct     = calcPct(score);
  const risk    = getRiskLevel(pct);
  const findings = QUESTIONS.filter(q => answers[q.id] === "no" || answers[q.id] === "unsure").slice(0, 8);

  // ── handlers ─────────────────────────────────────────────────────────────────
  const startAssessment = () => { setSecIdx(0); setPhase("assessment"); window.scrollTo({ top: 0 }); };

  const goNext = () => {
    if (secIdx < SECTIONS.length - 1) { setSecIdx(i => i + 1); window.scrollTo({ top: 0 }); }
    else { setPhase("results"); window.scrollTo({ top: 0 }); }
  };

  const goBack = () => {
    if (secIdx > 0) { setSecIdx(i => i - 1); window.scrollTo({ top: 0 }); }
    else setPhase("hero");
  };

  const restart = () => {
    setPhase("hero"); setAnswers({}); setSecIdx(0); setCompany("");
    setShowModal(false); setPassword(""); setPwError("");
  };

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const downloadFree = () => {
    try {
      const html = makeFreeReport(company, answers);
      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `GSG-Summary-${(company || "Report").replace(/\s+/g, "-")}-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      alert("Download failed. Please email paul@greensecuritygroup.com");
    }
  };

  const handleUnlock = () => {
    setPwError("");
    if (password.trim().toUpperCase() === VALID_PASSWORD.toUpperCase()) {
      setUnlocked(true);
      sessionStorage.setItem("gsg_unlocked", "true");
      setShowModal(false);
      setPassword("");
      downloadFull();
    } else {
      setPwError("Incorrect password. Check your Gumroad receipt email.");
    }
  };

  const makeFullReport = () => {
    const biz  = company || "Your Business";
    const date = new Date().toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" });
    const failed  = QUESTIONS.filter(q => answers[q.id] === "no");
    const unsure  = QUESTIONS.filter(q => answers[q.id] === "unsure");
    const passed  = QUESTIONS.filter(q => answers[q.id] === "yes");
    const allIssues = [...failed, ...unsure];

    const REMEDIATION = {
      1:  { action:"Install a business-grade firewall", how:"Purchase a Cisco Meraki MX or Fortinet FortiGate. Configure inbound/outbound rules blocking all unused ports. Review rules quarterly.", time:"1–2 days", cost:"$300–$800/yr" },
      2:  { action:"Enable WPA3 or WPA2 encryption on all Wi-Fi", how:"Log into your router admin panel. Go to Wireless Security settings. Select WPA3 or WPA2-AES. Set a 20+ character passphrase.", time:"30 minutes", cost:"Free" },
      3:  { action:"Create a separate guest Wi-Fi network", how:"In your router admin panel, enable Guest Network. Give it a different SSID and password. Enable client isolation so guests cannot reach your main network.", time:"30 minutes", cost:"Free" },
      4:  { action:"Deploy VPN for all remote connections", how:"Set up NordLayer or Cisco AnyConnect. Require all staff connecting remotely to use the VPN before accessing company resources.", time:"1–3 days", cost:"$8–$15/user/mo" },
      5:  { action:"Implement basic network monitoring", how:"Deploy SolarWinds or a free tool like PRTG Network Monitor. Set alerts for unusual traffic volumes or new devices joining the network.", time:"1–2 days", cost:"Free–$100/mo" },
      6:  { action:"Update all router and switch firmware", how:"Log into each network device admin panel. Check the manufacturer website for the latest firmware. Download and apply. Schedule quarterly reviews.", time:"2–4 hours", cost:"Free" },
      7:  { action:"Disable all unused network ports", how:"Access your managed switch admin panel. Identify ports with no connected devices. Disable them in the port configuration settings.", time:"1–2 hours", cost:"Free" },
      8:  { action:"Implement network segmentation", how:"Create separate VLANs for servers, workstations, and IoT devices on your managed switch. Restrict traffic between segments using firewall rules.", time:"1–3 days", cost:"$200–$500 for managed switch" },
      9:  { action:"Enforce unique credentials for every user", how:"Audit all accounts and remove shared logins. Create individual accounts for each person. Deploy Bitwarden or 1Password to manage unique passwords across the organization.", time:"1 day", cost:"$3–$5/user/mo" },
      10: { action:"Enable MFA on all email accounts", how:"In Microsoft 365 or Google Workspace admin, enforce MFA for all users. Require an authenticator app — not SMS. Roll out to all staff with a deadline.", time:"1–2 hours", cost:"Free" },
      11: { action:"Enable MFA on all cloud services", how:"Audit all cloud services your business uses. Enable MFA in each platform's security settings. Use Microsoft Authenticator or Google Authenticator.", time:"2–4 hours", cost:"Free" },
      12: { action:"Create a formal offboarding security checklist", how:"Document each step: disable email within 24 hours, revoke VPN access, remove from all systems, change shared passwords, collect devices. Run this for every departure.", time:"2–3 hours to create", cost:"Free" },
      13: { action:"Enforce least-privilege for admin accounts", how:"Create separate admin and standard accounts for IT staff. Use standard accounts daily. Only switch to admin for specific administrative tasks.", time:"1 day", cost:"Free" },
      14: { action:"Enforce minimum 14-character password policy", how:"In Active Directory Group Policy or your identity provider, set minimum password length to 14 characters. Enable complexity requirements. Communicate the change to all staff.", time:"2–4 hours", cost:"Free" },
      15: { action:"Deploy a company-wide password manager", how:"Choose Bitwarden (free) or 1Password ($3/user/mo). Set up a business account. Train all staff. Require use for all new accounts going forward.", time:"1–2 days", cost:"$0–$5/user/mo" },
      16: { action:"Schedule quarterly access reviews", how:"Create a spreadsheet listing every user and their access levels. Review quarterly. Remove access that is no longer needed. Document each review.", time:"2–4 hours quarterly", cost:"Free" },
      17: { action:"Implement automated daily backups", how:"Use Veeam, Acronis, or Windows Server Backup. Configure automated daily backups of all critical data. Verify backups are completing via daily email reports.", time:"1–2 days", cost:"$50–$200/mo" },
      18: { action:"Store backups offsite or in the cloud", how:"Configure your backup software to replicate to AWS S3, Azure Blob, or Backblaze. Ensure backups are geographically separate from your primary systems.", time:"1 day", cost:"$5–$50/mo" },
      19: { action:"Test backup restoration immediately", how:"Restore a sample of files from backup to a test location today. Verify the data is intact and readable. Document the test. Repeat this test every month.", time:"2–4 hours", cost:"Free" },
      20: { action:"Enable encryption for all backups", how:"In your backup software settings, enable AES-256 encryption. Set a strong encryption passphrase and store it securely in your password manager.", time:"1–2 hours", cost:"Free" },
      21: { action:"Protect backups from ransomware", how:"Enable immutable backup storage (S3 Object Lock or Backblaze immutable). Maintain at least one offline backup disconnected from the network. Follow the 3-2-1 rule.", time:"1–2 days", cost:"$10–$50/mo" },
      22: { action:"Document your recovery time objective", how:"Define how long your business can operate without each critical system. Document target recovery times. Test that your backup solution can meet those targets.", time:"2–3 hours", cost:"Free" },
      23: { action:"Deploy email filtering and anti-phishing", how:"Enable Microsoft Defender for Office 365 or Google Workspace's built-in protection. Add Proofpoint or Mimecast for an additional layer. Configure spam and phishing policies.", time:"1 day", cost:"$2–$10/user/mo" },
      24: { action:"Schedule phishing awareness training for all staff", how:"Sign up for KnowBe4 (free trial) or Proofpoint Security Awareness. Run a baseline phishing simulation. Train everyone who fails. Repeat quarterly.", time:"1 week to set up", cost:"$15–$30/user/yr" },
      25: { action:"Configure SPF, DKIM, and DMARC for your email domain", how:"Log into your DNS provider. Add SPF record (v=spf1 include:yourmailprovider ~all). Enable DKIM in your email platform. Add DMARC record. Verify at MXToolbox.com.", time:"2–4 hours", cost:"Free" },
      26: { action:"Create a suspicious email reporting process", how:"Set up security@yourcompany.com for reporting. Install the Microsoft Report Message button in Outlook. Train staff to report rather than delete suspicious emails.", time:"1–2 hours", cost:"Free" },
      27: { action:"Implement financial transaction verification", how:"Establish a policy: all wire transfers over $500 require phone verification using a known number — never a number from the email. Document and train all staff.", time:"1–2 hours", cost:"Free" },
      28: { action:"Enable attachment scanning on all email", how:"In Microsoft 365, enable Safe Attachments in Defender. In Google Workspace, enable Enhanced Safe Browsing. Configure to scan all attachments before delivery.", time:"1–2 hours", cost:"Free–$2/user/mo" },
      29: { action:"Deploy EDR on all company devices", how:"Choose CrowdStrike Falcon Go, SentinelOne, or Microsoft Defender for Business. Deploy the agent to all devices. Configure real-time monitoring and automatic threat response.", time:"1–2 days", cost:"$3–$8/device/mo" },
      30: { action:"Enable automatic OS updates on all devices", how:"On Windows, enable Windows Update set to automatic. On Mac, enable automatic updates in System Settings. For servers, configure WSUS.", time:"1–2 hours", cost:"Free" },
      31: { action:"Implement application patch management", how:"Audit all installed software. Enable automatic updates where available. For software without auto-update, create a monthly patching schedule using Ninite for Windows.", time:"1 day", cost:"Free–$50/mo" },
      32: { action:"Enable full disk encryption on all laptops", how:"On Windows, enable BitLocker in Settings > Privacy & Security. On Mac, enable FileVault in System Settings > Privacy & Security. Store recovery keys in your password manager.", time:"2–4 hours", cost:"Free" },
      33: { action:"Create a BYOD policy", how:"Define which personal devices can access company data. Require MDM enrollment for all personal devices accessing company email. Document acceptable use and security requirements.", time:"2–3 hours", cost:"Free" },
      34: { action:"Deploy Mobile Device Management", how:"Set up Microsoft Intune or Jamf. Enroll all company and BYOD devices. Configure policies: screen lock, encryption, remote wipe. Enforce compliance before granting access.", time:"2–5 days", cost:"$6–$12/device/mo" },
      35: { action:"Restrict USB ports on sensitive systems", how:"In Windows Group Policy, configure Device Installation Restrictions to block removable storage. On individual machines, use Endpoint Protector or CrowdStrike's USB control feature.", time:"2–4 hours", cost:"Free–$5/device/mo" },
      36: { action:"Secure all server rooms and network equipment", how:"Install a keyed lock on any room containing servers or network equipment. Maintain a log of who has access. Review access quarterly. Consider adding a basic IP camera.", time:"1 day", cost:"$50–$500" },
      37: { action:"Enforce screen lock policy", how:"Set Group Policy or MDM policy to lock screens after 5 minutes of inactivity. Train staff to manually lock screens with Windows+L when leaving their desks.", time:"1–2 hours", cost:"Free" },
      38: { action:"Implement a clean desk policy", how:"Write a policy requiring no sensitive documents left on desks and whiteboards cleared after meetings. Physical documents must be locked in drawers. Conduct occasional spot checks.", time:"1–2 hours", cost:"Free" },
      39: { action:"Implement visitor access logging", how:"Create a visitor sign-in sheet or use Envoy (free tier). Record name, company, host, time in/out, and purpose. Escort all visitors in secure areas.", time:"1–2 hours", cost:"Free" },
      40: { action:"Install security cameras in key areas", how:"Place cameras at entry and exit points, server room, and reception. Use a cloud-managed system like Arlo Business. Retain footage for a minimum of 30 days.", time:"1–2 days", cost:"$200–$1,000" },
      41: { action:"Create and distribute an Acceptable Use Policy", how:"Use the AUP template in the Green Security Group Toolkit. Add your company name. Have all staff read and sign it. Keep signed copies on file.", time:"2–4 hours", cost:"Free with toolkit" },
      42: { action:"Create an Incident Response Plan", how:"Use the IR Plan template in the Green Security Group Toolkit. Fill in team contacts, escalation paths, and communication procedures. Run a tabletop exercise to test it.", time:"4–8 hours", cost:"Free with toolkit" },
      43: { action:"Create and enforce a Password Policy", how:"Use the Password Policy template in the Green Security Group Toolkit. Add your company name and chosen password manager. Distribute to all staff and collect signatures.", time:"1–2 hours", cost:"Free with toolkit" },
      44: { action:"Complete a data inventory and mapping exercise", how:"Document every type of personal data you collect: where it is stored, who has access, and how long you retain it. Review annually and update whenever you add a new system.", time:"1–2 days", cost:"Free" },
      45: { action:"Add security clauses to all vendor contracts", how:"Review all active vendor contracts. Add data protection addendums requiring breach notification within 72 hours, data encryption, and access limitations. Include in all new contracts.", time:"1–2 days", cost:"Free–$500 legal review" },
      46: { action:"Review your PIPEDA obligations", how:"Visit the Office of the Privacy Commissioner of Canada website. Assess whether PIPEDA applies to your business. Identify your personal information obligations. Consider a privacy lawyer consultation.", time:"Half day", cost:"Free–$500 legal" },
      47: { action:"Schedule an annual security risk assessment", how:"Use this Green Security Group toolkit annually. Set a recurring calendar reminder. Update your risk register with new findings. Track your score improvement year over year.", time:"3–4 hours annually", cost:"Free with toolkit" },
      48: { action:"Obtain cybersecurity insurance", how:"Contact your business insurance broker and request a cyber liability policy. Compare at least 3 quotes. Typical small business cost is $1,000–$5,000 per year.", time:"1–2 weeks", cost:"$1,000–$5,000/yr" },
      49: { action:"Create a vendor and software inventory", how:"Create a spreadsheet listing every third-party software, SaaS tool, and service provider. Include: vendor name, purpose, data accessed, contract renewal date, and security contact.", time:"Half day", cost:"Free" },
      50: { action:"Assess key vendor security practices", how:"Send your top 5 vendors a security questionnaire asking about: data encryption, breach notification procedures, SOC 2 compliance, and incident response capabilities.", time:"1–2 days", cost:"Free" },
      51: { action:"Add breach notification clauses to vendor contracts", how:"Review all vendor contracts. Add a clause requiring notification within 72 hours of any breach involving your data. Include this in all new vendor agreements going forward.", time:"1 day", cost:"Free–$500 legal review" },
      52: { action:"Enforce least-privilege access for all vendors", how:"Audit what access each vendor currently has. Remove any access not actively needed. Create dedicated vendor accounts with limited permissions. Review quarterly.", time:"Half day", cost:"Free" },
    };

    const priorityFor = (q) => {
      const criticals = [10,11,17,18,19,21,27,29,9,2];
      const highs     = [1,4,6,12,13,14,15,20,23,24,25,28,30,31,32,36,41,42,43,44,46,48,51,52];
      if (criticals.includes(q.id)) return "CRITICAL";
      if (highs.includes(q.id))     return "HIGH";
      return "MEDIUM";
    };

    const sorted = [...allIssues].sort((a, b) => {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
      return (order[priorityFor(a)] || 2) - (order[priorityFor(b)] || 2);
    });

    const top10 = sorted.slice(0, 10);

    const execSummary = pct >= 60
      ? `This assessment reveals that ${biz} is operating with significant cybersecurity vulnerabilities that require prompt attention. With ${failed.length} failed controls and ${unsure.length} areas requiring review, your current security posture leaves the business exposed to real and preventable threats. The most urgent areas are ${sorted[0] ? sorted[0].section : "access control"} and ${sorted[1] ? sorted[1].section : "data backup"}. The good news is that many of the highest-impact fixes cost nothing and can be implemented within days.`
      : pct >= 30
      ? `${biz} has established a reasonable security foundation with ${passed.length} controls passing, but this assessment identifies ${allIssues.length} areas requiring improvement. Your score of ${pct}/100 leaves meaningful gaps that a motivated attacker could exploit. Addressing the priority items in this report over the next 90 days will significantly strengthen your security posture.`
      : `${biz} demonstrates a solid cybersecurity foundation with a score of ${pct}/100. This assessment identifies ${allIssues.length} remaining areas for improvement. Addressing these findings will further strengthen your defenses and ensure ongoing compliance with applicable regulations.`;

    const sectionRows = SECTIONS.map(sec => {
      const { score: sc, max: mx, pct: p } = getSectionScore(sec, answers);
      const col   = p >= 70 ? "#ef4444" : p >= 40 ? "#f59e0b" : "#22c55e";
      const level = p >= 70 ? "HIGH RISK" : p >= 40 ? "MEDIUM RISK" : "LOW RISK";
      const secFailed = QUESTIONS.filter(q => q.section === sec && answers[q.id] === "no").length;
      const secUnsure = QUESTIONS.filter(q => q.section === sec && answers[q.id] === "unsure").length;
      return `<tr>
        <td style="padding:9px 12px;font-weight:600;">${SECTION_ICONS[sec]} ${sec}</td>
        <td style="padding:9px 12px;text-align:center;font-weight:700;color:${col};">${sc}/${mx}</td>
        <td style="padding:9px 12px;text-align:center;"><span style="background:${col}22;color:${col};padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;">${level}</span></td>
        <td style="padding:9px 12px;color:#ef4444;font-weight:600;">${secFailed} failed</td>
        <td style="padding:9px 12px;color:#f59e0b;font-weight:600;">${secUnsure} need review</td>
        <td style="padding:9px 12px;min-width:100px;">
          <div style="height:7px;background:#e2e8f0;border-radius:4px;"><div style="width:${p}%;height:100%;background:${col};border-radius:4px;"></div></div>
        </td>
      </tr>`;
    }).join("");

    const findingRows = allIssues.map((q, i) => {
      const rem   = REMEDIATION[q.id];
      const isNo  = answers[q.id] === "no";
      const pri   = priorityFor(q);
      const priCol = pri === "CRITICAL" ? "#ef4444" : pri === "HIGH" ? "#f97316" : "#f59e0b";
      return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
        <td style="padding:9px 12px;"><span style="background:${isNo?"#fef2f2":"#fffbeb"};color:${isNo?"#ef4444":"#f59e0b"};padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">${isNo?"FAILED":"REVIEW"}</span></td>
        <td style="padding:9px 12px;font-size:11px;color:#1e3a5f;font-weight:600;">${q.section}</td>
        <td style="padding:9px 12px;font-size:12px;">${q.q}</td>
        <td style="padding:9px 12px;"><span style="background:${priCol}22;color:${priCol};padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">${pri}</span></td>
      </tr>`;
    }).join("");

    const remRows = top10.map((q, i) => {
      const rem = REMEDIATION[q.id];
      if (!rem) return "";
      const pri    = priorityFor(q);
      const priCol = pri === "CRITICAL" ? "#ef4444" : pri === "HIGH" ? "#f97316" : "#f59e0b";
      return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
        <td style="padding:9px 12px;text-align:center;font-weight:800;font-size:18px;color:#0b1628;">${i+1}</td>
        <td style="padding:9px 12px;"><strong>${rem.action}</strong><br/><span style="font-size:11px;color:#64748b;">${q.section}</span></td>
        <td style="padding:9px 12px;font-size:12px;color:#374151;line-height:1.6;">${rem.how}</td>
        <td style="padding:9px 12px;font-size:11px;white-space:nowrap;">${rem.time}</td>
        <td style="padding:9px 12px;font-size:11px;white-space:nowrap;">${rem.cost}</td>
        <td style="padding:9px 12px;"><span style="background:${priCol}22;color:${priCol};padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">${pri}</span></td>
      </tr>`;
    }).join("");

    // Distribute top10 evenly across 3 months — always starts at Month 1
    const allForRoadmap = sorted.slice(0, 12);
    const month1 = allForRoadmap.slice(0, 4);
    const month2 = allForRoadmap.slice(4, 8);
    const month3 = allForRoadmap.slice(8, 12);

    const roadmapSection = (items, title, color, weekStart = 1) => {
      if (!items.length) return "";
      return `<h3 style="background:${color};color:#fff;padding:9px 14px;border-radius:6px;margin:20px 0 8px;font-size:13px;">${title}</h3>
      <table><thead><tr><th>Week</th><th>Action</th><th>Time</th><th>Est. Cost</th></tr></thead><tbody>
      ${items.map((q,i) => {
        const rem = REMEDIATION[q.id];
        if (!rem) return "";
        return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
          <td style="padding:8px 12px;font-size:11px;">Week ${weekStart + i}</td>
          <td style="padding:8px 12px;font-size:12px;"><strong>${rem.action}</strong><br/><span style="color:#64748b;font-size:11px;">${q.section}</span></td>
          <td style="padding:8px 12px;font-size:11px;">${rem.time}</td>
          <td style="padding:8px 12px;font-size:11px;">${rem.cost}</td>
        </tr>`;
      }).join("")}
      </tbody></table>`;
    };

    const policyNeeds = [];
    if (answers[41] !== "yes") policyNeeds.push({ name:"Acceptable Use Policy (AUP)", urgency:"HIGH", reason:"No documented rules governing how staff use company technology — a foundational security and legal requirement." });
    if (answers[42] !== "yes") policyNeeds.push({ name:"Incident Response Plan", urgency:"HIGH", reason:"Without a response plan, a breach causes maximum damage. Every minute of confusion during an incident increases costs and liability." });
    if (answers[43] !== "yes") policyNeeds.push({ name:"Password Policy", urgency:"MEDIUM", reason:"Without a formal password policy, staff have no clear guidance on creating and managing strong passwords." });

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>GSG Professional Risk Report — ${biz}</title>
<style>
  body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; line-height: 1.6; }
  h2 { font-size: 17px; font-weight: 800; color: #0b1628; margin: 32px 0 10px; padding-bottom: 7px; border-bottom: 2px solid #22c55e; }
  h3 { font-size: 13px; font-weight: 700; color: #1e3a5f; margin: 18px 0 7px; }
  p  { font-size: 13px; color: #374151; line-height: 1.75; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
  th { background: #0b1628; color: #fff; padding: 9px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { border-bottom: 1px solid #e2e8f0; vertical-align: top; }
</style>
</head>
<body>
<div style="max-width:860px;margin:0 auto;">

<!-- COVER -->
<div style="background:#0b1628;padding:48px;color:#fff;">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
    <div style="width:42px;height:42px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:21px;">🛡</div>
    <div>
      <div style="font-size:16px;font-weight:800;">Green Security Group</div>
      <div style="font-size:10px;color:#22c55e;letter-spacing:0.1em;text-transform:uppercase;">CISSP-Certified · Professional Security Assessment</div>
    </div>
  </div>
  <div style="font-size:10px;color:#22c55e;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px;">Confidential Professional Risk Report</div>
  <div style="font-size:38px;font-weight:800;line-height:1.05;margin-bottom:8px;">Cybersecurity Risk<br>Assessment Report</div>
  <div style="font-size:18px;color:#94a3b8;margin-bottom:32px;">${biz}</div>
  <div style="display:flex;gap:32px;flex-wrap:wrap;">
    <div><div style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Prepared For</div><div style="font-size:13px;font-weight:600;">${biz}</div></div>
    <div><div style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Date</div><div style="font-size:13px;font-weight:600;">${date}</div></div>
    <div><div style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Prepared By</div><div style="font-size:13px;font-weight:600;">Paul Green, CISSP</div></div>
    <div><div style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Classification</div><div style="font-size:13px;font-weight:600;color:#22c55e;">Confidential</div></div>
  </div>
</div>

<!-- SCORE BANNER -->
<div style="background:${risk.bg};border-left:5px solid ${risk.color};padding:24px 48px;display:flex;align-items:center;gap:32px;flex-wrap:wrap;">
  <div style="text-align:center;">
    <div style="font-size:72px;font-weight:800;color:${risk.color};line-height:1;">${pct}</div>
    <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Risk Score / 100</div>
  </div>
  <div style="flex:1;">
    <div style="display:inline-flex;align-items:center;gap:7px;background:${risk.color}22;color:${risk.color};padding:7px 16px;border-radius:100px;font-weight:800;font-size:17px;margin-bottom:8px;">${risk.emoji} ${risk.label} RISK</div>
    <div style="font-size:13px;color:#475569;line-height:1.65;margin-bottom:12px;">${risk.desc}</div>
    <div style="height:7px;background:#e2e8f0;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${risk.color};border-radius:4px;"></div></div>
  </div>
  <div style="display:flex;gap:20px;">
    <div style="text-align:center;"><div style="font-size:32px;font-weight:800;color:#ef4444;">${failed.length}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;">Failed</div></div>
    <div style="text-align:center;"><div style="font-size:32px;font-weight:800;color:#f59e0b;">${unsure.length}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;">Review</div></div>
    <div style="text-align:center;"><div style="font-size:32px;font-weight:800;color:#22c55e;">${passed.length}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;">Passed</div></div>
  </div>
</div>

<!-- BODY -->
<div style="padding:36px 48px;">

<h2>1. Executive Summary</h2>
<p>${execSummary}</p>
<p>This report provides a complete analysis of your results across all 8 security categories, a prioritized top-10 remediation plan with step-by-step instructions, a custom 90-day roadmap built around your specific gaps, and policy recommendations based on your compliance findings. All recommendations are drawn from NIST CSF, CIS Controls, and ISO 27001 frameworks.</p>

<h2>2. Risk Score Analysis</h2>
<p>Your score of <strong>${pct} out of 100</strong> places ${biz} in the <strong>${risk.label}</strong> risk category. Scores are calculated by assigning 2 points per failed control and 1 point per uncertain control across all 52 questions. The average small business scores between 45 and 65.</p>
<table><thead><tr><th>Score</th><th>Risk Level</th><th>What It Means</th><th>Timeline</th></tr></thead>
<tbody>
  <tr style="${pct>=80?"background:#fef2f2":""}"><td>80–100</td><td><span style="background:#fef2f2;color:#ef4444;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">CRITICAL</span></td><td>Immediate breach exposure</td><td>Act within 30 days</td></tr>
  <tr style="${pct>=60&&pct<80?"background:#fff7ed":""}"><td>60–79</td><td><span style="background:#fff7ed;color:#f97316;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">HIGH</span></td><td>Significant security gaps</td><td>Act within 60 days</td></tr>
  <tr style="${pct>=40&&pct<60?"background:#fffbeb":""}"><td>40–59</td><td><span style="background:#fffbeb;color:#f59e0b;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">MEDIUM</span></td><td>Notable vulnerabilities</td><td>Act within 90 days</td></tr>
  <tr style="${pct>=20&&pct<40?"background:#f0fdf4":""}"><td>20–39</td><td><span style="background:#f0fdf4;color:#22c55e;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">LOW</span></td><td>Good foundation, minor gaps</td><td>Ongoing maintenance</td></tr>
  <tr><td>0–19</td><td><span style="background:#ecfdf5;color:#10b981;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">MINIMAL</span></td><td>Strong security posture</td><td>Annual review</td></tr>
</tbody></table>

<h2>3. Risk by Category</h2>
<table><thead><tr><th>Category</th><th style="text-align:center;">Score</th><th>Level</th><th>Failed</th><th>Review</th><th style="min-width:100px;">Bar</th></tr></thead>
<tbody>${sectionRows}</tbody></table>

<h2>4. All Findings — ${allIssues.length} Issues Identified</h2>
${allIssues.length > 0
  ? `<table><thead><tr><th>Status</th><th>Category</th><th>Control</th><th>Priority</th></tr></thead><tbody>${findingRows}</tbody></table>`
  : `<p style="color:#22c55e;font-weight:600;">✓ No failed controls identified. Excellent security posture.</p>`}

<h2>5. Prioritized Remediation Plan — Top ${top10.length} Actions</h2>
<p>These actions are ranked by risk reduction impact. Each includes step-by-step instructions, time estimates, and cost estimates. Start with item 1.</p>
${top10.length > 0
  ? `<table><thead><tr><th>#</th><th>Action</th><th>How To Do It</th><th>Time</th><th>Cost</th><th>Priority</th></tr></thead><tbody>${remRows}</tbody></table>`
  : `<p style="color:#22c55e;font-weight:600;">✓ No critical remediation actions required.</p>`}

<h2>6. Custom 90-Day Roadmap</h2>
<p>This roadmap is built specifically around your gaps — only actions relevant to your actual failures are included.</p>
${roadmapSection(month1, "Month 1 — Highest Priority Actions", "#ef4444", 1)}
${roadmapSection(month2, "Month 2 — High Priority Improvements", "#f59e0b", 5)}
${roadmapSection(month3, "Month 3 — Medium Priority & Maintenance", "#22c55e", 9)}
<p style="margin-top:14px;padding:12px 14px;background:#f8fafc;border-left:3px solid #22c55e;border-radius:4px;font-size:12px;">
  <strong>After 90 days:</strong> Re-run this assessment at greensecuritygroup.com to measure your improvement. Most businesses reduce their score by 30–50 points in the first 90 days.
</p>

<h2>7. Policy Recommendations</h2>
${policyNeeds.length > 0
  ? `<p>Based on your assessment, ${biz} requires the following security policies. All three templates are included in the Green Security Group Security Toolkit.</p>
    <table><thead><tr><th>Policy</th><th>Urgency</th><th>Why You Need It</th></tr></thead><tbody>
    ${policyNeeds.map(p => `<tr><td><strong>${p.name}</strong></td><td><span style="background:${p.urgency==="HIGH"?"#fff7ed":"#fffbeb"};color:${p.urgency==="HIGH"?"#f97316":"#f59e0b"};padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">${p.urgency}</span></td><td style="font-size:12px;">${p.reason}</td></tr>`).join("")}
    </tbody></table>`
  : `<p style="color:#22c55e;font-weight:600;">✓ All three core security policies are in place. Review them annually and have new staff sign them during onboarding.</p>`}

<h2>8. Professional Conclusion</h2>
<p>${pct >= 60
  ? `Based on this assessment, ${biz} faces material cybersecurity risk requiring prompt attention. The ${failed.length} failed controls represent real vulnerabilities that a motivated attacker could exploit. The majority of highest-impact fixes are free or low-cost and can be implemented without specialized expertise using the guidance in this report.`
  : `Based on this assessment, ${biz} has established a reasonable security foundation. The ${allIssues.length} remaining gaps are manageable and can be addressed systematically over the next 90 days using the roadmap provided.`
}</p>
<p><strong>Immediate priority (this week):</strong> ${top10[0] ? REMEDIATION[top10[0].id]?.action || "Review your top findings above" : "Maintain current controls and schedule annual review."}${top10[1] ? ` Also prioritize ${REMEDIATION[top10[1].id]?.action || "your second priority finding"}.` : ""}</p>
<p>If you need professional assistance implementing any of these recommendations, contact <strong>paul@greensecuritygroup.com</strong>.</p>

<div style="margin-top:28px;padding:22px 28px;background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03));border:1px solid rgba(34,197,94,0.22);border-radius:10px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
  <div style="width:46px;height:46px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0;">🛡</div>
  <div style="flex:1;">
    <div style="font-weight:800;font-size:15px;margin-bottom:2px;">Paul Green, CISSP</div>
    <div style="font-size:11px;color:#64748b;">Founder, Green Security Group · 10+ Years Enterprise Security Experience</div>
    <div style="font-size:10px;color:#22c55e;margin-top:3px;">CISSP · CySA+ · SSCP · CSAP · CSIS · CIOS · Security+ · Network+ · A+ · CC · ITIL</div>
  </div>
  <div style="font-size:11px;color:#64748b;text-align:right;">
    <div>paul@greensecuritygroup.com</div>
    <div>greensecuritygroup.com</div>
  </div>
</div>

<div style="margin-top:24px;padding:22px 28px;background:#0b1628;border-radius:10px;text-align:center;">
  <div style="font-size:10px;color:#22c55e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Next Step</div>
  <div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:7px;">Get the Full Security Toolkit</div>
  <div style="font-size:12px;color:#94a3b8;max-width:440px;margin:0 auto 12px;line-height:1.65;">Policy templates, risk register, 90-day roadmap, and security guide — everything you need to implement these recommendations.</div>
  <a href="https://greensecure.gumroad.com/l/fmxotn" style="display:inline-block;padding:11px 28px;background:#22c55e;color:#000;border-radius:7px;font-weight:700;text-decoration:none;font-size:13px;margin-bottom:8px;">Get the Security Toolkit — $67 →</a>
  <div style="font-size:11px;color:#475569;">greensecure.gumroad.com · Instant download</div>
</div>

</div>

<!-- FOOTER -->
<div style="background:#0b1628;padding:16px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
  <div style="color:#fff;font-weight:700;font-size:12px;">Green Security Group</div>
  <div style="color:#475569;font-size:10px;">© ${new Date().getFullYear()} · Confidential · All rights reserved</div>
  <div style="color:#475569;font-size:10px;">paul@greensecuritygroup.com</div>
</div>

</div>
</body>
</html>`;
  };

  const downloadFull = () => {
    try {
      const html = makeFullReport();
      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `GSG-Professional-Report-${(company || "Report").replace(/\s+/g, "-")}-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      alert("Download failed. Please email paul@greensecuritygroup.com — Error: " + e.message);
    }
  };

  const handlePaidClick = () => {
    if (unlocked) { downloadFull(); }
    else { setShowModal(true); }
  };

  const CERTS = ["CISSP","CySA+","SSCP","CSAP","CSIS","CIOS","Security+","Network+","A+","Project+","Linux Essentials","CC","ITIL Foundation"];

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo" onClick={() => setPhase("hero")}>
          <div className="logo-icon">🛡</div>
          <div>
            <div className="logo-name">Green Security Group</div>
            <div className="logo-sub">Cybersecurity Risk Assessment</div>
          </div>
        </div>
        <button className="nav-cta" onClick={startAssessment}>Start Free Assessment</button>
      </nav>

      {/* PASSWORD MODAL */}
      {showModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔐</div>
            <div className="modal-title">Enter Report Password</div>
            <div className="modal-sub">
              Your password is in your Gumroad receipt email. Format: <strong style={{ color: "var(--green)" }}>GSG-MMM-YYYY</strong>
            </div>
            <label className="modal-label">Password</label>
            <input
              className={`modal-input${pwError ? " err" : ""}`}
              placeholder="GSG-MAY-2026"
              value={password}
              autoFocus
              onChange={e => { setPassword(e.target.value); setPwError(""); }}
              onKeyDown={e => e.key === "Enter" && handleUnlock()}
            />
            {pwError && <div className="modal-error">⚠ {pwError}</div>}
            <div className="modal-hint">
              Password in Gumroad receipt email · Changes monthly<br />
              No receipt?{" "}
              <a href="https://greensecure.gumroad.com/l/jtrkdq" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--green)" }} onClick={() => setShowModal(false)}>
                Purchase on Gumroad →
              </a>
            </div>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setPassword(""); setPwError(""); }}>Cancel</button>
              <button className="modal-ok" onClick={handleUnlock} disabled={password.trim().length < 4}>
                Unlock Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      {phase === "hero" && (
        <div className="hero">
          <div className="hero-title">
            KNOW YOUR<br />
            <span className="g">RISK.</span><br />
            <span className="d">FIX IT FAST.</span>
          </div>
          <p className="hero-sub">
            Free cybersecurity risk assessment for small businesses — built by <strong>Paul Green, CISSP</strong> with 10+ years of enterprise security experience.
          </p>
          <input
            className="company-input"
            placeholder="Your company name (optional)"
            value={company}
            onChange={e => setCompany(e.target.value)}
            onKeyDown={e => e.key === "Enter" && startAssessment()}
          />
          <button className="btn-primary" onClick={startAssessment}>
            Start Free Assessment →
          </button>
          <div className="stats" style={{ marginBottom: 24 }}>
            {[["52","Questions"],["8","Risk Areas"],["FREE","Assessment"],["CISSP","Certified"]].map(([v,l]) => (
              <div className="stat" key={l}>
                <div className="stat-v">{v}</div>
                <div className="stat-l">{l}</div>
              </div>
            ))}
          </div>
          <div className="certs">
            {CERTS.map(c => <span className="cert-pill" key={c}>{c}</span>)}
          </div>
        </div>
      )}

      {/* ══ ASSESSMENT ══ */}
      {phase === "assessment" && (
        <div className="assess">
          {/* Progress */}
          <div className="progress-wrap">
            <div className="progress-row">
              <span>{totalAnswered} / {QUESTIONS.length} answered</span>
              <span className="progress-pct">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Section tabs */}
          <div className="sec-tabs">
            {SECTIONS.map((s, i) => {
              const done = QUESTIONS.filter(q => q.section === s).every(q => answers[q.id]);
              return (
                <button
                  key={s}
                  className={`sec-tab${i === secIdx ? " active" : ""}${done && i !== secIdx ? " done" : ""}`}
                  style={i === secIdx ? { background: SECTION_COLORS[s], borderColor: SECTION_COLORS[s] } : {}}
                  onClick={() => setSecIdx(i)}
                >
                  {SECTION_ICONS[s]} {done && i !== secIdx ? "✓" : s.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Section heading */}
          <div className="sec-heading">
            <div className="sec-name" style={{ color: SECTION_COLORS[SECTIONS[secIdx]] }}>
              {SECTION_ICONS[SECTIONS[secIdx]]} {SECTIONS[secIdx]}
            </div>
            <div className="sec-meta">Section {secIdx + 1} of {SECTIONS.length} · {secQs.length} questions</div>
          </div>

          {/* Questions */}
          {secQs.map(q => {
            const ans = answers[q.id];
            const needsAnswer = !ans && secAnswered > 0;
            return (
              <div
                key={q.id}
                className={`q-card${ans ? " answered" : ""}${needsAnswer ? " needs-answer" : ""}`}
              >
                <div className="q-num">
                  Q{q.id} of {QUESTIONS.length}
                  {needsAnswer ? " · ⚠ Needs answer" : ""}
                </div>
                <div className="q-text">{q.q}</div>
                <div className="q-opts">
                  {[{ v: "yes", l: "Yes ✓" }, { v: "unsure", l: "Unsure ?" }, { v: "no", l: "No ✗" }].map(o => (
                    <button
                      key={o.v}
                      className={`q-opt ${o.v}${ans === o.v ? " sel" : ""}`}
                      onClick={() => setAnswer(q.id, o.v)}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Nav */}
          <div className="nav-row">
            <button className="btn-back" onClick={goBack}>
              ← {secIdx === 0 ? "Home" : "Back"}
            </button>
            <div className="nav-status">
              {secDone
                ? <span style={{ color: "var(--green)" }}>✓ Complete</span>
                : `${secAnswered} / ${secQs.length} answered`}
            </div>
            <button className="btn-next" onClick={goNext} disabled={!secDone}>
              {isLast ? (secDone ? "View My Results →" : `${secQs.length - secAnswered} left`) : (secDone ? "Next →" : `${secQs.length - secAnswered} left`)}
            </button>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase === "results" && (
        <div className="results">
          <div className="results-eyebrow">
            Green Security Group{company ? ` · ${company}` : ""} · Risk Assessment Results
          </div>
          <div className="results-title">YOUR SECURITY<br />RISK REPORT</div>

          {/* Score card */}
          <div className="score-card">
            <div>
              <div className="score-num" style={{ color: risk.color }}>{pct}</div>
              <div className="score-label">Risk Score / 100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="risk-chip" style={{ background: risk.bg, color: risk.color }}>
                {risk.emoji} {risk.label} RISK
              </div>
              <div className="risk-desc">{risk.desc}</div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${pct}%`, background: risk.color }} />
              </div>
            </div>
          </div>

          {/* Section grid */}
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Risk by Category</div>
          <div className="section-grid">
            {SECTIONS.map(s => {
              const { score: sc, max: mx, pct: p } = getSectionScore(s, answers);
              const col = p >= 70 ? "#ef4444" : p >= 40 ? "#f59e0b" : "#22c55e";
              return (
                <div className="sec-card" key={s}>
                  <div className="sec-card-top">
                    <div className="sec-card-name">{SECTION_ICONS[s]} {s}</div>
                    <div className="sec-card-score" style={{ color: col }}>{sc}/{mx}</div>
                  </div>
                  <div className="sec-bar-track">
                    <div className="sec-bar-fill" style={{ width: `${p}%`, background: col }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Findings */}
          {findings.length > 0 && (
            <div className="findings-box">
              <div className="findings-title">⚠ Top Findings</div>
              {findings.map(q => (
                <div className="finding-row" key={q.id}>
                  <div className="finding-dot" style={{ background: answers[q.id] === "no" ? "#ef4444" : "#f59e0b" }} />
                  <div>
                    <div className="finding-cat" style={{ color: SECTION_COLORS[q.section] }}>{q.section}</div>
                    <div className="finding-text">{q.q}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Report cards */}
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>Get Your Report & Toolkit</div>
          <div className="report-grid">

            {/* Free */}
            <div className="report-card free">
              <div className="report-badge" style={{ color: "var(--muted)" }}>Free · Instant</div>
              <div className="report-title">Summary Report</div>
              <div className="report-desc">Your score, category breakdown, and top findings as a downloadable HTML file.</div>
              <div className="report-includes">
                {["Risk score & level","8-category breakdown","Top findings","Basic recommendations"].map(i => (
                  <div className="report-include-item" key={i}>
                    <span style={{ color: "var(--muted)" }}>✓</span> {i}
                  </div>
                ))}
              </div>
              <div className="report-price" style={{ color: "var(--green)" }}>FREE</div>
              <button className="btn-download free-btn" onClick={downloadFree}>
                Download Free Summary →
              </button>
            </div>

            {/* Professional Report */}
            <div className="report-card paid">
              <div className="report-badge" style={{ color: "var(--green)" }}>⚡ Professional · CISSP-Certified</div>
              <div className="report-title">Professional Report</div>
              <div className="report-desc">Full personalized report with step-by-step remediation for every finding, custom 90-day roadmap, and policy recommendations.</div>
              <div className="report-includes">
                {["Executive summary","Step-by-step fixes","Prioritized remediation","Custom 90-day roadmap","Policy recommendations","Signed by Paul Green, CISSP"].map(i => (
                  <div className="report-include-item" key={i}>
                    <span style={{ color: "var(--green)" }}>✓</span> {i}
                  </div>
                ))}
              </div>
              <div className="report-price" style={{ color: "var(--green)" }}>$97</div>
              <a
                href="https://greensecure.gumroad.com/l/jtrkdq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download paid-btn"
                style={{ marginBottom: 8 }}
              >
                Purchase on Gumroad — $97 →
              </a>
              <button
                className="btn-unlock"
                style={unlocked ? { background: "rgba(34,197,94,0.12)", borderColor: "#22c55e" } : {}}
                onClick={handlePaidClick}
              >
                {unlocked ? "⬇ Download My Report (Unlocked)" : "🔐 I Already Purchased — Enter Password"}
              </button>
              <div className="btn-note">
                {unlocked ? "✓ Unlocked for this session" : "Password sent in Gumroad receipt email"}
              </div>
            </div>

            {/* Security Toolkit */}
            <div className="report-card" style={{ background: "rgba(99,179,237,0.06)", border: "1px solid rgba(99,179,237,0.2)" }}>
              <div className="report-badge" style={{ color: "#63b3ed" }}>📦 5 Documents · Instant Download</div>
              <div className="report-title">Security Toolkit</div>
              <div className="report-desc">Everything you need to implement your security improvements — policies, risk register, roadmap, and guide included.</div>
              <div className="report-includes">
                {[
                  "20-page security guide",
                  "50-point risk checklist",
                  "Auto-scoring risk register (Excel)",
                  "3 policy templates (AUP, Password, IR)",
                  "90-day remediation roadmap",
                ].map(i => (
                  <div className="report-include-item" key={i}>
                    <span style={{ color: "#63b3ed" }}>✓</span> {i}
                  </div>
                ))}
              </div>
              <div className="report-price" style={{ color: "#63b3ed", marginBottom: 12 }}>$67</div>
              <a
                href="https://greensecure.gumroad.com/l/fmxotn"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
                style={{
                  display: "block", width: "100%", padding: "10px",
                  borderRadius: "6px", background: "#63b3ed", color: "#000",
                  fontWeight: 700, fontSize: 12, textAlign: "center",
                  textDecoration: "none", boxSizing: "border-box"
                }}
              >
                Get the Toolkit on Gumroad →
              </a>
              <div className="btn-note">Instant download · Use alongside this report</div>
            </div>
          </div>

          <button className="restart-btn" onClick={restart}>↺ Start New Assessment</button>
        </div>
      )}

      {/* FOOTER */}
      {phase !== "hero" && (
        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      )}
    </div>
  );
}
