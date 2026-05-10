import { useState } from "react";

const QUESTIONS = [
  { id: 1, section: "Network Security", q: "Do you have a firewall protecting your network perimeter?" },
  { id: 2, section: "Network Security", q: "Is your Wi-Fi protected with WPA2 or WPA3 encryption?" },
  { id: 3, section: "Network Security", q: "Do you have a separate guest Wi-Fi network for visitors?" },
  { id: 4, section: "Network Security", q: "Are remote connections secured with a VPN?" },
  { id: 5, section: "Network Security", q: "Do you monitor network traffic for unusual activity?" },
  { id: 6, section: "Network Security", q: "Is your router firmware kept up to date?" },
  { id: 7, section: "Network Security", q: "Are unused network ports disabled?" },
  { id: 8, section: "Network Security", q: "Do you have network segmentation separating critical systems?" },
  { id: 9, section: "Access Control", q: "Does every user have a unique username and password (no shared accounts)?" },
  { id: 10, section: "Access Control", q: "Is MFA enabled on all email accounts?" },
  { id: 11, section: "Access Control", q: "Is MFA enabled on all cloud services?" },
  { id: 12, section: "Access Control", q: "Do you have a formal process to remove access when staff leave?" },
  { id: 13, section: "Access Control", q: "Are admin accounts used only when necessary?" },
  { id: 14, section: "Access Control", q: "Do you enforce passwords of 12+ characters minimum?" },
  { id: 15, section: "Access Control", q: "Is a password manager used across the organization?" },
  { id: 16, section: "Access Control", q: "Do you review user access levels at least quarterly?" },
  { id: 17, section: "Data Backup", q: "Are critical business files backed up at least daily?" },
  { id: 18, section: "Data Backup", q: "Are backups stored offsite or in the cloud?" },
  { id: 19, section: "Data Backup", q: "Have you tested backup restoration in the last 6 months?" },
  { id: 20, section: "Data Backup", q: "Are backups encrypted to protect sensitive data?" },
  { id: 21, section: "Data Backup", q: "Are backups protected from ransomware (offline or immutable)?" },
  { id: 22, section: "Data Backup", q: "Do you have a documented recovery time objective?" },
  { id: 23, section: "Email & Phishing", q: "Do you use email filtering to block spam and phishing?" },
  { id: 24, section: "Email & Phishing", q: "Have all staff received phishing awareness training in the last 12 months?" },
  { id: 25, section: "Email & Phishing", q: "Is your email domain protected with SPF, DKIM, and DMARC?" },
  { id: 26, section: "Email & Phishing", q: "Do you have a process for staff to report suspicious emails?" },
  { id: 27, section: "Email & Phishing", q: "Are financial transactions verified via a second channel?" },
  { id: 28, section: "Email & Phishing", q: "Do you scan email attachments for malware before opening?" },
  { id: 29, section: "Endpoint Security", q: "Is antivirus or EDR software installed on all company devices?" },
  { id: 30, section: "Endpoint Security", q: "Are all operating systems set to receive automatic updates?" },
  { id: 31, section: "Endpoint Security", q: "Are all applications kept patched and up to date?" },
  { id: 32, section: "Endpoint Security", q: "Are company devices encrypted (BitLocker / FileVault)?" },
  { id: 33, section: "Endpoint Security", q: "Is there a policy governing personal device use for work?" },
  { id: 34, section: "Endpoint Security", q: "Are mobile devices enrolled in an MDM solution?" },
  { id: 35, section: "Endpoint Security", q: "Are USB ports restricted on sensitive systems?" },
  { id: 36, section: "Physical Security", q: "Are server rooms and network equipment locked and access-controlled?" },
  { id: 37, section: "Physical Security", q: "Do employees lock screens when leaving workstations unattended?" },
  { id: 38, section: "Physical Security", q: "Is a clean desk policy enforced?" },
  { id: 39, section: "Physical Security", q: "Are visitor access logs maintained?" },
  { id: 40, section: "Physical Security", q: "Is there camera coverage of key areas?" },
  { id: 41, section: "Compliance", q: "Do you have a written Acceptable Use Policy signed by all staff?" },
  { id: 42, section: "Compliance", q: "Do you have a documented Incident Response Plan?" },
  { id: 43, section: "Compliance", q: "Do you have a written Password Policy?" },
  { id: 44, section: "Compliance", q: "Have you identified what personal data you collect and how it is stored?" },
  { id: 45, section: "Compliance", q: "Do vendor contracts include security and data protection requirements?" },
  { id: 46, section: "Compliance", q: "Have you reviewed PIPEDA or applicable privacy law obligations?" },
  { id: 47, section: "Compliance", q: "Do you conduct annual security risk assessments?" },
  { id: 48, section: "Compliance", q: "Is cybersecurity insurance in place?" },
  { id: 49, section: "Vendor Risk", q: "Do you maintain an inventory of all third-party software and services?" },
  { id: 50, section: "Vendor Risk", q: "Have key vendors been assessed for their security practices?" },
  { id: 51, section: "Vendor Risk", q: "Do vendor contracts include breach notification requirements?" },
  { id: 52, section: "Vendor Risk", q: "Is vendor access limited to only what they need?" },
];

const SECTIONS = [...new Set(QUESTIONS.map(q => q.section))];

const SECTION_ICONS = {
  "Network Security": "🌐", "Access Control": "🔐", "Data Backup": "💾",
  "Email & Phishing": "📧", "Endpoint Security": "💻", "Physical Security": "🏢",
  "Compliance": "📋", "Vendor Risk": "🤝",
};

const SECTION_COLORS = {
  "Network Security": "#3b82f6", "Access Control": "#8b5cf6", "Data Backup": "#10b981",
  "Email & Phishing": "#f59e0b", "Endpoint Security": "#ef4444", "Physical Security": "#06b6d4",
  "Compliance": "#ec4899", "Vendor Risk": "#84cc16",
};

const CERTS = ["CISSP","CySA+","SSCP","CSAP","CSIS","CIOS","Security+","Network+","A+","Project+","Linux Essentials","CC","ITIL Foundation"];

function getRisk(score) {
  if (score >= 80) return { label:"CRITICAL", color:"#ef4444", bg:"rgba(239,68,68,0.1)", emoji:"🔴", desc:"Immediate action required. Your business faces serious breach exposure right now." };
  if (score >= 60) return { label:"HIGH",     color:"#f97316", bg:"rgba(249,115,22,0.1)", emoji:"🟠", desc:"Significant security gaps exist. You need to act within the next 60 days." };
  if (score >= 40) return { label:"MEDIUM",   color:"#f59e0b", bg:"rgba(245,158,11,0.1)", emoji:"🟡", desc:"Some controls are in place but notable vulnerabilities remain." };
  if (score >= 20) return { label:"LOW",       color:"#22c55e", bg:"rgba(34,197,94,0.1)",  emoji:"🟢", desc:"Good security foundation in place. Focus on closing the remaining gaps." };
  return               { label:"MINIMAL",   color:"#10b981", bg:"rgba(16,185,129,0.1)", emoji:"✅", desc:"Strong security posture. Keep it up and review annually." };
}

function secScore(section, answers) {
  const qs = QUESTIONS.filter(q => q.section === section);
  const score = qs.reduce((a, q) => a + (answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0), 0);
  return { score, max: qs.length * 2, pct: Math.round((score / (qs.length * 2)) * 100) };
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#07090f;--bg2:#0d1117;--surface:#111827;--surf2:#1a2332;
    --green:#22c55e;--green2:#16a34a;--border:rgba(34,197,94,0.12);--border2:rgba(34,197,94,0.22);
    --text:#e8edf5;--muted:#6b7fa3;--dim:#2d3f58;
    --display:'Syne',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
  }
  body{background:var(--bg);color:var(--text);font-family:var(--body);-webkit-font-smoothing:antialiased}

  /* NAV */
  .nav{position:sticky;top:0;z-index:100;background:rgba(7,9,15,0.95);backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);height:58px;display:flex;align-items:center;
    justify-content:space-between;padding:0 28px}
  .logo{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none}
  .logo-shield{width:34px;height:34px;background:linear-gradient(135deg,var(--green2),var(--green));
    border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
  .logo-text{line-height:1.15}
  .logo-name{font-family:var(--display);font-size:15px;font-weight:800;color:var(--text);letter-spacing:0.02em}
  .logo-sub{font-family:var(--mono);font-size:9px;color:var(--green);letter-spacing:0.1em;text-transform:uppercase}
  .nav-btn{padding:8px 18px;border-radius:6px;background:var(--green);color:#000;
    font-family:var(--body);font-weight:600;font-size:13px;border:none;cursor:pointer;transition:all 0.2s}
  .nav-btn:hover{background:var(--green2);color:#fff}

  /* HERO */
  .hero{min-height:calc(100vh - 58px);display:flex;flex-direction:column;align-items:center;
    justify-content:center;padding:72px 24px;text-align:center;position:relative;overflow:hidden}
  .hero-glow{position:absolute;top:-150px;left:50%;transform:translateX(-50%);
    width:700px;height:500px;pointer-events:none;
    background:radial-gradient(ellipse,rgba(34,197,94,0.09) 0%,transparent 70%)}
  .pill{display:inline-flex;align-items:center;gap:7px;background:rgba(34,197,94,0.08);
    border:1px solid var(--border2);border-radius:100px;padding:5px 16px;
    font-family:var(--mono);font-size:10px;color:var(--green);letter-spacing:0.1em;
    text-transform:uppercase;margin-bottom:28px}
  .pill-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 2s infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}

  .h-title{font-family:var(--display);font-size:clamp(44px,8vw,96px);font-weight:800;
    line-height:1;letter-spacing:0.01em;margin-bottom:20px}
  .h-title .g{color:var(--green)}.h-title .d{color:var(--dim)}
  .h-sub{font-size:16px;color:var(--muted);max-width:460px;line-height:1.75;margin:0 auto 36px;font-weight:300}
  .h-sub strong{color:var(--text);font-weight:500}

  .company-input{width:100%;max-width:340px;padding:12px 18px;border-radius:7px;
    background:var(--surface);border:1px solid var(--border2);color:var(--text);
    font-size:14px;font-family:var(--body);outline:none;text-align:center;margin-bottom:16px;
    transition:border-color 0.2s;display:block;margin-left:auto;margin-right:auto}
  .company-input:focus{border-color:rgba(34,197,94,0.45)}
  .company-input::placeholder{color:var(--dim)}

  .h-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:56px}
  .btn-p{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:#000;
    font-family:var(--body);font-weight:700;font-size:14px;padding:14px 32px;
    border-radius:7px;border:none;cursor:pointer;transition:all 0.2s}
  .btn-p:hover{background:var(--green2);color:#fff;transform:translateY(-1px);box-shadow:0 6px 24px rgba(34,197,94,0.3)}
  .btn-g{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--muted);
    font-family:var(--body);font-weight:500;font-size:14px;padding:14px 24px;
    border-radius:7px;border:1px solid var(--border2);cursor:pointer;transition:all 0.2s}
  .btn-g:hover{color:var(--text);border-color:rgba(34,197,94,0.35)}

  .metrics{display:flex;border:1px solid var(--border2);border-radius:10px;overflow:hidden;background:var(--surface)}
  .met{padding:18px 28px;text-align:center;border-right:1px solid var(--border)}
  .met:last-child{border-right:none}
  .met-v{font-family:var(--display);font-size:30px;font-weight:800;color:var(--green);line-height:1}
  .met-l{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:3px}

  /* CERT STRIP */
  .cert-strip{border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    background:var(--bg2);padding:20px 24px;text-align:center}
  .cert-strip p{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;
    letter-spacing:0.1em;margin-bottom:14px}
  .cert-wrap{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
  .cert{padding:4px 12px;border-radius:100px;font-family:var(--mono);font-size:9px;
    font-weight:500;letter-spacing:0.06em;border:1px solid var(--border2);
    color:var(--green);background:rgba(34,197,94,0.06)}

  /* FEATURES */
  .features{max-width:960px;margin:0 auto;padding:72px 24px}
  .feat-label{font-family:var(--mono);font-size:9px;color:var(--green);text-transform:uppercase;
    letter-spacing:0.12em;margin-bottom:14px;text-align:center}
  .feat-title{font-family:var(--display);font-size:clamp(28px,4vw,46px);font-weight:800;
    text-align:center;margin-bottom:40px;line-height:1.1}
  .feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:1px;background:var(--border);border-radius:10px;overflow:hidden}
  .feat-card{background:var(--surface);padding:24px 20px}
  .feat-icon{font-size:26px;margin-bottom:12px}
  .feat-name{font-weight:600;font-size:14px;margin-bottom:7px;color:var(--text)}
  .feat-desc{font-size:12px;color:var(--muted);line-height:1.65}

  /* ASSESSMENT */
  .assess{max-width:780px;margin:0 auto;padding:36px 24px 72px}

  .prog-wrap{margin-bottom:32px}
  .prog-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px}
  .prog-txt{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
  .prog-pct{font-family:var(--display);font-size:22px;font-weight:800;color:var(--green)}
  .prog-track{height:3px;background:var(--surf2);border-radius:3px}
  .prog-fill{height:100%;background:linear-gradient(90deg,var(--green2),var(--green));border-radius:3px;transition:width 0.4s ease}

  .sec-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:28px}
  .s-tab{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:5px;
    font-size:11px;font-weight:500;border:1px solid var(--border);background:var(--surface);
    color:var(--muted);cursor:pointer;transition:all 0.15s;font-family:var(--body)}
  .s-tab:hover{color:var(--text);border-color:var(--border2)}
  .s-tab.active{color:#fff;border-color:transparent}
  .s-tab.done{color:var(--green);border-color:rgba(34,197,94,0.2);background:rgba(34,197,94,0.06)}

  .sec-hd{margin-bottom:22px}
  .sec-hd-top{display:flex;align-items:center;gap:10px;margin-bottom:4px}
  .sec-icon{font-size:22px}
  .sec-name{font-family:var(--display);font-size:28px;font-weight:800;letter-spacing:0.02em}
  .sec-meta{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}

  .q-card{background:var(--surface);border:1px solid var(--border);border-radius:9px;
    padding:16px 18px;margin-bottom:8px;transition:border-color 0.15s}
  .q-card:hover{border-color:var(--border2)}
  .q-card.ans{border-color:rgba(34,197,94,0.18)}
  .q-id{font-family:var(--mono);font-size:9px;color:var(--dim);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.08em}
  .q-text{font-size:13px;line-height:1.6;color:var(--text);margin-bottom:13px;font-weight:400}
  .q-opts{display:flex;gap:5px}
  .q-btn{flex:1;padding:8px 5px;border-radius:5px;border:1px solid var(--border);
    background:var(--surf2);color:var(--muted);font-size:11px;font-weight:600;
    font-family:var(--mono);text-transform:uppercase;letter-spacing:0.05em;
    cursor:pointer;transition:all 0.12s;text-align:center}
  .q-btn:hover{border-color:var(--border2);color:var(--text)}
  .q-btn.yes.sel{background:rgba(34,197,94,0.12);border-color:#22c55e;color:#22c55e}
  .q-btn.no.sel{background:rgba(239,68,68,0.12);border-color:#ef4444;color:#ef4444}
  .q-btn.unsure.sel{background:rgba(245,158,11,0.12);border-color:#f59e0b;color:#f59e0b}

  .nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:28px;gap:10px}
  .btn-back{padding:10px 20px;border-radius:6px;font-family:var(--body);font-weight:500;
    font-size:13px;cursor:pointer;border:1px solid var(--border);background:transparent;
    color:var(--muted);transition:all 0.2s}
  .btn-back:hover{color:var(--text);border-color:var(--border2)}
  .btn-next{padding:10px 24px;border-radius:6px;font-family:var(--body);font-weight:700;
    font-size:13px;cursor:pointer;border:none;background:var(--green);color:#000;transition:all 0.2s}
  .btn-next:hover:not(:disabled){background:var(--green2);color:#fff;transform:translateY(-1px)}
  .btn-next:disabled{opacity:0.3;cursor:not-allowed}
  .nav-status{font-family:var(--mono);font-size:10px;color:var(--muted);text-align:center}

  /* RESULTS */
  .results{max-width:820px;margin:0 auto;padding:36px 24px 72px}
  .res-eyebrow{font-family:var(--mono);font-size:10px;color:var(--green);text-transform:uppercase;
    letter-spacing:0.1em;margin-bottom:6px}
  .res-title{font-family:var(--display);font-size:clamp(30px,5vw,46px);font-weight:800;
    letter-spacing:0.02em;margin-bottom:28px;line-height:1.05}

  .score-card{background:var(--surface);border:1px solid var(--border2);border-radius:14px;
    padding:36px;margin-bottom:20px;display:flex;align-items:center;gap:36px;flex-wrap:wrap}
  .score-l{text-align:center;min-width:140px}
  .score-big{font-family:var(--display);font-size:90px;font-weight:800;line-height:1;letter-spacing:0.02em}
  .score-of{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
  .score-r{flex:1;min-width:180px}
  .risk-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:100px;
    font-family:var(--display);font-size:18px;font-weight:800;letter-spacing:0.06em;margin-bottom:10px}
  .risk-desc{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:16px}
  .score-bar{height:5px;background:var(--surf2);border-radius:5px;overflow:hidden}
  .score-bar-fill{height:100%;border-radius:5px;transition:width 1s ease}

  .sec-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-bottom:20px}
  .sec-res-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px}
  .src-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
  .src-name{font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:5px}
  .src-score{font-family:var(--mono);font-size:10px}
  .src-track{height:3px;background:var(--surf2);border-radius:3px;overflow:hidden}
  .src-fill{height:100%;border-radius:3px}

  .findings-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;
    padding:24px;margin-bottom:20px}
  .findings-title{font-family:var(--display);font-size:22px;font-weight:800;letter-spacing:0.02em;margin-bottom:18px}
  .finding{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
  .finding:last-child{border-bottom:none}
  .f-dot{margin-top:5px;width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .f-cat{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px}
  .f-text{font-size:13px;color:var(--muted);line-height:1.6}

  .upsell{background:linear-gradient(135deg,rgba(34,197,94,0.07),rgba(34,197,94,0.03));
    border:1px solid var(--border2);border-radius:14px;padding:36px;text-align:center}
  .upsell-ey{font-family:var(--mono);font-size:9px;color:var(--green);text-transform:uppercase;
    letter-spacing:0.12em;margin-bottom:14px}
  .upsell-title{font-family:var(--display);font-size:clamp(24px,4vw,36px);font-weight:800;
    letter-spacing:0.02em;margin-bottom:10px;line-height:1.1}
  .upsell-sub{font-size:13px;color:var(--muted);max-width:440px;margin:0 auto 24px;line-height:1.7}
  .upsell-list{display:flex;flex-direction:column;gap:7px;max-width:360px;margin:0 auto 28px;text-align:left}
  .upsell-item{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text)}
  .u-check{color:var(--green);font-size:15px;flex-shrink:0}
  .upsell-price{font-family:var(--display);font-size:52px;font-weight:800;color:var(--green);
    letter-spacing:0.02em;margin-bottom:3px}
  .upsell-price-note{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;
    letter-spacing:0.08em;margin-bottom:22px}
  .upsell-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .btn-buy{padding:13px 32px;border-radius:7px;font-family:var(--body);font-weight:700;
    font-size:14px;cursor:pointer;border:none;background:var(--green);color:#000;transition:all 0.2s}
  .btn-buy:hover{background:var(--green2);color:#fff;transform:translateY(-1px);box-shadow:0 6px 24px rgba(34,197,94,0.3)}
  .btn-contact{padding:13px 24px;border-radius:7px;font-family:var(--body);font-weight:500;
    font-size:14px;cursor:pointer;background:transparent;border:1px solid var(--border2);
    color:var(--muted);transition:all 0.2s}
  .btn-contact:hover{color:var(--text);border-color:rgba(34,197,94,0.3)}
  .upsell-trust{font-family:var(--mono);font-size:9px;color:var(--dim);text-transform:uppercase;
    letter-spacing:0.08em;margin-top:18px}

  .restart-btn{display:block;margin:28px auto 0;padding:9px 22px;border-radius:100px;
    background:transparent;border:1px solid var(--border);color:var(--dim);
    font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;
    cursor:pointer;transition:all 0.2s}
  .restart-btn:hover{color:var(--muted);border-color:var(--border2)}

  /* FOOTER */
  .footer{border-top:1px solid var(--border);padding:28px;text-align:center;background:var(--bg2)}
  .footer-name{font-family:var(--display);font-size:16px;font-weight:800;color:var(--muted);
    letter-spacing:0.04em;margin-bottom:6px}
  .footer-sub{font-family:var(--mono);font-size:9px;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em}

  @media(max-width:600px){
    .metrics{flex-direction:column}
    .met{border-right:none;border-bottom:1px solid var(--border)}
    .met:last-child{border-bottom:none}
    .score-card{flex-direction:column;text-align:center}
    .q-opts{flex-direction:column}
    .nav-row{flex-direction:column}
    .upsell-btns{flex-direction:column;align-items:center}
  }
`;

export default function App() {
  const [phase, setPhase] = useState("hero");
  const [sec, setSec] = useState(0);
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState("");

  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);
  const secQs = QUESTIONS.filter(q => q.section === SECTIONS[sec]);
  const secDone = secQs.every(q => answers[q.id]);
  const isDone = (i) => QUESTIONS.filter(q => q.section === SECTIONS[i]).every(q => answers[q.id]);

  const totalScore = QUESTIONS.reduce((a, q) => a + (answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0), 0);
  const scorePct = Math.round((totalScore / (QUESTIONS.length * 2)) * 100);
  const risk = getRisk(scorePct);
  const findings = QUESTIONS.filter(q => answers[q.id]==="no"||answers[q.id]==="unsure").slice(0, 8);

  const start = () => { setPhase("assessment"); setSec(0); window.scrollTo({ top: 0 }); };
  const next = () => {
    if (sec < SECTIONS.length - 1) { setSec(s => s+1); window.scrollTo({ top: 0 }); }
    else { setPhase("results"); window.scrollTo({ top: 0 }); }
  };
  const back = () => {
    if (sec > 0) { setSec(s => s-1); window.scrollTo({ top: 0 }); }
    else setPhase("hero");
  };
  const restart = () => { setPhase("hero"); setAnswers({}); setSec(0); setCompany(""); };
  const setAns = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  return (
    <div>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo" onClick={() => setPhase("hero")}>
          <div className="logo-shield">🛡</div>
          <div className="logo-text">
            <div className="logo-name">Green Security Group</div>
            <div className="logo-sub">Cybersecurity Risk Assessment</div>
          </div>
        </div>
        <button className="nav-btn" onClick={start}>Start Free Assessment</button>
      </nav>

      {/* ══ HERO ══ */}
      {phase === "hero" && (<>
        <div className="hero">
          <div className="hero-glow" />
          <div className="pill"><span className="pill-dot" />Free · No Account Required · Instant Results</div>
          <h1 className="h-title">
            KNOW YOUR<br />
            <span className="g">RISK.</span><br />
            <span className="d">FIX IT FAST.</span>
          </h1>
          <p className="h-sub">
            Get an instant cybersecurity risk score across 8 critical areas — built by <strong>Paul Green, CISSP</strong> with 10+ years of enterprise security experience.
          </p>
          <input className="company-input" placeholder="Your company name (optional)"
            value={company} onChange={e => setCompany(e.target.value)}
            onKeyDown={e => e.key==="Enter" && start()} />
          <div className="h-btns">
            <button className="btn-p" onClick={start}>Start Free Assessment →</button>
            <button className="btn-g" onClick={() => window.open("mailto:paul@greensecuritygroup.com")}>Talk to an Expert</button>
          </div>
          <div className="metrics">
            {[["52","Questions"],["8","Risk Areas"],["5 MIN","To Complete"],["FREE","Results"]].map(([v,l]) => (
              <div className="met" key={l}><div className="met-v">{v}</div><div className="met-l">{l}</div></div>
            ))}
          </div>
        </div>

        <div className="cert-strip">
          <p>Green Security Group · 13 Active Certifications</p>
          <div className="cert-wrap">{CERTS.map(c => <span className="cert" key={c}>{c}</span>)}</div>
        </div>

        <div className="features">
          <div className="feat-label">What You Get</div>
          <div className="feat-title">ENTERPRISE SECURITY KNOWLEDGE.<br />SMALL BUSINESS PRICE.</div>
          <div className="feat-grid">
            {[
              ["🎯","Instant Risk Score","Get a scored risk assessment across 8 security areas the moment you finish."],
              ["🔍","Top Findings","Your highest-risk gaps ranked by severity — know exactly where to start."],
              ["📊","Category Breakdown","Visual breakdown across all 8 areas. Spot your weakest points at a glance."],
              ["🛡️","CISSP-Certified","Built by Paul Green — 13 active certifications, 10+ years enterprise experience."],
              ["📋","Full Toolkit Available","Upgrade for policies, risk register, and a 90-day remediation plan — $67."],
              ["⚡","Takes 5 Minutes","52 questions. No technical knowledge needed. Just answer honestly."],
            ].map(([icon,name,desc]) => (
              <div className="feat-card" key={name}>
                <div className="feat-icon">{icon}</div>
                <div className="feat-name">{name}</div>
                <div className="feat-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      </>)}

      {/* ══ ASSESSMENT ══ */}
      {phase === "assessment" && (
        <div className="assess">
          <div className="prog-wrap">
            <div className="prog-top">
              <span className="prog-txt">{answered} / {QUESTIONS.length} answered</span>
              <span className="prog-pct">{progress}%</span>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width:`${progress}%` }} /></div>
          </div>

          <div className="sec-tabs">
            {SECTIONS.map((s, i) => (
              <button key={s}
                className={`s-tab ${i===sec?"active":""} ${isDone(i)&&i!==sec?"done":""}`}
                style={i===sec?{background:SECTION_COLORS[s],borderColor:SECTION_COLORS[s]}:{}}
                onClick={() => setSec(i)}>
                {SECTION_ICONS[s]} {isDone(i)&&i!==sec?"✓":s.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="sec-hd">
            <div className="sec-hd-top">
              <span className="sec-icon">{SECTION_ICONS[SECTIONS[sec]]}</span>
              <span className="sec-name" style={{ color: SECTION_COLORS[SECTIONS[sec]] }}>{SECTIONS[sec]}</span>
            </div>
            <div className="sec-meta">Section {sec+1} of {SECTIONS.length} · {secQs.length} questions</div>
          </div>

          {secQs.map(q => (
            <div className={`q-card ${answers[q.id]?"ans":""}`} key={q.id}>
              <div className="q-id">Q{q.id} of {QUESTIONS.length}</div>
              <div className="q-text">{q.q}</div>
              <div className="q-opts">
                {[{v:"yes",l:"Yes ✓"},{v:"unsure",l:"Unsure ?"},{v:"no",l:"No ✗"}].map(o => (
                  <button key={o.v} className={`q-btn ${o.v} ${answers[q.id]===o.v?"sel":""}`}
                    onClick={() => setAns(q.id, o.v)}>{o.l}</button>
                ))}
              </div>
            </div>
          ))}

          <div className="nav-row">
            <button className="btn-back" onClick={back}>← {sec===0?"Home":"Back"}</button>
            <div className="nav-status">
              {secDone
                ? <span style={{color:"var(--green)"}}>✓ Section complete</span>
                : `${secQs.filter(q=>answers[q.id]).length} / ${secQs.length} answered`}
            </div>
            <button className="btn-next" onClick={next} disabled={!secDone}>
              {sec < SECTIONS.length-1 ? "Next Section →" : "View My Results →"}
            </button>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase === "results" && (
        <div className="results">
          <div className="res-eyebrow">
            Green Security Group · {company ? `${company} · ` : ""}Risk Assessment Report
          </div>
          <div className="res-title">YOUR SECURITY<br />RISK REPORT</div>

          {/* Score */}
          <div className="score-card">
            <div className="score-l">
              <div className="score-big" style={{color:risk.color}}>{scorePct}</div>
              <div className="score-of">Risk Score / 100</div>
            </div>
            <div className="score-r">
              <div className="risk-chip" style={{background:risk.bg,color:risk.color}}>
                {risk.emoji} {risk.label} RISK
              </div>
              <div className="risk-desc">{risk.desc}</div>
              <div className="score-bar">
                <div className="score-bar-fill" style={{width:`${scorePct}%`,background:risk.color}} />
              </div>
            </div>
          </div>

          {/* Section breakdown */}
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"0.02em",marginBottom:12}}>
            RISK BY CATEGORY
          </div>
          <div className="sec-results">
            {SECTIONS.map(s => {
              const {score,max,pct} = secScore(s, answers);
              const col = pct>=70?"#ef4444":pct>=40?"#f59e0b":"#22c55e";
              return (
                <div className="sec-res-card" key={s}>
                  <div className="src-top">
                    <div className="src-name">{SECTION_ICONS[s]} {s}</div>
                    <div className="src-score" style={{color:col}}>{score}/{max}</div>
                  </div>
                  <div className="src-track"><div className="src-fill" style={{width:`${pct}%`,background:col}} /></div>
                </div>
              );
            })}
          </div>

          {/* Findings */}
          {findings.length > 0 && (
            <div className="findings-card">
              <div className="findings-title">⚠ TOP FINDINGS</div>
              {findings.map(q => (
                <div className="finding" key={q.id}>
                  <div className="f-dot" style={{background:answers[q.id]==="no"?"#ef4444":"#f59e0b"}} />
                  <div>
                    <div className="f-cat" style={{color:SECTION_COLORS[q.section]}}>{q.section}</div>
                    <div className="f-text">{q.q}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upsell */}
          <div className="upsell">
            <div className="upsell-ey">Green Security Group · Full Security Toolkit</div>
            <div className="upsell-title">GET YOUR COMPLETE<br />REMEDIATION PLAN</div>
            <div className="upsell-sub">
              Everything a security consultant would charge $2,000+ to deliver — packaged into one instant download by a CISSP-certified engineer.
            </div>
            <div className="upsell-list">
              {["20-page plain-English security guide","50-point risk assessment checklist (printable)",
                "Auto-scoring Excel risk register","3 ready-to-use policy templates (AUP, Password, IR Plan)",
                "90-day step-by-step remediation roadmap"].map(item => (
                <div className="upsell-item" key={item}>
                  <span className="u-check">✓</span><span>{item}</span>
                </div>
              ))}
            </div>
            <div className="upsell-price">$67</div>
            <div className="upsell-price-note">One-time · Instant download · No subscription</div>
            <div className="upsell-btns">
              <button className="btn-buy" onClick={() => window.open("https://gumroad.com","_blank")}>
                Get the Full Toolkit →
              </button>
              <button className="btn-contact" onClick={() => window.open("mailto:paul@greensecuritygroup.com")}>
                Talk to Paul (CISSP)
              </button>
            </div>
            <div className="upsell-trust">
              Green Security Group · CISSP · CySA+ · SSCP · 13 Active Certifications · paul@greensecuritygroup.com
            </div>
          </div>

          <button className="restart-btn" onClick={restart}>↺ Start New Assessment</button>
        </div>
      )}

      {phase !== "hero" && (
        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      )}
    </div>
  );
}
