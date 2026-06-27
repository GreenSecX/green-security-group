import { useState } from "react";

// ─── GSG hexagon mark ─────────────────────────────────────────────────────────
const GSGMark = ({ size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} style={{flexShrink:0}}>
    <defs>
      <filter id="irmglow"><feGaussianBlur stdDeviation="2.5" result="b1"/><feGaussianBlur stdDeviation="5" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="irdglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="100" height="100" fill="#000"/>
    <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#050a06" stroke="#00ee66" strokeWidth="2" filter="url(#irmglow)"/>
    <polygon points="50,14 82,32 82,68 50,86 18,68 18,32" fill="#030803" stroke="#00dd55" strokeWidth="1.2" filter="url(#irmglow)" opacity="0.8"/>
    <path d="M50 28 A22 22 0 1 0 72 50 L58 50" fill="none" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#irmglow)"/>
    <line x1="58" y1="50" x2="72" y2="50" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#irmglow)"/>
    <line x1="72" y1="50" x2="72" y2="62" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#irmglow)"/>
    {[[50,6],[88,28],[88,72],[50,94],[12,72],[12,28]].map(([cx,cy],i)=>(<circle key={i} cx={cx} cy={cy} r="3" fill="#00ff66" filter="url(#irdglow)"/>))}
  </svg>
);

const IcoArr = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoDoc = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoScale = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 7h18M6 7l-3 6h6zM18 7l-3 6h6z"/></svg>;
const IcoCheck = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoX = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

// ─── Scenario data ────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    num: "01", title: "The fast restore", point: "Preserve vs. recover",
    context: "Northtide Bookkeeping — a 6-person firm that runs payroll for its clients and holds their personal data, including Social Insurance Numbers. Northtide has near-zero tolerance for any exposure of client personal information.",
    plan: "On suspected ransomware, isolate affected systems. Capture a forensic image before any restore. Preservation precedes recovery. The Incident Lead authorizes any deviation. (IR Plan \u00a74.2)",
    law: "Under PIPEDA you cannot assess \u201creal risk of significant harm\u201d without knowing whether data was exfiltrated \u2014 and modern ransomware often steals data before encrypting it. (Educational; confirm with counsel.)",
    situation: "Monday, 7:40am. Northtide\u2019s shared file server is encrypted, with a ransom note on screen. Staff are arriving, clients are calling, nobody can work. The owner wants to wipe the server and restore from last night\u2019s clean-looking backup to be operational by 9am.",
    options: [
      { k:"A", correct:false, label:"Wipe and restore from backup now \u2014 backups look clean, clients need service, speed wins.", verdict:"The trap", why:"It restores service fast and destroys the forensic basis to determine what was taken. With no evidence you must assume worst-case, forcing a broader, costlier notification than you might have owed. You traded an hour of uptime for a decision your plan and a regulator will both ask you to justify \u2014 and you can\u2019t." },
      { k:"B", correct:false, label:"Pay the ransom to get the fastest decryption.", verdict:"Wrong", why:"Rarely the right opening move, it doesn\u2019t touch the notification duty (paying doesn\u2019t un-happen the breach), and it\u2019s almost certainly an authority decision nobody pre-assigned." },
      { k:"C", correct:true, label:"Isolate the server, capture a forensic image before any restore, and convene the Incident Lead \u2014 follow the plan.", verdict:"Correct", why:"The only move consistent with both anchors. The plan says preservation precedes recovery, and the law needs that evidence \u2014 you cannot scope the harm without knowing what was exfiltrated." },
      { k:"D", correct:false, label:"Restore from backup but keep the encrypted disk \u201cjust in case.\u201d", verdict:"Well-meant, still wrong", why:"\u201cKeep the disk\u201d is a shrug, not preservation. Powering down and re-imaging around it can still destroy volatile evidence and break chain of custody. The plan specifies a forensic image, deliberately." },
    ],
    beat: "The technically fastest move (A) is the wrong governance move \u2014 and the reason isn\u2019t \u201cthe malware spreads,\u201d it\u2019s \u201cyou destroyed your ability to make a defensible notification decision.\u201d The plan existed precisely to override the 7:40am panic instinct. A checkbox auditor writes \u201cwe have a plan.\u201d An owner builds one that survives the moment everyone wants to ignore it.",
    chain: "Preserving evidence becomes a habit. A week later it\u2019s tested again \u2014 this time before any breach is even confirmed.",
  },
  {
    num: "02", title: "The new bank details", point: "Decision authority",
    context: "Northtide runs client payroll and pays vendors \u2014 it moves client money. It has near-zero tolerance for misdirected funds and unauthorized financial actions. The owner (the Principal) is the only person who can authorize payments and banking changes.",
    plan: "Any change to banking details, and any payment instruction received by email, must be verified by callback to a known number and authorized by the Principal before processing. Any staff member may place a hold on a suspect payment. No staff member may release a flagged payment without the Principal\u2019s authorization. (Financial Controls \u00a73.1)",
    law: "If this is a compromised mailbox (not just a spoofed email), client personal data may have been exposed \u2014 which would trigger a PIPEDA harm assessment. Whether that fires depends on what the investigation finds. (Educational; confirm with counsel.)",
    situation: "Thursday, 4:15pm. Dana, a bookkeeper, is about to run a client\u2019s payroll. An email \u2014 appearing to be from that client\u2019s owner \u2014 says an employee\u2019s bank changed and gives new account details: \u201cplease update before today\u2019s run, they really need this paycheque.\u201d The address looks right. Payroll closes at 5.",
    options: [
      { k:"A", correct:false, label:"Update the details and process \u2014 the email looks legitimate and the employee needs paying today.", verdict:"The trap", why:"Apparent authority under time pressure is the social-engineering lever. Updating bank details on an unverified email is how the money leaves \u2014 and once it\u2019s paid to a fraudster, Northtide ate the loss because Northtide processed it. The plan exists to override this exact instinct." },
      { k:"B", correct:false, label:"Reply to the email asking the client to confirm before processing.", verdict:"Theater, not verification", why:"Replying verifies through the channel that may itself be compromised \u2014 if the mailbox is taken over, the fraudster answers \u201cyes, confirmed.\u201d \u00a73.1 requires out-of-band callback to a known number for exactly this reason." },
      { k:"C", correct:true, label:"Place a hold, change nothing, and escalate to the Principal for callback verification and authorization \u2014 even though it means missing today\u2019s run.", verdict:"Correct", why:"The only move consistent with \u00a73.1 \u2014 verify by callback, authorize by the Principal, and Dana is explicitly empowered to hold." },
      { k:"D", correct:false, label:"Process today to make the deadline, then flag it to the Principal afterward to verify.", verdict:"Wrong", why:"Telling the Principal after the money\u2019s gone isn\u2019t authority \u2014 it\u2019s a report of a loss. The deadline is the pressure that\u2019s supposed to make you skip the control." },
    ],
    beat: "A junior bookkeeper placing a hold on an urgent request feels overcautious \u2014 even insubordinate. The reveal: the plan explicitly authorizes any staff member to halt a payment, precisely so one employee can stop an authority-impersonation attack without needing permission to be careful. Decision authority defined before the crisis is what lets a junior person say no to a senior-sounding instruction.",
    chain: "The Principal calls the client\u2019s known number. The client says: \u201cI never sent that.\u201d Not just a spoof \u2014 which raises a far harder question.",
  },
  {
    num: "03", title: "The clock nobody started", point: "Obligation assessment",
    context: "The data now in question: client payroll files \u2014 names, SINs, bank account numbers. High-sensitivity personal information, the category Northtide guards most tightly.",
    plan: "On confirmation that personal information may have been exposed, the Principal assesses real risk of significant harm and, where it exists, reports to the OPC and notifies affected individuals as soon as feasible. All breaches of security safeguards are recorded and retained for 24 months, regardless of the harm assessment. (IR Plan \u00a75)",
    law: "PIPEDA \u2014 assess \u201creal risk of significant harm\u201d (weighing sensitivity and probability of misuse). Where it exists: report to the OPC and notify individuals as soon as feasible. Record-keeping: all such breaches kept 24 months regardless of the determination. (Educational; confirm with counsel.)",
    situation: "The callback confirmed the client never sent that email. Checking further, Northtide finds its shared mailbox was accessed by an unauthorized party over the past week \u2014 and it held several clients\u2019 payroll files: names, SINs, bank numbers. The wire was caught and held, so no money was lost. The Principal resets the password, enables MFA, and feels it\u2019s handled: \u201cWe stopped the payment, we secured the account, no harm done.\u201d",
    options: [
      { k:"A", correct:false, label:"Treat the incident as closed \u2014 the money was saved and the account is secured. No need to alarm clients or regulators over an attack that didn\u2019t succeed.", verdict:"The trap", why:"\u201cWe caught it, no harm done\u201d confuses fixing the operational problem with the incident being over. Holding the wire solved the financial problem. Confirmed unauthorized access to SINs triggers a harm assessment regardless of whether any money moved \u2014 and the clients are exposed to identity theft either way." },
      { k:"B", correct:false, label:"Quietly tell the affected clients, but don\u2019t involve the OPC \u2014 keep it discreet to protect the firm\u2019s reputation.", verdict:"Wrong", why:"Where the harm threshold is met, OPC reporting and individual notification are both required \u2014 you don\u2019t get to keep the less embarrassing half. \u201cDiscreet for reputation\u201d treats a legal duty as a PR decision." },
      { k:"C", correct:true, label:"Assess the harm (high-sensitivity SINs + bank data + confirmed access = real risk), report to the OPC, notify affected individuals as soon as feasible, record the breach for 24 months, and engage counsel.", verdict:"Correct", why:"The only path that treats the privacy obligation as the separate track it is \u2014 meeting both the reporting duty and the record-keeping duty." },
      { k:"D", correct:false, label:"Wait until the investigation can prove data was actually copied, then decide whether to notify.", verdict:"Wrong", why:"The standard is risk, not proof of completed misuse. You can almost never prove exfiltration, and \u201cas soon as feasible\u201d doesn\u2019t mean \u201cafter you\u2019ve proven it.\u201d And even a \u201cno notification needed\u201d conclusion still triggers the 24-month record-keeping." },
    ],
    beat: "One incident, two separate clocks. The firm pours everything into the money \u2014 recover the wire, reset the password \u2014 and feels finished when the operational fire is out. But a separate obligation, the notification duty, started the moment personal data was exposed, and none of the financial fixes touch it. An incident isn\u2019t over when your systems are safe. It\u2019s over when your obligations are met.",
    chain: null,
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --white:#ffffff;--off-white:#f8faf9;--surface:#f1f5f2;
    --border:#d4e4da;--border-hi:#b8d4c2;
    --green:#1a7a3c;--green-light:#dcfce7;--green-glow:rgba(26,122,60,0.15);
    --amber:#c17b00;--amber-light:#fef3c7;--red:#b91c1c;--red-light:#fee2e2;
    --text:#1a2e22;--text-2:#3d6b50;--muted:#6b9e80;--dim:#9dbfad;
    --serif:'Merriweather',Georgia,serif;--sans:'Inter',system-ui,sans-serif;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--white);color:var(--text);font-family:var(--sans);line-height:1.65;-webkit-font-smoothing:antialiased;}

  .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 2rem;}
  .nav-inner{max-width:920px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:68px;}
  .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:0.95rem;color:var(--text);text-decoration:none;}
  .nav-links{display:flex;gap:1.75rem;list-style:none;align-items:center;}
  .nav-links a{font-size:0.875rem;color:var(--muted);text-decoration:none;transition:color 0.2s;font-weight:500;}
  .nav-links a:hover{color:var(--green);}

  .wrap{max-width:920px;margin:0 auto;padding:2.5rem 2rem 4rem;}

  /* progress */
  .prog{display:flex;gap:6px;margin-bottom:2rem;}
  .prog-seg{flex:1;height:5px;border-radius:3px;background:var(--border);transition:background 0.3s;}
  .prog-seg.done{background:var(--green);}
  .prog-seg.cur{background:var(--green-light);box-shadow:inset 0 0 0 1.5px var(--green);}

  /* intro */
  .intro{text-align:center;padding:2rem 0 1rem;}
  .eyebrow{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green-light);color:var(--green);font-size:0.8rem;font-weight:600;padding:0.4rem 1rem;border-radius:20px;margin-bottom:1.5rem;letter-spacing:0.02em;}
  .intro h1{font-family:var(--serif);font-size:clamp(2rem,4.5vw,3rem);line-height:1.2;margin-bottom:1.25rem;color:var(--text);}
  .intro h1 em{color:var(--green);font-style:italic;}
  .intro-sub{font-size:1.05rem;color:var(--text-2);max-width:620px;margin:0 auto 1.5rem;line-height:1.85;}
  .intro-how{background:var(--off-white);border:1px solid var(--border);border-radius:12px;padding:1.5rem 1.75rem;max-width:620px;margin:0 auto 2rem;text-align:left;}
  .intro-how h3{font-size:0.78rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.85rem;}
  .intro-how ul{list-style:none;display:flex;flex-direction:column;gap:0.7rem;}
  .intro-how li{display:flex;gap:0.7rem;font-size:0.92rem;color:var(--text-2);line-height:1.6;}
  .ih-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:0.5rem;}

  .btn{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green);color:white;border:none;border-radius:8px;padding:0.9rem 2rem;font-size:0.95rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn:hover{background:#15693a;transform:translateY(-1px);box-shadow:0 6px 20px var(--green-glow);}
  .btn-ghost{display:inline-flex;align-items:center;gap:0.4rem;background:white;color:var(--green);border:2px solid var(--green);border-radius:8px;padding:0.75rem 1.5rem;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none;font-family:var(--sans);transition:all 0.2s;}
  .btn-ghost:hover{background:var(--green-light);}

  /* scenario */
  .sc-head{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;}
  .sc-badge{font-size:0.72rem;font-weight:700;color:var(--green);background:var(--green-light);padding:0.25rem 0.7rem;border-radius:20px;letter-spacing:0.04em;text-transform:uppercase;}
  .sc-point{font-size:0.78rem;color:var(--muted);font-weight:500;}
  .sc-title{font-family:var(--serif);font-size:1.65rem;color:var(--text);margin-bottom:0.75rem;}
  .sc-context{font-size:0.92rem;color:var(--text-2);line-height:1.75;margin-bottom:1.25rem;}

  .anchors{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;margin-bottom:1.25rem;}
  .anchor{border-radius:10px;padding:1rem 1.15rem;font-size:0.86rem;line-height:1.65;}
  .anchor-plan{background:var(--green-light);border:1px solid var(--border-hi);}
  .anchor-law{background:var(--off-white);border:1px solid var(--border);}
  .anchor-h{display:flex;align-items:center;gap:0.45rem;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;}
  .anchor-plan .anchor-h{color:var(--green);}
  .anchor-law .anchor-h{color:var(--text-2);}
  .anchor p{color:var(--text-2);}

  .situation{background:white;border:1px solid var(--border);border-left:4px solid var(--text);border-radius:10px;padding:1.25rem 1.4rem;font-size:0.98rem;color:var(--text);line-height:1.8;margin-bottom:1.5rem;}

  .q-label{font-size:0.82rem;font-weight:600;color:var(--text-2);margin-bottom:0.85rem;}
  .opts{display:flex;flex-direction:column;gap:0.7rem;}
  .opt{display:flex;gap:0.85rem;text-align:left;background:white;border:1.5px solid var(--border);border-radius:10px;padding:1rem 1.15rem;cursor:pointer;transition:all 0.15s;font-family:var(--sans);width:100%;align-items:flex-start;}
  .opt:hover:not(:disabled){border-color:var(--green);background:var(--off-white);}
  .opt:disabled{cursor:default;}
  .opt-k{font-weight:700;font-size:0.85rem;color:var(--green);background:var(--green-light);width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .opt-label{font-size:0.92rem;color:var(--text);line-height:1.6;}
  .opt.correct{border-color:var(--green);background:var(--green-light);}
  .opt.wrong{border-color:var(--red);background:var(--red-light);}
  .opt.dim{opacity:0.6;}
  .opt.correct .opt-k{background:var(--green);color:white;}
  .opt.wrong .opt-k{background:var(--red);color:white;}

  .reveal{margin-top:1.5rem;}
  .verdicts{display:flex;flex-direction:column;gap:0.85rem;margin-bottom:1.5rem;}
  .vd{border-radius:10px;padding:1rem 1.15rem;border:1px solid var(--border);background:var(--off-white);}
  .vd.correct{background:var(--green-light);border-color:var(--border-hi);}
  .vd.chosen-wrong{background:var(--red-light);border-color:#f0c9c9;}
  .vd-top{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;}
  .vd-icon{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;}
  .vd-icon.ok{background:var(--green);} .vd-icon.no{background:var(--red);} .vd-icon.neutral{background:var(--muted);}
  .vd-k{font-size:0.82rem;font-weight:700;color:var(--text);}
  .vd-verdict{font-size:0.78rem;font-weight:600;}
  .vd.correct .vd-verdict{color:var(--green);} .vd.chosen-wrong .vd-verdict{color:var(--red);} .vd .vd-verdict{color:var(--muted);}
  .vd-why{font-size:0.88rem;color:var(--text-2);line-height:1.7;}

  .beat{background:var(--text);border-radius:12px;padding:1.4rem 1.6rem;margin-bottom:1.5rem;}
  .beat-h{font-size:0.72rem;font-weight:700;color:#7fd6a0;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.6rem;}
  .beat p{font-size:0.95rem;color:#e8f3ec;line-height:1.8;}

  .chain{font-size:0.92rem;color:var(--text-2);font-style:italic;line-height:1.75;padding:1rem 1.2rem;background:var(--off-white);border-radius:10px;border:1px dashed var(--border-hi);margin-bottom:1.5rem;}

  .sc-foot{display:flex;justify-content:flex-end;}

  /* summary */
  .sum-hero{text-align:center;margin-bottom:2.5rem;}
  .sum-score{font-family:var(--serif);font-size:3rem;font-weight:700;color:var(--green);line-height:1;margin-bottom:0.5rem;}
  .sum-score small{font-size:1.2rem;color:var(--muted);font-weight:400;}
  .sum-hero h2{font-family:var(--serif);font-size:1.8rem;color:var(--text);margin-bottom:0.75rem;}
  .sum-hero p{font-size:0.98rem;color:var(--text-2);max-width:600px;margin:0 auto;line-height:1.8;}
  .arc{display:flex;align-items:stretch;gap:0.5rem;margin-bottom:2rem;flex-wrap:wrap;}
  .arc-step{flex:1;min-width:200px;background:var(--off-white);border:1px solid var(--border);border-radius:10px;padding:1.1rem 1.25rem;}
  .arc-n{font-size:0.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.3rem;}
  .arc-t{font-size:0.95rem;font-weight:600;color:var(--text);margin-bottom:0.35rem;}
  .arc-d{font-size:0.84rem;color:var(--text-2);line-height:1.6;}
  .sum-lesson{background:var(--green-light);border:1px solid var(--border-hi);border-radius:12px;padding:1.5rem 1.75rem;margin-bottom:1.5rem;}
  .sum-lesson p{font-size:1rem;color:var(--text);line-height:1.8;font-family:var(--serif);font-style:italic;}
  .sum-prov{font-size:0.9rem;color:var(--text-2);line-height:1.75;padding:1.25rem 1.5rem;background:var(--off-white);border:1px solid var(--border);border-radius:12px;margin-bottom:1.75rem;}
  .sum-prov a{color:var(--green);text-decoration:none;font-weight:600;}
  .sum-prov a:hover{text-decoration:underline;}
  .sum-cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}

  .footer{background:var(--text);padding:2.5rem 2rem;margin-top:2rem;}
  .footer-inner{max-width:920px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;}
  .footer-name{font-size:0.95rem;color:white;font-weight:600;margin-bottom:0.25rem;}
  .footer-copy{font-size:0.78rem;color:var(--muted);}
  .footer-links{display:flex;gap:1.75rem;list-style:none;}
  .footer-links a{font-size:0.8rem;color:var(--dim);text-decoration:none;}
  .footer-links a:hover{color:white;}

  .disclaimer{font-size:0.78rem;color:var(--muted);line-height:1.7;text-align:center;max-width:640px;margin:2rem auto 0;font-style:italic;}

  @media(max-width:640px){
    .nav{padding:0 1rem;} .nav-links{gap:0.9rem;} .nav-links a{font-size:0.78rem;}
    .wrap{padding:1.5rem 1.25rem 3rem;}
    .anchors{grid-template-columns:1fr;}
    .arc{flex-direction:column;}
    .footer{padding:2rem 1.25rem;} .footer-inner{flex-direction:column;align-items:flex-start;}
  }
`;

export default function IncidentResponse() {
  const [stage, setStage] = useState("intro"); // 'intro' | 0..n | 'summary'
  const [picks, setPicks] = useState({}); // {num: optionKey}

  const score = SCENARIOS.filter(s => {
    const p = picks[s.num];
    return p && s.options.find(o => o.k === p)?.correct;
  }).length;

  const choose = (sc, k) => {
    if (picks[sc.num]) return; // lock first pick
    setPicks(p => ({ ...p, [sc.num]: k }));
  };

  const advance = () => {
    if (stage === "intro") { setStage(0); }
    else if (typeof stage === "number") {
      if (stage < SCENARIOS.length - 1) setStage(stage + 1);
      else setStage("summary");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => { setPicks({}); setStage("intro"); window.scrollTo({top:0}); };

  return (
    <div>
      <style>{css}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" href="/"><GSGMark size={36} /><span>Green Security Group</span></a>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/security">Security</a></li>
          </ul>
        </div>
      </nav>

      <div className="wrap">

        {typeof stage === "number" && (
          <div className="prog">
            {SCENARIOS.map((s,i)=>(
              <div key={s.num} className={"prog-seg"+(i<stage?" done":i===stage?" cur":"")}/>
            ))}
          </div>
        )}

        {/* INTRO */}
        {stage === "intro" && (
          <div className="intro">
            <div className="eyebrow">Interactive \u00b7 Governance, not technical</div>
            <h1>You run the <em>response</em>,<br/>not the recovery.</h1>
            <p className="intro-sub">
              Three incidents hit Northtide Bookkeeping &#8212; a small firm that holds its clients&#8217;
              payroll data. Each one tests a different governance decision. You won&#8217;t be asked which
              command to run. You&#8217;ll be asked what a prepared business <em>decides</em> when the
              pressure is on.
            </p>
            <div className="intro-how">
              <h3>How it works</h3>
              <ul>
                <li><span className="ih-dot"/><span>Every decision is graded against two things you can see: <strong>the firm&#8217;s own incident response plan</strong>, and <strong>the law</strong>. Not against opinion.</span></li>
                <li><span className="ih-dot"/><span>The fastest or most reassuring move is often the wrong one. The plan exists to override the instinct in the moment.</span></li>
                <li><span className="ih-dot"/><span>The three scenarios compound &#8212; the last one is only answerable because of how you handled the first two.</span></li>
              </ul>
            </div>
            <button className="btn" onClick={advance}>Begin <IcoArr/></button>
          </div>
        )}

        {/* SCENARIO */}
        {typeof stage === "number" && (() => {
          const sc = SCENARIOS[stage];
          const picked = picks[sc.num];
          const revealed = !!picked;
          return (
            <div key={sc.num}>
              <div className="sc-head">
                <span className="sc-badge">Scenario {sc.num}</span>
                <span className="sc-point">{sc.point}</span>
              </div>
              <h2 className="sc-title">{sc.title}</h2>
              <p className="sc-context">{sc.context}</p>

              <div className="anchors">
                <div className="anchor anchor-plan">
                  <div className="anchor-h"><IcoDoc/> Northtide&#8217;s plan says</div>
                  <p>{sc.plan}</p>
                </div>
                <div className="anchor anchor-law">
                  <div className="anchor-h"><IcoScale/> The law says</div>
                  <p>{sc.law}</p>
                </div>
              </div>

              <div className="situation">{sc.situation}</div>

              <div className="q-label">{revealed ? "Your call:" : "What do you do?"}</div>
              <div className="opts">
                {sc.options.map(o => {
                  let cls = "opt";
                  if (revealed) {
                    if (o.correct) cls += " correct";
                    else if (o.k === picked) cls += " wrong";
                    else cls += " dim";
                  }
                  return (
                    <button key={o.k} className={cls} disabled={revealed} onClick={()=>choose(sc,o.k)}>
                      <span className="opt-k">{o.k}</span>
                      <span className="opt-label">{o.label}</span>
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div className="reveal">
                  <div className="verdicts">
                    {sc.options.map(o => {
                      const isChosen = o.k === picked;
                      const cls = "vd" + (o.correct ? " correct" : isChosen ? " chosen-wrong" : "");
                      const iconCls = o.correct ? "ok" : isChosen ? "no" : "neutral";
                      return (
                        <div key={o.k} className={cls}>
                          <div className="vd-top">
                            <span className={"vd-icon "+iconCls}>{o.correct ? <IcoCheck/> : <IcoX/>}</span>
                            <span className="vd-k">{o.k}.</span>
                            <span className="vd-verdict">{o.verdict}{isChosen && !o.correct ? " \u2014 your pick" : ""}{isChosen && o.correct ? " \u2014 your pick" : ""}</span>
                          </div>
                          <div className="vd-why">{o.why}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="beat">
                    <div className="beat-h">The thing nobody teaches</div>
                    <p>{sc.beat}</p>
                  </div>

                  {sc.chain && <div className="chain">{sc.chain}</div>}

                  <div className="sc-foot">
                    <button className="btn" onClick={advance}>
                      {stage < SCENARIOS.length - 1 ? "Next scenario" : "See the through-line"} <IcoArr/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* SUMMARY */}
        {stage === "summary" && (
          <div>
            <div className="sum-hero">
              <div className="sum-score">{score}<small> / {SCENARIOS.length}</small></div>
              <h2>You made the defensible call {score === SCENARIOS.length ? "every time" : score === 0 ? "on none of them \u2014 first time" : `${score} of ${SCENARIOS.length} times`}.</h2>
              <p>{score === SCENARIOS.length
                ? "Every choice held to the plan and the law under pressure. That consistency is the whole point \u2014 a plan only matters if it survives the moment everyone wants to ignore it."
                : "The point isn\u2019t the score \u2014 it\u2019s noticing which instinct the plan was built to override. Read back through any you missed; the fastest or most reassuring move was the trap each time."}</p>
            </div>

            <div className="arc">
              <div className="arc-step">
                <div className="arc-n">Scenario 01</div>
                <div className="arc-t">Preserve before you recover</div>
                <div className="arc-d">Capturing evidence instead of wiping is what lets you ever know <em>what</em> was exposed.</div>
              </div>
              <div className="arc-step">
                <div className="arc-n">Scenario 02</div>
                <div className="arc-t">The hold</div>
                <div className="arc-d">Pre-defined authority let one bookkeeper stop the payment \u2014 which surfaced the compromise instead of burying it.</div>
              </div>
              <div className="arc-step">
                <div className="arc-n">Scenario 03</div>
                <div className="arc-t">Meet the obligation</div>
                <div className="arc-d">Only because of the first two could Northtide scope the breach and notify the <em>specific</em> people owed it.</div>
              </div>
            </div>

            <div className="sum-lesson">
              <p>&#8220;An incident isn&#8217;t over when your systems are safe. It&#8217;s over when your obligations are met.&#8221;</p>
            </div>

            <div className="sum-prov">
              These scenarios are graded against a real incident-response methodology &#8212; the same standard
              Green Security Group holds its own operation to. See <a href="/security">how we secure our own systems</a>.
            </div>

            <div className="sum-cta">
              <a className="btn" href="/">Explore the free assessment <IcoArr/></a>
              <button className="btn-ghost" onClick={restart}>Run it again</button>
            </div>

            <p className="disclaimer">
              Northtide Bookkeeping is a fictional firm. These scenarios are educational and do not constitute
              legal advice; a real breach decision should be made with qualified privacy counsel. PIPEDA
              references are simplified for teaching.
            </p>
          </div>
        )}

      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-name">Green Security Group</div>
            <div className="footer-copy">Paul Green, CISSP &#183; Nova Scotia, Canada</div>
          </div>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/security">Security</a></li>
            <li><a href="mailto:paul@greensecuritygroup.com">Email</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
