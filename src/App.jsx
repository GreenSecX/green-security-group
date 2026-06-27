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
    s.onload = () => window.jspdf?.jsPDF ? res((window.__gsg_jspdf = window.jspdf.jsPDF)) : rej(new Error("API not found"));
    s.onerror = () => rej(new Error("cdnjs failed"));
    document.head.appendChild(s);
  });
};

const SECTIONS = [
  { id:"s1",num:"01",title:"Protecting Your Physical Space",
    desc:"Before we look at your digital security, let's talk about something more familiar — your physical environment. Your office, equipment, and documents contain sensitive information that needs to be protected just like your filing cabinets.",
    questions:[
      {id:"s1q1",text:"Is the room or closet where your computer servers or main network equipment is kept locked and only accessible to people who need to be there?",control:"Physical access control",why:"Limiting who can physically reach your core equipment is one of the most basic — and most overlooked — protections. An unlocked server room means anyone who walks in can cause serious damage in minutes."},
      {id:"s1q2",text:"Do you keep a record of who enters your server room or equipment area, and when?",control:"Access logging",why:"A simple visitor log creates accountability. If something goes wrong, you need to know who was in that space and when."},
      {id:"s1q3",text:"When employees step away from their computers, do the screens lock automatically or do staff lock them manually?",control:"Workstation security",why:"An unlocked screen is an open door. Anyone walking past can access your systems, email, or client files in seconds."},
      {id:"s1q4",text:"Do you have security cameras covering the entrances to your office or building?",control:"Physical surveillance",why:"Cameras deter unauthorized access and provide evidence if an incident occurs. Even basic coverage at entry points makes a meaningful difference."},
      {id:"s1q5",text:"Are backup hard drives, USB drives, and sensitive printed documents stored in a locked cabinet or safe when not in use?",control:"Secure storage",why:"Physical media and printed documents are just as valuable to a thief as digital data. A locked cabinet is a simple, low-cost control."},
      {id:"s1q6",text:"When an employee leaves your business, is there a process to collect their keys, access cards, and update any door codes they knew?",control:"Access revocation",why:"Failing to revoke physical access when someone leaves is a frequently exploited gap. Former employees — or people they tell — may retain access to your space."},
    ]},
  { id:"s2",num:"02",title:"Controlling Who Can Access What",
    desc:"Think of access controls like the keys to your business. You would not give every employee a master key to every room. The same principle applies to your digital systems — people should only be able to access what they genuinely need to do their job.",
    questions:[
      {id:"s2q1",text:"Does every person who uses your systems have their own individual login? Or do people share usernames and passwords?",control:"Unique user accounts",why:"Shared accounts make it impossible to know who did what. When something goes wrong — or when an employee leaves — shared credentials create serious accountability and security gaps."},
      {id:"s2q2",text:"When staff log into email or business software, is there a second verification step — like a code sent to their phone — beyond just a password?",control:"Multi-factor authentication (MFA)",why:"A stolen password alone is not enough to break in when MFA is enabled. This single control prevents the vast majority of unauthorized account access."},
      {id:"s2q3",text:"Do your employees only have access to the systems and files they need for their specific job — nothing more?",control:"Least privilege access",why:"Giving people access only to what they need limits the damage if their account is ever compromised. A receptionist does not need access to your financial records."},
      {id:"s2q4",text:"Do the people who manage your IT systems use a separate, special account for those tasks — different from their everyday work account?",control:"Privileged account separation",why:"Administrative accounts are high-value targets. Keeping them separate from daily-use accounts limits exposure if a regular account is compromised."},
      {id:"s2q5",text:"When a new employee joins, is there a clear process for setting up their accounts? When someone leaves, are their accounts disabled right away?",control:"Account lifecycle management",why:"Accounts that linger after an employee leaves are a significant risk. A simple checklist ensures nothing gets missed during onboarding or offboarding."},
      {id:"s2q6",text:"Do you review who has access to what at least once a year to make sure it still makes sense?",control:"Access reviews",why:"People change roles, take on new responsibilities, or leave. Without regular reviews, old access piles up and creates unnecessary risk."},
      {id:"s2q7",text:"Does your business have a clear rule about how passwords should be created — including how long they should be and that they should not be reused?",control:"Password policy",why:"Weak or reused passwords are one of the leading causes of business breaches. A clear written policy sets expectations and gives you something to train staff on."},
    ]},
  { id:"s3",num:"03",title:"Securing Your Network and Devices",
    desc:"Your network is the highway that connects all of your business systems. Just like you would lock the doors to your office, your network needs controls to keep unauthorized people out and to contain problems if they occur.",
    questions:[
      {id:"s3q1",text:"Does your business use a professional-grade firewall — not just the basic router that came from your internet provider?",control:"Business firewall",why:"Consumer routers are not designed for business security. A business-grade firewall provides the controls needed to monitor and filter traffic in and out of your network."},
      {id:"s3q2",text:"Is the Wi-Fi network your customers or visitors use completely separate from the one your staff and business systems use?",control:"Network segmentation",why:"If a visitor's device is infected with malware and they connect to your business Wi-Fi, it can spread to your systems. Separate networks prevent this."},
      {id:"s3q3",text:"Are the routers, switches, and Wi-Fi access points in your office set up with custom passwords — not the factory defaults they came with?",control:"Device hardening",why:"Default passwords are publicly known and easily exploited. Changing them is a basic step that closes a common entry point for attackers."},
      {id:"s3q4",text:"Do you have any way of knowing if something unusual is happening on your network — like a large amount of data being sent out overnight?",control:"Network monitoring",why:"Most breaches go undetected for weeks or months. Basic monitoring helps you catch problems earlier, reducing the cost and scope of recovery."},
      {id:"s3q5",text:"If employees work remotely, do they connect to your business systems through a secure, approved method — rather than just logging in directly from home?",control:"Secure remote access (VPN/Zero Trust)",why:"Unprotected remote access is one of the most common ways attackers get in. A business VPN or zero-trust solution ensures remote connections are as secure as being in the office."},
      {id:"s3q6",text:"Do all of your business computers and laptops have up-to-date security software installed — beyond just the basic protection that came with the device?",control:"Endpoint protection (EDR/Antivirus)",why:"Modern threats require modern protection. Business-grade endpoint security detects and responds to threats that basic built-in tools miss."},
      {id:"s3q7",text:"Is there a process to make sure your computers, software, and network equipment get security updates applied in a timely way?",control:"Patch management",why:"Unpatched software is one of the most exploited vulnerabilities. Attackers actively scan for businesses running outdated systems."},
    ]},
  { id:"s4",num:"04",title:"Protecting Your Business Information",
    desc:"Your data — client records, financial information, employee details, and business documents — is one of your most valuable assets. Protecting it means knowing what you have, where it lives, and making sure it cannot be easily accessed or stolen.",
    questions:[
      {id:"s4q1",text:"Do you have a clear understanding of what sensitive information your business holds — such as client personal details, payment information, or health records?",control:"Data inventory and classification",why:"You cannot protect what you do not know you have. A simple data inventory is the foundation of all data protection decisions."},
      {id:"s4q2",text:"If a laptop or hard drive was stolen from your office, would the information on it be unreadable to the thief?",control:"Encryption at rest",why:"Encryption scrambles the data on a device so it is useless without the correct password, even if the physical device is stolen."},
      {id:"s4q3",text:"When your business sends sensitive information by email or through your website, is it sent in a way that cannot be intercepted?",control:"Encryption in transit (TLS/HTTPS)",why:"Information sent over the internet can be intercepted if it is not encrypted. Secure email and HTTPS websites protect data while it is moving."},
      {id:"s4q4",text:"Does your business back up its important data regularly — and do you actually test that you can restore from those backups?",control:"Backup and recovery",why:"Backups are your last line of defense against ransomware and accidental data loss. An untested backup may not work when you need it most."},
      {id:"s4q5",text:"Does your business have a clear policy about how long you keep different types of records, and how you safely dispose of them when they are no longer needed?",control:"Data retention and disposal",why:"Keeping data longer than necessary increases your risk. Disposing of it improperly — such as throwing hard drives in the trash — can expose sensitive information."},
      {id:"s4q6",text:"Do you know which outside companies or software tools have access to your business data, and have you checked that they handle it responsibly?",control:"Third-party data access",why:"Your vendors and software tools may have access to sensitive data. Their security practices become your risk."},
      {id:"s4q7",text:"Is there a way to know if someone is accessing sensitive files or records they should not be looking at?",control:"Access logging and monitoring",why:"Logging who accesses sensitive information creates an audit trail and allows you to detect unusual activity before it becomes a serious problem."},
    ]},
  { id:"s5",num:"05",title:"Being Ready When Something Goes Wrong",
    desc:"No security is perfect. Every business — regardless of size — faces the possibility of a security incident. The difference between a manageable problem and a business-threatening crisis is almost always whether you had a plan before it happened.",
    questions:[
      {id:"s5q1",text:"Does your business have a written plan for what to do if you experience a cyberattack, data breach, or other security emergency?",control:"Incident response plan",why:"A written plan dramatically reduces confusion and recovery time during an incident. Businesses without a plan typically take three times longer to recover and spend significantly more doing it."},
      {id:"s5q2",text:"Has your team actually walked through that plan in the last 12 months — even as a practice exercise — to make sure everyone knows their role?",control:"Tabletop exercises",why:"A plan that has never been tested may not work under pressure. A simple walk-through exercise identifies gaps before a real incident exposes them."},
      {id:"s5q3",text:"Does every member of your team know exactly who to call first if they think something has gone wrong?",control:"Incident reporting and escalation",why:"Delayed reporting is one of the biggest contributors to costly incidents. Every employee should know the one person or number to contact immediately."},
      {id:"s5q4",text:"Does your business have insurance that covers the costs of responding to a data breach or cyberattack — including notifying affected clients and legal fees?",control:"Cyber liability insurance",why:"The average cost of a small business data breach exceeds $50,000. Cyber insurance covers response costs, legal fees, notification expenses, and more."},
      {id:"s5q5",text:"If a cyberattack happened today, do you know how to preserve evidence without accidentally making things worse?",control:"Evidence preservation",why:"Well-intentioned actions during an incident — like turning off computers — can destroy forensic evidence needed for investigation and insurance claims."},
      {id:"s5q6",text:"Do you know whether your business is legally required to notify clients or regulators if their information is ever exposed in a breach?",control:"Breach notification obligations",why:"Most jurisdictions have mandatory breach notification laws. Failing to notify within required timeframes can result in significant regulatory penalties."},
    ]},
  { id:"s6",num:"06",title:"Managing Your Outside Vendors and Software",
    desc:"Most small businesses rely on dozens of outside vendors, contractors, and software tools. Each one that has access to your systems or data is an extension of your risk. A breach at one of your vendors can be just as damaging as a direct attack on your business.",
    questions:[
      {id:"s6q1",text:"Do you have a current list of every outside company, contractor, or software tool that can access your business systems or client information?",control:"Vendor inventory",why:"You cannot manage what you have not identified. A simple vendor list is the starting point for all third-party risk management."},
      {id:"s6q2",text:"Before you give a new vendor or software tool access to your business, do you check their security practices?",control:"Vendor due diligence",why:"Onboarding a vendor without reviewing their security is like giving a stranger a key to your office without a background check."},
      {id:"s6q3",text:"Do your contracts with vendors include clear expectations about how they protect your data and what happens if there is a breach?",control:"Vendor contract requirements",why:"Contracts create legal accountability. Without security clauses, you may have no recourse if a vendor's negligence causes a breach."},
      {id:"s6q4",text:"When a vendor needs to access your systems, do they only get access to what they specifically need — and only for as long as they need it?",control:"Vendor access controls",why:"Excessive or lingering vendor access is a common cause of breaches. Time-limited, minimal access reduces your exposure."},
      {id:"s6q5",text:"When you stop working with a vendor, is there a process to make sure they no longer have access to your systems or data?",control:"Vendor offboarding",why:"Former vendors with active access are a significant risk. Access should be revoked on the last day of a relationship — not when someone eventually remembers."},
      {id:"s6q6",text:"If your most critical software or service provider suddenly became unavailable, do you have a backup plan to keep your business running?",control:"Vendor dependency and continuity",why:"Over-reliance on a single vendor without a contingency plan can bring your business to a halt. A written backup plan dramatically reduces recovery time."},
    ]},
  { id:"s7",num:"07",title:"Building a Security-Aware Team",
    desc:"Your employees are both your greatest vulnerability and your strongest defense. Most successful cyberattacks start with a deceptive email or phone call targeting a staff member. A team that knows what to watch for — and what to do — is one of the most cost-effective security investments you can make.",
    questions:[
      {id:"s7q1",text:"Does every member of your team receive some form of security training at least once a year?",control:"Security awareness training",why:"Employees who have never been trained cannot be expected to recognize threats. Annual training does not need to be expensive — free and low-cost options exist for small businesses."},
      {id:"s7q2",text:"Do your staff know how to spot a suspicious email — including ones that look like they come from a trusted source?",control:"Phishing awareness",why:"Phishing emails are the starting point for the majority of small business breaches. Training staff to recognize the warning signs is one of the highest-return investments available."},
      {id:"s7q3",text:"Is there an easy, blame-free way for employees to report something that looks suspicious — without worrying they will get in trouble?",control:"Incident reporting culture",why:"Employees who fear punishment for making a mistake are less likely to report incidents promptly. Early reporting is critical to limiting damage."},
      {id:"s7q4",text:"Does your business periodically send practice phishing emails to staff to see how they respond — and use the results to improve training?",control:"Phishing simulations",why:"Simulated phishing tests identify which employees need additional training before a real attack exploits them. Several free tools are available for small businesses."},
      {id:"s7q5",text:"When new employees join your team, do they receive security guidance as part of their onboarding?",control:"New employee security onboarding",why:"New employees are statistically the most likely to fall for phishing in their first 90 days. Early training significantly reduces this risk."},
      {id:"s7q6",text:"Has every employee read and acknowledged your key security policies — such as your rules around passwords and acceptable computer use?",control:"Policy acknowledgment",why:"Written acknowledgment creates accountability and ensures employees cannot claim they were unaware of the rules."},
      {id:"s7q7",text:"Do employees in high-risk roles — such as those who handle payments or have access to sensitive records — receive additional targeted training?",control:"Role-based security training",why:"Finance staff, executives, and others in sensitive roles face targeted attacks like business email compromise and whaling. General training is not enough for high-risk positions."},
    ]},
  { id:"s8",num:"08",title:"Staying Safe in the Cloud and Working Remotely",
    desc:"Most small businesses today rely on cloud software — email, file storage, accounting tools, and more. Remote work has added another layer of complexity. This section looks at whether your cloud tools and remote work setup are as secure as your office.",
    questions:[
      {id:"s8q1",text:"Do you have a complete list of every cloud application and online service your business uses — including ones staff may have signed up for on their own?",control:"SaaS inventory / Shadow IT",why:"Staff often sign up for cloud tools without IT involvement. These unmanaged applications can contain business data with no security oversight."},
      {id:"s8q2",text:"For your cloud platforms like email and file storage, is multi-factor authentication turned on for every account — especially administrator accounts?",control:"Cloud MFA enforcement",why:"Cloud account takeover is one of the most common SMB incidents. Enforcing MFA at the platform level prevents the vast majority of these attacks."},
      {id:"s8q3",text:"When employees work from home or another location, do they use a secure, business-approved connection to access your systems?",control:"Secure remote access",why:"Employees connecting from home over unsecured connections expose your business systems to interception and attack."},
      {id:"s8q4",text:"If employees use their personal phones or computers for work, are there rules about what they can access and how those devices must be secured?",control:"BYOD policy and MDM",why:"Personal devices used for work that have no security requirements are a significant gap. A minimum standard — such as a PIN lock and the ability to remotely wipe the device — is essential."},
      {id:"s8q5",text:"Are your cloud file storage settings configured so that sensitive documents cannot accidentally be shared with people outside your business?",control:"Cloud data sharing controls",why:"Default sharing settings in platforms like Google Drive or OneDrive can allow sensitive documents to be shared publicly. Reviewing and tightening these settings is a quick win."},
      {id:"s8q6",text:"When an employee who works remotely leaves your business, is there a process to revoke all their cloud access and ensure business data is removed from their personal devices?",control:"Remote worker offboarding",why:"Remote workers may have business data on personal devices and active access to cloud systems. A thorough offboarding process prevents data from walking out the door."},
    ]},
];


// ─── Utilities ────────────────────────────────────────────────────────────────
const ratingColor = p => p>=75?"#1a7a3c":p>=50?"#c17b00":p>=25?"#c45200":"#b91c1c";
const ratingBg    = p => p>=75?"#dcfce7":p>=50?"#fef3c7":p>=25?"#ffedd5":"#fee2e2";
const ratingLabel = p => p>=75?"Well Protected":p>=50?"Some Gaps to Address":p>=25?"Action Needed":"Immediate Attention Required";
const ratingRGB   = p => p>=75?[26,122,60]:p>=50?[193,123,0]:p>=25?[196,82,0]:[185,28,28];

const secScore = (ans,sec) => {
  const max = sec.questions.length * 2;
  const score = sec.questions.reduce((s,q) => s+(ans[q.id]?.score??0),0);
  return { score, max, pct: Math.round(score/max*100) };
};
const totalScore = ans => {
  const all = SECTIONS.flatMap(s=>s.questions);
  const max = all.length*2;
  const score = all.reduce((s,q) => s+(ans[q.id]?.score??0),0);
  return { score, max, pct: Math.round(score/max*100) };
};
const critCount = ans => SECTIONS.flatMap(s=>s.questions).filter(q=>(ans[q.id]?.score??0)===0).length;

// ─── PDF builder ──────────────────────────────────────────────────────────────
async function buildPDF(answers, orgName) {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({orientation:"portrait",unit:"mm",format:"letter"});
  const W=215.9,H=279.4,M=18,CW=W-M*2;
  const tots = totalScore(answers);
  const [rR,rG,rB] = ratingRGB(tots.pct);
  let pg=1;

  const hdr = title => {
    doc.setFillColor(255,255,255); doc.rect(0,0,W,14,"F");
    doc.setFillColor(26,122,60); doc.rect(0,0,W,1.5,"F");
    doc.setFillColor(245,247,250); doc.rect(0,1.5,W,12.5,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(30,58,47);
    doc.text("Green Security Group", M, 9);
    doc.setFont("helvetica","normal"); doc.setTextColor(100,120,110);
    doc.text(title, W-M, 9, {align:"right"});
    return 24;
  };
  const ftr = () => {
    doc.setFillColor(245,247,250); doc.rect(0,H-10,W,10,"F");
    doc.setFillColor(26,122,60); doc.rect(0,H-10,W,0.8,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(120,140,130);
    doc.text("greensecuritygroup.com  |  Prepared by Paul Green, CISSP", M, H-3.5);
    doc.text("Page "+pg, W-M, H-3.5, {align:"right"});
  };
  const np = title => { ftr(); doc.addPage(); pg++; const y=hdr(title); return y; };
  const chk = (y,n,t) => y+n>H-14 ? np(t) : y;

  // ── COVER ──────────────────────────────────────────────────────────────────
  // White background with green top bar
  doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");
  doc.setFillColor(26,122,60); doc.rect(0,0,W,4,"F");

  // Top label
  doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
  doc.text("GREEN SECURITY GROUP", M, 2.8);

  // Left green accent bar
  doc.setFillColor(26,122,60); doc.rect(0,4,6,H-4,"F");
  doc.setFillColor(232,245,237); doc.rect(6,4,M-6,H-4,"F");

  // Main content area
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(100,140,120);
  doc.text("BUSINESS SECURITY ASSESSMENT", M+6, 40);
  doc.setFont("helvetica","bold"); doc.setFontSize(32); doc.setTextColor(20,40,30);
  doc.text("Your Security", M+6, 58);
  doc.text("Report", M+6, 72);
  doc.setFillColor(26,122,60); doc.rect(M+6,76,50,1.5,"F");

  if (orgName?.trim()) {
    doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(60,100,80);
    doc.text("Prepared for: "+orgName.trim(), M+6, 88);
  }
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(120,150,135);
  doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), M+6, orgName?.trim()?98:88);

  // Score card
  const sx=W-M-55, sy=35, sw=55, sh=70;
  doc.setFillColor(245,250,247); doc.roundedRect(sx,sy,sw,sh,4,4,"F");
  doc.setDrawColor(200,230,210); doc.setLineWidth(0.5); doc.roundedRect(sx,sy,sw,sh,4,4,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(80,130,100);
  doc.text("OVERALL SCORE", sx+sw/2, sy+10, {align:"center"});
  doc.setFontSize(36); doc.setTextColor(rR,rG,rB);
  doc.text(tots.pct+"%", sx+sw/2, sy+32, {align:"center"});
  // Rating pill
  const rl = ratingLabel(tots.pct);
  const rw = Math.min(sw-8, doc.getTextWidth(rl)+8);
  doc.setFillColor(rR,rG,rB); doc.roundedRect(sx+sw/2-rw/2,sy+36,rw,8,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(255,255,255);
  doc.text(rl, sx+sw/2, sy+41.5, {align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(80,130,100);
  doc.text(tots.score+" out of "+tots.max+" points", sx+sw/2, sy+54, {align:"center"});
  doc.setTextColor(120,150,135); doc.setFontSize(7);
  doc.text(critCount(answers)+" areas need immediate attention", sx+sw/2, sy+62, {align:"center"});

  // What this report covers
  doc.setFillColor(245,250,247); doc.roundedRect(M+6, 110, CW-6, 50, 3,3,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,58,47);
  doc.text("What this report covers:", M+14, 122);
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(80,110,95);
  const covers = ["How well your business is protected across 8 key areas",
    "Which areas need the most urgent attention","Plain-language explanations of each finding",
    "Practical next steps you can start this week"];
  covers.forEach((line,i) => {
    doc.setFillColor(26,122,60); doc.circle(M+15,130+i*10,1.2,"F");
    doc.text(line, M+20, 130+i*10+1);
  });

  // Bottom bar
  doc.setFillColor(30,58,47); doc.rect(0,H-22,W,22,"F");
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(150,200,175);
  doc.text("greensecuritygroup.com  |  paul@greensecuritygroup.com  |  Paul Green, CISSP", M, H-11);
  doc.setTextColor(80,140,110); doc.setFontSize(7);
  doc.text("This report was generated from your assessment responses. All answers are processed locally — no data was transmitted or stored.", M, H-4);

  // ── EXECUTIVE SUMMARY ──────────────────────────────────────────────────────
  let y = np("Executive Summary");
  doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(20,40,30);
  doc.text("Your Security at a Glance", M, y); y+=10;

  // Overall score box
  doc.setFillColor(245,250,247); doc.roundedRect(M,y,CW,22,3,3,"F");
  doc.setDrawColor(200,225,210); doc.setLineWidth(0.4); doc.roundedRect(M,y,CW,22,3,3,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(rR,rG,rB);
  doc.text(ratingLabel(tots.pct), M+8, y+9);
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(80,110,95);
  doc.text("Your business scored "+tots.score+" out of "+tots.max+" points ("+tots.pct+"%) across all 8 security areas.", M+8, y+17);
  const bw2 = doc.getTextWidth(tots.pct+"%")+10;
  doc.setFillColor(rR,rG,rB); doc.roundedRect(W-M-bw2-4,y+6,bw2+4,12,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(255,255,255);
  doc.text(tots.pct+"%", W-M-bw2/2-4, y+14, {align:"center"});
  y+=28;

  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(20,40,30);
  doc.text("Results by Area", M, y); y+=7;

  SECTIONS.forEach(sec => {
    const ss=secScore(answers,sec); const [dr,dg,db]=ratingRGB(ss.pct);
    const barW=CW*0.38, fill2=(ss.pct/100)*barW;
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(60,90,75);
    doc.text(sec.title, M, y+4);
    const bx=M+90;
    doc.setFillColor(225,235,230); doc.roundedRect(bx,y,barW,6,1,1,"F");
    if(fill2>0){doc.setFillColor(dr,dg,db); doc.roundedRect(bx,y,fill2,6,1,1,"F");}
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(dr,dg,db);
    doc.text(ss.pct+"%", bx+barW+4, y+5);
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(140,160,150);
    doc.text(ss.score+"/"+ss.max+" pts", W-M, y+5, {align:"right"});
    y+=10;
  });
  y+=4;
  doc.setDrawColor(210,225,217); doc.setLineWidth(0.4); doc.line(M,y,W-M,y); y+=8;

  // Score guide
  doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(20,40,30);
  doc.text("What Your Score Means", M, y); y+=7;
  [[ratingRGB(88),"75 - 100%","Well Protected","Good foundation in place. Focus on maintaining controls and closing any remaining gaps."],
   [ratingRGB(62),"50 - 74%","Some Gaps to Address","Important protections are in place but gaps exist. Create a 90-day plan to address them."],
   [ratingRGB(37),"25 - 49%","Action Needed","Several significant gaps. Prioritize the highest-risk areas and consider professional guidance."],
   [ratingRGB(12),"0 - 24%","Immediate Attention Required","Critical gaps across multiple areas. Take action now and consider engaging a security advisor."]].forEach(([rgb,range,lbl,desc]) => {
    doc.setFillColor(...rgb); doc.roundedRect(M,y-2,3,7,0.5,0.5,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...rgb); doc.text(range, M+6, y+3);
    doc.setTextColor(30,55,42); doc.text(lbl, M+32, y+3);
    doc.setFont("helvetica","normal"); doc.setTextColor(100,130,115);
    const dl=doc.splitTextToSize(desc, CW-70); doc.text(dl, M+75, y+3); y+=10;
  });
  ftr();

  // ── SECTION REPORTS ────────────────────────────────────────────────────────
  for(const sec of SECTIONS){
    y = np(sec.title);
    const ss=secScore(answers,sec); const [dr,dg,db]=ratingRGB(ss.pct);

    // Section header
    doc.setFillColor(245,250,247); doc.roundedRect(M,y,CW,20,3,3,"F");
    doc.setDrawColor(dr,dg,db); doc.setLineWidth(1); doc.line(M,y,M,y+20);
    doc.setLineWidth(0.3);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100,140,120);
    doc.text("AREA "+sec.num+" OF 8", M+6, y+7);
    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(20,40,30);
    doc.text(sec.title, M+6, y+16);
    doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(dr,dg,db);
    doc.text(ss.pct+"%", W-M-4, y+14, {align:"right"});
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(140,160,150);
    doc.text(ss.score+"/"+ss.max+" pts", W-M-4, y+7, {align:"right"});
    y+=26;

    doc.setFont("helvetica","oblique"); doc.setFontSize(9); doc.setTextColor(100,130,115);
    const dl2=doc.splitTextToSize(sec.desc, CW); doc.text(dl2,M,y); y+=dl2.length*4.5+6;
    doc.setDrawColor(210,225,217); doc.setLineWidth(0.3); doc.line(M,y,W-M,y); y+=6;

    for(let qi=0;qi<sec.questions.length;qi++){
      const q=sec.questions[qi];
      const ans=answers[q.id]; const score=ans?.score??0; const notes=ans?.notes?.trim()??"";
      const sl=score===2?"Yes":score===1?"Partially":"Not Yet";
      const [qR,qG,qB]=score===2?[26,122,60]:score===1?[193,123,0]:[185,28,28];
      const qBg=score===2?[240,253,244]:score===1?[255,251,235]:[255,241,242];

      const qL=doc.splitTextToSize(q.text, CW-30);
      // Control note for partial or no
      const controlNote = score<2 ? doc.splitTextToSize("What this covers: "+q.control+" — "+q.why, CW-12) : [];
      const noteLines = notes ? doc.splitTextToSize("Your note: "+notes, CW-12) : [];
      const blockH = Math.max(qL.length*4.5,8)+controlNote.length*3.8+noteLines.length*3.8+10;
      y=chk(y,blockH,sec.title+" (continued)");

      // Answer badge
      doc.setFillColor(qR,qG,qB); doc.roundedRect(M,y,20,7,1,1,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(6); doc.setTextColor(255,255,255);
      doc.text(sl, M+10, y+4.8, {align:"center"});
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(30,55,42);
      doc.text(qL, M+24, y+4.5); y+=Math.max(qL.length*4.5,8);

      if(controlNote.length){
        doc.setFillColor(...qBg); doc.roundedRect(M+4,y,CW-4,controlNote.length*4+6,1,1,"F");
        doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(80,110,95);
        doc.text(controlNote,M+8,y+4); y+=controlNote.length*4+8;
      }
      if(noteLines.length){
        doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(130,155,140);
        doc.text(noteLines,M+8,y); y+=noteLines.length*4+4;
      }
      y+=3;
      doc.setDrawColor(225,235,230); doc.setLineWidth(0.25); doc.line(M,y,W-M,y); y+=5;
    }
    ftr();
  }

  // ── ACTION PLAN ────────────────────────────────────────────────────────────
  y = np("Your Action Plan");
  doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(20,40,30);
  doc.text("Your Personalized Action Plan", M, y); y+=8;
  doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(100,130,115);
  doc.text("Based on your assessment, here are the steps we recommend — starting with the most urgent.", M, y); y+=12;

  const crit2=SECTIONS.flatMap(s=>s.questions.filter(q=>(answers[q.id]?.score??0)===0).map(q=>({s,q})));
  const part2=SECTIONS.flatMap(s=>s.questions.filter(q=>(answers[q.id]?.score??0)===1).map(q=>({s,q})));

  const drawItem=(s,q,rgb,bg) => {
    const qL=doc.splitTextToSize(q.text,CW-20);
    const cL=doc.splitTextToSize(q.control+" — "+q.why,CW-20);
    y=chk(y,qL.length*4.5+cL.length*4+12,"Your Action Plan (continued)");
    doc.setFillColor(...bg); doc.roundedRect(M,y,CW,qL.length*4.5+cL.length*4+10,2,2,"F");
    doc.setFillColor(...rgb); doc.roundedRect(M,y,4,qL.length*4.5+cL.length*4+10,2,2,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,55,42);
    doc.text(qL,M+10,y+6); y+=qL.length*4.5+3;
    doc.setFont("helvetica","oblique"); doc.setFontSize(7.5); doc.setTextColor(100,130,115);
    doc.text(cL,M+10,y+3); y+=cL.length*4+10;
  };

  if(crit2.length){
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(185,28,28);
    doc.text("Address Right Away", M, y); y+=7;
    crit2.forEach(({s,q})=>drawItem(s,q,[185,28,28],[255,241,242]));
    y+=4;
  }
  if(part2.length){
    y=chk(y,12,"Your Action Plan (continued)");
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(193,123,0);
    doc.text("Address in the Next 30-90 Days", M, y); y+=7;
    part2.forEach(({s,q})=>drawItem(s,q,[193,123,0],[255,251,235]));
  }

  // Next steps
  y=chk(y,55,"Next Steps");
  y+=4; doc.setDrawColor(210,225,217); doc.setLineWidth(0.4); doc.line(M,y,W-M,y); y+=8;
  doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(20,40,30);
  doc.text("What to Do Next", M, y); y+=8;
  ["Download the free Security Toolkit at greensecuritygroup.com — includes policy templates, a risk register, and a 90-day action plan.",
   "Share this report with your IT provider or managed service provider as a prioritized work list.",
   "Run this assessment again in 6-12 months to track your improvement.",
   "Have questions? Reach out to paul@greensecuritygroup.com — happy to help."].forEach((step,i)=>{
    doc.setFillColor(26,122,60); doc.circle(M+3,y+3,1.8,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(30,55,42);
    const ls=doc.splitTextToSize(step,CW-12); doc.text(ls,M+9,y+4.5); y+=ls.length*4.5+5;
  });
  y+=4;

  // AI Disclosure
  y=chk(y,22,"AI Disclosure");
  doc.setFillColor(245,250,247); doc.roundedRect(M,y,CW,20,2,2,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(60,100,80);
  doc.text("About This Assessment", M+6, y+7);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100,130,115);
  const aiL=doc.splitTextToSize("This assessment and report were developed with assistance from Claude (Anthropic) and reviewed by Paul Green, CISSP. The questions and recommendations reflect real-world security practices for small businesses.", CW-12);
  doc.text(aiL,M+6,y+13);
  ftr();

  doc.save("GSG-Security-Assessment-"+new Date().toISOString().split("T")[0]+".pdf");
}


// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --white:#ffffff;--off-white:#f8faf9;--surface:#f1f5f2;--surface2:#e8f0eb;
    --border:#d4e4da;--border-hi:#b8d4c2;
    --green:#1a7a3c;--green-light:#dcfce7;--green-mid:#4caf73;--green-glow:rgba(26,122,60,0.15);
    --amber:#c17b00;--amber-light:#fef3c7;
    --red:#b91c1c;--red-light:#fee2e2;
    --text:#1a2e22;--text-2:#3d6b50;--muted:#6b9e80;--dim:#9dbfad;
    --serif:'Merriweather',Georgia,serif;
    --sans:'Inter',system-ui,sans-serif;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--white);color:var(--text);font-family:var(--sans);line-height:1.65;-webkit-font-smoothing:antialiased;}

  /* NAV */
  .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 2rem;}
  .nav-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:68px;}
  .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:0.95rem;color:var(--text);background:none;border:none;cursor:pointer;font-family:var(--sans);}
  .logo-mark{width:36px;height:36px;border-radius:8px;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0;}
  .nav-links{display:flex;gap:2rem;list-style:none;align-items:center;}
  .nav-links button,.nav-links a{font-size:0.875rem;color:var(--muted);text-decoration:none;background:none;border:none;cursor:pointer;transition:color 0.2s;font-family:var(--sans);font-weight:500;}
  .nav-links button:hover,.nav-links a:hover{color:var(--green);}
  .nav-active{color:var(--green) !important;}
  .nav-cta{background:var(--green) !important;color:white !important;padding:0.5rem 1.25rem !important;border-radius:6px !important;font-weight:600 !important;}
  .nav-cta:hover{background:#15693a !important;color:white !important;}
  .nav-back{font-size:0.875rem;color:var(--muted);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.4rem;transition:color 0.2s;font-weight:500;}
  .nav-back:hover{color:var(--green);}

  /* HERO */
  .hero{padding:6rem 2rem 5rem;max-width:1140px;margin:0 auto;}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green-light);color:var(--green);font-size:0.8rem;font-weight:600;padding:0.4rem 1rem;border-radius:20px;margin-bottom:1.5rem;letter-spacing:0.02em;}
  .hero h1{font-family:var(--serif);font-size:clamp(2.4rem,5vw,4rem);line-height:1.2;margin-bottom:1.25rem;color:var(--text);max-width:700px;}
  .hero h1 em{color:var(--green);font-style:italic;}
  .hero-sub{font-size:1.1rem;color:var(--text-2);max-width:580px;line-height:1.8;margin-bottom:2.5rem;}
  .hero-actions{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3.5rem;}
  .hero-stats{display:flex;gap:3rem;flex-wrap:wrap;padding-top:2rem;border-top:1px solid var(--border);}
  .stat-n{font-family:var(--serif);font-size:2rem;color:var(--text);display:block;font-weight:700;}
  .stat-l{font-size:0.8rem;color:var(--muted);font-weight:500;margin-top:2px;}
  .hero-img{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;display:flex;flex-direction:column;gap:0.75rem;}
  .check-item{display:flex;align-items:center;gap:0.75rem;font-size:0.9rem;color:var(--text-2);}
  .check-icon{width:22px;height:22px;border-radius:50%;background:var(--green-light);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0;}

  /* BUTTONS */
  .btn-primary{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green);color:white;border:none;border-radius:8px;padding:0.875rem 1.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn-primary:hover{background:#15693a;transform:translateY(-1px);box-shadow:0 6px 20px var(--green-glow);}
  .btn-secondary{display:inline-flex;align-items:center;gap:0.5rem;background:white;color:var(--green);border:2px solid var(--green);border-radius:8px;padding:0.825rem 1.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn-secondary:hover{background:var(--green-light);}
  .btn-ghost{display:inline-flex;align-items:center;gap:0.4rem;background:transparent;color:var(--green);border:1px solid var(--border-hi);border-radius:6px;padding:0.45rem 1rem;font-size:0.8rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn-ghost:hover{border-color:var(--green);background:var(--green-light);}

  /* SECTION LAYOUT */
  .section{padding:5rem 2rem;}
  .section-inner{max-width:1140px;margin:0 auto;}
  .section-label{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green-light);color:var(--green);font-size:0.75rem;font-weight:600;padding:0.35rem 0.9rem;border-radius:20px;margin-bottom:1rem;letter-spacing:0.02em;}
  .section h2{font-family:var(--serif);font-size:clamp(1.75rem,3vw,2.5rem);line-height:1.25;color:var(--text);margin-bottom:1rem;}
  .section-sub{font-size:1rem;color:var(--text-2);max-width:600px;line-height:1.8;margin-bottom:2.5rem;}
  .section-bg{background:var(--off-white);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}

  /* PROJECT CARDS */
  .project-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:3rem;}
  .project-card{background:white;border:1px solid var(--border);border-radius:12px;padding:2rem;display:flex;flex-direction:column;gap:1rem;transition:all 0.2s;position:relative;overflow:hidden;}
  .project-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--green);}
  .project-card:hover{border-color:var(--border-hi);box-shadow:0 4px 20px rgba(0,0,0,0.06);}
  .project-num{font-size:0.72rem;font-weight:700;color:var(--green);letter-spacing:0.1em;text-transform:uppercase;}
  .project-card h3{font-family:var(--serif);font-size:1.4rem;color:var(--text);line-height:1.3;}
  .project-card p{font-size:0.9rem;color:var(--text-2);line-height:1.75;flex:1;}
  .feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.5rem 0;}
  .feat-item{display:flex;align-items:center;gap:0.5rem;font-size:0.825rem;color:var(--text-2);}
  .feat-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;}

  /* TOOLKIT */
  .toolkit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.1rem;margin-bottom:2rem;}
  .tool-card{background:white;border:1px solid var(--border);border-radius:10px;padding:1.5rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s;}
  .tool-card:hover{border-color:var(--border-hi);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
  .tool-id{font-size:0.7rem;font-weight:700;color:var(--green);letter-spacing:0.1em;text-transform:uppercase;}
  .tool-name{font-size:1rem;font-weight:600;color:var(--text);}
  .tool-desc{font-size:0.84rem;color:var(--text-2);line-height:1.65;flex:1;}
  .tool-footer{display:flex;justify-content:space-between;align-items:center;padding-top:0.75rem;border-top:1px solid var(--border);}
  .tool-fmt{font-size:0.75rem;color:var(--muted);}

  /* REVIEWS */
  .reviews{margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--border);}
  .rev-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.5rem;}
  .rev-label{font-size:0.8rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;}
  .rev-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-bottom:1.5rem;}
  .rev-card{background:white;border:1px solid var(--border);border-radius:10px;padding:1.5rem;}
  .stars{display:flex;gap:2px;margin-bottom:0.75rem;}
  .star-on{color:#f59e0b;font-size:0.85rem;} .star-off{color:var(--border);font-size:0.85rem;}
  .rev-text{font-size:0.875rem;color:var(--text-2);line-height:1.75;margin-bottom:0.75rem;font-style:italic;}
  .rev-author{font-size:0.825rem;font-weight:600;color:var(--text);}
  .rev-role{font-size:0.75rem;color:var(--muted);margin-top:2px;}
  .rev-form{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.75rem;}
  .rev-form-title{font-size:0.875rem;font-weight:600;color:var(--text);margin-bottom:1.25rem;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
  .field{display:flex;flex-direction:column;gap:0.4rem;} .field.full{grid-column:1/-1;}
  .field label{font-size:0.78rem;font-weight:500;color:var(--text-2);}
  .field input,.field textarea,.field select{background:white;border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--sans);font-size:0.9rem;padding:0.65rem 0.85rem;outline:none;width:100%;transition:border-color 0.2s;}
  .field input:focus,.field textarea:focus,.field select:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-light);}
  .field textarea{resize:vertical;min-height:90px;}
  .btn-submit{background:white;border:2px solid var(--green);color:var(--green);font-family:var(--sans);font-size:0.875rem;font-weight:600;padding:0.65rem 1.5rem;border-radius:6px;cursor:pointer;transition:all 0.2s;margin-top:0.5rem;}
  .btn-submit:hover{background:var(--green-light);}
  .form-ok{color:var(--green);font-size:0.875rem;padding:0.85rem;background:var(--green-light);border:1px solid var(--border-hi);border-radius:6px;text-align:center;font-weight:500;}

  /* REC TOOLS */
  .rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:1.25rem;margin-bottom:1.5rem;}
  .rec-card{background:white;border:1px solid var(--border);border-radius:12px;padding:1.75rem;display:flex;flex-direction:column;gap:0.9rem;transition:all 0.2s;}
  .rec-card:hover{border-color:var(--border-hi);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
  .rec-cat{font-size:0.72rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;}
  .rec-name{font-size:1.05rem;font-weight:700;color:var(--text);}
  .rec-desc{font-size:0.875rem;color:var(--text-2);line-height:1.75;flex:1;}
  .rec-foot{display:flex;justify-content:space-between;align-items:center;padding-top:0.9rem;border-top:1px solid var(--border);}
  .rec-tags{display:flex;gap:0.4rem;}
  .tag-tier{font-size:0.72rem;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:0.2rem 0.7rem;font-weight:500;}
  .tag-aff{font-size:0.72rem;color:var(--green);background:var(--green-light);border:1px solid var(--border-hi);border-radius:20px;padding:0.2rem 0.7rem;font-weight:500;}
  .rec-link{font-size:0.8rem;color:var(--green);text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:0.3rem;border:1px solid var(--border-hi);border-radius:6px;padding:0.35rem 0.8rem;transition:all 0.2s;}
  .rec-link:hover{background:var(--green-light);border-color:var(--green);}
  .aff-note{font-size:0.78rem;color:var(--muted);line-height:1.7;padding:1rem 1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:8px;}

  /* AI SECTION */
  .ai-inner{display:grid;grid-template-columns:260px 1fr;gap:4rem;align-items:start;}
  .ai-label{font-size:0.72rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.75rem;}
  .ai-inner h3{font-family:var(--serif);font-size:1.6rem;color:var(--text);}
  .ai-body p{font-size:0.95rem;color:var(--text-2);line-height:1.85;margin-bottom:1rem;}
  .ai-body p:last-child{margin-bottom:0;} .ai-body strong{color:var(--text);} .ai-body a{color:var(--green);text-decoration:none;} .ai-body a:hover{text-decoration:underline;}

  /* FOOTER */
  .footer{background:var(--text);padding:3rem 2rem;}
  .footer-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;}
  .footer-name{font-size:0.95rem;color:white;font-weight:600;margin-bottom:0.25rem;}
  .footer-copy{font-size:0.78rem;color:var(--muted);}
  .footer-links{display:flex;gap:2rem;list-style:none;}
  .footer-links a,.footer-links button{font-size:0.8rem;color:var(--dim);text-decoration:none;background:none;border:none;cursor:pointer;transition:color 0.2s;font-family:var(--sans);}
  .footer-links a:hover,.footer-links button:hover{color:white;}

  /* ASSESSMENT */
  .ass-prog{height:4px;background:var(--border);display:flex;}
  .ass-prog-seg{height:4px;transition:background 0.3s;}
  .ass-hdr{background:white;border-bottom:1px solid var(--border);padding:1.5rem 2rem;}
  .ass-hdr-inner{max-width:1140px;margin:0 auto;}
  .ass-eyebrow{font-size:0.72rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;}
  .ass-sec-title{font-size:1.4rem;font-weight:700;color:var(--text);}
  .ass-wrap{max-width:1140px;margin:0 auto;padding:2rem 2rem;}
  .ass-desc{background:var(--green-light);border:1px solid var(--border-hi);border-radius:10px;padding:1.1rem 1.35rem;margin-bottom:1.5rem;}
  .ass-desc p{font-size:0.9rem;color:var(--green);line-height:1.75;font-weight:500;}
  .ass-qlist{display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;}
  .q-card{background:white;border:1px solid var(--border);border-radius:10px;padding:1.35rem 1.5rem;transition:all 0.2s;}
  .q-card.answered{border-color:var(--green);box-shadow:0 0 0 1px var(--green-light);}
  .q-top{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem;}
  .q-num{font-size:0.7rem;font-weight:700;color:var(--green);flex-shrink:0;margin-top:3px;background:var(--green-light);padding:0.2rem 0.5rem;border-radius:4px;}
  .q-text{font-size:0.95rem;color:var(--text);line-height:1.65;font-weight:500;}
  .q-acts{display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;}
  .s-btn{background:white;border:2px solid var(--border);border-radius:8px;color:var(--muted);font-family:var(--sans);font-size:0.8rem;font-weight:600;padding:0.55rem 1.1rem;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:76px;}
  .s-btn .pts{font-size:0.65rem;font-weight:400;opacity:0.7;}
  .s-btn.sy{background:var(--green-light);border-color:var(--green);color:var(--green);}
  .s-btn.sp{background:var(--amber-light);border-color:var(--amber);color:var(--amber);}
  .s-btn.sn{background:var(--red-light);border-color:var(--red);color:var(--red);}
  .notes-tog{margin-left:auto;background:transparent;border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:var(--sans);font-size:0.78rem;font-weight:500;padding:0.4rem 0.85rem;cursor:pointer;transition:all 0.15s;}
  .notes-tog:hover{border-color:var(--green);color:var(--green);}
  .notes-ta{margin-top:0.85rem;background:var(--off-white);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--sans);font-size:0.9rem;padding:0.75rem;resize:vertical;min-height:80px;width:100%;outline:none;}
  .notes-ta:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-light);}
  .notes-ta::placeholder{color:var(--dim);}
  .ass-foot{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;border-top:1px solid var(--border);}
  .ass-btn{background:white;border:2px solid var(--border);border-radius:8px;color:var(--muted);font-family:var(--sans);font-size:0.875rem;font-weight:600;padding:0.75rem 1.5rem;cursor:pointer;transition:all 0.2s;}
  .ass-btn:hover:not(:disabled){border-color:var(--green);color:var(--green);}
  .ass-btn:disabled{opacity:0.35;cursor:not-allowed;}
  .ass-btn.pri{background:var(--green);color:white;border-color:var(--green);}
  .ass-btn.pri:hover:not(:disabled){background:#15693a;}
  .ass-status{font-size:0.8rem;color:var(--muted);font-weight:500;}
  .ass-intro{min-height:calc(100vh - 68px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 2rem;text-align:center;background:var(--off-white);}
  .ass-intro h2{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);line-height:1.2;margin-bottom:1rem;max-width:600px;}
  .ass-intro h2 em{color:var(--green);font-style:italic;}
  .ass-intro-sub{color:var(--text-2);font-size:1rem;max-width:540px;line-height:1.8;margin-bottom:2.5rem;}
  .ass-stat-row{display:flex;gap:3rem;justify-content:center;flex-wrap:wrap;padding:2rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:2.5rem;width:100%;max-width:560px;}
  .ass-stat-n{font-family:var(--serif);font-size:1.8rem;color:var(--text);display:block;font-weight:700;}
  .ass-stat-l{font-size:0.78rem;color:var(--muted);font-weight:500;}
  /* Results */
  .res-wrap{max-width:1140px;margin:0 auto;padding:2.5rem 2rem;}
  .res-hero{text-align:center;padding:2.5rem;margin-bottom:2.5rem;background:var(--off-white);border-radius:16px;border:1px solid var(--border);}
  .score-ring{width:130px;height:130px;border-radius:50%;margin:0 auto 1.25rem;display:flex;flex-direction:column;align-items:center;justify-content:center;border:4px solid;background:white;}
  .score-big{font-family:var(--serif);font-size:2.4rem;font-weight:700;line-height:1;}
  .score-sub{font-size:0.72rem;color:var(--muted);margin-top:3px;font-weight:500;}
  .rating-pill{display:inline-block;padding:0.4rem 1.25rem;border-radius:20px;font-size:0.85rem;font-weight:600;margin-bottom:0.75rem;}
  .score-detail{font-size:0.875rem;color:var(--muted);}
  .dom-grid{margin-bottom:2.5rem;}
  .dom-row{display:flex;align-items:center;gap:1rem;padding:0.7rem 0;border-bottom:1px solid var(--border);}
  .dom-num{font-size:0.72rem;font-weight:700;color:var(--green);width:28px;flex-shrink:0;}
  .dom-name{font-size:0.875rem;font-weight:500;color:var(--text);width:190px;flex-shrink:0;}
  .dom-bar{flex:1;background:var(--border);border-radius:4px;height:8px;overflow:hidden;}
  .dom-fill{height:8px;border-radius:4px;transition:width 0.6s ease;}
  .dom-pct{font-size:0.78rem;font-weight:600;width:38px;text-align:right;flex-shrink:0;}
  .dom-sc{font-size:0.72rem;color:var(--muted);width:44px;text-align:right;flex-shrink:0;}
  .dl-box{background:white;border:2px solid var(--green);border-radius:12px;padding:2rem;margin-bottom:1.5rem;}
  .dl-label{font-size:0.8rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem;}
  .org-input{background:var(--off-white);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--sans);font-size:0.95rem;padding:0.75rem 1rem;width:100%;outline:none;margin-bottom:1rem;}
  .org-input:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-light);}
  .org-input::placeholder{color:var(--dim);}
  .dl-btn{width:100%;background:var(--green);color:white;border:none;border-radius:8px;padding:1rem 1.5rem;font-family:var(--sans);font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:0.6rem;}
  .dl-btn:hover:not(:disabled){background:#15693a;transform:translateY(-1px);box-shadow:0 6px 20px var(--green-glow);}
  .dl-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .err-msg{font-size:0.8rem;color:var(--red);margin-top:0.5rem;text-align:center;}
  .restart-btn{background:white;border:1px solid var(--border);border-radius:8px;color:var(--muted);font-family:var(--sans);font-size:0.875rem;font-weight:500;padding:0.75rem 1.5rem;cursor:pointer;transition:all 0.2s;width:100%;}
  .restart-btn:hover{border-color:var(--border-hi);color:var(--text);}
  .sec-lbl{font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.75rem;}

  /* ABOUT */
  .about-hero{padding:5rem 2rem 4rem;background:var(--off-white);border-bottom:1px solid var(--border);}
  .about-hero-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:2.5rem;align-items:center;}
  .about-avatar{width:100px;height:100px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:700;color:white;flex-shrink:0;}
  .about-name{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);line-height:1.1;margin-bottom:0.4rem;}
  .about-role{font-size:0.95rem;color:var(--text-2);display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;}
  .about-body{max-width:1140px;margin:0 auto;padding:4rem 2rem;display:grid;grid-template-columns:1fr 320px;gap:4rem;align-items:start;}
  .about-bio h3{font-family:var(--serif);font-size:1.6rem;color:var(--text);margin-bottom:1.25rem;}
  .about-bio p{font-size:0.95rem;color:var(--text-2);line-height:1.9;margin-bottom:1.25rem;}
  .about-bio p:last-child{margin-bottom:0;} .about-bio strong{color:var(--text);}
  .about-sidebar{display:flex;flex-direction:column;gap:1.25rem;}
  .sb-card{background:white;border:1px solid var(--border);border-radius:12px;padding:1.5rem;}
  .sb-title{font-size:0.75rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem;}
  .cert-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;}
  .cert-badge{background:var(--off-white);border:1px solid var(--border);border-radius:8px;padding:0.6rem 0.75rem;}
  .cert-code{font-size:0.85rem;font-weight:700;color:var(--text);}
  .cert-issuer{font-size:0.65rem;color:var(--muted);margin-top:2px;}
  .cert-more{background:var(--green-light);border:1px solid var(--border-hi);border-radius:8px;padding:0.6rem 0.75rem;grid-column:1/-1;text-align:center;}
  .cert-more-n{font-size:1rem;font-weight:700;color:var(--green);}
  .cert-more-l{font-size:0.68rem;color:var(--text-2);}
  .stat-list{display:flex;flex-direction:column;}
  .stat-item{display:flex;justify-content:space-between;align-items:baseline;padding:0.6rem 0;border-bottom:1px solid var(--border);}
  .stat-item:last-child{border-bottom:none;}
  .stat-item-l{font-size:0.78rem;color:var(--muted);font-weight:500;}
  .stat-item-v{font-size:0.8rem;font-weight:600;color:var(--text);text-align:right;max-width:55%;}
  .about-cta{background:var(--green);padding:4rem 2rem;}
  .about-cta-inner{max-width:1140px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem;}
  .about-cta h3{font-family:var(--serif);font-size:1.75rem;color:white;}
  .about-cta p{font-size:0.9rem;color:rgba(255,255,255,0.75);margin-top:0.4rem;}
  .cta-btns{display:flex;gap:1rem;flex-wrap:wrap;}
  .btn-white{display:inline-flex;align-items:center;gap:0.5rem;background:white;color:var(--green);border:none;border-radius:8px;padding:0.875rem 1.75rem;font-size:0.9rem;font-weight:700;cursor:pointer;text-decoration:none;transition:all 0.2s;}
  .btn-white:hover{background:var(--green-light);}
  .btn-outline-white{display:inline-flex;align-items:center;gap:0.5rem;background:transparent;color:white;border:2px solid rgba(255,255,255,0.5);border-radius:8px;padding:0.825rem 1.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;}
  .btn-outline-white:hover{border-color:white;background:rgba(255,255,255,0.1);}

  @media(max-width:960px){
    .project-grid{grid-template-columns:1fr;}
    .about-hero-inner,.about-body{grid-template-columns:1fr;}
    .about-body{gap:2rem;} .about-sidebar{flex-direction:row;flex-wrap:wrap;} .about-sidebar>*{flex:1;min-width:240px;}
    .ai-inner{grid-template-columns:1fr;gap:2rem;}
    .hero-stats{gap:1.75rem;} .nav-links{gap:1.25rem;}
  }
  @media(max-width:640px){
    html,body{overflow-x:hidden;max-width:100vw;}
    *{box-sizing:border-box;}
    .hero{padding:3rem 1.25rem 2.5rem;}
    .section{padding:3rem 1.25rem;}
    .nav{padding:0 1rem;}
    .nav-links{gap:0.75rem;}
    .nav-links button,.nav-links a{font-size:0.72rem;}
    .nav-cta{padding:0.4rem 0.85rem !important;font-size:0.72rem !important;}
    .hero h1{font-size:1.9rem;line-height:1.2;}
    .hero-eyebrow{font-size:0.7rem;flex-wrap:wrap;}
    .hero-sub{font-size:0.925rem;}
    .hero-stats{gap:1.25rem;padding-top:1.5rem;flex-wrap:wrap;}
    .stat-n{font-size:1.5rem;}
    .stat-l{font-size:0.72rem;}
    .hero-actions{flex-direction:column;}
    .hero-actions .btn-primary,.hero-actions .btn-secondary{width:100%;justify-content:center;}
    .about-hero,.about-cta{padding-left:1.25rem;padding-right:1.25rem;}
    .about-body{padding:2rem 1.25rem;}
    .about-cta-inner{flex-direction:column;align-items:flex-start;}
    .footer-inner{flex-direction:column;align-items:flex-start;}
    .footer{padding:2.5rem 1.25rem;}
    .footer-links{gap:1rem;flex-wrap:wrap;}
    .dom-name{width:110px;}
    .ass-wrap,.res-wrap{padding:1.5rem 1rem;}
    .form-grid{grid-template-columns:1fr;}
    .feat-grid{grid-template-columns:1fr;}
    .project-grid{grid-template-columns:1fr;}
    .rec-grid{grid-template-columns:1fr;}
    .toolkit-grid{grid-template-columns:1fr;}
    .rev-cards{grid-template-columns:1fr;}
    .ass-stat-row{gap:1.5rem;}
    .score-ring{width:100px;height:100px;}
    .score-big{font-size:1.8rem;}
    .dom-row{gap:0.5rem;}
    .dom-sc{display:none;}
  }
`;


// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoDl  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoArr = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoExt = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IcoCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const GSGMark = ({ size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} style={{flexShrink:0}}>
    <defs>
      <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ff88"/><stop offset="100%" stopColor="#00cc55"/>
      </linearGradient>
      <filter id="mglow">
        <feGaussianBlur stdDeviation="2.5" result="b1"/>
        <feGaussianBlur stdDeviation="5" result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="dglow">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" fill="#000"/>
    <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#050a06" stroke="#00ee66" strokeWidth="2" filter="url(#mglow)"/>
    <polygon points="50,14 82,32 82,68 50,86 18,68 18,32" fill="#030803" stroke="#00dd55" strokeWidth="1.2" filter="url(#mglow)" opacity="0.8"/>
    <path d="M50 28 A22 22 0 1 0 72 50 L58 50" fill="none" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#mglow)"/>
    <line x1="58" y1="50" x2="72" y2="50" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#mglow)"/>
    <line x1="72" y1="50" x2="72" y2="62" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#mglow)"/>
    <circle cx="50" cy="6" r="3" fill="#00ff66" filter="url(#dglow)"/>
    <circle cx="88" cy="28" r="3" fill="#00ff66" filter="url(#dglow)"/>
    <circle cx="88" cy="72" r="3" fill="#00ff66" filter="url(#dglow)"/>
    <circle cx="50" cy="94" r="3" fill="#00ff66" filter="url(#dglow)"/>
    <circle cx="12" cy="72" r="3" fill="#00ff66" filter="url(#dglow)"/>
    <circle cx="12" cy="28" r="3" fill="#00ff66" filter="url(#dglow)"/>
  </svg>
);

// ─── Static data ──────────────────────────────────────────────────────────────
const REC_TOOLS = [
  { cat:"Password Management",      name:"Bitwarden",                       desc:"A secure, easy-to-use password manager that helps your team stop reusing passwords. Everyone gets their own secure vault. One of the first tools we recommend to every business owner.", tier:"Free / Paid", aff:true, url:"https://bitwarden.com" },
  { cat:"Business VPN",             name:"NordLayer",                       desc:"A simple way to secure your team's internet connection when working from home or on the road. Easy to set up and manage — no IT degree required.", tier:"Paid", aff:true, url:"https://nordlayer.com" },
  { cat:"Cloud Backup",             name:"Backblaze B2",                    desc:"Affordable, reliable cloud backup for your business files. Set it up once and your data is automatically protected offsite every day. Straightforward pricing with no surprises.", tier:"Paid", aff:true, url:"https://backblaze.com/cloud-storage" },
  { cat:"Device Protection",        name:"Microsoft Defender for Business", desc:"Professional-grade security software for your business computers and laptops. Included with Microsoft 365 Business Premium — significantly more effective than basic built-in protection.", tier:"Paid", aff:false, url:"https://microsoft.com/security/business/endpoint-security/microsoft-defender-business" },
  { cat:"Website and DNS Security", name:"Cloudflare",                      desc:"Free protection for your business website against attacks, with fast and reliable DNS. The free tier is genuinely excellent and covers most small business needs with no technical setup required.", tier:"Free / Paid", aff:false, url:"https://cloudflare.com" },
  { cat:"Staff Security Training",  name:"KnowBe4",                        desc:"Security awareness training designed to help your team recognize phishing emails and scams before they cause damage. Free tools available for small teams including practice phishing tests.", tier:"Free / Paid", aff:false, url:"https://knowbe4.com" },
];

const TOOLKIT = [
  { id:"GSG-01", name:"Plain-Language Security Guide",   desc:"A 20-page guide written for business owners — not IT professionals. Covers the most important security concepts in plain English with practical steps you can take right away.", fmt:"PDF \u00b7 20 pages", href:"/downloads/gsg-01-security-guide.pdf" },
  { id:"GSG-02", name:"Security Review Checklist",       desc:"A structured checklist covering all 52 questions from the assessment — useful for internal reviews, IT vendor meetings, or tracking your progress over time.", fmt:"PDF \u00b7 Checklist", href:"/downloads/gsg-02-risk-checklist.pdf" },
  { id:"GSG-03", name:"Policy Templates",                desc:"Three ready-to-use policy documents: an Acceptable Use Policy, a Password Policy, and an Incident Response Plan. Written in plain language your team will actually read and follow.", fmt:"PDF \u00b7 3 documents", href:"/downloads/gsg-03-policy-templates.pdf" },
  { id:"GSG-04", name:"90-Day Action Plan",              desc:"A step-by-step plan broken into 30-day milestones. Tells you exactly what to do, in what order, to meaningfully improve your security posture without needing a dedicated IT team.", fmt:"PDF \u00b7 Roadmap", href:"/downloads/gsg-04-90day-roadmap.pdf" },
  { id:"GSG-05", name:"Risk Tracking Spreadsheet",       desc:"A pre-built Excel spreadsheet to track your security gaps, who owns each one, what the plan is to fix it, and when it is due. Includes 20 pre-filled examples to get you started.", fmt:"XLSX \u00b7 Spreadsheet", href:"/downloads/gsg-05-risk-register.xlsx" },
];

const CERTS = [
  { code:"CISSP", issuer:"(ISC)\u00b2" }, { code:"CySA+", issuer:"CompTIA" },
  { code:"SSCP",  issuer:"(ISC)\u00b2" }, { code:"Security+", issuer:"CompTIA" },
];

// ─── Shared components ────────────────────────────────────────────────────────
function SiteNav({ view, setView }) {
  const goHome = anchor => {
    setView("home");
    if (anchor) setTimeout(()=>document.getElementById(anchor)?.scrollIntoView({behavior:"smooth"}),80);
  };
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="logo" onClick={()=>goHome()}>
          <GSGMark size={36} />
          <span>Green Security Group</span>
        </button>
        <ul className="nav-links">
          <li><button className={view==="about"?"nav-active":""} onClick={()=>setView("about")}>About</button></li>
          <li><button onClick={()=>goHome("projects")}>Resources</button></li>
          <li><button onClick={()=>goHome("tools")}>Recommended Tools</button></li>
          <li><button onClick={()=>{setView("home");setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),80);}}>Contact</button></li>
          <li><a href="/security">Security</a></li>
          <li><button className="nav-cta" onClick={()=>setView("assessment")}>Start Free Assessment</button></li>
        </ul>
      </div>
    </nav>
  );
}
function SiteFooter({ setView }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div><div className="footer-name">Green Security Group</div><div className="footer-copy">Paul Green, CISSP &#183; Nova Scotia, Canada</div></div>
        <ul className="footer-links">
          <li><a href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="mailto:paul@greensecuritygroup.com">Email</a></li>
          <li><button onClick={()=>setView("about")}>About</button></li>
          <li><button onClick={()=>setView("home")}>AI Disclosure</button></li>
        </ul>
      </div>
    </footer>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage({ setView }) {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">&#10003; Free for Small Business &#183; No Account Required</div>
        <h1>Is your business<br/><em>protected?</em></h1>
        <p className="hero-sub">
          Most small businesses have security gaps they do not know about. Our free assessment helps you find them in 15 minutes — and gives you a clear, jargon-free report that tells you exactly where to focus and what to do next.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={()=>setView("assessment")}>Take the Free Assessment <IcoArr/></button>
          <a className="btn-secondary" href="#projects">Browse Free Resources</a>
        </div>
        <div className="hero-stats">
          {[["52","Questions that actually make sense"],["8","Areas of your business covered"],["15 min","Average completion time"],["$0","Always free, no strings attached"]].map(([n,l])=>(
            <div key={l}><span className="stat-n">{n}</span><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </section>

      <div style={{background:"var(--off-white)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"3rem 2rem"}}>
        <div style={{maxWidth:"1140px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"2rem"}}>
          {[
            ["🔒","No technical knowledge required","Every question is written in plain English. If you can run a business, you can complete this assessment."],
            ["📄","Get a professional report","Download a clear PDF with your results, what each finding means for your business, and specific next steps you can act on right away."],
            ["🏢","Built for business owners","Designed for the owner of a dental clinic, an accounting firm, or a restaurant group — not an IT department."],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
              <div style={{fontSize:"1.5rem",flexShrink:0}}>{icon}</div>
              <div><div style={{fontWeight:700,fontSize:"0.95rem",color:"var(--text)",marginBottom:"0.35rem"}} dangerouslySetInnerHTML={{__html:title}}/><p style={{fontSize:"0.875rem",color:"var(--text-2)",lineHeight:1.7}}>{desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <div className="section-inner">
          <div className="section-label">Free Resources</div>
          <h2>Everything you need to get started</h2>
          <p className="section-sub">Three free projects designed to help small business owners understand and improve their security — without needing an IT background.</p>

          <div className="project-grid">
            <div className="project-card">
              <div className="project-num">PROJECT 01</div>
              <h3>Business Security Assessment</h3>
              <p>Answer 52 straightforward questions about how your business operates and get a full security report in return. No technical knowledge required. Every question is written in plain business language — the same way you would talk to your accountant about your finances.</p>
              <div className="feat-grid">
                {["Takes 15-20 minutes","Covers 8 areas of your business","Written for non-technical owners","Professional PDF report included","Your answers never leave your device","Completely free, no account needed"].map(f=>(
                  <div key={f} className="feat-item"><div className="feat-dot"/>{f}</div>
                ))}
              </div>
              <button className="btn-primary" onClick={()=>setView("assessment")}>Start the Assessment <IcoArr/></button>
            </div>

            <div className="project-card">
              <div className="project-num">PROJECT 02</div>
              <h3>Small Business Security Toolkit</h3>
              <p>Five practical documents that give you everything you need to put basic security in place — even without IT support. Written in plain English, designed to be used immediately. Download what you need, or grab the full set.</p>
              <div className="toolkit-grid" style={{marginTop:"0.5rem"}}>
                {TOOLKIT.map(t=>(
                  <div key={t.id} className="tool-card">
                    <div className="tool-id">{t.id}</div>
                    <div className="tool-name">{t.name}</div>
                    <div className="tool-desc">{t.desc}</div>
                    <div className="tool-footer">
                      <span className="tool-fmt">{t.fmt}</span>
                      <a className="btn-ghost" href={t.href} download><IcoDl/> Download</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECT 03 */}
          <div style={{marginTop:"2rem",marginBottom:"3rem"}}>
            <div className="project-card" style={{maxWidth:"100%"}}>
              <div className="project-num">PROJECT 03</div>
              <h3>Phishing Email Spotter</h3>
              <p>Ten realistic emails. Some are phishing attempts. Some are legitimate. Can you tell the difference? Each level gets harder — and every answer comes with a plain-language explanation so you actually learn something. Share it with your team as a quick training exercise.</p>
              <div className="feat-grid">
                {["10 realistic email scenarios","Easy to hard difficulty","Canadian and universal examples","Instant feedback on every answer","Score and results breakdown","Free reporting tool recommendations"].map(f=>(
                  <div key={f} className="feat-item"><div className="feat-dot"/>{f}</div>
                ))}
              </div>
             <a className="btn-primary" href="/phishing-spotter" style={{width:"fit-content"}}>Try the Phishing Spotter <IcoArr/></a>
            </div>
          </div>

          {/* PROJECT 04 */}
          <div style={{marginBottom:"3rem"}}>
            <div className="project-card" style={{maxWidth:"100%"}}>
              <div className="project-num">PROJECT 04</div>
              <h3>Incident Response: The Governance Game</h3>
              <p>Three incidents hit a small firm. You don&#8217;t pick which command to run &#8212; you make the governance calls a prepared business makes under pressure: preserve or restore, who&#8217;s authorized to stop a payment, and what you actually owe people after a breach. Every decision is graded against the firm&#8217;s own plan and the law, not opinion.</p>
              <div className="feat-grid">
                {["Three connected scenarios","Governance decisions, not technical","Graded against plan + law","Plain-language reveals","Built on a real IR methodology","Free, nothing to install"].map(f=>(
                  <div key={f} className="feat-item"><div className="feat-dot"/>{f}</div>
                ))}
              </div>
              <a className="btn-primary" href="/incident-response" style={{width:"fit-content"}}>Play the Scenarios <IcoArr/></a>
            </div>
          </div>
        </div>
      </section>

      {/* REC TOOLS */}
      <section className="section section-bg" id="tools">
        <div className="section-inner">
          <div className="section-label">Recommended Tools</div>
          <h2>Tools we actually recommend</h2>
          <p className="section-sub">We only suggest tools that are genuinely useful for small businesses — easy to set up, affordable, and proven to make a difference. Some links below are affiliate links, marked clearly.</p>
          <div className="rec-grid">
            {REC_TOOLS.map(t=>(
              <div key={t.name} className="rec-card">
                <div className="rec-cat">{t.cat}</div>
                <div className="rec-name">{t.name}</div>
                <div className="rec-desc">{t.desc}</div>
                <div className="rec-foot">
                  <div className="rec-tags">
                    <span className="tag-tier">{t.tier}</span>
                    {t.aff&&<span className="tag-aff">&#10022; Affiliate</span>}
                  </div>
                  <a className="rec-link" href={t.url} target="_blank" rel="noreferrer">Learn More <IcoExt/></a>
                </div>
              </div>
            ))}
          </div>
          <div className="aff-note">
            <strong>Affiliate disclosure:</strong> Links marked &#10022; are affiliate links. If you sign up through one of these links, Green Security Group earns a small commission at no extra cost to you. We only recommend tools we genuinely believe in. Affiliate relationships never influence which tools appear here or how we describe them.
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section section-bg" id="contact" style={{scrollMarginTop:"80px"}}>
        <div className="section-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
          <div>
            <div className="section-label">Get in Touch</div>
            <h2>Have a question?</h2>
            <p className="section-sub" style={{marginBottom:"1.5rem"}}>Whether you have questions about your assessment results, want to talk through your specific situation, or just want to connect — reach out any time.</p>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <a href="mailto:paul@greensecuritygroup.com" className="btn-primary" style={{width:"fit-content"}}>paul@greensecuritygroup.com</a>
              <a href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer" className="btn-secondary" style={{width:"fit-content"}}>Connect on LinkedIn <IcoExt/></a>
            </div>
          </div>
          <div style={{background:"white",border:"1px solid var(--border)",borderRadius:"16px",padding:"2rem"}}>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"1rem"}}>Paul Green, CISSP</div>
            <div style={{fontSize:"0.95rem",color:"var(--text-2)",lineHeight:1.75}}>
              <p style={{marginBottom:"0.75rem"}}>I personally respond to every message. If you have questions about your assessment results or want to talk through what they mean for your specific business, I am happy to help.</p>
              <p>No sales pitch. Just a security professional who wants to help small businesses stay safe.</p>
            </div>
          </div>
        </div>
      </section>


      {/* AI DISCLOSURE */}
      <section className="section" id="ai-disclosure" style={{scrollMarginTop:"80px"}}>
        <div className="section-inner">
          <div className="ai-inner">
            <div><div className="ai-label">Transparency Notice</div><h3>About how this was built</h3></div>
            <div className="ai-body">
              <p>The resources on this site were developed with assistance from <strong>Claude (Anthropic)</strong>, an AI tool used to help structure content, draft language, and write the code behind this website.</p>
              <p>All content has been reviewed, edited, and validated by <strong>Paul Green, CISSP</strong> — a cybersecurity professional with real-world experience helping organizations build security programs. The questions, recommendations, and guidance reflect genuine practitioner knowledge, not just AI output.</p>
              <p>Transparency matters — especially when the topic is trust. If you have questions about how any part of this was developed, reach out at <a href="mailto:paul@greensecuritygroup.com">paul@greensecuritygroup.com</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Assessment ───────────────────────────────────────────────────────────────
function ScoreBtn({ val, cur, onClick }) {
  const MAP = { 2:["Yes","sy","2 pts"], 1:["Partially","sp","1 pt"], 0:["Not Yet","sn","0 pts"] };
  const [lbl,cls,pts] = MAP[val];
  return (
    <button className={"s-btn"+(cur===val?" "+cls:"")} onClick={onClick}>
      <span>{lbl}</span><span className="pts">{pts}</span>
    </button>
  );
}
function QCard({ q, ans, onChange, idx, snum }) {
  const [notes,setNotes]=useState(false);
  return (
    <div className={"q-card"+(ans?.score!=null?" answered":"")}>
      <div className="q-top">
        <span className="q-num">{snum}.{String(idx).padStart(2,"0")}</span>
        <p className="q-text">{q.text}</p>
      </div>
      <div className="q-acts">
        {[2,1,0].map(v=><ScoreBtn key={v} val={v} cur={ans?.score} onClick={()=>onChange(q.id,v,ans?.notes??"")}/>)}
        <button className="notes-tog" onClick={()=>setNotes(n=>!n)}>{notes?"Hide note":"+ Add note"}</button>
      </div>
      {notes&&<textarea className="notes-ta" placeholder="Optional: add context, observations, or evidence..." value={ans?.notes??""} onChange={e=>onChange(q.id,ans?.score??null,e.target.value)}/>}
    </div>
  );
}
function AssIntro({ onStart }) {
  return (
    <div className="ass-intro">
      <div className="hero-eyebrow" style={{marginBottom:"1.25rem"}}>Free &#183; No Account Required &#183; Takes 15-20 Minutes</div>
      <h2>Find out how <em>protected</em><br/>your business really is.</h2>
      <p className="ass-intro-sub">Answer 52 plain-language questions about your business and get a full security report — written for business owners, not IT professionals. No technical knowledge required.</p>
      <div className="ass-stat-row">
        {[["52","Questions"],["8","Areas Covered"],["15-20 min","To Complete"],["$0","Free Forever"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center"}}><span className="ass-stat-n">{n}</span><div className="ass-stat-l">{l}</div></div>
        ))}
      </div>
      <button className="btn-primary" style={{fontSize:"1rem",padding:"1rem 2.5rem"}} onClick={onStart}>
        Start Assessment <IcoArr/>
      </button>
      <p style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"1.25rem"}}>Your answers are never stored or transmitted. Everything stays on your device.</p>
    </div>
  );
}
function AssResults({ answers, onRestart }) {
  const [org,setOrg]=useState(""); const [busy,setBusy]=useState(false);
  const [pdfOk,setPdfOk]=useState("loading"); const [err,setErr]=useState("");
  const tots=totalScore(answers);
  useEffect(()=>{loadJsPDF().then(()=>setPdfOk("ready")).catch(e=>{console.error(e);setPdfOk("failed");});},[]);
  const download=async()=>{setBusy(true);setErr("");try{await buildPDF(answers,org);}catch(e){console.error(e);setErr("Could not generate PDF. Try refreshing the page.");}setBusy(false);};
  return (
    <div className="res-wrap">
      <div className="res-hero">
        <div className="score-ring" style={{borderColor:ratingColor(tots.pct)}}>
          <span className="score-big" style={{color:ratingColor(tots.pct)}}>{tots.pct}%</span>
          <span className="score-sub">Overall Score</span>
        </div>
        <div className="rating-pill" style={{background:ratingBg(tots.pct),color:ratingColor(tots.pct)}}>{ratingLabel(tots.pct)}</div>
        <div className="score-detail">{tots.score} out of {tots.max} points &#183; {critCount(answers)} area{critCount(answers)!==1?"s":""} need{critCount(answers)===1?"s":""} immediate attention</div>
      </div>
      <div className="dom-grid">
        <div className="sec-lbl">Your Results by Area</div>
        {SECTIONS.map(sec=>{const ss=secScore(answers,sec);const col=ratingColor(ss.pct);return(
          <div key={sec.id} className="dom-row">
            <span className="dom-num">{sec.num}</span>
            <span className="dom-name">{sec.title}</span>
            <div className="dom-bar"><div className="dom-fill" style={{width:ss.pct+"%",background:col}}/></div>
            <span className="dom-pct" style={{color:col}}>{ss.pct}%</span>
            <span className="dom-sc">{ss.score}/{ss.max}</span>
          </div>
        );})}
      </div>
      <div className="dl-box">
        <div className="dl-label">Download Your Full Report</div>
        <p style={{fontSize:"0.875rem",color:"var(--text-2)",marginBottom:"1rem",lineHeight:1.65}}>Your report includes a plain-language explanation of every finding, what it means for your business, and practical next steps — ready to share with your team or IT provider.</p>
        <input className="org-input" type="text" placeholder="Your business name (optional — appears on the report)" value={org} onChange={e=>setOrg(e.target.value)}/>
        <button className="dl-btn" onClick={download} disabled={busy||pdfOk==="loading"}>
          {busy?"Generating your report...":pdfOk==="loading"?"Getting ready...":"\u2193 Download My Free Report"}
        </button>
        {pdfOk==="failed"&&!err&&<div className="err-msg">Could not load PDF engine. Try refreshing the page.</div>}
        {err&&<div className="err-msg">{err}</div>}
        <p style={{fontSize:"0.75rem",color:"var(--muted)",marginTop:"0.75rem",lineHeight:1.6}}>Generated on your device. Your answers are never stored or sent anywhere.</p>
      </div>
      <button className="restart-btn" onClick={onRestart}>Start Over</button>
    </div>
  );
}
function AssessmentFlow({ onBack }) {
  const [view,setView]=useState("intro"); const [idx,setIdx]=useState(0); const [answers,setAnswers]=useState({});
  const upd=(qId,score,notes)=>setAnswers(p=>({...p,[qId]:{score:score??p[qId]?.score??null,notes:notes??p[qId]?.notes??""}}));
  const restart=()=>{setAnswers({});setIdx(0);setView("intro");};
  const sec=SECTIONS[idx];
  const done=sec?.questions.filter(q=>answers[q.id]?.score!=null).length??0;
  const allDone=done===sec?.questions.length;
  const ss=sec?secScore(answers,sec):{score:0,max:0};
  return (
    <div>
      <nav className="nav">
        <div className="nav-inner">
          <button className="logo" onClick={onBack}><GSGMark size={36} /><span>Green Security Group</span></button>
          {view!=="section"
            ?<button className="nav-back" onClick={onBack}>&#8592; Back to Home</button>
            :<span style={{fontSize:"0.8rem",color:"var(--muted)",fontWeight:500}}>Area {idx+1} of {SECTIONS.length}</span>}
        </div>
        {view==="section"&&(
          <div className="ass-prog">
            {SECTIONS.map((s,i)=><div key={s.id} className="ass-prog-seg" style={{flex:1,background:i<idx?"var(--green)":i===idx?"var(--green-mid)":"var(--border)"}}/>)}
          </div>
        )}
      </nav>
      {view==="intro"&&<AssIntro onStart={()=>setView("section")}/>}
      {view==="results"&&<AssResults answers={answers} onRestart={restart}/>}
      {view==="section"&&sec&&(
        <div>
          <div className="ass-hdr" id="ass-top">
            <div className="ass-hdr-inner">
              <div className="ass-eyebrow">Area {sec.num} of 8 &#183; {done} of {sec.questions.length} answered</div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
                <h2 className="ass-sec-title">{sec.title}</h2>
                {allDone&&<span style={{fontSize:"0.8rem",fontWeight:600,color:"var(--green)"}}>&#10003; All answered</span>}
              </div>
            </div>
          </div>
          <div className="ass-wrap">
            <div className="ass-desc"><p>{sec.desc}</p></div>
            <div className="ass-qlist">{sec.questions.map((q,i)=><QCard key={q.id} q={q} ans={answers[q.id]} onChange={upd} idx={i+1} snum={sec.num}/>)}</div>
            <div className="ass-foot">
              <button className="ass-btn" onClick={()=>idx===0?setView("intro"):setIdx(i=>i-1)}>&#8592; {idx===0?"Intro":"Back"}</button>
              <span className="ass-status">{allDone?"Score so far: "+ss.score+"/"+ss.max:done+" of "+sec.questions.length+" answered"}</span>
              <button className="ass-btn pri" disabled={!allDone} onClick={()=>{
                if(idx===SECTIONS.length-1){setView("results");}else{setIdx(i=>i+1);}
                setTimeout(()=>{
                  document.getElementById("ass-top")?.scrollIntoView({behavior:"smooth",block:"start"});
                  document.documentElement.scrollTop=0;
                  document.body.scrollTop=0;
                },0);
              }}>
                {idx===SECTIONS.length-1?"See My Results \u2192":"Next Area \u2192"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── About page ───────────────────────────────────────────────────────────────
function AboutPage({ setView }) {
  return (
    <div>
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="about-avatar">PG</div>
          <div>
            <h1 className="about-name">Paul Green, CISSP</h1>
            <div className="about-role">Programs Security Engineer<span style={{color:"var(--border-hi)"}}>&#160;&#183;&#160;</span>OnX<span style={{color:"var(--border-hi)"}}>&#160;&#183;&#160;</span>Nova Scotia, Canada</div>
          </div>
        </div>
      </div>
      <div className="about-body">
        <div className="about-bio">
          <h3>Security should not be complicated.</h3>
          <p>I am a cybersecurity professional who spends my days helping large organizations build security programs. And the thing I keep seeing — everywhere — is that the resources available to small businesses are either written for IT departments or too generic to be useful. Most business owners are left to figure it out on their own.</p>
          <p>Green Security Group is my attempt to fix that. I built these tools the way I wish someone had when I was starting out — plain language, practical focus, and sized for businesses with no dedicated IT staff. The assessment questions are based on real security incidents. The recommendations come from things that actually work.</p>
          <p>I hold <strong>13 active certifications</strong> including my CISSP, CySA+, SSCP, and Security+, and am completing a <strong>Bachelor of Science in Cybersecurity at Western Governors University</strong>. My day job at OnX keeps me close to what is actually happening in the threat landscape — and that informs everything here.</p>
          <p>Everything on this site is <strong>free</strong>. If it helps your business, that is the whole point. If you want to talk through your specific situation, reach out.</p>
        </div>
        <div className="about-sidebar">
          <div className="sb-card">
            <div className="sb-title">Certifications</div>
            <div className="cert-grid">
              {CERTS.map(c=><div key={c.code} className="cert-badge"><div className="cert-code">{c.code}</div><div className="cert-issuer">{c.issuer}</div></div>)}
              <div className="cert-more"><div className="cert-more-n">+9</div><div className="cert-more-l">Additional Active Certifications</div></div>
            </div>
          </div>
          <div className="sb-card">
            <div className="sb-title">At a Glance</div>
            <div className="stat-list">
              {[["Role","Security Engineer"],["Employer","OnX"],["Location","Halifax, NS"],["Education","BS Cybersecurity, WGU"],["Active Certs","13"]].map(([l,v])=>(
                <div key={l} className="stat-item"><span className="stat-item-l">{l}</span><span className="stat-item-v">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="about-cta">
        <div className="about-cta-inner">
          <div><h3>Ready to find out where you stand?</h3><p>Take the free assessment and get your report in 15 minutes.</p></div>
          <div className="cta-btns">
            <button className="btn-white" onClick={()=>setView("assessment")}>Start Free Assessment</button>
            <a className="btn-outline-white" href="mailto:paul@greensecuritygroup.com">Get in Touch <IcoArr/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView]=useState("home");
  return (
    <div>
      <style>{css}</style>
      {view==="assessment"
        ?<AssessmentFlow onBack={()=>setView("home")}/>
        :<><SiteNav view={view} setView={setView}/>{view==="home"&&<HomePage setView={setView}/>}{view==="about"&&<AboutPage setView={setView}/>}<SiteFooter setView={setView}/></>
      }
    </div>
  );
}
