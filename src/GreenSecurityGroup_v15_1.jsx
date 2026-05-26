import { useState, useEffect } from "react";

const loadJsPDF = async () => {
  if (window.__gsg_jspdf) return window.__gsg_jspdf;
  try {
    const mod = await import("https://esm.sh/jspdf@2.5.1");
    const J = mod.jsPDF || mod.default;
    if (!J) throw new Error("not found");
    return (window.__gsg_jspdf = J);
  } catch (_) {}
  return new Promise((res, rej) => {
    if (window.jspdf?.jsPDF) return res((window.__gsg_jspdf = window.jspdf.jsPDF));
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () =>
      window.jspdf?.jsPDF
        ? res((window.__gsg_jspdf = window.jspdf.jsPDF))
        : rej(new Error("API not found"));
    s.onerror = () => rej(new Error("cdnjs failed"));
    document.head.appendChild(s);
  });
};

const SECTIONS = [
  { id:"s1",num:"01",title:"Physical Security",
    desc:"Physical access controls are the first line of defense. Unauthorized physical access to servers, workstations, or network hardware can bypass every digital control you have.",
    questions:[
      {id:"s1q1",text:"Are server rooms, network closets, and IT equipment secured with locks limiting access to authorized personnel only?",rec:"Install keyed or keycard access on all areas containing servers or network equipment. A deadbolt with limited key distribution is a meaningful improvement over no control."},
      {id:"s1q2",text:"Is a visitor log or access record maintained for sensitive areas such as server rooms?",rec:"Create a visitor log for sensitive areas. A paper sign-in sheet recording entry time, purpose, and authorizing employee is better than no record. Review monthly."},
      {id:"s1q3",text:"Are workstations and laptops secured when unattended through a locked screen policy, cable locks, or secured storage?",rec:"Enforce auto-lock after 5 minutes via Group Policy or MDM. Consider cable locks for laptops in shared or public-facing workspaces."},
      {id:"s1q4",text:"Do you have surveillance cameras or physical access monitoring at entry points to your facility?",rec:"Install cameras at building entry points and server room doors. Cloud-based camera systems are now affordable for SMBs and provide remote monitoring."},
      {id:"s1q5",text:"Are backup media, portable drives, and sensitive printed documents physically secured in a locked location?",rec:"Store backup media in a locked fireproof cabinet or safe. Consider offsite or cloud-based backup to eliminate physical media risks."},
      {id:"s1q6",text:"Is there a formal process for issuing and revoking physical access when employees join or leave?",rec:"Build a physical access checklist for onboarding and offboarding. Collect all keys and keycards on last day. Change PINs immediately when anyone with access departs."},
    ]},
  { id:"s2",num:"02",title:"Access Controls",
    desc:"Who can access what and why is one of the most impactful controls any organization can implement. Poor access management is a leading contributor to both internal and external breaches.",
    questions:[
      {id:"s2q1",text:"Does every user have a unique account? Are shared or generic accounts such as admin or office prohibited?",rec:"Audit all accounts immediately and eliminate shared credentials. Shared accounts prevent accountability and make incident investigation nearly impossible."},
      {id:"s2q2",text:"Is multi-factor authentication (MFA) enabled for email, cloud services, VPN, and remote access?",rec:"Enable MFA on Microsoft 365 or Google Workspace immediately. Free TOTP-based MFA is available for most platforms at no additional cost."},
      {id:"s2q3",text:"Do employees have access only to the systems and data they need for their job, the principle of least privilege?",rec:"Conduct an access audit by role. Remove permissions granted historically but no longer needed. Start with your most sensitive data stores."},
      {id:"s2q4",text:"Are administrative or privileged accounts separate from standard user accounts?",rec:"Create dedicated admin accounts for staff requiring elevated privileges. Never use them for daily activities. This limits the blast radius of a compromised credential."},
      {id:"s2q5",text:"Is there a formal process for provisioning and deprovisioning user accounts when staff join, transfer, or leave?",rec:"Build an HR-IT handoff process with a documented checklist. Departing employee accounts should be disabled on their last day, not after the weekend."},
      {id:"s2q6",text:"Are user access rights reviewed at least annually to ensure they remain appropriate to the current role?",rec:"Schedule an annual access review for all user accounts. Validate that access aligns with each role and document the review."},
      {id:"s2q7",text:"Is there a documented password policy enforcing minimum length, complexity, and prohibiting reuse?",rec:"Implement a policy requiring a minimum of 12 characters. Deploy a business password manager such as Bitwarden Teams or 1Password Business."},
    ]},
  { id:"s3",num:"03",title:"Network Defenses",
    desc:"Your network perimeter and what happens inside it determines how easily attackers can move laterally, exfiltrate data, or deploy malware. Even basic controls dramatically reduce exposure.",
    questions:[
      {id:"s3q1",text:"Is your network protected by a business-grade firewall with documented rules reviewed at least annually?",rec:"Ensure a business-grade firewall is in place. Document all rules with a business justification and prune unused rules annually."},
      {id:"s3q2",text:"Is your guest Wi-Fi on a separate network segment from your business systems and internal resources?",rec:"Configure a dedicated guest SSID on its own VLAN that cannot access internal resources. Most business-grade access points support this natively."},
      {id:"s3q3",text:"Are all network devices including routers, switches, and access points running current firmware and using non-default credentials?",rec:"Create an inventory of all network devices. Change default credentials immediately. Set a quarterly reminder to check for firmware updates."},
      {id:"s3q4",text:"Do you have network monitoring or logging in place to detect unusual traffic or unauthorized connections?",rec:"Enable logging on your firewall and router. Review logs monthly. Even basic detection of unusual outbound traffic or connections to unknown destinations can catch incidents early."},
      {id:"s3q5",text:"Is remote access limited to approved VPN or zero-trust methods, with no open RDP or unprotected protocols exposed to the internet?",rec:"Disable RDP port 3389 from internet exposure immediately. Implement a business VPN or zero-trust access solution for all remote connections."},
      {id:"s3q6",text:"Are endpoint protection tools such as antivirus or EDR installed and actively maintained on all business devices?",rec:"Deploy and maintain endpoint protection on every device. Microsoft Defender for Business is affordable for SMBs and significantly more effective than traditional antivirus."},
      {id:"s3q7",text:"Is there a defined process for applying security patches within a documented timeframe?",rec:"Establish a patch cadence: critical patches within 14 days, high severity within 30 days. Automate OS patching where possible and document exceptions."},
    ]},
  { id:"s4",num:"04",title:"Data Protection",
    desc:"Understanding what data you hold, where it lives, and how it is protected is foundational to both security and compliance. Data you do not know about is data you cannot protect.",
    questions:[
      {id:"s4q1",text:"Have you identified and documented the sensitive data types your business collects, stores, or transmits including PII, financial, or health information?",rec:"Conduct a data mapping exercise: inventory what sensitive data you hold, where it is stored, who can access it, and who it is shared with."},
      {id:"s4q2",text:"Is sensitive data encrypted at rest on servers, workstations, and portable devices?",rec:"Enable BitLocker on Windows or FileVault on Mac on all workstations and laptops. Verify server-level encryption is enabled for databases and file shares."},
      {id:"s4q3",text:"Is sensitive data encrypted in transit using HTTPS, TLS, or encrypted email?",rec:"Verify all internal and public-facing web services use HTTPS. Use TLS for email transmission and consider encrypted email for sensitive attachments."},
      {id:"s4q4",text:"Are business backups performed regularly, stored in at least two locations including one offsite or cloud, and tested for restoration?",rec:"Implement the 3-2-1 backup rule: 3 copies, on 2 media types, with 1 offsite or cloud. Test restoration at least quarterly. An untested backup is not a backup."},
      {id:"s4q5",text:"Is there a documented data retention and disposal policy? Are devices securely wiped or destroyed at end of life?",rec:"Document how long different data types are retained and how they are disposed of. Use NIST SP 800-88 compliant wiping tools. Physically destroy drives when in doubt."},
      {id:"s4q6",text:"Do you know which third-party vendors have access to your sensitive data, and have you reviewed their security practices?",rec:"Build a vendor data access inventory. For each vendor with access to sensitive data, obtain their SOC 2 report, ISO 27001 certificate, or completed security questionnaire."},
      {id:"s4q7",text:"Is access to sensitive data logged, and are those logs reviewed periodically for anomalies?",rec:"Enable access logging on systems containing sensitive data. Review logs monthly or use automated alerting for anomalous patterns such as bulk downloads or after-hours access."},
    ]},
  { id:"s5",num:"05",title:"Incident Response",
    desc:"A security incident is not a matter of if but when. Organizations without a response plan spend significantly more time and money recovering. Even a basic documented plan dramatically improves outcomes.",
    questions:[
      {id:"s5q1",text:"Does your organization have a documented Incident Response Plan outlining steps to take when a breach or security event occurs?",rec:"Download and customize the GSG Incident Response Plan template free at greensecuritygroup.com as an immediate starting point. A documented plan does not need to be perfect to be valuable."},
      {id:"s5q2",text:"Has the Incident Response Plan been reviewed or tested in a tabletop exercise in the past 12 months?",rec:"Schedule an annual tabletop exercise. Walk key staff through a realistic scenario such as ransomware or data theft and identify gaps before a real incident exposes them."},
      {id:"s5q3",text:"Do all staff know who to contact internally and externally if they suspect a security incident?",rec:"Create a printed or laminated incident contact card posted in your server room and distributed to key staff. Include internal contacts, your IT vendor, and your cyber insurance hotline."},
      {id:"s5q4",text:"Do you have cyber liability insurance covering data breach response costs, notification, and legal expenses?",rec:"Obtain cyber liability insurance quotes from at least two providers. Breach response costs routinely exceed $50,000 even for small incidents. Coverage is now essential for SMBs."},
      {id:"s5q5",text:"Is there a process for preserving evidence such as logs and disk images during a security incident without contaminating it?",rec:"Document basic evidence preservation guidance: do not power off affected systems without advice, capture memory and logs before shutdown, and isolate rather than destroy."},
      {id:"s5q6",text:"Have you identified your regulatory or legal notification obligations in the event of a data breach?",rec:"Consult with a lawyer familiar with data privacy law in your jurisdiction. Depending on industry, you may have obligations under PIPEDA, state privacy laws, HIPAA, or PCI DSS."},
    ]},
  { id:"s6",num:"06",title:"Vendor and Third-Party Risk",
    desc:"Your vendors, contractors, and SaaS tools are extensions of your attack surface. A breach at a trusted third party can expose your business just as effectively as a direct attack.",
    questions:[
      {id:"s6q1",text:"Do you maintain an inventory of all third-party vendors, contractors, and SaaS tools that have access to your systems or data?",rec:"Build a vendor inventory spreadsheet listing every vendor with system or data access, what they can access, your primary contact, and contract renewal date. Update quarterly."},
      {id:"s6q2",text:"Are vendor security practices reviewed before onboarding through SOC 2 reports, security questionnaires, or certifications?",rec:"Add a security review step to vendor onboarding. Request a SOC 2 Type II report, ISO 27001 certificate, or a completed questionnaire before granting access."},
      {id:"s6q3",text:"Do vendor contracts include security requirements, data handling obligations, and breach notification clauses?",rec:"Add security addendums to vendor contracts at next renewal. Key clauses: data handling requirements, breach notification within 24 to 48 hours, right to audit, and data deletion on termination."},
      {id:"s6q4",text:"Is vendor access to your systems limited to what is necessary and monitored while active?",rec:"Apply least privilege to vendor access. Use time-limited credentials for one-off access. Review active vendor connections quarterly and remove any that are no longer needed."},
      {id:"s6q5",text:"Is there a process for reviewing and revoking vendor access when a contract ends?",rec:"Include vendor offboarding in your contract terms and internal access management process. Audit and revoke all vendor credentials on the contract end date, not when someone remembers."},
      {id:"s6q6",text:"Are critical business functions dependent on a single vendor without a documented contingency plan?",rec:"Identify your top 3 most critical vendor dependencies. Document what you would do if each became unavailable for 24 hours or indefinitely. A written plan reduces recovery time dramatically."},
    ]},
  { id:"s7",num:"07",title:"Security Awareness",
    desc:"The most technically sophisticated security controls can be undone by a single employee clicking a phishing link. A security-aware workforce is one of the highest-return investments any organization can make.",
    questions:[
      {id:"s7q1",text:"Do all employees receive security awareness training at least annually, covering phishing, social engineering, and safe computing practices?",rec:"Implement annual security awareness training. Free or low-cost options include KnowBe4 Free Tools, SANS Security Awareness, and CISA's Cybersecurity Awareness Program."},
      {id:"s7q2",text:"Have employees been trained to recognize and report phishing emails, suspicious links, and social engineering attempts?",rec:"Include phishing recognition in annual training. Train staff on specific indicators: urgency, mismatched sender addresses, unexpected attachments, and requests to bypass normal process."},
      {id:"s7q3",text:"Is there a clear, low-friction process for employees to report suspected phishing without fear of blame?",rec:"Create a single easy-to-remember reporting mechanism such as a dedicated email address or a Report Phishing button in your email client. Make reporting feel like a win, not a failure."},
      {id:"s7q4",text:"Do you conduct phishing simulations or tests to measure and improve employee awareness?",rec:"Run phishing simulations at least twice per year. Use results to identify high-risk individuals for targeted training, not punishment. Several platforms offer free tiers for small teams."},
      {id:"s7q5",text:"Are new employees required to complete security awareness training as part of their onboarding process?",rec:"Add security awareness training to your new hire onboarding checklist. New employees are statistically the highest-risk group for phishing susceptibility in their first 90 days."},
      {id:"s7q6",text:"Are employees aware of and trained on your acceptable use, password, and data handling policies?",rec:"Require all staff to read and acknowledge your AUP, password policy, and data handling policies annually. Written acknowledgment creates accountability."},
      {id:"s7q7",text:"Is security awareness tailored to specific roles such as finance staff on business email compromise and IT staff on privileged access risks?",rec:"Identify your highest-risk roles: finance for BEC, executives for whaling, IT staff for privileged access misuse. Provide targeted training beyond the general annual program."},
    ]},
  { id:"s8",num:"08",title:"Cloud and Remote Work",
    desc:"The shift to cloud services and remote work has expanded the attack surface significantly. Controls that worked in an office-centric environment must be adapted for a distributed, cloud-first reality.",
    questions:[
      {id:"s8q1",text:"Are all cloud services including Microsoft 365, Google Workspace, and AWS inventoried and managed under a central IT or security review?",rec:"Build a SaaS inventory listing every cloud service in use, who owns the account, and what data it accesses. Shadow IT is one of the biggest SMB cloud risks."},
      {id:"s8q2",text:"Is MFA enforced at the tenant level on all cloud platforms, including administrative accounts?",rec:"Enable MFA enforcement as a tenant-level policy in Microsoft 365 via Conditional Access or Google Workspace via Admin Console. This single control prevents most account takeover attacks."},
      {id:"s8q3",text:"Are employees required to use a company-approved VPN or zero-trust solution when accessing business systems remotely?",rec:"Deploy a business VPN such as NordLayer or evaluate zero-trust network access. Ensure all remote connections to internal systems go through the approved solution."},
      {id:"s8q4",text:"Is there a policy restricting personal device use for business to devices enrolled in a mobile device management solution?",rec:"Implement a BYOD policy requiring MDM enrollment for any personal device accessing business email or systems. At minimum require a PIN lock and remote wipe capability."},
      {id:"s8q5",text:"Are cloud storage platforms configured to prevent unauthorized external sharing of sensitive data?",rec:"Audit sharing settings in OneDrive, SharePoint, or Google Drive. Disable anonymous link sharing for sensitive document libraries. Enable DLP policies where supported."},
      {id:"s8q6",text:"Is there a defined process for offboarding remote workers that includes revoking all cloud access, VPN credentials, and confirming device wipe?",rec:"Create a remote-specific offboarding checklist: revoke cloud access, disable MFA devices, initiate remote wipe of enrolled devices, and confirm completion before final payroll."},
    ]},
];


// ─── Utilities ────────────────────────────────────────────────────────────────
const ratingRGB   = p => p>=75?[61,220,104]:p>=50?[240,160,48]:p>=25?[224,96,48]:[208,48,32];
const ratingColor = p => p>=75?"#3ddc68":p>=50?"#f0a030":p>=25?"#e06030":"#d03020";
const ratingLabel = p => p>=75?"Strong Foundation":p>=50?"Moderate Risk":p>=25?"Elevated Risk":"Critical Exposure";
const secScore = (ans,sec) => {
  const max = sec.questions.length * 2;
  const score = sec.questions.reduce((s,q) => s + (ans[q.id]?.score ?? 0), 0);
  return { score, max, pct: Math.round(score / max * 100) };
};
const totalScore = ans => {
  const all = SECTIONS.flatMap(s => s.questions);
  const max = all.length * 2;
  const score = all.reduce((s,q) => s + (ans[q.id]?.score ?? 0), 0);
  return { score, max, pct: Math.round(score / max * 100) };
};
const critCount = ans =>
  SECTIONS.flatMap(s => s.questions).filter(q => (ans[q.id]?.score ?? 0) === 0).length;

// ─── PDF builder ──────────────────────────────────────────────────────────────
async function buildPDF(answers, orgName) {
  const JsPDF = await loadJsPDF();
  const doc   = new JsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const W = 215.9, H = 279.4, M = 15, CW = W - M * 2;
  const tots = totalScore(answers);
  const [rR,rG,rB] = ratingRGB(tots.pct);
  let pg = 1;

  const hdr = title => {
    doc.setFillColor(6,12,7); doc.rect(0,0,W,13,"F");
    doc.setFillColor(61,220,104); doc.rect(0,0,W,1.5,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(61,77,64);
    doc.text("GREEN SECURITY GROUP  \u00b7  CONFIDENTIAL", M, 9);
    doc.text(title, W-M, 9, { align:"right" });
    return 22;
  };
  const ftr = () => {
    doc.setFillColor(24,44,26); doc.rect(0,H-9,W,9,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(6); doc.setTextColor(61,77,64);
    doc.text("greensecuritygroup.com  \u00b7  paul@greensecuritygroup.com", M, H-3.5);
    doc.text("Page " + pg, W-M, H-3.5, { align:"right" });
  };
  const np = title => { ftr(); doc.addPage(); pg++; const y = hdr(title); doc.setFillColor(245,249,245); doc.rect(0,13,W,H-13,"F"); return y; };
  const chk = (y,n,t) => y+n > H-14 ? np(t) : y;

  // Cover
  doc.setFillColor(6,12,7); doc.rect(0,0,W,H,"F");
  doc.setFillColor(61,220,104); doc.rect(0,0,W,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(61,220,104);
  doc.text("GREEN SECURITY GROUP", M, 14);
  doc.setDrawColor(24,44,26); doc.setLineWidth(0.4); doc.line(M,18,W-M,18);
  doc.setTextColor(223,240,225); doc.setFont("helvetica","bold"); doc.setFontSize(40);
  doc.text("Security",M,80); doc.text("Assessment",M,97); doc.text("Report",M,114);
  doc.setFillColor(61,220,104); doc.rect(M,119,56,1.5,"F");
  if (orgName?.trim()) {
    doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(120,155,124);
    doc.text("Prepared for: " + orgName.trim(), M, 132);
  }
  doc.setFontSize(8.5); doc.setTextColor(61,77,64);
  doc.text("Assessment Date: " + new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), M, orgName?.trim() ? 142 : 132);
  // Score circle
  const cx = W-M-38, cy2 = 97, r = 30;
  doc.setDrawColor(24,44,26); doc.setLineWidth(8); doc.circle(cx,cy2,r,"S");
  doc.setDrawColor(rR,rG,rB); doc.setLineWidth(2.5); doc.circle(cx,cy2,r,"S");
  doc.setFillColor(11,26,13); doc.circle(cx,cy2,r-1.5,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(26); doc.setTextColor(rR,rG,rB);
  doc.text(tots.pct + "%", cx, cy2-2, { align:"center" });
  doc.setFontSize(6.5); doc.setTextColor(120,155,124); doc.text("OVERALL SCORE", cx, cy2+9, { align:"center" });
  const rl = ratingLabel(tots.pct).toUpperCase();
  const bw = doc.getTextWidth(rl) + 8;
  doc.setFillColor(rR,rG,rB); doc.roundedRect(cx-bw/2, cy2+14, bw, 7.5, 1,1,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(6,12,7);
  doc.text(rl, cx, cy2+19.5, { align:"center" });
  // Stat bar
  doc.setFillColor(11,26,13); doc.rect(0,H-28,W,28,"F");
  doc.setFillColor(24,44,26); doc.rect(0,H-29,W,0.5,"F");
  [["52","Questions"],["8","Domains"],[tots.score+"/"+tots.max,"Total Score"],[String(critCount(answers)),"Critical Gaps"]].forEach(([v,l],i) => {
    const sx = (W/4)*i + W/8;
    doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(61,220,104); doc.text(v, sx, H-16, { align:"center" });
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(61,77,64); doc.text(l, sx, H-8, { align:"center" });
  });

  // Executive summary
  let y = np("Executive Summary");
  doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(29,46,31);
  doc.text("Executive Summary", M, y); y += 10;
  doc.setFillColor(11,26,13); doc.roundedRect(M,y,CW,22,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(61,220,104);
  doc.text("OVERALL SECURITY POSTURE", M+8, y+8);
  doc.setFontSize(13); doc.setTextColor(223,240,225);
  doc.text(tots.score + " / " + tots.max + "  (" + tots.pct + "%)", M+8, y+17);
  const rw = doc.getTextWidth(ratingLabel(tots.pct)) + 10;
  doc.setFillColor(rR,rG,rB); doc.roundedRect(W-M-rw-4,y+8,rw+4,9,1,1,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(6,12,7);
  doc.text(ratingLabel(tots.pct), W-M-rw/2-4, y+14, { align:"center" });
  y += 28;
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(29,46,31);
  doc.text("Domain Score Breakdown", M, y); y += 7;
  SECTIONS.forEach(sec => {
    const ss = secScore(answers,sec); const [dr,dg,db] = ratingRGB(ss.pct);
    const bMax = CW*0.44, bFill = (ss.pct/100)*bMax;
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(61,220,104); doc.text(sec.num, M, y+4);
    doc.setFont("helvetica","normal"); doc.setTextColor(29,46,31); doc.text(sec.title, M+8, y+4);
    const bx = M+76;
    doc.setFillColor(220,235,222); doc.roundedRect(bx,y-1,bMax,7,1,1,"F");
    if (bFill > 0) { doc.setFillColor(dr,dg,db); doc.roundedRect(bx,y-1,bFill,7,1,1,"F"); }
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(dr,dg,db); doc.text(ss.pct+"%", bx+bMax+3, y+4);
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(120,155,124); doc.text(ss.score+"/"+ss.max, W-M, y+4, { align:"right" });
    y += 10;
  });
  y += 6; doc.setDrawColor(220,235,222); doc.setLineWidth(0.5); doc.line(M,y,W-M,y); y += 8;
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(29,46,31); doc.text("Score Interpretation", M, y); y += 7;
  [[ratingRGB(88),"75-100%","Strong Foundation","Maintain controls, address gaps, and schedule an annual review."],
   [ratingRGB(62),"50-74%","Moderate Risk","Develop a 90-day remediation plan. Prioritize lowest-scoring domains."],
   [ratingRGB(37),"25-49%","Elevated Risk","Treat top gaps as urgent. Consider engaging a qualified security advisor."],
   [ratingRGB(12),"0-24%","Critical Exposure","Immediate action required. Engage qualified security help."]].forEach(([rgb,range,lbl,desc]) => {
    doc.setFillColor(...rgb); doc.rect(M,y-3,3,7,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...rgb); doc.text(range, M+6, y+2);
    doc.setTextColor(29,46,31); doc.text(lbl, M+28, y+2);
    doc.setFont("helvetica","normal"); doc.setTextColor(80,100,82);
    const dl = doc.splitTextToSize(desc, CW-68); doc.text(dl, M+72, y+2); y += 10;
  });
  ftr();

  // Domain reports
  for (const sec of SECTIONS) {
    y = np("Domain " + sec.num + " - " + sec.title);
    const ss = secScore(answers,sec); const [dr,dg,db] = ratingRGB(ss.pct);
    doc.setFillColor(11,26,13); doc.roundedRect(M,y,CW,19,2,2,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(61,220,104);
    doc.text("DOMAIN " + sec.num + " OF 08", M+6, y+7);
    doc.setFontSize(12); doc.setTextColor(223,240,225); doc.text(sec.title, M+6, y+15);
    doc.setFontSize(14); doc.setTextColor(dr,dg,db); doc.text(ss.pct+"%", W-M-6, y+13, { align:"right" });
    doc.setFontSize(6.5); doc.setTextColor(61,77,64); doc.text(ss.score+"/"+ss.max+" pts", W-M-6, y+7, { align:"right" });
    y += 23;
    doc.setFont("helvetica","oblique"); doc.setFontSize(8.5); doc.setTextColor(80,100,82);
    const dl2 = doc.splitTextToSize(sec.desc, CW); doc.text(dl2, M, y); y += dl2.length*4+6;
    doc.setDrawColor(220,235,222); doc.setLineWidth(0.4); doc.line(M,y,W-M,y); y += 6;
    for (let qi = 0; qi < sec.questions.length; qi++) {
      const q = sec.questions[qi];
      const ans = answers[q.id]; const score = ans?.score ?? 0; const notes = ans?.notes?.trim() ?? "";
      const sl = score===2?"YES":score===1?"PARTIAL":"NO";
      const [qR,qG,qB] = score===2?[61,220,104]:score===1?[240,160,48]:[208,48,32];
      const qL = doc.splitTextToSize(q.text, CW-36);
      const rL = score < 2 ? doc.splitTextToSize("Recommendation: " + q.rec, CW-10) : [];
      const nL = notes ? doc.splitTextToSize("Note: " + notes, CW-10) : [];
      const bH = Math.max(qL.length*4,7) + rL.length*3.8 + nL.length*3.8 + 8;
      y = chk(y, bH, "Domain " + sec.num + " - " + sec.title + " cont.");
      doc.setFillColor(qR,qG,qB); doc.roundedRect(M,y,16,6,1,1,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(5.5); doc.setTextColor(6,12,7);
      doc.text(sl, M+8, y+4.2, { align:"center" });
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(120,155,124);
      doc.text("D"+sec.num+"."+String(qi+1).padStart(2,"0"), M+19, y+4.5);
      doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(29,46,31);
      doc.text(qL, M+34, y+4.5); y += Math.max(qL.length*4,7);
      if (rL.length) { doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(80,110,82); doc.text(rL,M+4,y+1); y += rL.length*3.8+2; }
      if (nL.length) { doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(120,150,122); doc.text(nL,M+4,y+1); y += nL.length*3.8+2; }
      y += 3; doc.setDrawColor(230,240,232); doc.setLineWidth(0.3); doc.line(M,y,W-M,y); y += 5;
    }
    ftr();
  }

  // Action plan
  y = np("Prioritized Action Plan");
  doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(29,46,31);
  doc.text("Prioritized Action Plan", M, y); y += 12;
  const crit = SECTIONS.flatMap(s => s.questions.filter(q => (answers[q.id]?.score??0)===0).map(q=>({s,q})));
  const part = SECTIONS.flatMap(s => s.questions.filter(q => (answers[q.id]?.score??0)===1).map(q=>({s,q})));
  const dItem = (s,q,rgb) => {
    const qL=doc.splitTextToSize(q.text,CW-20); const rL=doc.splitTextToSize(q.rec,CW-20);
    y = chk(y, qL.length*4+rL.length*3.8+10, "Prioritized Action Plan cont.");
    doc.setFillColor(...rgb); doc.roundedRect(M,y,5,5,0.5,0.5,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(80,100,82); doc.text("D"+s.num,M+8,y+4);
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(29,46,31); doc.text(qL,M+18,y+4); y+=qL.length*4+2;
    doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(80,110,82); doc.text(rL,M+18,y); y+=rL.length*3.8+6;
  };
  if (crit.length) { doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(208,48,32); doc.text("CRITICAL GAPS  -  Score 0/2  -  Address Immediately",M,y); y+=8; crit.forEach(({s,q})=>dItem(s,q,[208,48,32])); y+=4; }
  if (part.length) { y=chk(y,10,"Action Plan cont."); doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(240,160,48); doc.text("IMPROVEMENT AREAS  -  Score 1/2  -  Address in 30-90 Days",M,y); y+=8; part.forEach(({s,q})=>dItem(s,q,[240,160,48])); }
  y = chk(y,50,"Next Steps");
  y+=4; doc.setDrawColor(220,235,222); doc.setLineWidth(0.5); doc.line(M,y,W-M,y); y+=8;
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(29,46,31); doc.text("Next Steps",M,y); y+=8;
  ["Download the free Security Toolkit at greensecuritygroup.com - 90-Day Roadmap, Risk Register, and Policy Templates ready to use.",
   "Share this report with your IT vendor or MSP as a prioritized work order.",
   "Repeat this assessment in 6-12 months to measure improvement over time.",
   "For advisory support, reach out to paul@greensecuritygroup.com."].forEach(step => {
    doc.setFillColor(61,220,104); doc.circle(M+2,y+2,1.5,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(29,46,31);
    const ls = doc.splitTextToSize(step, CW-10); doc.text(ls,M+7,y+3.5); y += ls.length*4+4;
  });
  y+=4; y=chk(y,30,"AI Disclosure");
  doc.setFillColor(11,26,13); doc.roundedRect(M,y,CW,26,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(61,220,104); doc.text("AI DISCLOSURE",M+6,y+8);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(120,155,124);
  const aiL = doc.splitTextToSize("This assessment was developed with assistance from Claude (Anthropic). All content has been reviewed and validated by Paul Green, CISSP. AI accelerated the writing process; it did not substitute for the practitioner expertise behind it.", CW-12);
  doc.text(aiL, M+6, y+15); ftr();
  doc.save("GSG-Security-Assessment-" + new Date().toISOString().split("T")[0] + ".pdf");
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `

  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#060c07;--surface:#0b1a0d;--surface2:#0f2011;
    --border:#182c1a;--border-hi:#274d2a;
    --green:#3ddc68;--gdim:rgba(61,220,104,0.08);--gglow:rgba(61,220,104,0.18);
    --amber:#f0a030;--red:#d03020;
    --text:#dff0e1;--muted:#789b7c;--dim:#3d5840;
    --serif:'Instrument Serif',Georgia,serif;
    --sans:'IBM Plex Sans',system-ui,sans-serif;
    --mono:'IBM Plex Mono','Courier New',monospace;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.65;-webkit-font-smoothing:antialiased;}
  .nav{position:sticky;top:0;z-index:100;background:rgba(6,12,7,0.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);padding:0 2rem;}
  .nav-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;}
  .logo{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:0.85rem;color:var(--text);background:none;border:none;cursor:pointer;}
  .logo-mark{width:34px;height:34px;border-radius:5px;background:var(--green);color:var(--bg);display:flex;align-items:center;justify-content:center;font-weight:500;font-size:0.8rem;flex-shrink:0;}
  .nav-links{display:flex;gap:1.75rem;list-style:none;align-items:center;}
  .nav-links button,.nav-links a{font-family:var(--mono);font-size:0.78rem;color:var(--muted);text-decoration:none;background:none;border:none;cursor:pointer;transition:color 0.2s;padding:0;}
  .nav-links button:hover,.nav-links a:hover{color:var(--green);}
  .nav-active{color:var(--green) !important;}
  .nav-back{font-family:var(--mono);font-size:0.78rem;color:var(--muted);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.4rem;transition:color 0.2s;}
  .nav-back:hover{color:var(--green);}
  .hero{padding:7rem 2rem 5.5rem;max-width:1140px;margin:0 auto;position:relative;}
  .hero::before{content:'';position:absolute;top:0;left:-2rem;right:-2rem;bottom:0;background:radial-gradient(ellipse 60% 70% at 15% 60%,rgba(61,220,104,0.055) 0%,transparent 70%);pointer-events:none;}
  .eyebrow{font-family:var(--mono);font-size:0.72rem;color:var(--green);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1.4rem;display:flex;align-items:center;gap:0.75rem;}
  .eyebrow::before{content:'';width:24px;height:1px;background:var(--green);display:inline-block;}
  .hero h1{font-family:var(--serif);font-size:clamp(2.8rem,5.5vw,4.75rem);line-height:1.1;margin-bottom:1.5rem;max-width:760px;}
  .hero h1 em{color:var(--green);font-style:italic;}
  .hero-sub{font-size:1.05rem;color:var(--muted);max-width:560px;line-height:1.8;margin-bottom:3.25rem;}
  .hero-stats{display:flex;gap:3.5rem;flex-wrap:wrap;padding-top:2.25rem;border-top:1px solid var(--border);}
  .stat-label{font-family:var(--mono);font-size:0.65rem;color:var(--dim);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.2rem;}
  .stat-value{font-family:var(--serif);font-size:1.9rem;color:var(--text);}
  hr.divider{border:none;border-top:1px solid var(--border);}
  .projects-wrap{padding:0 2rem;}
  .project{max-width:1140px;margin:0 auto;padding:6rem 0;border-bottom:1px solid var(--border);}
  .project-header{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;margin-bottom:3.5rem;align-items:start;}
  .proj-num{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.15em;margin-bottom:0.85rem;display:flex;align-items:center;gap:0.6rem;}
  .proj-num::before{content:'';width:18px;height:1px;background:var(--green);display:inline-block;}
  .project h2{font-family:var(--serif);font-size:clamp(2rem,3.5vw,3rem);line-height:1.15;}
  .proj-desc p{color:var(--muted);font-size:0.95rem;line-height:1.85;margin-bottom:1.2rem;}
  .proj-desc p:last-child{margin-bottom:0;}
  .includes{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:2rem;margin-bottom:2.5rem;}
  .includes-title{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--green);margin-bottom:1.25rem;}
  .feat-list{display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;list-style:none;}
  .feat-list li{font-size:0.875rem;color:var(--muted);display:flex;align-items:flex-start;gap:0.6rem;}
  .feat-list li::before{content:'\2192';color:var(--green);font-family:var(--mono);font-size:0.78rem;flex-shrink:0;margin-top:0.1em;}
  .btn-primary{display:inline-flex;align-items:center;gap:0.6rem;background:var(--green);color:var(--bg);border:none;border-radius:5px;padding:0.875rem 1.75rem;font-family:var(--mono);font-size:0.82rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.2s;}
  .btn-primary:hover{background:#5ef08a;transform:translateY(-1px);box-shadow:0 8px 28px var(--gglow);}
  .btn-ghost{display:inline-flex;align-items:center;gap:0.5rem;background:transparent;color:var(--green);border:1px solid var(--border-hi);border-radius:4px;padding:0.45rem 0.9rem;font-family:var(--mono);font-size:0.73rem;cursor:pointer;text-decoration:none;transition:all 0.2s;white-space:nowrap;}
  .btn-ghost:hover{border-color:var(--green);background:var(--gdim);}
  .toolkit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.1rem;margin-bottom:2.5rem;}
  .tool-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;display:flex;flex-direction:column;gap:0.7rem;transition:all 0.2s;}
  .tool-card:hover{border-color:var(--border-hi);background:var(--surface2);}
  .tool-id{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.1em;}
  .tool-name{font-size:0.975rem;font-weight:500;color:var(--text);}
  .tool-desc{font-size:0.82rem;color:var(--muted);line-height:1.65;flex:1;}
  .tool-footer{font-family:var(--mono);font-size:0.68rem;color:var(--dim);padding-top:0.75rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
  .reviews{margin-top:4rem;padding-top:3rem;border-top:1px solid var(--border);}
  .reviews-header{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:2rem;}
  .rev-label{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);}
  .rev-count{font-family:var(--mono);font-size:0.72rem;color:var(--dim);}
  .rev-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.1rem;margin-bottom:2rem;}
  .rev-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;}
  .stars{display:flex;gap:3px;margin-bottom:0.75rem;}
  .star-on{color:var(--green);font-size:0.85rem;} .star-off{color:var(--border-hi);font-size:0.85rem;}
  .rev-text{font-size:0.875rem;color:var(--muted);line-height:1.75;margin-bottom:1rem;font-style:italic;}
  .rev-author{font-size:0.8rem;color:var(--text);font-weight:500;}
  .rev-role{font-size:0.72rem;color:var(--dim);font-family:var(--mono);margin-top:2px;}
  .rev-form{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.75rem;}
  .form-title{font-family:var(--mono);font-size:0.7rem;color:var(--muted);letter-spacing:0.1em;margin-bottom:1.25rem;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
  .field{display:flex;flex-direction:column;gap:0.4rem;} .field.full{grid-column:1/-1;}
  .field label{font-size:0.72rem;color:var(--muted);font-family:var(--mono);}
  .field input,.field textarea,.field select{background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--sans);font-size:0.875rem;padding:0.6rem 0.75rem;outline:none;width:100%;transition:border-color 0.2s;}
  .field input:focus,.field textarea:focus,.field select:focus{border-color:var(--green);}
  .field textarea{resize:vertical;min-height:90px;} .field select option{background:var(--bg);}
  .btn-submit{background:transparent;border:1px solid var(--border-hi);color:var(--green);font-family:var(--mono);font-size:0.78rem;padding:0.65rem 1.4rem;border-radius:4px;cursor:pointer;transition:all 0.2s;margin-top:0.5rem;}
  .btn-submit:hover{border-color:var(--green);background:var(--gdim);}
  .form-ok{color:var(--green);font-family:var(--mono);font-size:0.8rem;padding:0.85rem;background:var(--gdim);border:1px solid rgba(61,220,104,0.2);border-radius:4px;text-align:center;}
  .rec-section{padding:5rem 2rem;border-bottom:1px solid var(--border);}
  .rec-inner{max-width:1140px;margin:0 auto;}
  .sec-eyebrow{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.85rem;display:flex;align-items:center;gap:0.6rem;}
  .sec-eyebrow::before{content:'';width:18px;height:1px;background:var(--green);display:inline-block;}
  .rec-hdr h2{font-family:var(--serif);font-size:clamp(1.75rem,3vw,2.5rem);line-height:1.2;margin-bottom:0.75rem;}
  .rec-hdr p{font-size:0.95rem;color:var(--muted);max-width:640px;line-height:1.8;margin-bottom:2.5rem;}
  .rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:1.25rem;margin-bottom:1.5rem;}
  .rec-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.75rem;display:flex;flex-direction:column;gap:0.9rem;transition:all 0.2s;}
  .rec-card:hover{border-color:var(--border-hi);background:var(--surface2);}
  .rec-cat{font-family:var(--mono);font-size:0.64rem;color:var(--green);letter-spacing:0.12em;text-transform:uppercase;}
  .rec-name{font-size:1.05rem;font-weight:600;color:var(--text);}
  .rec-desc{font-size:0.875rem;color:var(--muted);line-height:1.75;flex:1;}
  .rec-foot{display:flex;justify-content:space-between;align-items:center;padding-top:0.9rem;border-top:1px solid var(--border);}
  .rec-tags{display:flex;gap:0.4rem;flex-wrap:wrap;}
  .tag-tier{font-family:var(--mono);font-size:0.6rem;color:var(--dim);background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:0.18rem 0.5rem;}
  .tag-aff{font-family:var(--mono);font-size:0.6rem;color:var(--green);background:var(--gdim);border:1px solid rgba(61,220,104,0.2);border-radius:3px;padding:0.18rem 0.5rem;}
  .rec-link{font-family:var(--mono);font-size:0.72rem;color:var(--green);text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;border:1px solid var(--border-hi);border-radius:4px;padding:0.35rem 0.75rem;transition:all 0.2s;white-space:nowrap;}
  .rec-link:hover{border-color:var(--green);background:var(--gdim);}
  .aff-note{font-family:var(--mono);font-size:0.68rem;color:var(--dim);line-height:1.7;padding:1rem 1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:6px;}
  .ai-section{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:5rem 2rem;}
  .ai-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:300px 1fr;gap:5rem;align-items:start;}
  .ai-label{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.75rem;}
  .ai-section h3{font-family:var(--serif);font-size:1.75rem;line-height:1.25;}
  .ai-body p{font-size:0.925rem;color:var(--muted);line-height:1.85;margin-bottom:1.1rem;}
  .ai-body p:last-child{margin-bottom:0;} .ai-body strong{color:var(--text);font-weight:500;} .ai-body a{color:var(--green);text-decoration:none;} .ai-body a:hover{text-decoration:underline;}
  .footer-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;padding:2.75rem 2rem;}
  .footer-copy{font-family:var(--mono);font-size:0.72rem;color:var(--dim);}
  .footer-name{font-size:0.8rem;color:var(--muted);margin-bottom:0.2rem;}
  .footer-links{display:flex;gap:1.75rem;list-style:none;}
  .footer-links a,.footer-links button{font-family:var(--mono);font-size:0.72rem;color:var(--dim);text-decoration:none;background:none;border:none;cursor:pointer;transition:color 0.2s;}
  .footer-links a:hover,.footer-links button:hover{color:var(--green);}
  .ass-prog{height:3px;background:var(--border);display:flex;}
  .ass-prog-seg{height:3px;transition:background 0.3s;}
  .ass-sec-hdr{background:var(--surface);border-bottom:1px solid var(--border);padding:1.25rem 2rem;}
  .ass-sec-inner{max-width:1140px;margin:0 auto;}
  .ass-eyebrow{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.12em;margin-bottom:0.3rem;display:flex;align-items:center;gap:0.5rem;}
  .ass-eyebrow::before{content:'';width:14px;height:1px;background:var(--green);}
  .ass-sec-title{font-size:1.35rem;font-weight:600;}
  .ass-wrap{max-width:1140px;margin:0 auto;padding:1.75rem 2rem;}
  .ass-desc{background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:1rem 1.25rem;margin-bottom:1.25rem;}
  .ass-desc p{font-size:0.9rem;color:var(--muted);line-height:1.75;}
  .ass-qlist{display:flex;flex-direction:column;gap:0.85rem;margin-bottom:2rem;}
  .q-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.15rem 1.35rem;transition:border-color 0.2s;}
  .q-card.answered{border-color:var(--border-hi);}
  .q-top{display:flex;align-items:flex-start;gap:0.85rem;margin-bottom:0.9rem;}
  .q-num{font-family:var(--mono);font-size:0.66rem;color:var(--green);flex-shrink:0;margin-top:3px;white-space:nowrap;}
  .q-text{font-size:0.925rem;line-height:1.65;}
  .q-acts{display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;}
  .s-btn{background:transparent;border:1px solid var(--border-hi);border-radius:4px;color:var(--muted);font-family:var(--mono);font-size:0.75rem;padding:0.45rem 0.9rem;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:68px;}
  .s-btn .pts{font-size:0.6rem;opacity:0.6;}
  .s-btn.sy{background:rgba(61,220,104,0.12);border-color:var(--green);color:var(--green);}
  .s-btn.sp{background:rgba(240,160,48,0.12);border-color:var(--amber);color:var(--amber);}
  .s-btn.sn{background:rgba(208,48,32,0.12);border-color:var(--red);color:var(--red);}
  .notes-tog{margin-left:auto;background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--dim);font-family:var(--mono);font-size:0.66rem;padding:0.3rem 0.7rem;cursor:pointer;white-space:nowrap;}
  .notes-tog:hover{border-color:var(--border-hi);color:var(--muted);}
  .notes-ta{margin-top:0.75rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--sans);font-size:0.875rem;padding:0.6rem 0.8rem;resize:vertical;min-height:68px;width:100%;outline:none;}
  .notes-ta:focus{border-color:var(--green);} .notes-ta::placeholder{color:var(--dim);}
  .ass-foot{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;border-top:1px solid var(--border);}
  .ass-btn{background:transparent;border:1px solid var(--border-hi);border-radius:5px;color:var(--muted);font-family:var(--mono);font-size:0.78rem;padding:0.65rem 1.4rem;cursor:pointer;transition:all 0.2s;}
  .ass-btn:hover:not(:disabled){border-color:var(--green);color:var(--green);}
  .ass-btn:disabled{opacity:0.3;cursor:not-allowed;}
  .ass-btn.pri{background:var(--green);color:var(--bg);border-color:var(--green);font-weight:500;}
  .ass-btn.pri:hover:not(:disabled){background:#5ef08a;}
  .ass-status{font-family:var(--mono);font-size:0.7rem;color:var(--dim);}
  .ass-intro{min-height:calc(100vh - 64px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 2rem;text-align:center;}
  .ass-intro-ey{font-family:var(--mono);font-size:0.72rem;color:var(--green);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.6rem;justify-content:center;}
  .ass-intro-ey::before,.ass-intro-ey::after{content:'';width:20px;height:1px;background:var(--green);}
  .ass-intro h2{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);line-height:1.2;margin-bottom:1rem;max-width:580px;}
  .ass-intro h2 em{color:var(--green);font-style:italic;}
  .ass-intro-sub{color:var(--muted);font-size:1rem;max-width:520px;line-height:1.8;margin-bottom:2.5rem;}
  .ass-stats{display:flex;gap:2.5rem;justify-content:center;flex-wrap:wrap;padding:1.75rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:2.5rem;width:100%;max-width:560px;}
  .ass-stat{text-align:center;}
  .ass-stat-n{font-family:var(--mono);font-size:1.6rem;color:var(--green);display:block;font-weight:500;}
  .ass-stat-l{font-family:var(--mono);font-size:0.65rem;color:var(--dim);letter-spacing:0.08em;text-transform:uppercase;}
  .res-wrap{max-width:1140px;margin:0 auto;padding:2.5rem 2rem;}
  .res-hero{text-align:center;padding:2.5rem 1.5rem;margin-bottom:2.5rem;border-bottom:1px solid var(--border);}
  .score-circle{width:120px;height:120px;border-radius:50%;margin:0 auto 1.25rem;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid;background:var(--surface);}
  .score-big{font-family:var(--mono);font-size:2.2rem;font-weight:500;line-height:1;}
  .score-sub{font-family:var(--mono);font-size:0.62rem;color:var(--muted);margin-top:3px;}
  .rating-badge{display:inline-block;padding:0.3rem 1rem;border-radius:20px;font-family:var(--mono);font-size:0.78rem;font-weight:500;color:var(--bg);margin-bottom:0.75rem;}
  .score-detail{font-family:var(--mono);font-size:0.8rem;color:var(--muted);}
  .dom-grid{margin-bottom:2.5rem;}
  .dom-row{display:flex;align-items:center;gap:0.9rem;padding:0.6rem 0;border-bottom:1px solid var(--border);}
  .dom-num{font-family:var(--mono);font-size:0.68rem;color:var(--green);width:24px;flex-shrink:0;}
  .dom-name{font-size:0.875rem;width:180px;flex-shrink:0;}
  .dom-bar{flex:1;background:var(--border);border-radius:3px;height:6px;overflow:hidden;}
  .dom-fill{height:6px;border-radius:3px;transition:width 0.6s ease;}
  .dom-pct{font-family:var(--mono);font-size:0.72rem;width:36px;text-align:right;flex-shrink:0;}
  .dom-sc{font-family:var(--mono);font-size:0.68rem;color:var(--dim);width:44px;text-align:right;flex-shrink:0;}
  .dl-box{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.75rem;margin-bottom:1.5rem;}
  .dl-lbl{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1rem;}
  .org-input{background:var(--bg);border:1px solid var(--border);border-radius:5px;color:var(--text);font-family:var(--sans);font-size:0.95rem;padding:0.7rem 1rem;width:100%;outline:none;margin-bottom:1rem;}
  .org-input:focus{border-color:var(--green);} .org-input::placeholder{color:var(--dim);}
  .dl-btn{width:100%;background:var(--green);color:var(--bg);border:none;border-radius:6px;padding:0.9rem 1.5rem;font-family:var(--mono);font-size:0.9rem;font-weight:500;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:0.6rem;}
  .dl-btn:hover:not(:disabled){background:#5ef08a;transform:translateY(-1px);box-shadow:0 6px 20px var(--gglow);}
  .dl-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .err-msg{font-family:var(--mono);font-size:0.75rem;color:var(--red);margin-top:0.5rem;text-align:center;}
  .restart-btn{background:transparent;border:1px solid var(--border);border-radius:5px;color:var(--muted);font-family:var(--mono);font-size:0.78rem;padding:0.65rem 1.5rem;cursor:pointer;transition:all 0.2s;width:100%;}
  .restart-btn:hover{border-color:var(--border-hi);color:var(--text);}
  .sec-lbl{font-family:var(--mono);font-size:0.68rem;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;}
  .about-hero{padding:5rem 2rem 4rem;background:var(--surface);border-bottom:1px solid var(--border);}
  .about-hero-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:3rem;align-items:center;}
  .about-avatar{width:100px;height:100px;border-radius:50%;background:var(--gdim);border:2px solid var(--border-hi);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:1.5rem;font-weight:500;color:var(--green);flex-shrink:0;}
  .about-title{font-family:var(--serif);font-size:clamp(2rem,4vw,3.25rem);line-height:1.1;margin-bottom:0.5rem;}
  .about-sub{font-family:var(--mono);font-size:0.82rem;color:var(--muted);display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;}
  .about-body{max-width:1140px;margin:0 auto;padding:4rem 2rem;display:grid;grid-template-columns:1fr 340px;gap:4.5rem;align-items:start;}
  .about-bio h3{font-family:var(--serif);font-size:1.6rem;margin-bottom:1.5rem;}
  .about-bio p{font-size:0.95rem;color:var(--muted);line-height:1.9;margin-bottom:1.35rem;}
  .about-bio p:last-child{margin-bottom:0;} .about-bio strong{color:var(--text);font-weight:500;}
  .about-sidebar{display:flex;flex-direction:column;gap:1.5rem;}
  .sb-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.5rem;}
  .sb-title{font-family:var(--mono);font-size:0.68rem;color:var(--green);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:1.1rem;}
  .cert-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;}
  .cert-badge{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:0.6rem 0.75rem;}
  .cert-code{font-family:var(--mono);font-size:0.8rem;font-weight:500;}
  .cert-issuer{font-family:var(--mono);font-size:0.6rem;color:var(--dim);margin-top:2px;}
  .cert-more{background:var(--gdim);border:1px solid rgba(61,220,104,0.2);border-radius:6px;padding:0.6rem 0.75rem;grid-column:1/-1;text-align:center;}
  .cert-more-n{font-family:var(--mono);font-size:0.9rem;color:var(--green);font-weight:500;}
  .cert-more-l{font-family:var(--mono);font-size:0.62rem;color:var(--muted);}
  .stat-list{display:flex;flex-direction:column;gap:0.75rem;}
  .stat-item{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:0.75rem;border-bottom:1px solid var(--border);}
  .stat-item:last-child{border-bottom:none;padding-bottom:0;}
  .stat-item-l{font-family:var(--mono);font-size:0.72rem;color:var(--muted);}
  .stat-item-v{font-family:var(--mono);font-size:0.78rem;color:var(--green);text-align:right;max-width:55%;}
  .about-contact{background:var(--surface);border-top:1px solid var(--border);padding:4rem 2rem;}
  .ac-inner{max-width:1140px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem;}
  .ac-inner h3{font-family:var(--serif);font-size:1.75rem;}
  .ac-inner p{font-size:0.9rem;color:var(--muted);margin-top:0.5rem;}
  .ac-btns{display:flex;gap:1rem;flex-wrap:wrap;}
  @media(max-width:900px){
    .about-hero-inner,.about-body{grid-template-columns:1fr;}
    .about-body{gap:2.5rem;} .about-sidebar{flex-direction:row;flex-wrap:wrap;} .about-sidebar>*{flex:1;min-width:240px;}
    .project-header{grid-template-columns:1fr;gap:2rem;} .feat-list{grid-template-columns:1fr;}
    .ai-inner{grid-template-columns:1fr;gap:2rem;} .form-grid{grid-template-columns:1fr;}
    .hero-stats{gap:1.75rem;} .nav-links{gap:1.25rem;}
  }
  @media(max-width:600px){
    .hero{padding:4.5rem 1.25rem 3.5rem;} .project{padding:3.5rem 0;}
    .projects-wrap,.rec-section,.ai-section{padding-left:1.25rem;padding-right:1.25rem;}
    .footer-inner{padding:2rem 1.25rem;flex-direction:column;align-items:flex-start;}
    .nav{padding:0 1.25rem;} .about-body{padding:2.5rem 1.25rem;}
    .about-hero,.about-contact{padding-left:1.25rem;padding-right:1.25rem;}
    .ac-inner{flex-direction:column;align-items:flex-start;}
    .dom-name{width:120px;} .ass-wrap,.res-wrap{padding:1.75rem 1.25rem;}
  }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────
const IcoDl  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoArr = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoExt = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

// ─── Static data ─────────────────────────────────────────────────────────────
const REC_TOOLS = [
  { cat:"Password Management",      name:"Bitwarden",                       desc:"Open-source password manager with a generous free tier and affordable Teams plan. The first tool we recommend to every SMB. Self-hostable for organizations that require it.",                                                                              tier:"Free / Paid", aff:true,  url:"https://bitwarden.com" },
  { cat:"Business VPN",             name:"NordLayer",                       desc:"Business-grade network access security built for SMBs. Centralized team management, zero-trust architecture, and simple deployment without the complexity of enterprise VPN solutions.",                                                                   tier:"Paid",        aff:true,  url:"https://nordlayer.com" },
  { cat:"Cloud Backup",             name:"Backblaze B2",                    desc:"Affordable cloud storage and backup purpose-built for the offsite leg of the 3-2-1 backup rule. Straightforward per-GB pricing with no egress fees when paired with Cloudflare.",                                                                        tier:"Paid",        aff:true,  url:"https://backblaze.com/cloud-storage" },
  { cat:"Endpoint Protection",      name:"Microsoft Defender for Business", desc:"Enterprise-grade EDR made accessible for SMBs. Included with Microsoft 365 Business Premium and a significant step up from traditional antivirus for Windows-centric environments.",                                                                     tier:"Paid",        aff:false, url:"https://microsoft.com/security/business/endpoint-security/microsoft-defender-business" },
  { cat:"DNS and Network Security", name:"Cloudflare",                      desc:"Free DNS, DDoS protection, and web application firewall. The free tier covers most SMB needs with enterprise-grade infrastructure. Paid tiers add meaningful control over traffic policies and zero-trust access.",                                        tier:"Free / Paid", aff:false, url:"https://cloudflare.com" },
  { cat:"Security Awareness",       name:"KnowBe4",                        desc:"Security awareness training and phishing simulation platform with free tools for small teams. Includes phishing templates, training modules, and a Security Culture Survey to measure baseline employee awareness.",                                       tier:"Free / Paid", aff:false, url:"https://knowbe4.com" },
];

const TOOLKIT = [
  { id:"GSG-01", name:"SMB Security Guide",        desc:"20-page plain-language guide covering foundational concepts, common threats, and practical controls for small businesses.",         fmt:"PDF \u00b7 20 pages",    href:"/downloads/gsg-01-security-guide.pdf" },
  { id:"GSG-02", name:"Risk Assessment Checklist", desc:"Structured checklist for conducting an internal risk review across all eight core SMB control domains.",                           fmt:"PDF \u00b7 Checklist",   href:"/downloads/gsg-02-risk-checklist.pdf" },
  { id:"GSG-03", name:"Policy Templates",          desc:"Three ready-to-customize policies: Acceptable Use Policy, Password Policy, and Incident Response Plan.",                          fmt:"PDF \u00b7 3 documents",  href:"/downloads/gsg-03-policy-templates.pdf" },
  { id:"GSG-04", name:"90-Day Security Roadmap",   desc:"Phased action plan broken into 30-day milestones to move from baseline awareness to measurable security improvement.",            fmt:"PDF \u00b7 Roadmap",      href:"/downloads/gsg-04-90day-roadmap.pdf" },
  { id:"GSG-05", name:"Risk Register",             desc:"Pre-formatted Excel workbook to track identified risks, owners, mitigation actions, and residual risk scores over time.",        fmt:"XLSX \u00b7 Spreadsheet", href:"/downloads/gsg-05-risk-register.xlsx" },
];

const CERTS = [
  { code:"CISSP",     issuer:"(ISC)\u00b2" },
  { code:"CySA+",     issuer:"CompTIA" },
  { code:"SSCP",      issuer:"(ISC)\u00b2" },
  { code:"Security+", issuer:"CompTIA" },
];

const ASS_REV = [
  { name:"Mark T.",     role:"IT Manager, Regional Manufacturer",  rating:5, text:"Found three critical gaps we had completely overlooked. The structured format made it easy to present findings to leadership." },
  { name:"Sarah K.",    role:"Office Manager, Regional Law Firm",   rating:5, text:"Without a technical background I was still able to understand where we stood and what questions to bring to our IT vendor. Exactly what small firms need." },
  { name:"David R.",    role:"Operations Director, Food Distribution", rating:4, text:"Eight sections covering everything from physical security to cloud hygiene. Per-domain scoring made prioritization very clear." },
];
const TK_REV = [
  { name:"Jennifer M.", role:"Owner, Dental Practice",              rating:5, text:"The policy templates saved us weeks of work. Our compliance consultant was impressed we already had these drafted." },
  { name:"Carlos B.",   role:"IT Director, Credit Union",           rating:5, text:"The Risk Register is exactly what I needed for board-level reporting — clean, professional, and easy to customize." },
  { name:"Priya N.",    role:"COO, E-commerce Startup",             rating:4, text:"The 90-Day Roadmap gave us something actionable immediately. Week 10 and we already feel significantly more confident." },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Stars({ n }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => <span key={i} className={i <= n ? "star-on" : "star-off"}>&#9733;</span>)}
    </div>
  );
}

function ReviewSection({ seed }) {
  const [reviews, setReviews] = useState(seed);
  const [form, setForm] = useState({ name:"", role:"", rating:"5", text:"" });
  const [ok, setOk] = useState(false);
  const upd = (k,v) => setForm(p => ({ ...p, [k]:v }));
  const submit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    setReviews(r => [...r, { ...form, rating: parseInt(form.rating) }]);
    setForm({ name:"", role:"", rating:"5", text:"" });
    setOk(true); setTimeout(() => setOk(false), 3500);
  };
  return (
    <div className="reviews">
      <div className="reviews-header">
        <div className="rev-label">// Community Reviews</div>
        <div className="rev-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
      </div>
      <div className="rev-cards">
        {reviews.map((r,i) => (
          <div key={i} className="rev-card">
            <Stars n={r.rating}/>
            <p className="rev-text">&#8220;{r.text}&#8221;</p>
            <div className="rev-author">{r.name}</div>
            <div className="rev-role">{r.role}</div>
          </div>
        ))}
      </div>
      <div className="rev-form">
        <div className="form-title">// Leave a Review</div>
        {ok ? (
          <div className="form-ok">&#10003; Review received &#8212; thank you.</div>
        ) : (
          <>
            <div className="form-grid">
              <div className="field"><label>Name</label><input type="text" placeholder="Your name" value={form.name} onChange={e=>upd("name",e.target.value)}/></div>
              <div className="field"><label>Role / Organization (optional)</label><input type="text" placeholder="e.g. IT Manager, 30-person firm" value={form.role} onChange={e=>upd("role",e.target.value)}/></div>
              <div className="field"><label>Rating</label>
                <select value={form.rating} onChange={e=>upd("rating",e.target.value)}>
                  <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; &#8212; Excellent</option>
                  <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734; &#8212; Good</option>
                  <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734; &#8212; Average</option>
                  <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734; &#8212; Below Average</option>
                  <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734; &#8212; Poor</option>
                </select>
              </div>
              <div className="field full"><label>Your Review</label><textarea placeholder="What did you find useful? How did you apply it?" value={form.text} onChange={e=>upd("text",e.target.value)}/></div>
            </div>
            <button className="btn-submit" onClick={submit}>Submit Review &#8594;</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Nav + Footer ─────────────────────────────────────────────────────────────
function SiteNav({ view, setView }) {
  const goHome = (anchor) => {
    setView("home");
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior:"smooth" }), 80);
  };
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="logo" onClick={() => goHome()}>
          <div className="logo-mark">G/</div>
          <span>Green Security Group</span>
        </button>
        <ul className="nav-links">
          <li><button className={view==="about" ? "nav-active" : ""} onClick={() => setView("about")}>About</button></li>
          <li><button onClick={() => goHome("projects")}>Projects</button></li>
          <li><button onClick={() => goHome("tools")}>Tools</button></li>
          <li><button onClick={() => goHome("ai-disclosure")}>AI Disclosure</button></li>
          <li><a href="mailto:paul@greensecuritygroup.com">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

function SiteFooter({ setView }) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-name">Green Security Group</div>
          <div className="footer-copy">Paul Green, CISSP &#183; Nova Scotia, Canada</div>
        </div>
        <ul className="footer-links">
          <li><a href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="mailto:paul@greensecuritygroup.com">Email</a></li>
          <li><button onClick={() => setView("about")}>About</button></li>
          <li><button onClick={() => setView("home")}>AI Disclosure</button></li>
        </ul>
      </div>
    </footer>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage({ setView }) {
  return (
    <div>
      <section className="hero">
        <div className="eyebrow">Open Security Projects &#183; Free for SMBs</div>
        <h1>Professional security tools,<br/><em>built for small business.</em></h1>
        <p className="hero-sub">
          Green Security Group is an ongoing project to make professional-grade cybersecurity resources
          genuinely accessible to small and medium businesses &#8212; without an enterprise budget or a
          dedicated security team. Everything here is free. No accounts. No paywalls.
        </p>
        <div className="hero-stats">
          {[["Active Projects","02"],["Assessment Questions","52"],["Toolkit Documents","05"],["Cost to You","$0"]].map(([l,v]) => (
            <div key={l}><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
          ))}
        </div>
      </section>

      <hr className="divider"/>

      <div className="projects-wrap" id="projects">
        {/* ── Project 01 ── */}
        <div className="project">
          <div className="project-header">
            <div>
              <div className="proj-num">PROJECT 01</div>
              <h2>SMB Security<br/>Assessment</h2>
            </div>
            <div className="proj-desc">
              <p>Designed specifically for small and medium businesses, this assessment gives you a structured, honest picture of your current security posture across eight critical control domains &#8212; without requiring a security background to complete or understand.</p>
              <p>The 52-question framework covers physical security, access controls, network defenses, data protection, incident response readiness, vendor risk, employee security awareness, and cloud and remote work hygiene. Each section is scored independently so you can identify and prioritize the highest-risk areas without being overwhelmed by the full scope.</p>
              <p>Complete the assessment online, answer at your own pace with optional notes per question, and download a full professional PDF report with tailored recommendations when done. Your answers never leave your browser.</p>
            </div>
          </div>
          <div className="includes">
            <div className="includes-title">// What&#39;s Included</div>
            <ul className="feat-list">
              <li>52-question structured assessment</li>
              <li>8 security control domains</li>
              <li>Yes / Partial / No scoring with notes</li>
              <li>Per-domain score breakdown</li>
              <li>Tailored recommendations per finding</li>
              <li>Prioritized action plan</li>
              <li>Professional PDF report &#8212; downloaded locally</li>
              <li>No account or data upload required</li>
            </ul>
          </div>
          <button className="btn-primary" onClick={() => setView("assessment")}>
            Start Assessment <IcoArr/>
          </button>
          <ReviewSection seed={ASS_REV}/>
        </div>

        {/* ── Project 02 ── */}
        <div className="project">
          <div className="project-header">
            <div>
              <div className="proj-num">PROJECT 02</div>
              <h2>Small Business<br/>Security Toolkit</h2>
            </div>
            <div className="proj-desc">
              <p>The Security Toolkit is a collection of five standalone documents covering the most commonly needed security foundations for any small business &#8212; from a plain-language security primer to ready-to-deploy policy templates. Each resource was developed to be immediately usable without starting from scratch.</p>
              <p>The documents follow a logical progression: understand your risk landscape with the Guide and Checklist, formalize your commitments with Policy Templates, track what matters over time with the Risk Register, and execute a structured improvement plan with the 90-Day Roadmap.</p>
              <p>These resources reflect real-world SMB security challenges &#8212; not enterprise frameworks stripped down to look accessible. They are intentionally scoped for businesses with limited IT resources and no dedicated security staff.</p>
            </div>
          </div>
          <div className="toolkit-grid">
            {TOOLKIT.map(t => (
              <div key={t.id} className="tool-card">
                <div className="tool-id">{t.id}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
                <div className="tool-footer">
                  <span>{t.fmt}</span>
                  <a className="btn-ghost" href={t.href} download><IcoDl/> Download</a>
                </div>
              </div>
            ))}
          </div>
          <ReviewSection seed={TK_REV}/>
        </div>
      </div>

      {/* ── Recommended Tools ── */}
      <section className="rec-section" id="tools">
        <div className="rec-inner">
          <div className="rec-hdr">
            <div className="sec-eyebrow">Recommended Security Tools</div>
            <h2>Vetted tools for small business security.</h2>
            <p>Every tool below has been evaluated for SMB fit, pricing transparency, and ease of deployment. We recommend these based on practitioner experience &#8212; not vendor relationships. Some links are affiliate links (marked below) where we may earn a small commission at no cost to you.</p>
          </div>
          <div className="rec-grid">
            {REC_TOOLS.map(t => (
              <div key={t.name} className="rec-card">
                <div className="rec-cat">{t.cat}</div>
                <div className="rec-name">{t.name}</div>
                <div className="rec-desc">{t.desc}</div>
                <div className="rec-foot">
                  <div className="rec-tags">
                    <span className="tag-tier">{t.tier}</span>
                    {t.aff && <span className="tag-aff">&#10022; Affiliate</span>}
                  </div>
                  <a className="rec-link" href={t.url} target="_blank" rel="noreferrer">Visit <IcoExt/></a>
                </div>
              </div>
            ))}
          </div>
          <div className="aff-note">
            &#10022; Affiliate disclosure &#8212; Links marked &#10022; are affiliate links. If you sign up through one of these links, Green Security Group earns a small commission at no additional cost to you. We only recommend tools we believe in, and affiliate status does not influence which tools appear here or how they are described.
          </div>
        </div>
      </section>

      {/* ── AI Disclosure ── */}
      <section className="ai-section" id="ai-disclosure">
        <div className="ai-inner">
          <div>
            <div className="ai-label">// AI Disclosure</div>
            <h3>Built with the assistance of AI tools</h3>
          </div>
          <div className="ai-body">
            <p>The resources on this site were developed with significant assistance from <strong>Claude (Anthropic)</strong>, a large language model. AI was used to help structure content, draft and refine document language, and generate the code for this website.</p>
            <p>All content has been reviewed, edited, and validated by <strong>Paul Green, CISSP</strong> &#8212; a cybersecurity professional with hands-on experience in security program development, risk management, and SMB-oriented advisory work. The frameworks, domain coverage, and recommendations reflect genuine practitioner knowledge. AI accelerated the writing process; it did not substitute for the expertise behind it.</p>
            <p>Transparency about AI use in professional content matters &#8212; especially in a field built on trust. Questions about methodology or how any document was developed can be directed to <a href="mailto:paul@greensecuritygroup.com">paul@greensecuritygroup.com</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Assessment ───────────────────────────────────────────────────────────────
function ScoreBtn({ val, cur, onClick }) {
  const MAP = { 2:["Yes","sy","2 pts"], 1:["Partial","sp","1 pt"], 0:["No","sn","0 pts"] };
  const [lbl, cls, pts] = MAP[val];
  return (
    <button className={"s-btn" + (cur === val ? " " + cls : "")} onClick={onClick}>
      <span>{lbl}</span><span className="pts">{pts}</span>
    </button>
  );
}

function QCard({ q, ans, onChange, idx, snum }) {
  const [notes, setNotes] = useState(false);
  return (
    <div className={"q-card" + (ans?.score != null ? " answered" : "")}>
      <div className="q-top">
        <span className="q-num">D{snum}.{String(idx).padStart(2,"0")}</span>
        <p className="q-text">{q.text}</p>
      </div>
      <div className="q-acts">
        {[2,1,0].map(v => <ScoreBtn key={v} val={v} cur={ans?.score} onClick={() => onChange(q.id, v, ans?.notes ?? "")}/>)}
        <button className="notes-tog" onClick={() => setNotes(n => !n)}>{notes ? "\u2212 Notes" : "+ Notes"}</button>
      </div>
      {notes && (
        <textarea className="notes-ta" placeholder="Add context, observations, or evidence..."
          value={ans?.notes ?? ""} onChange={e => onChange(q.id, ans?.score ?? null, e.target.value)}/>
      )}
    </div>
  );
}

function AssIntro({ onStart }) {
  return (
    <div className="ass-intro">
      <div className="ass-intro-ey">SMB Security Assessment</div>
      <h2>Know where you stand.<br/><em>Fix what matters most.</em></h2>
      <p className="ass-intro-sub">A structured 52-question assessment across 8 security domains built for small and medium businesses. Complete it in 15&#8211;20 minutes and download a full professional report when done. Free. No account required.</p>
      <div className="ass-stats">
        {[["52","Questions"],["8","Domains"],["15-20","Minutes"],["$0","Cost"]].map(([n,l]) => (
          <div key={l} className="ass-stat"><span className="ass-stat-n">{n}</span><span className="ass-stat-l">{l}</span></div>
        ))}
      </div>
      <button className="btn-primary" style={{fontSize:"0.9rem",padding:"0.85rem 2.5rem"}} onClick={onStart}>
        Start Assessment <IcoArr/>
      </button>
    </div>
  );
}

function AssResults({ answers, onRestart }) {
  const [org, setOrg] = useState("");
  const [busy, setBusy] = useState(false);
  const [pdfOk, setPdfOk] = useState("loading");
  const [err, setErr] = useState("");
  const tots = totalScore(answers);

  useEffect(() => {
    loadJsPDF()
      .then(() => setPdfOk("ready"))
      .catch(e => { console.error("jsPDF:", e); setPdfOk("failed"); });
  }, []);

  const download = async () => {
    setBusy(true); setErr("");
    try { await buildPDF(answers, org); }
    catch(e) { console.error(e); setErr("Error: " + (e?.message || "Unknown. Check browser console.")); }
    setBusy(false);
  };

  return (
    <div className="res-wrap">
      <div className="res-hero">
        <div className="score-circle" style={{ borderColor: ratingColor(tots.pct) }}>
          <span className="score-big" style={{ color: ratingColor(tots.pct) }}>{tots.pct}%</span>
          <span className="score-sub">Overall Score</span>
        </div>
        <div className="rating-badge" style={{ background: ratingColor(tots.pct) }}>{ratingLabel(tots.pct)}</div>
        <div className="score-detail">{tots.score} / {tots.max} points &#183; {critCount(answers)} critical gaps identified</div>
      </div>

      <div className="dom-grid">
        <div className="sec-lbl">Domain Breakdown</div>
        {SECTIONS.map(sec => {
          const ss = secScore(answers, sec); const col = ratingColor(ss.pct);
          return (
            <div key={sec.id} className="dom-row">
              <span className="dom-num">{sec.num}</span>
              <span className="dom-name">{sec.title}</span>
              <div className="dom-bar"><div className="dom-fill" style={{ width: ss.pct+"%", background: col }}/></div>
              <span className="dom-pct" style={{ color: col }}>{ss.pct}%</span>
              <span className="dom-sc">{ss.score}/{ss.max}</span>
            </div>
          );
        })}
      </div>

      <div className="dl-box">
        <div className="dl-lbl">// Generate Professional Report</div>
        <input className="org-input" type="text" placeholder="Organization name (optional)"
          value={org} onChange={e => setOrg(e.target.value)}/>
        <button className="dl-btn" onClick={download} disabled={busy || pdfOk === "loading"}>
          {busy ? "Generating PDF..." : pdfOk === "loading" ? "Loading PDF engine..." : "\u2193 Download Full PDF Report"}
        </button>
        {pdfOk === "failed" && !err && <div className="err-msg">PDF engine failed to load. Try refreshing.</div>}
        {err && <div className="err-msg">{err}</div>}
        <p style={{ fontSize:"0.75rem", color:"var(--dim)", marginTop:"0.75rem", fontFamily:"var(--mono)", lineHeight:1.6 }}>
          Generated entirely in your browser. Your answers never leave your device.
        </p>
      </div>
      <button className="restart-btn" onClick={onRestart}>Start Over</button>
    </div>
  );
}

function AssessmentFlow({ onBack }) {
  const [view, setView] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const upd = (qId, score, notes) =>
    setAnswers(p => ({ ...p, [qId]: { score: score ?? p[qId]?.score ?? null, notes: notes ?? p[qId]?.notes ?? "" } }));
  const restart = () => { setAnswers({}); setIdx(0); setView("intro"); };
  const sec = SECTIONS[idx];
  const done = sec?.questions.filter(q => answers[q.id]?.score != null).length ?? 0;
  const allDone = done === sec?.questions.length;
  const ss = sec ? secScore(answers, sec) : { score:0, max:0 };

  return (
    <div>
      <nav className="nav">
        <div className="nav-inner">
          <button className="logo" onClick={onBack}><div className="logo-mark">G/</div><span>Green Security Group</span></button>
          {view !== "section"
            ? <button className="nav-back" onClick={onBack}>&#8592; Back to Projects</button>
            : <span style={{fontFamily:"var(--mono)",fontSize:"0.78rem",color:"var(--dim)"}}>Section {idx+1} of {SECTIONS.length}</span>
          }
        </div>
        {view === "section" && (
          <div className="ass-prog">
            {SECTIONS.map((s,i) => (
              <div key={s.id} className="ass-prog-seg" style={{ flex:1, background: i<idx?"var(--green)":i===idx?"rgba(61,220,104,0.35)":"var(--border)" }}/>
            ))}
          </div>
        )}
      </nav>

      {view === "intro"   && <AssIntro onStart={() => setView("section")}/>}
      {view === "results" && <AssResults answers={answers} onRestart={restart}/>}
      {view === "section" && sec && (
        <div>
          <div className="ass-sec-hdr">
            <div className="ass-sec-inner">
              <div className="ass-eyebrow">Domain {sec.num} of 08</div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
                <h2 className="ass-sec-title">{sec.title}</h2>
                <span style={{fontFamily:"var(--mono)",fontSize:"0.7rem",color:"var(--dim)"}}>{done}/{sec.questions.length} answered</span>
              </div>
            </div>
          </div>
          <div className="ass-wrap">
            <div className="ass-desc"><p>{sec.desc}</p></div>
            <div className="ass-qlist">
              {sec.questions.map((q,i) => <QCard key={q.id} q={q} ans={answers[q.id]} onChange={upd} idx={i+1} snum={sec.num}/>)}
            </div>
            <div className="ass-foot">
              <button className="ass-btn" onClick={() => idx===0 ? setView("intro") : setIdx(i=>i-1)}>
                &#8592; {idx===0?"Intro":"Back"}
              </button>
              <span className="ass-status">{allDone ? "Score: "+ss.score+"/"+ss.max : done+" of "+sec.questions.length+" answered"}</span>
              <button className="ass-btn pri" disabled={!allDone}
                onClick={() => idx===SECTIONS.length-1 ? setView("results") : setIdx(i=>i+1)}>
                {idx===SECTIONS.length-1 ? "View Results \u2192" : "Next Section \u2192"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── About page ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div>
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="about-avatar">PG</div>
          <div>
            <h1 className="about-title">Paul Green, CISSP</h1>
            <div className="about-sub">
              Programs Security Engineer
              <span style={{color:"var(--dim)"}}>&#160;&#183;&#160;</span>
              OnX
              <span style={{color:"var(--dim)"}}>&#160;&#183;&#160;</span>
              Nova Scotia, Canada
            </div>
          </div>
        </div>
      </div>

      <div className="about-body">
        <div className="about-bio">
          <h3>Building security that actually fits.</h3>
          <p>I am a Programs Security Engineer at <strong>OnX</strong>, where I work on security program development, risk frameworks, and helping organizations translate security requirements into operational reality. My background spans enterprise and mid-market environments across a range of industries &#8212; and the same gap keeps showing up everywhere: the guidance available to small businesses is either written for enterprise teams or too generic to be actionable.</p>
          <p>That gap is what Green Security Group is built to close. I started it as a side project to create the kind of resources I wish I could hand to every SMB I have encountered &#8212; practitioner-authored, plain-language, and sized for businesses with real-world constraints. No six-figure consulting engagement required. No 300-page framework that assumes a dedicated security team. Just practical tools you can actually use this week.</p>
          <p>I hold <strong>13 active certifications</strong>, including my CISSP, CySA+, SSCP, and Security+, and am currently completing a <strong>Bachelor of Science in Cybersecurity at Western Governors University</strong>. My work at OnX keeps me close to what is actually happening across the threat landscape &#8212; and that informs everything I build here.</p>
          <p>Everything on this site is <strong>free and openly available</strong>. If you want to talk security, have a question about your environment, or want to discuss what comes next for your program &#8212; my contact details are below.</p>
        </div>

        <div className="about-sidebar">
          <div className="sb-card">
            <div className="sb-title">// Certifications</div>
            <div className="cert-grid">
              {CERTS.map(c => (
                <div key={c.code} className="cert-badge">
                  <div className="cert-code">{c.code}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
              ))}
              <div className="cert-more">
                <div className="cert-more-n">+9</div>
                <div className="cert-more-l">Additional Active Certifications</div>
              </div>
            </div>
          </div>

          <div className="sb-card">
            <div className="sb-title">// At a Glance</div>
            <div className="stat-list">
              {[
                ["Role","Programs Security Eng."],
                ["Employer","OnX"],
                ["Location","Dartmouth, Nova Scotia"],
                ["Education","BS Cybersecurity, WGU"],
                ["Active Certs","13"],
                ["LinkedIn","linkedin.com/in/itpg"],
              ].map(([l,v]) => (
                <div key={l} className="stat-item">
                  <span className="stat-item-l">{l}</span>
                  <span className="stat-item-v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="about-contact">
        <div className="ac-inner">
          <div>
            <h3>Let&#39;s talk security.</h3>
            <p>Questions about the tools, your environment, or what to prioritize next.</p>
          </div>
          <div className="ac-btns">
            <a className="btn-primary" href="mailto:paul@greensecuritygroup.com">paul@greensecuritygroup.com</a>
            <a className="btn-ghost" href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer">LinkedIn <IcoExt/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  return (
    <div>
      <style>{css}</style>
      {view === "assessment" ? (
        <AssessmentFlow onBack={() => setView("home")}/>
      ) : (
        <>
          <SiteNav view={view} setView={setView}/>
          {view === "home"  && <HomePage setView={setView}/>}
          {view === "about" && <AboutPage/>}
          <SiteFooter setView={setView}/>
        </>
      )}
    </div>
  );
}
