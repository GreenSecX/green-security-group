import { useState, useEffect } from "react";

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

function getRisk(score) {
  if (score >= 80) return { label:"CRITICAL", color:"#ef4444", bg:"rgba(239,68,68,0.1)", emoji:"🔴", desc:"Immediate action required. Your business faces serious breach exposure." };
  if (score >= 60) return { label:"HIGH",     color:"#f97316", bg:"rgba(249,115,22,0.1)", emoji:"🟠", desc:"Significant security gaps exist. Act within the next 60 days." };
  if (score >= 40) return { label:"MEDIUM",   color:"#f59e0b", bg:"rgba(245,158,11,0.1)", emoji:"🟡", desc:"Some controls in place but notable vulnerabilities remain." };
  if (score >= 20) return { label:"LOW",       color:"#22c55e", bg:"rgba(34,197,94,0.1)",  emoji:"🟢", desc:"Good foundation. Focus on closing the remaining gaps." };
  return               { label:"MINIMAL",   color:"#10b981", bg:"rgba(16,185,129,0.1)", emoji:"✅", desc:"Strong security posture. Keep it up and review annually." };
}

function secScore(section, answers) {
  const qs = QUESTIONS.filter(q => q.section === section);
  const score = qs.reduce((a,q) => a+(answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0),0);
  return { score, max:qs.length*2, pct:Math.round((score/(qs.length*2))*100) };
}

// ── REMEDIATION ADVICE PER QUESTION ─────────────────────────────────────────
const REMEDIATION = {
  1:  { action:"Install a business-grade firewall", how:"Purchase a Cisco Meraki MX or Fortinet FortiGate. Configure basic inbound/outbound rules blocking all unused ports.", time:"1–2 days", cost:"$300–$800/yr", priority:"CRITICAL" },
  2:  { action:"Enable WPA3 or WPA2 encryption on all Wi-Fi", how:"Log into your router admin panel. Navigate to Wireless Security settings. Select WPA3-Personal or WPA2-AES. Set a strong 20+ character passphrase.", time:"30 minutes", cost:"Free", priority:"CRITICAL" },
  3:  { action:"Create a separate guest Wi-Fi network", how:"In your router admin panel, enable Guest Network. Give it a different SSID and password. Ensure it cannot access your main network (enable client isolation).", time:"30 minutes", cost:"Free", priority:"HIGH" },
  4:  { action:"Deploy a VPN for all remote connections", how:"Set up NordLayer, Cisco AnyConnect, or OpenVPN. Require all staff connecting remotely to use VPN before accessing company resources.", time:"1–3 days", cost:"$8–$15/user/mo", priority:"HIGH" },
  5:  { action:"Implement basic network monitoring", how:"Deploy a free tool like Wireshark for occasional checks, or SolarWinds for continuous monitoring. Set alerts for unusual traffic volumes.", time:"1–2 days", cost:"Free–$100/mo", priority:"MEDIUM" },
  6:  { action:"Update all router and switch firmware", how:"Log into each network device admin panel. Check the manufacturer website for latest firmware. Download and apply updates. Schedule quarterly checks.", time:"2–4 hours", cost:"Free", priority:"HIGH" },
  7:  { action:"Disable all unused network ports", how:"Access your managed switch admin panel. Identify ports with no connected devices. Disable them in the port configuration settings.", time:"1–2 hours", cost:"Free", priority:"MEDIUM" },
  8:  { action:"Implement basic network segmentation", how:"Create separate VLANs for servers, workstations, and IoT devices. Configure your managed switch to enforce VLAN separation. Restrict inter-VLAN routing.", time:"1–3 days", cost:"$200–$500 for managed switch", priority:"HIGH" },
  9:  { action:"Enforce unique credentials for every user", how:"Audit all accounts and remove shared logins. Create individual accounts for each user. Deploy a password manager (Bitwarden, 1Password) to manage unique passwords.", time:"1 day", cost:"$3–$5/user/mo", priority:"CRITICAL" },
  10: { action:"Enable MFA on all email accounts", how:"In Microsoft 365 or Google Workspace admin, enable MFA enforcement for all users. Require authenticator app (not SMS). Roll out to all staff.", time:"1–2 hours", cost:"Free", priority:"CRITICAL" },
  11: { action:"Enable MFA on all cloud services", how:"Audit all cloud services your business uses. Enable MFA in each platform's security settings. Use an authenticator app like Microsoft Authenticator or Google Authenticator.", time:"2–4 hours", cost:"Free", priority:"CRITICAL" },
  12: { action:"Create a formal offboarding security checklist", how:"Document a step-by-step process: disable email, revoke VPN access, remove from all systems, change shared passwords, collect devices. Run this for every departing employee within 24 hours.", time:"2–3 hours to create", cost:"Free", priority:"HIGH" },
  13: { action:"Enforce least-privilege access for admin accounts", how:"Create separate admin and standard user accounts for each IT person. Use standard accounts for daily tasks. Only switch to admin when performing specific administrative tasks.", time:"1 day", cost:"Free", priority:"HIGH" },
  14: { action:"Enforce minimum 14-character password policy", how:"In Active Directory Group Policy or your identity provider, set minimum password length to 14 characters. Enable complexity requirements. Communicate the change to all staff.", time:"2–4 hours", cost:"Free", priority:"HIGH" },
  15: { action:"Deploy a company-wide password manager", how:"Choose Bitwarden (free), 1Password ($3/user/mo), or Dashlane. Set up a business account. Import existing passwords. Train all staff. Require use for all new accounts.", time:"1–2 days", cost:"$0–$5/user/mo", priority:"HIGH" },
  16: { action:"Schedule quarterly access reviews", how:"Create a spreadsheet listing every user and their access levels. Review quarterly. Remove access for roles that no longer need it. Document each review.", time:"2–4 hours quarterly", cost:"Free", priority:"MEDIUM" },
  17: { action:"Implement automated daily backups", how:"Use Veeam, Acronis, or Windows Server Backup. Configure automated daily backups of all critical data. Verify backups are completing successfully via daily email reports.", time:"1–2 days", cost:"$50–$200/mo", priority:"CRITICAL" },
  18: { action:"Store backups offsite or in the cloud", how:"Configure Veeam or Acronis to replicate backups to AWS S3, Azure Blob, or Backblaze. Ensure backups are geographically separate from primary systems.", time:"1 day", cost:"$5–$50/mo", priority:"CRITICAL" },
  19: { action:"Test backup restoration immediately", how:"Schedule a restoration test today. Restore a sample of files from backup to a test location. Verify data integrity. Document the test results. Repeat monthly.", time:"2–4 hours", cost:"Free", priority:"CRITICAL" },
  20: { action:"Enable encryption for all backups", how:"In your backup software settings, enable AES-256 encryption. Set a strong encryption passphrase. Store the passphrase securely in your password manager.", time:"1–2 hours", cost:"Free", priority:"HIGH" },
  21: { action:"Protect backups from ransomware", how:"Enable immutable backup storage (S3 Object Lock or Backblaze immutable). Maintain at least one offline backup disconnected from the network. Follow the 3-2-1 rule: 3 copies, 2 media types, 1 offsite.", time:"1–2 days", cost:"$10–$50/mo", priority:"CRITICAL" },
  22: { action:"Document your recovery time objective (RTO)", how:"Define how long your business can survive without each critical system. Document target recovery times. Ensure your backup solution can meet those targets. Test quarterly.", time:"2–3 hours", cost:"Free", priority:"MEDIUM" },
  23: { action:"Deploy email filtering and anti-phishing", how:"Enable Microsoft Defender for Office 365 or Google Workspace's built-in protection. Add a third-party layer like Proofpoint or Mimecast. Configure spam and phishing policies.", time:"1 day", cost:"$2–$10/user/mo", priority:"HIGH" },
  24: { action:"Schedule phishing awareness training for all staff", how:"Sign up for KnowBe4 (free trial) or Proofpoint Security Awareness. Run a baseline phishing simulation. Deliver training to everyone who fails. Repeat quarterly.", time:"1 week to set up", cost:"$15–$30/user/yr", priority:"HIGH" },
  25: { action:"Configure SPF, DKIM, and DMARC for your email domain", how:"Log into your DNS provider. Add SPF record (v=spf1 include:yourmailprovider ~all). Enable DKIM in your email platform. Add DMARC record (v=DMARC1; p=quarantine). Use MXToolbox to verify.", time:"2–4 hours", cost:"Free", priority:"HIGH" },
  26: { action:"Create a suspicious email reporting process", how:"Set up a dedicated email address (security@yourcompany.com) for reporting. Install the Microsoft Report Message or Google Phishing Report button. Train staff to report rather than delete.", time:"1–2 hours", cost:"Free", priority:"MEDIUM" },
  27: { action:"Implement financial transaction verification", how:"Establish a policy requiring phone verification for all wire transfers over $500. Never approve financial requests received only by email. Verify using a known number, not one in the email.", time:"1–2 hours to create policy", cost:"Free", priority:"CRITICAL" },
  28: { action:"Enable attachment scanning on all email", how:"In Microsoft 365, enable Safe Attachments policy in Defender. In Google Workspace, enable Enhanced Safe Browsing. Configure to scan all attachments before delivery.", time:"1–2 hours", cost:"Free–$2/user/mo", priority:"HIGH" },
  29: { action:"Deploy EDR on all company devices", how:"Choose CrowdStrike Falcon Go, SentinelOne, or Microsoft Defender for Business. Deploy agent to all Windows and Mac devices. Configure real-time monitoring and automatic threat response.", time:"1–2 days", cost:"$3–$8/device/mo", priority:"CRITICAL" },
  30: { action:"Enable automatic OS updates on all devices", how:"In Windows, enable Windows Update and set to automatic. On Mac, enable automatic updates in System Settings. For servers, configure Windows Server Update Services (WSUS) or equivalent.", time:"1–2 hours", cost:"Free", priority:"HIGH" },
  31: { action:"Implement application patch management", how:"Audit all installed software. Enable automatic updates where available. For software without auto-update, create a monthly patching schedule. Use Ninite for bulk updates on Windows.", time:"1 day", cost:"Free–$50/mo", priority:"HIGH" },
  32: { action:"Enable full disk encryption on all laptops", how:"On Windows, enable BitLocker (Settings > Privacy & Security > Device Encryption). On Mac, enable FileVault (System Settings > Privacy & Security > FileVault). Store recovery keys in your password manager.", time:"2–4 hours", cost:"Free", priority:"HIGH" },
  33: { action:"Create a Bring Your Own Device (BYOD) policy", how:"Define which personal devices can access company data. Require MDM enrollment for all personal devices accessing company email. Document acceptable use and security requirements.", time:"2–3 hours", cost:"Free", priority:"MEDIUM" },
  34: { action:"Deploy Mobile Device Management (MDM)", how:"Set up Microsoft Intune, Jamf, or Kandji. Enroll all company and BYOD devices. Configure policies: screen lock, encryption, remote wipe. Enforce compliance before granting access.", time:"2–5 days", cost:"$6–$12/device/mo", priority:"MEDIUM" },
  35: { action:"Restrict USB ports on sensitive systems", how:"In Windows Group Policy, configure Device Installation Restrictions to block removable storage. On individual machines, use Endpoint Protector or CrowdStrike's USB control feature.", time:"2–4 hours", cost:"Free–$5/device/mo", priority:"MEDIUM" },
  36: { action:"Secure all server rooms and network equipment", how:"Install a keyed lock on any room containing servers or network equipment. Maintain a log of who has access. Review access quarterly. Add a basic IP camera if budget allows.", time:"1 day", cost:"$50–$500", priority:"HIGH" },
  37: { action:"Enforce screen lock policy", how:"Set Group Policy or MDM policy to lock screens after 5 minutes of inactivity. Require password or PIN to unlock. Train staff to manually lock screens (Windows+L) when leaving desks.", time:"1–2 hours", cost:"Free", priority:"MEDIUM" },
  38: { action:"Implement a clean desk policy", how:"Create a written policy: no sensitive documents left on desks, whiteboards cleared after meetings, physical documents locked in drawers. Conduct occasional spot checks.", time:"1–2 hours to write", cost:"Free", priority:"LOW" },
  39: { action:"Implement visitor access logging", how:"Create a simple visitor sign-in sheet or use a digital visitor management tool like Envoy (free tier available). Record name, company, host, time in/out, purpose of visit.", time:"1–2 hours", cost:"Free", priority:"LOW" },
  40: { action:"Install security cameras in key areas", how:"Place cameras at entry/exit points, server room, and reception. Use a cloud-managed system like Verkada or Arlo Business. Retain footage for minimum 30 days.", time:"1–2 days", cost:"$200–$1,000", priority:"MEDIUM" },
  41: { action:"Create and distribute an Acceptable Use Policy", how:"Use the AUP template in your Green Security Group Toolkit. Add your company name. Have legal review if you handle regulated data. Require all staff to read and sign. Keep signed copies on file.", time:"2–4 hours", cost:"Free with toolkit", priority:"HIGH" },
  42: { action:"Create an Incident Response Plan", how:"Use the IR Plan template in your Green Security Group Toolkit. Fill in your team contacts, escalation paths, and communication procedures. Run a tabletop exercise to test it.", time:"4–8 hours", cost:"Free with toolkit", priority:"HIGH" },
  43: { action:"Create and enforce a Password Policy", how:"Use the Password Policy template in your Green Security Group Toolkit. Add your company name and chosen password manager. Distribute to all staff and collect signatures.", time:"1–2 hours", cost:"Free with toolkit", priority:"HIGH" },
  44: { action:"Complete a data inventory and mapping exercise", how:"Document every type of personal data you collect (names, emails, payment info, health data). Record where it is stored, who has access, and how long you retain it. Review annually.", time:"1–2 days", cost:"Free", priority:"HIGH" },
  45: { action:"Add security clauses to all vendor contracts", how:"Review all active vendor contracts. Add data protection addendums requiring: breach notification within 72 hours, data encryption, and access limitations. Include in all new contracts going forward.", time:"1–2 days", cost:"Free–$500 legal review", priority:"MEDIUM" },
  46: { action:"Review your PIPEDA obligations", how:"Visit the Office of the Privacy Commissioner of Canada website. Assess whether you are subject to PIPEDA. Identify what personal information you collect and your obligations. Consider a privacy lawyer consultation.", time:"Half day", cost:"Free–$500 legal consult", priority:"HIGH" },
  47: { action:"Schedule an annual security risk assessment", how:"Use this Green Security Group toolkit annually. Set a recurring calendar reminder. Update your risk register with new findings. Track improvement in your score year over year.", time:"3–4 hours annually", cost:"Free with toolkit", priority:"MEDIUM" },
  48: { action:"Obtain cybersecurity insurance", how:"Contact your business insurance broker. Request a cyber liability policy. Typical coverage: breach response costs, business interruption, liability. Compare at least 3 quotes. Expect $1,000–$5,000/yr for small businesses.", time:"1–2 weeks", cost:"$1,000–$5,000/yr", priority:"HIGH" },
  49: { action:"Create a vendor and software inventory", how:"Create a spreadsheet listing every third-party software, SaaS tool, and service provider your business uses. Include: vendor name, purpose, data accessed, contract renewal date, and security contact.", time:"Half day", cost:"Free", priority:"MEDIUM" },
  50: { action:"Assess key vendor security practices", how:"Send your top 5 vendors a security questionnaire. Ask about: data encryption, breach notification procedures, SOC 2 compliance, employee security training, and incident response. Keep responses on file.", time:"1–2 days", cost:"Free", priority:"MEDIUM" },
  51: { action:"Add breach notification clauses to vendor contracts", how:"Review all vendor contracts. Add a clause requiring notification within 72 hours of any breach involving your data. Include this requirement in all new vendor agreements.", time:"1 day", cost:"Free–$500 legal review", priority:"HIGH" },
  52: { action:"Enforce least-privilege access for all vendors", how:"Audit what access each vendor currently has. Remove any access that is not actively needed for their service. Create dedicated vendor accounts with limited permissions. Review quarterly.", time:"Half day", cost:"Free", priority:"HIGH" },
};

// ── FULL REPORT GENERATOR ────────────────────────────────────────────────────
function buildFullReport(company, answers, scorePct, risk) {
  const biz = company || "Your Business";
  const date = new Date().toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" });
  const failed = QUESTIONS.filter(q => answers[q.id] === "no");
  const unsure = QUESTIONS.filter(q => answers[q.id] === "unsure");
  const passed = QUESTIONS.filter(q => answers[q.id] === "yes");
  const allIssues = [...failed, ...unsure];

  // Top 10 priority actions
  const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const top10 = allIssues
    .map(q => ({ q, rem: REMEDIATION[q.id] }))
    .filter(x => x.rem)
    .sort((a, b) => (priorityOrder[a.rem.priority] || 3) - (priorityOrder[b.rem.priority] || 3))
    .slice(0, 10);

  // Section analysis
  const sectionData = SECTIONS.map(sec => {
    const { score, max, pct } = secScore(sec, answers);
    const qs = QUESTIONS.filter(q => q.section === sec);
    const secFailed = qs.filter(q => answers[q.id] === "no");
    const secUnsure = qs.filter(q => answers[q.id] === "unsure");
    const level = pct >= 70 ? "HIGH RISK" : pct >= 40 ? "MEDIUM RISK" : "LOW RISK";
    const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : "#22c55e";
    return { sec, score, max, pct, secFailed, secUnsure, level, color };
  });

  // Executive summary based on score
  const execSummary = risk.label === "CRITICAL"
    ? `This assessment reveals that ${biz} is operating with critical cybersecurity vulnerabilities that expose the business to immediate risk of a damaging breach. With ${failed.length} failed controls and ${unsure.length} areas requiring urgent review, your current security posture leaves the business significantly exposed. Immediate action is required across multiple areas — particularly in ${top10[0]?.q.section || "access control"} and ${top10[1]?.q.section || "data backup"}, where the risk of exploitation is highest. The good news is that many of the highest-impact fixes cost nothing and can be implemented within days.`
    : risk.label === "HIGH"
    ? `This assessment identifies significant security gaps at ${biz} that require prompt attention. With ${failed.length} failed controls across ${SECTIONS.filter(s => sectionData.find(d => d.sec === s && d.pct >= 50)).length} categories, your business faces meaningful exposure to cyber threats. The most urgent areas for improvement are ${top10[0]?.q.section || "access control"} and ${top10[1]?.q.section || "data backup"}. Several of the highest-impact fixes can be implemented this week at no cost, providing immediate risk reduction while longer-term improvements are planned.`
    : risk.label === "MEDIUM"
    ? `${biz} has established a basic security foundation, but this assessment identifies ${failed.length} specific control failures and ${unsure.length} areas needing improvement. Your score of ${scorePct}/100 places you ahead of many small businesses but still leaves meaningful gaps that a motivated attacker could exploit. The priority areas are ${top10[0]?.q.section || "access control"} and ${top10[1]?.q.section || "compliance"}, where targeted improvements will yield the greatest risk reduction.`
    : `${biz} demonstrates a solid cybersecurity foundation with a score of ${scorePct}/100. This assessment identifies ${failed.length} remaining control gaps and ${unsure.length} areas for improvement. While your overall posture is good, addressing the remaining findings will further strengthen your defenses and ensure compliance with applicable regulations. Focus on the priority areas identified in this report to maintain and improve your strong security posture.`;

  // 90-day roadmap based on actual failures only
  const month1Items = top10.filter(x => x.rem.priority === "CRITICAL" || x.rem.priority === "HIGH").slice(0, 5);
  const month2Items = top10.filter(x => x.rem.priority === "HIGH" || x.rem.priority === "MEDIUM").slice(0, 4);
  const month3Items = allIssues
    .map(q => ({ q, rem: REMEDIATION[q.id] }))
    .filter(x => x.rem && x.rem.priority === "MEDIUM" || x?.rem?.priority === "LOW")
    .slice(0, 4);

  const styleBlock = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', sans-serif; color: #1e293b; background: #fff; line-height: 1.6; }
    .page { max-width: 860px; margin: 0 auto; }
    h2 { font-size: 18px; font-weight: 800; color: #0b1628; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #22c55e; }
    h3 { font-size: 14px; font-weight: 700; color: #1e3a5f; margin: 20px 0 8px; }
    p { font-size: 13px; color: #374151; line-height: 1.75; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    th { background: #0b1628; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
    .critical { background: #fef2f2; color: #ef4444; }
    .high { background: #fff7ed; color: #f97316; }
    .medium { background: #fffbeb; color: #f59e0b; }
    .low { background: #f0fdf4; color: #22c55e; }
    .failed-badge { background: #fef2f2; color: #ef4444; }
    .review-badge { background: #fffbeb; color: #f59e0b; }
    .pass-badge { background: #f0fdf4; color: #22c55e; }
    @media print { .no-print { display: none !important; } }
  `;

  const sectionRows = sectionData.map(d => `
    <tr>
      <td><strong>${SECTION_ICONS[d.sec]} ${d.sec}</strong></td>
      <td class="mono" style="text-align:center;font-weight:700;color:${d.color};">${d.score}/${d.max}</td>
      <td style="text-align:center;"><span class="badge" style="background:${d.color}20;color:${d.color};">${d.level}</span></td>
      <td style="color:#ef4444;font-weight:600;">${d.secFailed.length} failed</td>
      <td style="color:#f59e0b;font-weight:600;">${d.secUnsure.length} need review</td>
      <td>
        <div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
          <div style="width:${d.pct}%;height:100%;background:${d.color};border-radius:4px;"></div>
        </div>
      </td>
    </tr>`).join("");

  const findingRows = allIssues.map((q, i) => {
    const rem = REMEDIATION[q.id];
    const isFail = answers[q.id] === "no";
    return `
    <tr>
      <td style="white-space:nowrap;"><span class="badge ${isFail?"failed-badge":"review-badge"}">${isFail?"FAILED":"REVIEW"}</span></td>
      <td style="font-weight:600;color:#1e3a5f;font-size:11px;">${q.section}</td>
      <td>${q.q}</td>
      <td><span class="badge ${rem?.priority?.toLowerCase()||"medium"}">${rem?.priority||"MEDIUM"}</span></td>
    </tr>`;
  }).join("");

  const remediationRows = top10.map((x, i) => `
    <tr>
      <td style="text-align:center;font-weight:800;color:#0b1628;font-size:16px;">${i+1}</td>
      <td><strong>${x.rem.action}</strong><br/><span style="color:#64748b;font-size:11px;">${x.q.section}</span></td>
      <td style="font-size:12px;color:#374151;">${x.rem.how}</td>
      <td style="white-space:nowrap;font-size:11px;">${x.rem.time}</td>
      <td style="white-space:nowrap;font-size:11px;">${x.rem.cost}</td>
      <td><span class="badge ${x.rem.priority.toLowerCase()}">${x.rem.priority}</span></td>
    </tr>`).join("");

  const roadmapMonth = (items, title, color, month) => {
    if (!items.length) return "";
    return `
      <h3 style="background:${color};color:#fff;padding:10px 16px;border-radius:6px;margin-top:24px;">${title}</h3>
      <table>
        <thead><tr><th>Week</th><th>Action</th><th>Time Required</th><th>Est. Cost</th><th>Priority</th></tr></thead>
        <tbody>
          ${items.map((x, i) => `
          <tr>
            <td class="mono">Week ${month === 1 ? i+1 : month === 2 ? i+5 : i+9}</td>
            <td><strong>${x.rem.action}</strong><br/><span style="color:#64748b;font-size:11px;">${x.q.section}</span></td>
            <td>${x.rem.time}</td>
            <td>${x.rem.cost}</td>
            <td><span class="badge ${x.rem.priority.toLowerCase()}">${x.rem.priority}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  };

  const policyNeeds = [];
  if (answers[41] === "no" || answers[41] === "unsure") policyNeeds.push({ name: "Acceptable Use Policy (AUP)", urgency: "CRITICAL", reason: "You have no documented rules governing how staff use company technology — a foundational requirement for security and legal protection." });
  if (answers[42] === "no" || answers[42] === "unsure") policyNeeds.push({ name: "Incident Response Plan", urgency: "HIGH", reason: "Without a documented response plan, a breach will cause maximum damage. Every minute of confusion during an incident increases costs." });
  if (answers[43] === "no" || answers[43] === "unsure") policyNeeds.push({ name: "Password Policy", urgency: "HIGH", reason: "Without a formal password policy, staff have no guidance on creating strong passwords — the #1 cause of breaches." });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GSG Professional Risk Report — ${biz}</title>
<style>${styleBlock}</style>
</head>
<body>
<div class="page">

<!-- ══ COVER ══ -->
<div style="background:#0b1628;padding:52px 48px;color:#fff;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:rgba(34,197,94,0.06);"></div>
  <div style="position:absolute;bottom:-80px;left:40px;width:180px;height:180px;border-radius:50%;background:rgba(99,179,237,0.05);"></div>

  <div style="display:flex;align-items:center;gap:12px;margin-bottom:40px;">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🛡</div>
    <div>
      <div style="font-size:17px;font-weight:800;letter-spacing:0.02em;">Green Security Group</div>
      <div style="font-size:10px;color:#22c55e;letter-spacing:0.12em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;">CISSP-Certified · Professional Security Assessment</div>
    </div>
  </div>

  <div style="font-size:10px;color:#22c55e;letter-spacing:0.14em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-bottom:14px;">Confidential Professional Risk Report</div>
  <div style="font-size:40px;font-weight:800;line-height:1.05;margin-bottom:10px;">Cybersecurity Risk<br>Assessment Report</div>
  <div style="font-size:20px;color:#94a3b8;margin-bottom:40px;font-weight:300;">${biz}</div>

  <div style="display:flex;gap:0;border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.04);">
    ${[
      ["Prepared For", biz],
      ["Assessment Date", date],
      ["Prepared By", "Paul Green, CISSP"],
      ["Confidentiality", "Confidential"],
    ].map(([l,v], i) => `
    <div style="padding:18px 24px;${i<3?'border-right:1px solid rgba(255,255,255,0.08);':''}flex:1;">
      <div style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;font-family:'JetBrains Mono',monospace;">${l}</div>
      <div style="font-size:13px;font-weight:600;">${v}</div>
    </div>`).join("")}
  </div>
</div>

<!-- ══ SCORE BANNER ══ -->
<div style="background:${risk.bg};border-left:5px solid ${risk.color};padding:28px 48px;display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
  <div style="text-align:center;min-width:120px;">
    <div style="font-size:80px;font-weight:800;color:${risk.color};line-height:1;">${scorePct}</div>
    <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace;">Risk Score / 100</div>
  </div>
  <div style="flex:1;min-width:200px;">
    <div style="display:inline-flex;align-items:center;gap:8px;background:${risk.color}25;color:${risk.color};padding:8px 20px;border-radius:100px;font-weight:800;font-size:18px;margin-bottom:10px;">${risk.emoji} ${risk.label} RISK</div>
    <div style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:14px;">${risk.desc}</div>
    <div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;"><div style="width:${scorePct}%;height:100%;background:${risk.color};border-radius:4px;"></div></div>
  </div>
  <div style="display:flex;gap:24px;">
    <div style="text-align:center;">
      <div style="font-size:36px;font-weight:800;color:#ef4444;">${failed.length}</div>
      <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Failed</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:36px;font-weight:800;color:#f59e0b;">${unsure.length}</div>
      <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Need Review</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:36px;font-weight:800;color:#22c55e;">${passed.length}</div>
      <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Passed</div>
    </div>
  </div>
</div>

<!-- ══ BODY CONTENT ══ -->
<div style="padding:40px 48px;">

  <!-- Executive Summary -->
  <h2>1. Executive Summary</h2>
  <p>${execSummary}</p>
  <p>This report provides a complete analysis of your assessment results across all 8 security categories, a prioritized list of the top 10 actions to take, a custom 90-day remediation roadmap built around your specific gaps, and policy recommendations based on your compliance findings. All recommendations are drawn from NIST CSF, CIS Controls, and ISO 27001 frameworks — the same standards used in enterprise security programs.</p>

  <!-- Risk Score Analysis -->
  <h2>2. Risk Score Analysis</h2>
  <p>Your overall risk score of <strong>${scorePct} out of 100</strong> places ${biz} in the <strong>${risk.label}</strong> category. This score is calculated by assigning 2 points for each control that failed and 1 point for each control marked as uncertain, across all 52 assessment questions.</p>
  <p>For context: the average small business completing this assessment scores between 45 and 65. A score above 60 indicates significant gaps requiring prompt attention. A score below 30 indicates a strong security posture that should be maintained through regular review.</p>
  <table>
    <thead><tr><th>Score Range</th><th>Risk Level</th><th>What It Means</th><th>Recommended Timeline</th></tr></thead>
    <tbody>
      <tr style="${scorePct>=80?'background:#fef2f2;':''}" ><td class="mono">80–100</td><td><span class="badge critical">CRITICAL</span></td><td>Immediate exposure to breach</td><td>Act within 30 days</td></tr>
      <tr style="${scorePct>=60&&scorePct<80?'background:#fff7ed;':''}" ><td class="mono">60–79</td><td><span class="badge high">HIGH</span></td><td>Significant security gaps</td><td>Act within 60 days</td></tr>
      <tr style="${scorePct>=40&&scorePct<60?'background:#fffbeb;':''}" ><td class="mono">40–59</td><td><span class="badge medium">MEDIUM</span></td><td>Notable vulnerabilities present</td><td>Act within 90 days</td></tr>
      <tr style="${scorePct>=20&&scorePct<40?'background:#f0fdf4;':''}"><td class="mono">20–39</td><td><span class="badge low">LOW</span></td><td>Good foundation, minor gaps</td><td>Ongoing maintenance</td></tr>
      <tr><td class="mono">0–19</td><td><span class="badge low">MINIMAL</span></td><td>Strong security posture</td><td>Annual review</td></tr>
    </tbody>
  </table>
  <p><strong>Your score: ${scorePct}/100</strong> — highlighted above. ${risk.label === "CRITICAL" || risk.label === "HIGH" ? "Prompt action is strongly recommended to reduce your exposure before an incident occurs." : "Continue building on your foundation with the improvements identified in this report."}</p>

  <!-- Section Breakdown -->
  <h2>3. Risk by Category — Section Analysis</h2>
  <p>The table below shows your performance across all 8 security categories. Categories with a HIGH RISK rating should be prioritized in your remediation plan.</p>
  <table>
    <thead><tr><th>Category</th><th style="text-align:center;">Score</th><th style="text-align:center;">Risk Level</th><th>Failed</th><th>Need Review</th><th style="min-width:120px;">Risk Bar</th></tr></thead>
    <tbody>${sectionRows}</tbody>
  </table>

  ${sectionData.filter(d => d.pct >= 40).map(d => `
  <h3>${SECTION_ICONS[d.sec]} ${d.sec} — ${d.level}</h3>
  <p>${d.secFailed.length === 0 && d.secUnsure.length === 0
    ? `${biz} has strong controls in ${d.sec}. All ${d.max/2} controls in this category passed. Maintain these controls through regular review.`
    : `${biz} has ${d.secFailed.length} failed control${d.secFailed.length !== 1 ? 's' : ''} and ${d.secUnsure.length} uncertain control${d.secUnsure.length !== 1 ? 's' : ''} in ${d.sec}. ${
      d.pct >= 70
        ? `This is a high-risk area requiring immediate attention. The gaps identified here expose the business to significant threats including ${d.sec === "Network Security" ? "unauthorized network access and lateral movement" : d.sec === "Access Control" ? "credential theft and unauthorized account access" : d.sec === "Data Backup" ? "permanent data loss in the event of ransomware or hardware failure" : d.sec === "Email & Phishing" ? "business email compromise and phishing-driven breaches" : d.sec === "Endpoint Security" ? "malware infection and device compromise" : d.sec === "Compliance" ? "regulatory penalties and legal liability" : d.sec === "Physical Security" ? "physical intrusion and unauthorized device access" : "third-party supply chain attacks"}.`
        : `This area has room for improvement. Addressing the identified gaps will meaningfully reduce your overall risk exposure.`
    }`
  }</p>`).join("")}

  <!-- All Findings -->
  <h2>4. Complete Findings — All ${allIssues.length} Issues Identified</h2>
  <p>The following table lists every control that failed or requires review, along with its security category and priority level. Address CRITICAL and HIGH priority items first.</p>
  ${allIssues.length > 0 ? `
  <table>
    <thead><tr><th>Status</th><th>Category</th><th>Control</th><th>Priority</th></tr></thead>
    <tbody>${findingRows}</tbody>
  </table>` : `<p style="color:#22c55e;font-weight:600;">✓ No failed controls identified. Excellent security posture.</p>`}

  <!-- Prioritized Remediation -->
  <h2>5. Prioritized Remediation Plan — Top ${top10.length} Actions</h2>
  <p>The following actions are ranked by risk reduction impact. Each includes specific step-by-step instructions, time estimates, and cost estimates. Start with item 1 and work your way down.</p>
  ${top10.length > 0 ? `
  <table>
    <thead><tr><th>#</th><th>Action</th><th>How To Do It</th><th>Time</th><th>Cost</th><th>Priority</th></tr></thead>
    <tbody>${remediationRows}</tbody>
  </table>` : `<p style="color:#22c55e;font-weight:600;">✓ No critical remediation actions required. Maintain your current controls.</p>`}

  <!-- 90-Day Roadmap -->
  <h2>6. Your Custom 90-Day Roadmap</h2>
  <p>This roadmap is built specifically around the gaps identified in your assessment. Only actions relevant to your actual failures are included.</p>
  ${roadmapMonth(month1Items, "Month 1 — Critical & High Priority Fixes", "#ef4444", 1)}
  ${roadmapMonth(month2Items, "Month 2 — High & Medium Priority Improvements", "#f59e0b", 2)}
  ${roadmapMonth(month3Items.length ? month3Items : month2Items.slice(0,2), "Month 3 — Medium Priority & Ongoing Maintenance", "#22c55e", 3)}
  <p style="margin-top:16px;padding:14px;background:#f8fafc;border-left:3px solid #22c55e;border-radius:4px;font-size:12px;"><strong>After 90 days:</strong> Re-run this assessment at greensecuritygroup.com to measure your improvement. Most businesses reduce their risk score by 30–50 points in the first 90 days of active remediation.</p>

  <!-- Policy Recommendations -->
  <h2>7. Policy Recommendations</h2>
  ${policyNeeds.length > 0 ? `
  <p>Based on your assessment results, ${biz} requires the following security policies. These policies are included in the Green Security Group Security Toolkit — ready to fill in and distribute to staff.</p>
  <table>
    <thead><tr><th>Policy Required</th><th>Urgency</th><th>Why You Need It</th></tr></thead>
    <tbody>
      ${policyNeeds.map(p => `<tr><td><strong>${p.name}</strong></td><td><span class="badge ${p.urgency.toLowerCase()}">${p.urgency}</span></td><td style="font-size:12px;">${p.reason}</td></tr>`).join("")}
    </tbody>
  </table>
  <p>All three policy templates are available as fillable documents in the Green Security Group Security Toolkit at <strong>greensecuritygroup.com</strong>.</p>` : `
  <p style="color:#22c55e;font-weight:600;">✓ All three core security policies are in place. Ensure they are reviewed annually and that all new staff sign them during onboarding.</p>`}

  <!-- Conclusion -->
  <h2>8. Professional Conclusion & Recommendations</h2>
  <p>
    ${risk.label === "CRITICAL" || risk.label === "HIGH"
      ? `Based on this assessment, ${biz} faces material cybersecurity risk that requires prompt attention. The ${failed.length} failed controls identified represent real vulnerabilities that a motivated attacker could exploit. The good news is that the majority of the highest-impact fixes are either free or low-cost, and can be implemented without specialized expertise using the guidance in this report.`
      : `Based on this assessment, ${biz} has established a reasonable security foundation. The ${failed.length} remaining gaps are manageable and can be addressed systematically over the next 90 days using the roadmap provided.`
    }
  </p>
  <p>My specific recommendations for ${biz}:</p>
  <p><strong>Immediate (this week):</strong> ${top10[0] ? top10[0].rem.action : "Maintain current security controls and schedule annual review."} ${top10[1] ? "Also prioritize " + top10[1].rem.action + "." : ""}</p>
  <p><strong>Short-term (30 days):</strong> Work through all CRITICAL and HIGH priority items in the remediation plan above. These represent the greatest risk reduction per hour invested.</p>
  <p><strong>Medium-term (90 days):</strong> Complete the full 90-day roadmap. Re-run this assessment to measure your improvement and identify any new gaps.</p>
  <p><strong>Ongoing:</strong> Security is not a one-time project. Schedule an annual assessment, maintain your policies, and keep all software patched and updated.</p>
  <p>If you would like professional assistance implementing any of these recommendations, I am available for security consultations at <strong>paul@greensecuritygroup.com</strong>.</p>

  <div style="margin-top:32px;padding:24px 32px;background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03));border:1px solid rgba(34,197,94,0.25);border-radius:12px;">
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div style="width:48px;height:48px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🛡</div>
      <div style="flex:1;">
        <div style="font-weight:800;font-size:16px;margin-bottom:3px;">Paul Green, CISSP</div>
        <div style="font-size:12px;color:#64748b;">Founder, Green Security Group · 10+ Years Enterprise Security Experience</div>
        <div style="font-size:11px;color:#22c55e;margin-top:4px;font-family:'JetBrains Mono',monospace;">CISSP · CySA+ · SSCP · CSAP · CSIS · CIOS · Security+ · Network+ · A+ · CC · ITIL</div>
      </div>
      <div style="text-align:right;font-size:12px;color:#64748b;">
        <div>paul@greensecuritygroup.com</div>
        <div>greensecuritygroup.com</div>
      </div>
    </div>
  </div>

  <!-- Upgrade CTA -->
  <div style="margin-top:32px;padding:28px 32px;background:#0b1628;border-radius:12px;text-align:center;">
    <div style="font-size:10px;color:#22c55e;text-transform:uppercase;letter-spacing:0.12em;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">Next Step</div>
    <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:8px;">Get the Full Security Toolkit</div>
    <div style="font-size:13px;color:#94a3b8;max-width:480px;margin:0 auto 16px;line-height:1.7;">This report identifies your gaps. The Green Security Group Toolkit gives you everything to fix them — 3 ready-to-use policy templates, a pre-built risk register, and a 20-page security guide.</div>
    <div style="font-size:13px;color:#64748b;">Visit <strong style="color:#22c55e;">greensecuritygroup.com</strong> to get the full toolkit</div>
  </div>

</div>

<!-- FOOTER -->
<div style="background:#0b1628;padding:20px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:0;">
  <div style="color:#fff;font-weight:700;font-size:13px;">Green Security Group</div>
  <div style="color:#475569;font-size:11px;font-family:'JetBrains Mono',monospace;">© ${new Date().getFullYear()} · Confidential · All rights reserved</div>
  <div style="color:#475569;font-size:11px;font-family:'JetBrains Mono',monospace;">paul@greensecuritygroup.com</div>
</div>

</div>
</body>
</html>`;
}

// ── FREE SUMMARY REPORT ──────────────────────────────────────────────────────
function buildFreeReport(company, answers, scorePct, risk) {
  const biz = company || "Your Business";
  const date = new Date().toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" });
  const failed = QUESTIONS.filter(q => answers[q.id] === "no");
  const unsure = QUESTIONS.filter(q => answers[q.id] === "unsure");

  const sectionRows = SECTIONS.map(sec => {
    const { score, max, pct } = secScore(sec, answers);
    const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : "#22c55e";
    const level = pct >= 70 ? "HIGH RISK" : pct >= 40 ? "MEDIUM RISK" : "LOW RISK";
    return `<tr>
      <td style="padding:10px 14px;font-weight:600;">${SECTION_ICONS[sec]} ${sec}</td>
      <td style="padding:10px 14px;text-align:center;font-weight:700;color:${color};">${score}/${max}</td>
      <td style="padding:10px 14px;text-align:center;"><span style="background:${color}20;color:${color};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">${level}</span></td>
      <td style="padding:10px 14px;"><div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${color};border-radius:4px;"></div></div></td>
    </tr>`;
  }).join("");

  const findingRows = [...failed, ...unsure].slice(0, 10).map((q, i) => {
    const isNo = answers[q.id] === "no";
    return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
      <td style="padding:10px 14px;"><span style="background:${isNo?"#fef2f2":"#fffbeb"};color:${isNo?"#ef4444":"#f59e0b"};padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">${isNo?"FAILED":"REVIEW"}</span></td>
      <td style="padding:10px 14px;font-size:12px;font-weight:600;color:#1e3a5f;">${q.section}</td>
      <td style="padding:10px 14px;font-size:12px;">${q.q}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GSG Summary Report — ${biz}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#1e293b;background:#fff}table{border-collapse:collapse;width:100%}th{background:#0b1628;color:#fff;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.06em}</style>
  </head><body><div style="max-width:800px;margin:0 auto;">
  <div style="background:#0b1628;padding:44px 40px;color:#fff;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
      <div style="width:40px;height:40px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;">🛡</div>
      <div><div style="font-size:16px;font-weight:800;">Green Security Group</div><div style="font-size:10px;color:#22c55e;letter-spacing:0.1em;text-transform:uppercase;">Free Summary Report</div></div>
    </div>
    <div style="font-size:32px;font-weight:800;line-height:1.1;margin-bottom:8px;">Cybersecurity Risk Summary</div>
    <div style="font-size:16px;color:#94a3b8;margin-bottom:28px;">${biz} · ${date}</div>
    <div style="font-size:12px;color:#64748b;">Prepared by Paul Green, CISSP · greensecuritygroup.com</div>
  </div>
  <div style="background:${risk.bg};border-left:4px solid ${risk.color};padding:24px 40px;display:flex;align-items:center;gap:32px;flex-wrap:wrap;">
    <div style="text-align:center;"><div style="font-size:72px;font-weight:800;color:${risk.color};line-height:1;">${scorePct}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Risk Score / 100</div></div>
    <div><div style="display:inline-flex;align-items:center;gap:8px;background:${risk.color}20;color:${risk.color};padding:6px 16px;border-radius:100px;font-weight:800;font-size:16px;margin-bottom:8px;">${risk.emoji} ${risk.label} RISK</div><div style="font-size:13px;color:#475569;line-height:1.6;">${risk.desc}</div></div>
    <div style="margin-left:auto;text-align:center;"><div style="font-size:28px;font-weight:800;color:#ef4444;">${failed.length}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;">Failed</div><div style="font-size:28px;font-weight:800;color:#f59e0b;margin-top:8px;">${unsure.length}</div><div style="font-size:10px;color:#64748b;text-transform:uppercase;">Need Review</div></div>
  </div>
  <div style="padding:28px 40px;"><div style="font-size:16px;font-weight:800;margin-bottom:14px;">Risk by Category</div>
  <table><thead><tr><th>Category</th><th style="text-align:center;">Score</th><th style="text-align:center;">Level</th><th>Risk Bar</th></tr></thead><tbody>${sectionRows}</tbody></table></div>
  ${[...failed,...unsure].length>0?`<div style="padding:0 40px 28px;"><div style="font-size:16px;font-weight:800;margin-bottom:14px;">⚠ Top Findings (showing ${Math.min(10,[...failed,...unsure].length)} of ${[...failed,...unsure].length})</div>
  <table><thead><tr><th>Status</th><th>Category</th><th>Finding</th></tr></thead><tbody>${findingRows}</tbody></table>
  ${[...failed,...unsure].length>10?`<div style="text-align:center;padding:10px;font-size:12px;color:#94a3b8;">+ ${[...failed,...unsure].length-10} more findings in the full Professional Report</div>`:""}
  </div>`:""}
  <div style="margin:0 40px 32px;background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:28px;text-align:center;">
    <div style="font-size:10px;color:#22c55e;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px;">Upgrade to Full Report</div>
    <div style="font-size:20px;font-weight:800;margin-bottom:8px;color:#0b1628;">Get Your Professional Risk Report</div>
    <div style="font-size:13px;color:#64748b;max-width:440px;margin:0 auto 16px;line-height:1.7;">This summary shows <em>what</em> your risks are. The full Professional Report gives you step-by-step remediation instructions for every finding, a custom 90-day roadmap, and policy recommendations — personalized to your specific assessment answers.</div>
    <div style="font-size:32px;font-weight:800;color:#22c55e;margin-bottom:4px;">$97</div>
    <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">One-time · Instant download</div>
    <div style="font-size:13px;color:#64748b;">Visit <strong>greensecuritygroup.com</strong> to get your full report</div>
  </div>
  <div style="background:#0b1628;padding:18px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
    <div style="color:#fff;font-weight:700;font-size:13px;">Green Security Group</div>
    <div style="color:#64748b;font-size:11px;">paul@greensecuritygroup.com · greensecuritygroup.com</div>
    <div style="color:#64748b;font-size:11px;">CISSP · CySA+ · SSCP · 13 Certs</div>
  </div>
  </div></body></html>`;
}

// ── STYLES ───────────────────────────────────────────────────────────────────
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
  .report-card{border-radius:14px;padding:28px}
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
  .rc-btn-free:hover{border-color:rgba(34,197,94,0.3)}
  .rc-btn-paid{background:var(--green);color:#000}
  .rc-btn-paid:hover{background:var(--green2);color:#fff;transform:translateY(-1px)}
  .verified-banner{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
  .modal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;padding:36px;max-width:440px;width:100%}
  .modal-title{font-family:var(--display);font-size:24px;font-weight:800;margin-bottom:8px;letter-spacing:0.02em}
  .modal-sub{font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.7}
  .modal-label{font-family:var(--mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;display:block}
  .modal-input{width:100%;padding:12px 16px;border-radius:7px;background:var(--surf2);border:1px solid var(--border2);color:var(--text);font-size:15px;font-family:var(--mono);outline:none;margin-bottom:8px;transition:border-color 0.2s;letter-spacing:0.05em}
  .modal-input:focus{border-color:rgba(34,197,94,0.45)}
  .modal-input.error{border-color:#ef4444}
  .modal-error{font-size:12px;color:#ef4444;margin-bottom:16px;font-family:var(--mono);line-height:1.5}
  .modal-hint{font-size:11px;color:var(--dim);margin-bottom:20px;font-family:var(--mono);line-height:1.6;padding:10px 12px;background:var(--surf2);border-radius:6px;border-left:2px solid var(--border2)}
  .modal-btns{display:flex;gap:10px}
  .modal-confirm{flex:1;padding:12px;border-radius:7px;background:var(--green);color:#000;font-family:var(--body);font-weight:700;font-size:14px;border:none;cursor:pointer;transition:all 0.2s}
  .modal-confirm:hover:not(:disabled){background:var(--green2);color:#fff}
  .modal-confirm:disabled{opacity:0.4;cursor:not-allowed}
  .modal-cancel{padding:12px 20px;border-radius:7px;background:transparent;color:var(--muted);font-family:var(--body);font-weight:500;font-size:14px;border:1px solid var(--border);cursor:pointer}
  .modal-cancel:hover{color:var(--text)}
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

// ── MONTHLY PASSWORD — UPDATE ON THE 1ST OF EACH MONTH ──────────────────────
// To update: change the value below, commit to GitHub, Vercel deploys in 30s
// Format: GSG-MMM-YYYY (e.g. GSG-JUN-2026, GSG-JUL-2026)
const VALID_PASSWORD = "GSG-MAY-2026";

export default function App() {
  const [phase, setPhase] = useState("hero");
  const [sec, setSec] = useState(0);
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // Check if previously unlocked this session
    if (sessionStorage.getItem("gsg_unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);
  const secQs = QUESTIONS.filter(q => q.section === SECTIONS[sec]);
  const secAnswered = secQs.filter(q => answers[q.id]).length;
  const secDone = secAnswered === secQs.length;
  const isLastSection = sec === SECTIONS.length - 1;
  const isDone = (i) => QUESTIONS.filter(q => q.section === SECTIONS[i]).every(q => answers[q.id]);
  const totalScore = QUESTIONS.reduce((a,q) => a+(answers[q.id]==="no"?2:answers[q.id]==="unsure"?1:0),0);
  const scorePct = Math.round((totalScore/(QUESTIONS.length*2))*100);
  const risk = getRisk(scorePct);
  const findings = QUESTIONS.filter(q => answers[q.id]==="no"||answers[q.id]==="unsure").slice(0,8);

  const start = () => { setPhase("assessment"); setSec(0); window.scrollTo({top:0}); };
  const next = () => {
    if (sec < SECTIONS.length-1) { setSec(s=>s+1); window.scrollTo({top:0}); }
    else { setPhase("results"); window.scrollTo({top:0}); }
  };
  const back = () => {
    if (sec > 0) { setSec(s=>s-1); window.scrollTo({top:0}); }
    else setPhase("hero");
  };
  const restart = () => { setPhase("hero"); setAnswers({}); setSec(0); setCompany(""); };

  const handlePasswordSubmit = () => {
    setPasswordError("");
    if (password.trim().toUpperCase() === VALID_PASSWORD.toUpperCase()) {
      setUnlocked(true);
      sessionStorage.setItem("gsg_unlocked", "true");
      setShowPasswordModal(false);
      setPassword("");
      downloadReport(true);
    } else {
      setPasswordError("Incorrect password. Check your Gumroad receipt email and try again.");
    }
  };

  const handleDownloadProfessional = () => {
    if (unlocked) {
      downloadReport(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const downloadReport = (full) => {
    try {
      const html = full
        ? buildFullReport(company, answers, scorePct, risk)
        : buildFreeReport(company, answers, scorePct, risk);
      const blob = new Blob([html], { type:"text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GSG-${full?"Professional":"Summary"}-Report-${company||"YourBusiness"}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(err) {
      console.error("Report generation error:", err);
      alert("Report generation failed. Please email paul@greensecuritygroup.com and we will send your report within 24 hours. Error: " + err.message);
    }
  };

  return (
    <div>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo" onClick={()=>setPhase("hero")}>
          <div className="logo-shield">🛡</div>
          <div>
            <div className="logo-name">Green Security Group</div>
            <div className="logo-sub">Cybersecurity Risk Assessment</div>
          </div>
        </div>
        <button className="nav-btn" onClick={start}>Start Free Assessment</button>
      </nav>

      {/* ── PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowPasswordModal(false)}>
          <div className="modal">
            <div style={{fontSize:36,marginBottom:14}}>🔐</div>
            <div className="modal-title">Enter Your Report Password</div>
            <div className="modal-sub">
              Your password is included in your Gumroad receipt email. It looks like <strong style={{color:"var(--green)",fontFamily:"var(--mono)"}}>GSG-MMM-YYYY</strong> and changes on the 1st of each month.
            </div>

            <label className="modal-label">Report Password</label>
            <input
              className={`modal-input ${passwordError?"error":""}`}
              placeholder="GSG-MAY-2026"
              value={password}
              onChange={e=>{setPassword(e.target.value);setPasswordError("");}}
              onKeyDown={e=>e.key==="Enter"&&handlePasswordSubmit()}
              autoFocus
            />
            {passwordError && <div className="modal-error">⚠ {passwordError}</div>}

            <div className="modal-hint">
              💡 Password is in your Gumroad receipt email.<br/>
              Haven't purchased yet?{" "}
              <a
                href="https://greensecure.gumroad.com/l/jtrkdq"
                target="_blank"
                rel="noopener noreferrer"
                style={{color:"var(--green)",textDecoration:"underline"}}
                onClick={()=>setShowPasswordModal(false)}>
                Buy on Gumroad — $97 →
              </a>
            </div>

            <div className="modal-btns">
              <button className="modal-cancel" onClick={()=>{setShowPasswordModal(false);setPassword("");setPasswordError("");}}>Cancel</button>
              <button className="modal-confirm"
                onClick={handlePasswordSubmit}
                disabled={password.trim().length < 4}>
                Unlock My Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HERO ══ */}
      {phase==="hero" && (<>
        <div className="hero">
          <div className="hero-glow" />
          <div className="pill"><span className="pill-dot" />Free Assessment · Professional Reports · Instant Download</div>
          <h1 className="h-title">KNOW YOUR<br /><span className="g">RISK.</span><br /><span className="d">FIX IT FAST.</span></h1>
          <p className="h-sub">Get an instant cybersecurity risk score — then download a <strong>fully personalized professional report</strong> built from your specific answers by Paul Green, CISSP.</p>
          <input className="company-input" placeholder="Your company name (optional)" value={company}
            onChange={e=>setCompany(e.target.value)} onKeyDown={e=>e.key==="Enter"&&start()} />
          <div className="h-btns">
            <button className="btn-p" onClick={start}>Start Free Assessment →</button>
            <button className="btn-g" onClick={()=>window.location.href="mailto:paul@greensecuritygroup.com"}>Talk to an Expert</button>
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
          <div className="feat-title">FREE ASSESSMENT.<br />PROFESSIONAL REPORT.</div>
          <div className="feat-grid">
            {[
              ["🎯","Step 1: Free Assessment","Answer 52 questions across 8 security categories. Takes 5 minutes. No account required."],
              ["📊","Step 2: Instant Risk Score","See your 0–100 risk score, category breakdown, and top findings immediately."],
              ["📄","Step 3: Free Summary Report","Download a branded PDF summary with your score and top findings — free, instant."],
              ["📋","Step 4: Professional Report ($97)","Purchase on Gumroad and return here to download your fully personalized 15-page report — instantly."],
              ["🛡️","CISSP-Certified Content","Every report includes step-by-step remediation instructions built on NIST CSF and CIS Controls frameworks."],
              ["⚡","Truly Instant","Both reports download immediately — no waiting, no email, no account needed."],
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
            <div className={`q-card ${answers[q.id]?"ans":""}`} key={q.id}
              style={!answers[q.id] && secAnswered > 0 ? {borderColor:"rgba(245,158,11,0.3)"} : {}}>
              <div className="q-id">Q{q.id} of {QUESTIONS.length} {!answers[q.id] ? "· ⚠ Needs answer" : ""}</div>
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
            <div className="nav-status">
              {secDone
                ? <span style={{color:"var(--green)"}}>✓ Section complete</span>
                : <span style={{color:"var(--muted)"}}>{secAnswered} / {secQs.length} answered{!secDone && secAnswered > 0 ? ` — scroll up to answer remaining` : ""}</span>
              }
            </div>
            <button
              className="btn-next"
              onClick={next}
              disabled={!secDone}
              title={!secDone ? `Answer all ${secQs.length - secAnswered} remaining question${secQs.length - secAnswered !== 1 ? "s" : ""} to continue` : ""}>
              {isLastSection
                ? secDone ? "View My Results →" : `Answer ${secQs.length - secAnswered} more to finish`
                : secDone ? "Next Section →" : `${secQs.length - secAnswered} left`}
            </button>
          </div>
        </div>
      )}

      {/* ══ RESULTS ══ */}
      {phase==="results" && (() => {
        try {
          return (
        <div className="results">
          <div className="res-eyebrow">Green Security Group · {company?`${company} · `:""}Risk Assessment Results</div>
          <div className="res-title">YOUR SECURITY<br />RISK REPORT</div>

          {/* Score */}
          <div className="score-card">
            <div className="score-l"><div className="score-big" style={{color:risk.color}}>{scorePct}</div><div className="score-of">Risk Score / 100</div></div>
            <div className="score-r">
              <div className="risk-chip" style={{background:risk.bg,color:risk.color}}>{risk.emoji} {risk.label} RISK</div>
              <div className="risk-desc">{risk.desc}</div>
              <div className="score-bar"><div className="score-bar-fill" style={{width:`${scorePct}%`,background:risk.color}} /></div>
            </div>
          </div>

          {/* Section breakdown */}
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"0.02em",marginBottom:12}}>RISK BY CATEGORY</div>
          <div className="sec-results">
            {SECTIONS.map(s=>{
              const {score,max,pct}=secScore(s,answers);
              const col=pct>=70?"#ef4444":pct>=40?"#f59e0b":"#22c55e";
              return (
                <div className="sec-res-card" key={s}>
                  <div className="src-top"><div className="src-name">{SECTION_ICONS[s]} {s}</div><div className="src-score" style={{color:col}}>{score}/{max}</div></div>
                  <div className="src-track"><div className="src-fill" style={{width:`${pct}%`,background:col}} /></div>
                </div>
              );
            })}
          </div>

          {/* Top findings */}
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

          {/* Report cards */}
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"0.02em",marginBottom:16}}>GET YOUR REPORT</div>
          <div className="report-cards">

            {/* Free report */}
            <div className="report-card rc-free">
              <div className="rc-badge" style={{color:"var(--muted)"}}>Free · Instant Download</div>
              <div className="rc-title">Summary Report</div>
              <div className="rc-desc">Your risk score, category breakdown, and top findings — branded PDF ready to download now.</div>
              <div className="rc-includes">
                {["Risk score & level","8-category breakdown","Top findings list","Basic recommendations","Branded PDF format"].map(i=>(
                  <div className="rc-item" key={i}><span className="rc-check" style={{color:"var(--muted)"}}>✓</span>{i}</div>
                ))}
              </div>
              <div className="rc-price" style={{color:"var(--green)"}}>FREE</div>
              <button className="rc-btn rc-btn-free" onClick={()=>downloadReport(false)}>
                Download Free Summary →
              </button>
            </div>

            {/* Professional report */}
            <div className="report-card rc-paid">
              <div className="rc-badge" style={{color:"var(--green)"}}>⚡ Professional · Fully Personalized · CISSP-Certified</div>
              <div className="rc-title">Professional Report</div>
              <div className="rc-desc">A 15-page report with step-by-step remediation for every finding, a custom 90-day roadmap, and policy recommendations — personalized to your specific answers.</div>
              <div className="rc-includes">
                {[
                  "Executive summary for your business",
                  "Every finding with step-by-step fix",
                  "Prioritized remediation plan",
                  "Custom 90-day roadmap",
                  "Policy recommendations",
                  "Signed by Paul Green, CISSP"
                ].map(i=>(
                  <div className="rc-item" key={i}><span className="rc-check" style={{color:"var(--green)"}}>✓</span>{i}</div>
                ))}
              </div>
              <div className="rc-price" style={{color:"var(--green)"}}>$97</div>

              {/* Primary — Buy button — using anchor tag to avoid popup blocker */}
              <a
                href="https://greensecure.gumroad.com/l/jtrkdq"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:"block",width:"100%",padding:"11px",borderRadius:"7px",
                  background:"var(--green)",color:"#000",fontFamily:"var(--body)",
                  fontWeight:700,fontSize:13,textAlign:"center",textDecoration:"none",
                  marginBottom:10,transition:"all 0.2s",boxSizing:"border-box"
                }}>
                Purchase on Gumroad — $97 →
              </a>

              {/* Secondary — Password gated download */}
              <button className="rc-btn"
                style={{
                  background: unlocked ? "rgba(34,197,94,0.12)" : "transparent",
                  border: unlocked ? "1px solid #22c55e" : "1px solid var(--border2)",
                  color:"var(--green)",
                  fontWeight:600,
                  fontSize:13,
                }}
                onClick={handleDownloadProfessional}>
                {unlocked ? "⬇ Download My Report (Unlocked)" : "🔐 I Already Purchased — Enter Password"}
              </button>

              <div style={{textAlign:"center",marginTop:10,fontSize:10,color:"var(--dim)",fontFamily:"var(--mono)",lineHeight:1.7}}>
                {unlocked
                  ? "✓ Report unlocked for this session"
                  : "Purchase on Gumroad first · Password sent in your receipt email"}
              </div>
            </div>
          </div>

          <button className="restart-btn" onClick={restart}>↺ Start New Assessment</button>
        </div>
          );
        } catch(err) {
          console.error("Results render error:", err);
          return (
            <div className="results">
              <div style={{textAlign:"center",padding:"48px 24px"}}>
                <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
                <div style={{fontFamily:"var(--display)",fontSize:28,fontWeight:800,marginBottom:12}}>Something went wrong</div>
                <div style={{fontSize:14,color:"var(--muted)",marginBottom:24,lineHeight:1.7}}>
                  Your assessment was completed successfully but we hit a display error.<br/>
                  Please email us and we will send your report manually.
                </div>
                <a href="mailto:paul@greensecuritygroup.com?subject=Report%20Request&body=Please%20send%20me%20my%20risk%20report"
                  style={{display:"inline-block",padding:"14px 28px",background:"var(--green)",color:"#000",borderRadius:"7px",fontWeight:700,textDecoration:"none",marginBottom:16}}>
                  Email paul@greensecuritygroup.com
                </a>
                <br/>
                <button className="restart-btn" onClick={restart} style={{marginTop:16}}>↺ Try Again</button>
              </div>
            </div>
          );
        }
      })()}

      {phase!=="hero"&&(
        <footer className="footer">
          <div className="footer-name">GREEN SECURITY GROUP</div>
          <div className="footer-sub">paul@greensecuritygroup.com · greensecuritygroup.com · Nova Scotia, Canada</div>
        </footer>
      )}
    </div>
  );
}
