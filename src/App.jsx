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
  { id: 9, section: "Access Control", q: "Does every user have a unique username and password?" },
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
  { id: 21, section: "Data Backup", q: "Are backups protected from ransomware?" },
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
  { id: 36, section: "Physical Security", q: "Are server rooms and network equipment locked?" },
  { id: 37, section: "Physical Security", q: "Do employees lock screens when leaving workstations?" },
  { id: 38, section: "Physical Security", q: "Is a clean desk policy enforced?" },
  { id: 39, section: "Physical Security", q: "Are visitor access logs maintained?" },
  { id: 40, section: "Physical Security", q: "Is there camera coverage of key areas?" },
  { id: 41, section: "Compliance", q: "Do you have a written Acceptable Use Policy signed by all staff?" },
  { id: 42, section: "Compliance", q: "Do you have a documented Incident Response Plan?" },
  { id: 43, section: "Compliance", q: "Do you have a written Password Policy?" },
  { id: 44, section: "Compliance", q: "Have you identified what personal data you collect and how it is stored?" },
  { id: 45, section: "Compliance", q: "Do vendor contracts include security requirements?" },
  { id: 46, section: "Compliance", q: "Have you reviewed PIPEDA or applicable privacy law obligations?" },
  { id: 47, section: "Compliance", q: "Do you conduct annual security risk assessments?" },
  { id: 48, section: "Compliance", q: "Is cybersecurity insurance in place?" },
  { id: 49, section: "Vendor Risk", q: "Do you maintain an inventory of all third-party software?" },
  { id: 50, section: "Vendor Risk", q: "Have key vendors been assessed for their security practices?" },
  { id: 51, section: "Vendor Risk", q: "Do vendor contracts include breach notification requirements?" },
  { id: 52, section: "Vendor Risk", q: "Is vendor access limited to only what they need?" },
];

const SECTIONS = [...new Set(QUESTIONS.map(q => q.section))];
const SECTION_ICONS = { "Network Security":"🌐","Access Control":"🔐","Data Backup":"💾","Email & Phishing":"📧","Endpoint Security":"💻","Physical Security":"🏢","Compliance":"📋","Vendor Risk":"🤝" };
const SECTION_COLORS = { "Network Security":"#3b82f6","Access Control":"#8b5cf6","Data Backup":"#10b981","Email & Phishing":"#f59e0b","Endpoint Security":"#ef4444","Physical Security":"#06b6d4","Compliance":"#ec4899","Vendor Risk":"#84cc16" };
const CERTS = ["CISSP","CySA+","SSCP","CSAP","CSIS","CIOS","Security+","Network+","A+","Project+","Linux Essentials","CC","ITIL Foundation"];

// No code system — report generates after email entry

function getRisk(score) {
  if (score >= 80) return { label:"CRITICAL", color:"#ef4444", bg:"rgba(239,68,68,0.1)", emoji:"🔴", desc:"Immediate action required. Your business faces serious breach exposure." };
  if (score >= 60) return { label:"HIGH",     color:"#f97316", bg:"rgba(249,115,22,0.1)", emoji:"🟠", desc:"Significant security gaps. Act within the next 60 days." };
  if (score >= 40) return { label:"MEDIUM",   color:"#f59e0b", bg:"rgba(245,158,11,0.1)", emoji:"🟡", desc:"Some controls in place but notable vulnerabilities remain." };
  if (score >= 20) return { label:"LOW",       color:"#22c55e", bg:"rgba(34,197,94,0.1)",  emoji:"🟢", desc:"Good foundation. Focus on closing the remaining gaps." };
  return               { label:"MINIMAL",   color:"#10b981", bg:"rgba(16,185,129,0.1)", emoji:"✅", desc:"Strong security posture. Keep it up and review annually." };
}

function secScore(section, answers) {
  const qs = QUESTIONS.filter(q => q.section === section);
  const score = qs.reduce((a,q) => a+(answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0),0);
  return { score, max:qs.length*2, pct:Math.round((score/(qs.length*2))*100) };
}

function generateFreeReport(company, answers, scorePct, risk) {
  const findings = QUESTIONS.filter(q => answers[q.id]==="no"||answers[q.id]==="unsure");
  const critical = findings.filter(q => answers[q.id]==="no");
  const warnings = findings.filter(q => answers[q.id]==="unsure");
  const date = new Date().toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});

  const sectionRows = SECTIONS.map(sec => {
    const {score,max,pct} = secScore(sec,answers);
    const level = pct>=70?"HIGH RISK":pct>=40?"MEDIUM RISK":"LOW RISK";
    const color = pct>=70?"#ef4444":pct>=40?"#f59e0b":"#22c55e";
    return `<tr>
      <td style="padding:10px 14px;font-weight:600;color:#1e293b;">${SECTION_ICONS[sec]} ${sec}</td>
      <td style="padding:10px 14px;text-align:center;font-weight:700;color:${color};">${score}/${max}</td>
      <td style="padding:10px 14px;text-align:center;"><span style="background:${color}20;color:${color};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">${level}</span></td>
      <td style="padding:10px 14px;"><div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${color};border-radius:4px;"></div></div></td>
    </tr>`;
  }).join("");

  const findingRows = findings.slice(0,15).map((q,i) => {
    const isNo = answers[q.id]==="no";
    return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
      <td style="padding:10px 14px;"><span style="background:${isNo?"#fef2f2":"#fffbeb"};color:${isNo?"#ef4444":"#f59e0b"};padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">${isNo?"FAILED":"REVIEW"}</span></td>
      <td style="padding:10px 14px;font-size:12px;color:#64748b;font-weight:600;">${q.section}</td>
      <td style="padding:10px 14px;font-size:12px;color:#1e293b;">${q.q}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GSG Security Report</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#1e293b;background:#fff}table{border-collapse:collapse;width:100%}th{background:#0b1628;color:#fff;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em}</style>
  </head><body><div style="max-width:800px;margin:0 auto;">
  <div style="background:#0b1628;padding:48px 40px;color:#fff;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:40px;height:40px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;">🛡</div>
      <div><div style="font-size:16px;font-weight:800;">Green Security Group</div><div style="font-size:10px;color:#22c55e;letter-spacing:0.1em;text-transform:uppercase;">Cybersecurity Risk Assessment</div></div>
    </div>
    <div style="font-size:11px;color:#22c55e;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">Confidential Security Report</div>
    <div style="font-size:36px;font-weight:800;line-height:1.1;margin-bottom:8px;">Cybersecurity Risk<br>Assessment Report</div>
    <div style="font-size:16px;color:#94a3b8;margin-bottom:32px;">${company||"Your Business"}</div>
    <div style="display:flex;gap:32px;flex-wrap:wrap;">
      <div><div style="font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:4px;">Prepared For</div><div style="font-size:14px;font-weight:600;">${company||"Business Owner"}</div></div>
      <div><div style="font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:4px;">Date</div><div style="font-size:14px;font-weight:600;">${date}</div></div>
      <div><div style="font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:4px;">Prepared By</div><div style="font-size:14px;font-weight:600;">Paul Green, CISSP</div></div>
      <div><div style="font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:4px;">Report Type</div><div style="font-size:14px;font-weight:600;color:#22c55e;">Free Summary Report</div></div>
    </div>
  </div>
  <div style="background:${risk.bg};border-left:4px solid ${risk.color};padding:24px 40px;display:flex;align-items:center;gap:32px;flex-wrap:wrap;">
    <div style="text-align:center;"><div style="font-size:72px;font-weight:800;color:${risk.color};line-height:1;">${scorePct}</div><div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Risk Score / 100</div></div>
    <div><div style="display:inline-flex;align-items:center;gap:8px;background:${risk.color}20;color:${risk.color};padding:6px 16px;border-radius:100px;font-weight:800;font-size:16px;margin-bottom:8px;">${risk.emoji} ${risk.label} RISK</div><div style="font-size:14px;color:#475569;line-height:1.6;max-width:400px;">${risk.desc}</div></div>
    <div style="margin-left:auto;text-align:center;"><div style="font-size:28px;font-weight:800;color:#ef4444;">${critical.length}</div><div style="font-size:11px;color:#64748b;text-transform:uppercase;">Failed</div><div style="font-size:28px;font-weight:800;color:#f59e0b;margin-top:8px;">${warnings.length}</div><div style="font-size:11px;color:#64748b;text-transform:uppercase;">Needs Review</div></div>
  </div>
  <div style="padding:32px 40px;"><div style="font-size:18px;font-weight:800;margin-bottom:16px;">Risk by Category</div><table><thead><tr><th>Category</th><th style="text-align:center;">Score</th><th style="text-align:center;">Level</th><th>Risk Bar</th></tr></thead><tbody>${sectionRows}</tbody></table></div>
  ${findings.length>0?`<div style="padding:0 40px 32px;"><div style="font-size:18px;font-weight:800;margin-bottom:16px;">⚠ Top Findings</div><table><thead><tr><th>Status</th><th>Category</th><th>Finding</th></tr></thead><tbody>${findingRows}</tbody></table></div>`:""}
  <div style="margin:0 40px 40px;background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:32px;text-align:center;">
    <div style="font-size:11px;color:#22c55e;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px;">Upgrade Available</div>
    <div style="font-size:24px;font-weight:800;margin-bottom:8px;color:#0b1628;">Get Your Full Professional Risk Report</div>
    <div style="font-size:14px;color:#64748b;max-width:480px;margin:0 auto 20px;line-height:1.7;">A personalized 15-page report generated specifically from your answers — every finding explained, every fix prioritized, custom 90-day roadmap.</div>
    <div style="font-size:36px;font-weight:800;color:#22c55e;margin-bottom:4px;">$97</div>
    <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">One-time · Delivered in 60 seconds</div>
    <div style="font-size:13px;color:#64748b;">Visit <strong>greensecuritygroup.com</strong> · Return to this site · Enter your email · Get your report</div>
  </div>
  <div style="background:#0b1628;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div style="color:#fff;font-weight:700;font-size:13px;">Green Security Group</div>
    <div style="color:#64748b;font-size:11px;">paul@greensecuritygroup.com · greensecuritygroup.com</div>
    <div style="color:#64748b;font-size:11px;">CISSP · CySA+ · SSCP · 13 Active Certs</div>
  </div>
  </div></body></html>`;
}

async function generateAIReport(company, answers, scorePct, risk) {
  const findings = QUESTIONS.filter(q => answers[q.id]==="no"||answers[q.id]==="unsure");
  const sectionSummary = SECTIONS.map(sec => {
    const {score,max} = secScore(sec,answers);
    const qs = QUESTIONS.filter(q => q.section===sec);
    const failed = qs.filter(q => answers[q.id]==="no").map(q=>q.q);
    const review = qs.filter(q => answers[q.id]==="unsure").map(q=>q.q);
    return `${sec} (${score}/${max} risk points):\nFailed: ${failed.length>0?failed.join("; "):"None"}\nNeeds Review: ${review.length>0?review.join("; "):"None"}`;
  }).join("\n\n");

  const prompt = `You are Paul Green, CISSP, founder of Green Security Group — a cybersecurity firm specializing in small business security. You have 10+ years of enterprise security experience and hold 13 active certifications including CISSP, CySA+, SSCP, Security+, Network+, and ITIL Foundation.

A small business has completed your cybersecurity risk assessment and purchased a personalized risk report. Generate a professional, detailed 15-page security report.

BUSINESS: ${company||"The Business"}
OVERALL RISK SCORE: ${scorePct}/100 — ${risk.label} RISK
TOTAL FINDINGS: ${findings.length} issues identified

DETAILED RESULTS BY CATEGORY:
${sectionSummary}

Write a comprehensive report with these sections:

## 1. EXECUTIVE SUMMARY
Two paragraphs speaking directly to the business owner. Use their company name. Reference their specific risk level and top 3 most critical findings. Be direct and clear about the urgency.

## 2. RISK SCORE ANALYSIS
Explain what their score of ${scorePct} means, how it compares to typical small businesses, and the immediate business implications.

## 3. CRITICAL FINDINGS & BUSINESS IMPACT
For each failed item, write 2-3 sentences explaining: what the risk is, what could realistically go wrong, and the potential business impact in dollars or operational terms.

## 4. SECTION-BY-SECTION ANALYSIS
For each of the 8 categories, one paragraph analyzing their performance, what is working, what is failing, and why it matters to their business.

## 5. PRIORITIZED REMEDIATION PLAN
Top 10 actions ranked by risk reduction impact. For each: what to do, how to do it step by step, estimated time, estimated cost, and expected risk reduction.

## 6. CUSTOM 90-DAY ROADMAP
Month by month plan based SPECIFICALLY on their failing items. Only include actions relevant to what they answered NO or UNSURE to.

## 7. POLICY RECOMMENDATIONS
Based on their compliance gaps, specify exactly which of the 3 policies they need most urgently (AUP, Password Policy, IR Plan) and what to prioritize.

## 8. CONCLUSION & NEXT STEPS
Strong closing paragraph. End with a personal recommendation signed as Paul Green, CISSP.

Be specific, direct, and practical. Use the business name throughout. Reference their actual failing items. This must feel genuinely personalized — because it is.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role:"user", content:prompt }]
    })
  });
  const data = await response.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#07090f;--bg2:#0d1117;--surface:#111827;--surf2:#1a2332;
    --green:#22c55e;--green2:#16a34a;
    --border:rgba(34,197,94,0.12);--border2:rgba(34,197,94,0.22);
    --text:#e8edf5;--muted:#6b7fa3;--dim:#2d3f58;
    --display:'Syne',sans-serif;--body:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace;
  }
  body{background:var(--bg);color:var(--text);font-family:var(--body);-webkit-font-smoothing:antialiased}
  .nav{position:sticky;top:0;z-index:100;background:rgba(7,9,15,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 28px}
  .logo{display:flex;align-items:center;gap:10px;cursor:pointer}
  .logo-shield{width:34px;height:34px;background:linear-gradient(135deg,var(--green2),var(--green));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
  .logo-name{font-family:var(--display);font-size:15px;font-weight:800;color:var(--text)}
  .logo-sub{font-family:var(--mono);font-size:9px;color:var(--green);letter-spacing:0.1em;text-transform:uppercase}
  .nav-btn{padding:8px 18px;border-radius:6px;background:var(--green);color:#000;font-family:var(--body);font-weight:600;font-size:13px;border:none;cursor:pointer;transition:all 0.2s}
  .nav-btn:hover{background:var(--green2);color:#fff}
  .hero{min-height:calc(100vh - 58px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 24px;text-align:center;position:relative;overflow:hidden}
  .hero-glow{position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:700px;height:500px;pointer-events:none;background:radial-gradient(ellipse,rgba(34,197,94,0.09) 0%,transparent 70%)}
  .pill{display:inline-flex;align-items:center;gap:7px;background:rgba(34,197,94,0.08);border:1px solid var(--border2);border-radius:100px;padding:5px 16px;font-family:var(--mono);font-size:10px;color:var(--green);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px}
  .pill-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 2s infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  .h-title{font-family:var(--display);font-size:clamp(44px,8vw,96px);font-weight:800;line-height:1;letter-spacing:0.01em;margin-bottom:20px}
  .h-title .g{color:var(--green)}.h-title .d{color:var(--dim)}
  .h-sub{font-size:16px;color:var(--muted);max-width:460px;line-height:1.75;margin:0 auto 36px;font-weight:300}
  .h-sub strong{color:var(--text);font-weight:500}
  .company-input{width:100%;max-width:340px;padding:12px 18px;border-radius:7px;background:var(--surface);border:1px solid var(--border2);color:var(--text);font-size:14px;font-family:var(--body);outline:none;text-align:center;margin-bottom:16px;transition:border-color 0.2s;display:block;margin-left:auto;margin-right:auto}
  .company-input:focus{border-color:rgba(34,197,94,0.45)}
  .company-input::placeholder{color:var(--dim)}
  .h-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:56px}
  .btn-p{display:inline-flex;align-items:center;gap:8px;background:var(--green);color:#000;font-family:var(--body);font-weight:700;font-size:14px;padding:14px 32px;border-radius:7px;border:none;cursor:pointer;transition:all 0.2s}
  .btn-p:hover{background:var(--green2);color:#fff;transform:translateY(-1px)}
  .btn-g{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--muted);font-family:var(--body);font-weight:500;font-size:14px;padding:14px 24px;border-radius:7px;border:1px solid var(--border2);cursor:pointer;transition:all 0.2s}
  .btn-g:hover{color:var(--text);border-color:rgba(34,197,94,0.35)}
  .metrics{display:flex;border:1px solid var(--border2);border-radius:10px;overflow:hidden;background:var(--surface)}
  .met{padding:18px 28px;text-align:center;border-right:1px solid var(--border)}
  .met:last-child{border-right:none}
  .met-v{font-family:var(--display);font-size:30px;font-weight:800;color:var(--green);line-height:1}
  .met-l{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:3px}
  .cert-strip{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2);padding:20px 24px;text-align:center}
  .cert-strip p{font-family:var(--mono);font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px}
  .cert-wrap{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
  .cert{padding:4px 12px;border-radius:100px;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:0.06em;border:1px solid var(--border2);color:var(--green);background:rgba(34,197,94,0.06)}
  .features{max-width:960px;margin:0 auto;padding:72px 24px}
  .feat-label{font-family:var(--mono);font-size:9px;color:var(--green);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:14px;text-align:center}
  .feat-title{font-family:var(--display);font-size:clamp(28px,4vw,46px);font-weight:800;text-align:center;margin-bottom:40px;line-height:1.1}
  .feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--border);border-radius:10px;overflow:hidden}
  .feat-card{background:var(--surface);padding:24px 20px}
  .feat-icon{font-size:26px;margin-bottom:12px}
  .feat-name{font-weight:600;font-size:14px;margin-bottom:7px;color:var(--text)}
  .feat-desc{font-size:12px;color:var(--muted);line-height:1.65}
  .assess{max-width:780px;margin:0 auto;padding:36px 24px 72px}
  .prog-wrap{margin-bottom:32px}
  .prog-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px}
  .prog-txt{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
  .prog-pct{font-family:var(--display);font-size:22px;font-weight:800;color:var(--green)}
  .prog-track{height:3px;background:var(--surf2);border-radius:3px}
  .prog-fill{height:100%;background:linear-gradient(90deg,var(--green2),var(--green));border-radius:3px;transition:width 0.4s ease}
  .sec-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:28px}
  .s-tab{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:5px;font-size:11px;font-weight:500;border:1px solid var(--border);background:var(--surface);color:var(--muted);cursor:pointer;transition:all 0.15s;font-family:var(--body)}
  .s-tab:hover{color:var(--text);border-color:var(--border2)}
  .s-tab.active{color:#fff;border-color:transparent}
  .s-tab.done{color:var(--green);border-color:rgba(34,197,94,0.2);background:rgba(34,197,94,0.06)}
  .sec-hd{margin-bottom:22px}
  .sec-hd-top{display:flex;align-items:center;gap:10px;margin-bottom:4px}
  .sec-name{font-family:var(--display);font-size:28px;font-weight:800;letter-spacing:0.02em}
  .sec-meta{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
  .q-card{background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:16px 18px;margin-bottom:8px;transition:border-color 0.15s}
  .q-card:hover{border-color:var(--border2)}
  .q-card.ans{border-color:rgba(34,197,94,0.18)}
  .q-id{font-family:var(--mono);font-size:9px;color:var(--dim);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.08em}
  .q-text{font-size:13px;line-height:1.6;color:var(--text);margin-bottom:13px}
  .q-opts{display:flex;gap:5px}
  .q-btn{flex:1;padding:8px 5px;border-radius:5px;border:1px solid var(--border);background:var(--surf2);color:var(--muted);font-size:11px;font-weight:600;font-family:var(--mono);text-transform:uppercase;letter-spacing:0.05em;cursor:pointer;transition:all 0.12s;text-align:center}
  .q-btn:hover{border-color:var(--border2);color:var(--text)}
  .q-btn.yes.sel{background:rgba(34,197,94,0.12);border-color:#22c55e;color:#22c55e}
  .q-btn.no.sel{background:rgba(239,68,68,0.12);border-color:#ef4444;color:#ef4444}
  .q-btn.unsure.sel{background:rgba(245,158,11,0.12);border-color:#f59e0b;color:#f59e0b}
  .nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:28px;gap:10px}
  .btn-back{padding:10px 20px;border-radius:6px;font-family:var(--body);font-weight:500;font-size:13px;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all 0.2s}
  .btn-back:hover{color:var(--text);border-color:var(--border2)}
  .btn-next{padding:10px 24px;border-radius:6px;font-family:var(--body);font-weight:700;font-size:13px;cursor:pointer;border:none;background:var(--green);color:#000;transition:all 0.2s}
  .btn-next:hover:not(:disabled){background:var(--green2);color:#fff;transform:translateY(-1px)}
  .btn-next:disabled{opacity:0.3;cursor:not-allowed}
  .nav-status{font-family:var(--mono);font-size:10px;color:var(--muted);text-align:center}
  .results{max-width:860px;margin:0 auto;padding:36px 24px 72px}
  .res-eyebrow{font-family:var(--mono);font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px}
  .res-title{font-family:var(--display);font-size:clamp(30px,5vw,46px);font-weight:800;letter-spacing:0.02em;margin-bottom:28px;line-height:1.05}
  .score-card{background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:36px;margin-bottom:20px;display:flex;align-items:center;gap:36px;flex-wrap:wrap}
  .score-l{text-align:center;min-width:140px}
  .score-big{font-family:var(--display);font-size:90px;font-weight:800;line-height:1}
  .score-of{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
  .score-r{flex:1;min-width:180px}
  .risk-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:100px;font-family:var(--display);font-size:18px;font-weight:800;letter-spacing:0.06em;margin-bottom:10px}
  .risk-desc{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:16px}
  .score-bar{height:5px;background:var(--surf2);border-radius:5px;overflow:hidden}
  .score-bar-fill{height:100%;border-radius:5px}
  .sec-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;margin-bottom:20px}
  .sec-res-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px}
  .src-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
  .src-name{font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:5px}
  .src-score{font-family:var(--mono);font-size:10px}
  .src-track{height:3px;background:var(--surf2);border-radius:3px;overflow:hidden}
  .src-fill{height:100%;border-radius:3px}
  .findings-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:20px}
  .findings-title{font-family:var(--display);font-size:22px;font-weight:800;letter-spacing:0.02em;margin-bottom:18px}
  .finding{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
  .finding:last-child{border-bottom:none}
  .f-dot{margin-top:5px;width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .f-cat{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px}
  .f-text{font-size:13px;color:var(--muted);line-height:1.6}
  .report-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
  .report-card{border-radius:14px;padding:28px;position:relative;overflow:hidden}
  .rc-free{background:var(--surface);border:1px solid var(--border)}
  .rc-paid{background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.04));border:1px solid var(--border2)}
  .rc-badge{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px}
  .rc-title{font-family:var(--display);font-size:22px;font-weight:800;margin-bottom:8px;line-height:1.1}
  .rc-desc{font-size:12px;color:var(--muted);line-height:1.65;margin-bottom:16px}
  .rc-includes{display:flex;flex-direction:column;gap:5px;margin-bottom:20px}
  .rc-item{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--text)}
  .rc-check{font-size:13px;flex-shrink:0}
  .rc-price{font-family:var(--display);font-size:32px;font-weight:800;margin-bottom:12px}
  .rc-btn{width:100%;padding:11px;border-radius:7px;font-family:var(--body);font-weight:700;font-size:13px;cursor:pointer;border:none;transition:all 0.2s;text-align:center}
  .rc-btn-free{background:var(--surf2);color:var(--text);border:1px solid var(--border2)}
  .rc-btn-free:hover{background:var(--surface);border-color:rgba(34,197,94,0.3)}
  .rc-btn-paid{background:var(--green);color:#000}
  .rc-btn-paid:hover{background:var(--green2);color:#fff;transform:translateY(-1px)}

  /* ── MODAL ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;padding:36px;max-width:460px;width:100%}
  .modal-title{font-family:var(--display);font-size:26px;font-weight:800;margin-bottom:8px;letter-spacing:0.02em}
  .modal-sub{font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.7}
  .modal-label{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;display:block}
  .modal-input{width:100%;padding:12px 16px;border-radius:7px;background:var(--surf2);border:1px solid var(--border2);color:var(--text);font-size:14px;font-family:var(--body);outline:none;margin-bottom:16px;transition:border-color 0.2s}
  .modal-input:focus{border-color:rgba(34,197,94,0.45)}
  .modal-input::placeholder{color:var(--dim)}
  .modal-input.error{border-color:#ef4444}
  .modal-error{font-size:12px;color:#ef4444;margin-top:-10px;margin-bottom:12px;font-family:var(--mono)}
  .modal-gumroad-link{display:flex;align-items:center;gap:8px;background:rgba(34,197,94,0.06);border:1px solid var(--border2);border-radius:7px;padding:12px 16px;margin-bottom:20px;text-decoration:none;cursor:pointer;transition:all 0.2s}
  .modal-gumroad-link:hover{border-color:rgba(34,197,94,0.35)}
  .modal-gumroad-text{font-size:13px;color:var(--text);font-weight:500}
  .modal-gumroad-sub{font-size:11px;color:var(--muted)}
  .modal-btns{display:flex;gap:10px}
  .modal-confirm{flex:1;padding:12px;border-radius:7px;background:var(--green);color:#000;font-family:var(--body);font-weight:700;font-size:14px;border:none;cursor:pointer;transition:all 0.2s}
  .modal-confirm:hover:not(:disabled){background:var(--green2);color:#fff}
  .modal-confirm:disabled{opacity:0.4;cursor:not-allowed}
  .modal-cancel{padding:12px 20px;border-radius:7px;background:transparent;color:var(--muted);font-family:var(--body);font-weight:500;font-size:14px;border:1px solid var(--border);cursor:pointer}
  .modal-cancel:hover{color:var(--text)}

  /* ── GENERATING ── */
  .generating{text-align:center;padding:72px 24px}
  .gen-icon{font-size:56px;margin-bottom:20px;display:block;animation:pulse 1.5s ease-in-out infinite}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.7}}
  .gen-title{font-family:var(--display);font-size:32px;font-weight:800;margin-bottom:10px;letter-spacing:0.02em}
  .gen-sub{font-size:14px;color:var(--muted);line-height:1.7;max-width:400px;margin:0 auto 32px}
  .gen-steps{display:flex;flex-direction:column;gap:8px;max-width:340px;margin:0 auto}
  .gen-step{display:flex;align-items:center;gap:12px;font-size:13px;padding:11px 16px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--muted);transition:all 0.3s}
  .gen-step.active{border-color:var(--border2);color:var(--green);background:rgba(34,197,94,0.06)}
  .gen-step.done{opacity:0.4}
  .gen-step-icon{width:20px;text-align:center;font-size:14px}

  /* ── RISK REPORT ── */
  .ai-report-wrap{background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:32px;margin-bottom:20px}
  .ai-report-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:12px}
  .ai-report-meta{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
  .ai-report-title{font-family:var(--display);font-size:22px;font-weight:800}
  .ai-report-body{font-size:13px;line-height:1.85;color:#94a3b8}
  .ai-report-body h2{font-family:var(--display);color:var(--text);font-size:18px;font-weight:800;letter-spacing:0.02em;margin:28px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--border)}
  .ai-report-body h2:first-child{margin-top:0}
  .download-btn{padding:10px 22px;border-radius:7px;background:var(--green);color:#000;font-family:var(--body);font-weight:700;font-size:13px;border:none;cursor:pointer;transition:all 0.2s}
  .download-btn:hover{background:var(--green2);color:#fff}

  .restart-btn{display:block;margin:28px auto 0;padding:9px 22px;border-radius:100px;background:transparent;border:1px solid var(--border);color:var(--dim);font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;transition:all 0.2s}
  .restart-btn:hover{color:var(--muted);border-color:var(--border2)}
  .footer{border-top:1px solid var(--border);padding:28px;text-align:center;background:var(--bg2)}
  .footer-name{font-family:var(--display);font-size:16px;font-weight:800;color:var(--muted);letter-spacing:0.04em;margin-bottom:6px}
  .footer-sub{font-family:var(--mono);font-size:9px;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em}
  @media(max-width:640px){
    .metrics{flex-direction:column}.met{border-right:none;border-bottom:1px solid var(--border)}.met:last-child{border-bottom:none}
    .score-card{flex-direction:column;text-align:center}.q-opts{flex-direction:column}
    .nav-row{flex-direction:column}.report-cards{grid-template-columns:1fr}
  }
`;

const GEN_STEPS = [
  { icon:"🔍", label:"Analyzing your 52 responses..." },
  { icon:"⚠️", label:"Identifying critical vulnerabilities..." },
  { icon:"🛠", label:"Building your remediation plan..." },
  { icon:"🗓", label:"Generating your 90-day roadmap..." },
  { icon:"📝", label:"Drafting executive recommendations..." },
  { icon:"✅", label:"Finalizing your personalized report..." },
];

export default function App() {
  const [phase, setPhase] = useState("hero");
  const [sec, setSec] = useState(0);
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [aiReport, setAiReport] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const answered = Object.keys(answers).length;
  const progress = Math.round((answered/QUESTIONS.length)*100);
  const secQs = QUESTIONS.filter(q=>q.section===SECTIONS[sec]);
  const secDone = secQs.every(q=>answers[q.id]);
  const isDone = (i) => QUESTIONS.filter(q=>q.section===SECTIONS[i]).every(q=>answers[q.id]);
  const totalScore = QUESTIONS.reduce((a,q)=>a+(answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0),0);
  const scorePct = Math.round((totalScore/(QUESTIONS.length*2))*100);
  const risk = getRisk(scorePct);
  const findings = QUESTIONS.filter(q=>answers[q.id]==="no"||answers[q.id]==="unsure").slice(0,8);

  const start = () => { setPhase("assessment"); setSec(0); window.scrollTo({top:0}); };
  const next = () => {
    if (sec<SECTIONS.length-1) { setSec(s=>s+1); window.scrollTo({top:0}); }
    else { setPhase("results"); window.scrollTo({top:0}); }
  };
  const back = () => {
    if (sec>0) { setSec(s=>s-1); window.scrollTo({top:0}); }
    else setPhase("hero");
  };
  const restart = () => { setPhase("hero"); setAnswers({}); setSec(0); setCompany(""); setAiReport(""); setEmail(""); };

  const downloadFreeReport = () => {
    const html = generateFreeReport(company, answers, scorePct, risk);
    const blob = new Blob([html],{type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`GSG-Risk-Report-${company||"YourBusiness"}-${new Date().toISOString().split("T")[0]}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setShowModal(false);
    setGenerating(true);
    setGenStep(0);
    window.scrollTo({top:0});

    for (let i=0; i<GEN_STEPS.length; i++) {
      setGenStep(i);
      await new Promise(r=>setTimeout(r,1400));
    }

    try {
      const report = await generateAIReport(company, answers, scorePct, risk);
      setAiReport(report);
      setGenerating(false);
      setPhase("aiReport");
      window.scrollTo({top:0});
    } catch(err) {
      setGenerating(false);
      alert("Report generation failed. Please email paul@greensecuritygroup.com and we will send your report manually.");
    }
  };

  const downloadAIReport = () => {
    const content = `GREEN SECURITY GROUP\nPERSONALIZED AI SECURITY REPORT\n${company?`Prepared for: ${company}\n`:""}Date: ${new Date().toLocaleDateString()}\nPrepared by: Paul Green, CISSP\nRisk Score: ${scorePct}/100 — ${risk.label} RISK\n\n${"═".repeat(60)}\n\n${aiReport}\n\n${"═".repeat(60)}\n© ${new Date().getFullYear()} Green Security Group\npaul@greensecuritygroup.com · greensecuritygroup.com\nCISSP · CySA+ · SSCP · 13 Active Certifications`;
    const blob = new Blob([content],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`GSG-Risk-Report-${company||"YourBusiness"}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo" onClick={()=>setPhase("hero")}>
          <div className="logo-shield">🛡</div>
          <div><div className="logo-name">Green Security Group</div><div className="logo-sub">Cybersecurity Risk Assessment</div></div>
        </div>
        <button className="nav-btn" onClick={start}>Start Free Assessment</button>
      </nav>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div style={{fontSize:32,marginBottom:12}}>📋</div>
            <div className="modal-title">Get Your Risk Report</div>
            <div className="modal-sub">
              Enter your email and your personalized 15-page cybersecurity risk report will be generated in under 60 seconds — built specifically from your assessment answers.
            </div>

            <div className="modal-gumroad-link" onClick={()=>window.open("https://greensecure.gumroad.com/l/jtrkdq","_blank")}>
              <span style={{fontSize:20}}>🛒</span>
              <div>
                <div className="modal-gumroad-text">Purchase Risk Report — $97</div>
                <div className="modal-gumroad-sub">Opens Gumroad · Then return here to generate your report</div>
              </div>
              <span style={{marginLeft:"auto",color:"var(--green)",fontSize:16}}>→</span>
            </div>

            <label className="modal-label">Your Email Address</label>
            <input className="modal-input" type="email" placeholder="your@email.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />

            <div style={{fontSize:11,color:"var(--dim)",fontFamily:"var(--mono)",marginBottom:20,lineHeight:1.7}}>
              By generating your report you confirm you have purchased<br/>
              the Green Security Group Risk Report on Gumroad.
            </div>

            <div className="modal-btns">
              <button className="modal-cancel" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="modal-confirm" onClick={handleSubmit}
                disabled={!email.includes("@")}>
                Generate My Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      {phase==="hero" && (<>
        <div className="hero">
          <div className="hero-glow" />
          <div className="pill"><span className="pill-dot" />Free Assessment · Professional Risk Reports · Instant Results</div>
          <h1 className="h-title">KNOW YOUR<br /><span className="g">RISK.</span><br /><span className="d">FIX IT FAST.</span></h1>
          <p className="h-sub">Get an instant cybersecurity risk score — then upgrade to a <strong>personalized risk report</strong> built from your specific answers by Paul Green, CISSP.</p>
          <input className="company-input" placeholder="Your company name (optional)" value={company} onChange={e=>setCompany(e.target.value)} onKeyDown={e=>e.key==="Enter"&&start()} />
          <div className="h-btns">
            <button className="btn-p" onClick={start}>Start Free Assessment →</button>
            <button className="btn-g" onClick={()=>window.open("mailto:paul@greensecuritygroup.com")}>Talk to an Expert</button>
          </div>
          <div className="metrics">
            {[["52","Questions"],["8","Risk Areas"],["FREE","Assessment"],["CISSP","Certified"]].map(([v,l])=>(
              <div className="met" key={l}><div className="met-v">{v}</div><div className="met-l">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="cert-strip">
          <p>Green Security Group · 13 Active Certifications</p>
          <div className="cert-wrap">{CERTS.map(c=><span className="cert" key={c}>{c}</span>)}</div>
        </div>
        <div className="features">
          <div className="feat-label">How It Works</div>
          <div className="feat-title">FREE ASSESSMENT.<br />PROFESSIONAL RISK REPORT.</div>
          <div className="feat-grid">
            {[
              ["🎯","Step 1: Free Assessment","Answer 52 questions across 8 security categories. Takes 5 minutes. No account required."],
              ["📊","Step 2: Instant Risk Score","See your 0–100 risk score, category breakdown, and top findings immediately."],
              ["📄","Step 3: Free Summary Report","Download a branded PDF with your score, findings, and basic recommendations — free."],
              ["📋","Step 4: Risk Report ($97)","Purchase on Gumroad, return here, enter your email and get your personalized 15-page risk report in 60 seconds."],
              ["🛡️","CISSP-Certified","Every report built on frameworks by Paul Green — 13 certifications, 10+ years enterprise experience."],
              ["⚡","Instant Delivery","Free report downloads immediately. Full risk report generated in under 60 seconds."],
            ].map(([icon,name,desc])=>(
              <div className="feat-card" key={name}><div className="feat-icon">{icon}</div><div className="feat-name">{name}</div><div className="feat-desc">{desc}</div></div>
            ))}
          </div>
        </div>
        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      </>)}

      {/* ══ ASSESSMENT ══ */}
      {phase==="assessment" && (
        <div className="assess">
          <div className="prog-wrap">
            <div className="prog-top"><span className="prog-txt">{answered} / {QUESTIONS.length} answered</span><span className="prog-pct">{progress}%</span></div>
            <div className="prog-track"><div className="prog-fill" style={{width:`${progress}%`}} /></div>
          </div>
          <div className="sec-tabs">
            {SECTIONS.map((s,i)=>(
              <button key={s} className={`s-tab ${i===sec?"active":""} ${isDone(i)&&i!==sec?"done":""}`}
                style={i===sec?{background:SECTION_COLORS[s],borderColor:SECTION_COLORS[s]}:{}}
                onClick={()=>setSec(i)}>
                {SECTION_ICONS[s]} {isDone(i)&&i!==sec?"✓":s.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="sec-hd">
            <div className="sec-hd-top">
              <span style={{fontSize:22}}>{SECTION_ICONS[SECTIONS[sec]]}</span>
              <span className="sec-name" style={{color:SECTION_COLORS[SECTIONS[sec]]}}>{SECTIONS[sec]}</span>
            </div>
            <div className="sec-meta">Section {sec+1} of {SECTIONS.length} · {secQs.length} questions</div>
          </div>
          {secQs.map(q=>(
            <div className={`q-card ${answers[q.id]?"ans":""}`} key={q.id}>
              <div className="q-id">Q{q.id} of {QUESTIONS.length}</div>
              <div className="q-text">{q.q}</div>
              <div className="q-opts">
                {[{v:"yes",l:"Yes ✓"},{v:"unsure",l:"Unsure ?"},{v:"no",l:"No ✗"}].map(o=>(
                  <button key={o.v} className={`q-btn ${o.v} ${answers[q.id]===o.v?"sel":""}`}
                    onClick={()=>setAnswers(p=>({...p,[q.id]:o.v}))}>{o.l}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="nav-row">
            <button className="btn-back" onClick={back}>← {sec===0?"Home":"Back"}</button>
            <div className="nav-status">{secDone?<span style={{color:"var(--green)"}}>✓ Section complete</span>:`${secQs.filter(q=>answers[q.id]).length} / ${secQs.length} answered`}</div>
            <button className="btn-next" onClick={next} disabled={!secDone}>{sec<SECTIONS.length-1?"Next Section →":"View My Results →"}</button>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase==="results" && (
        <div className="results">
          <div className="res-eyebrow">Green Security Group · {company?`${company} · `:""}Risk Assessment Report</div>
          <div className="res-title">YOUR SECURITY<br />RISK REPORT</div>
          <div className="score-card">
            <div className="score-l"><div className="score-big" style={{color:risk.color}}>{scorePct}</div><div className="score-of">Risk Score / 100</div></div>
            <div className="score-r">
              <div className="risk-chip" style={{background:risk.bg,color:risk.color}}>{risk.emoji} {risk.label} RISK</div>
              <div className="risk-desc">{risk.desc}</div>
              <div className="score-bar"><div className="score-bar-fill" style={{width:`${scorePct}%`,background:risk.color}} /></div>
            </div>
          </div>
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"0.02em",marginBottom:12}}>RISK BY CATEGORY</div>
          <div className="sec-results">
            {SECTIONS.map(s=>{
              const {score,max,pct}=secScore(s,answers);
              const col=pct>=70?"#ef4444":pct>=40?"#f59e0b":"#22c55e";
              return (<div className="sec-res-card" key={s}>
                <div className="src-top"><div className="src-name">{SECTION_ICONS[s]} {s}</div><div className="src-score" style={{color:col}}>{score}/{max}</div></div>
                <div className="src-track"><div className="src-fill" style={{width:`${pct}%`,background:col}} /></div>
              </div>);
            })}
          </div>
          {findings.length>0&&(
            <div className="findings-card">
              <div className="findings-title">⚠ TOP FINDINGS</div>
              {findings.map(q=>(
                <div className="finding" key={q.id}>
                  <div className="f-dot" style={{background:answers[q.id]==="no"?"#ef4444":"#f59e0b"}} />
                  <div><div className="f-cat" style={{color:SECTION_COLORS[q.section]}}>{q.section}</div><div className="f-text">{q.q}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* REPORT CARDS */}
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"0.02em",marginBottom:16}}>GET YOUR REPORT</div>
          <div className="report-cards">
            <div className="report-card rc-free">
              <div className="rc-badge" style={{color:"var(--muted)"}}>Free · Instant Download</div>
              <div className="rc-title">Summary Report</div>
              <div className="rc-desc">Your risk score, category breakdown, and top findings in a branded PDF — ready to download right now.</div>
              <div className="rc-includes">
                {["Risk score & overall level","8-category breakdown","Top findings list","Basic recommendations","Branded PDF format"].map(i=>(
                  <div className="rc-item" key={i}><span className="rc-check" style={{color:"var(--muted)"}}>✓</span>{i}</div>
                ))}
              </div>
              <div className="rc-price" style={{color:"var(--green)"}}>FREE</div>
              <button className="rc-btn rc-btn-free" onClick={downloadFreeReport}>Download Free Report →</button>
            </div>
            <div className="report-card rc-paid">
              <div className="rc-badge" style={{color:"var(--green)"}}>⚡ Professional · Fully Personalized</div>
              <div className="rc-title">Full Risk Report</div>
              <div className="rc-desc">A 15-page report written specifically for your business specifically from your answers. Purchase on Gumroad, return here, enter your email and your report is generated in 60 seconds.</div>
              <div className="rc-includes">
                {["Executive summary for your business","Every finding explained in detail","Prioritized remediation plan","Custom 90-day roadmap","Policy recommendations","Signed by Paul Green, CISSP"].map(i=>(
                  <div className="rc-item" key={i}><span className="rc-check" style={{color:"var(--green)"}}>✓</span>{i}</div>
                ))}
              </div>
              <div className="rc-price" style={{color:"var(--green)"}}>$97</div>
              <button className="rc-btn rc-btn-paid" onClick={()=>setShowModal(true)}>Get My Risk Report →</button>
              <div style={{textAlign:"center",marginTop:10}}>
                <span style={{fontSize:11,color:"var(--muted)",cursor:"pointer",textDecoration:"underline"}}
                  onClick={()=>window.open("https://greensecure.gumroad.com/l/jtrkdq","_blank")}>
                  Purchase on Gumroad first →
                </span>
              </div>
            </div>
          </div>
          <button className="restart-btn" onClick={restart}>↺ Start New Assessment</button>
        </div>
      )}

      {/* ══ GENERATING ══ */}
      {generating && (
        <div className="results">
          <div style={{textAlign:"center",padding:"72px 24px"}}>
            <span className="gen-icon">📋</span>
            <div className="gen-title">Preparing Your Risk Report</div>
            <div className="gen-sub">Our system is analyzing your responses and building a personalized report for {company||"your business"}...</div>
            <div className="gen-steps">
              {GEN_STEPS.map((step,i)=>(
                <div key={i} className={`gen-step ${i===genStep?"active":""} ${i<genStep?"done":""}`}>
                  <span className="gen-step-icon">{i<genStep?"✓":i===genStep?step.icon:"○"}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ RISK REPORT ══ */}
      {phase==="aiReport"&&aiReport&&(
        <div className="results">
          <div className="res-eyebrow">Green Security Group · Professional Risk Report</div>
          <div className="res-title">YOUR PROFESSIONAL<br />SECURITY REPORT</div>
          <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:10,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20}}>✅</span>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--green)"}}>Report Generated Successfully</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>Personalized for {company||"your business"} · {new Date().toLocaleDateString()} · Paul Green, CISSP</div>
            </div>
          </div>
          <div className="ai-report-wrap">
            <div className="ai-report-hd">
              <div>
                <div className="ai-report-title">📋 Your Personalized Security Report</div>
                <div className="ai-report-meta">Green Security Group · CISSP-Certified · {new Date().toLocaleDateString()}</div>
              </div>
              <button className="download-btn" onClick={downloadAIReport}>Download ↓</button>
            </div>
            <div className="ai-report-body" dangerouslySetInnerHTML={{__html:aiReport.replace(/\n\n/g,"<br/><br/>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h2>$1</h2>")}} />
          </div>
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:28,textAlign:"center",marginBottom:20}}>
            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Next Step</div>
            <div style={{fontFamily:"var(--display)",fontSize:22,fontWeight:800,marginBottom:8}}>GET THE FULL TOOLKIT</div>
            <div style={{fontSize:13,color:"var(--muted)",maxWidth:420,margin:"0 auto 20px",lineHeight:1.7}}>Your risk report identifies the gaps. The Green Security Group toolkit gives you the policy templates, risk register, and 90-day roadmap to fix them.</div>
            <button className="rc-btn rc-btn-paid" style={{maxWidth:280,margin:"0 auto",display:"block"}}
              onClick={()=>window.open("https://greensecure.gumroad.com/l/fmxotn","_blank")}>Get the Full Toolkit — $67 →</button>
          </div>
          <button className="restart-btn" onClick={restart}>↺ Start New Assessment</button>
        </div>
      )}

      {phase!=="hero"&&!generating&&(
        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      )}
    </div>
  );
}
