import { useState } from "react";

// ── Phishing scenarios ────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1,
    difficulty: "easy",
    label: "Level 1",
    isPhishing: true,
    email: {
      from_name: "Royal Bank of Canada",
      from_addr: "security@rbc-alerts.net",
      to: "you@yourbusiness.com",
      subject: "URGENT: Your RBC account has been suspended",
      body: `Dear Valued Customer,

We have detected unusual activity on your RBC Online Banking account. Your account has been temporarily suspended for your protection.

To restore access immediately, please verify your information by clicking the button below within 24 hours or your account will be permanently closed.

Your account number ending in: ****4821

If you do not verify within 24 HOURS your account will be PERMANENTLY SUSPENDED.`,
      cta: "Verify My Account Now",
      cta_url: "http://rbc-secure-verify.com/login",
    },
    red_flags: [
      "The sender domain is rbc-alerts.net — not rbc.com. RBC only sends email from @rbc.com.",
      "Urgent language and threats of permanent suspension are classic pressure tactics designed to make you act without thinking.",
      "Legitimate banks never ask you to verify your account by clicking an email link.",
      "The link goes to rbc-secure-verify.com — a fake domain with no connection to RBC.",
    ],
    what_to_do: "Do not click the link. If you are concerned about your account, call the number on the back of your RBC card or go directly to rbc.com by typing it in your browser.",
    tip: "Always check the sender's email domain — not just the display name. The name can say anything.",
  },
  {
    id: 2,
    difficulty: "easy",
    label: "Level 2",
    isPhishing: false,
    email: {
      from_name: "Google",
      from_addr: "no-reply@accounts.google.com",
      to: "you@yourbusiness.com",
      subject: "Security alert: New sign-in to your Google Account",
      body: `Hi,

Your Google Account was just signed in to from a new Windows device. If this was you, you don't need to do anything.

If this wasn't you, your account may have been compromised. You can review your recent sign-ins at myaccount.google.com.

Device: Windows PC
Location: Halifax, NS
Time: Today, 9:14 AM`,
      cta: "Review Activity",
      cta_url: "https://myaccount.google.com/notifications",
    },
    red_flags: [],
    what_to_do: "This is a legitimate Google security alert. The sender domain is accounts.google.com, the link goes to myaccount.google.com, and there are no threats or urgency tactics. If you did sign in, no action needed. If you did not, click Review Activity to secure your account.",
    tip: "Not every security email is phishing. Legitimate alerts from Google, Microsoft, and others use their real domains and link to their real websites.",
  },
  {
    id: 3,
    difficulty: "easy",
    label: "Level 3",
    isPhishing: true,
    email: {
      from_name: "Canada Revenue Agency",
      from_addr: "refund@cra-arc-canada.com",
      to: "you@yourbusiness.com",
      subject: "You have a tax refund waiting — action required",
      body: `Dear taxpayer,

After the annual calculation of your fiscal activity, we have determined that you are eligible to receive a tax refund of $847.50.

Please submit your refund request within 3 business days to the following secure form. You will need your SIN, banking information, and date of birth to complete the request.

Refund amount: $847.50
Reference: CRA-2024-REF-88291`,
      cta: "Claim Your Refund",
      cta_url: "http://cra-refund-portal.ca/claim",
    },
    red_flags: [
      "The CRA never initiates contact by email to offer a refund or ask for personal information. Ever.",
      "The sender domain is cra-arc-canada.com — the real CRA uses canada.ca only.",
      "Asking for your SIN, banking details, and date of birth in one form is identity theft in progress.",
      "The link goes to cra-refund-portal.ca — a fake site with no connection to the government.",
    ],
    what_to_do: "Delete this email immediately. The CRA will only notify you of a refund through My Account on canada.ca or by mail. If you think you are owed a refund, log in to canada.ca directly.",
    tip: "The CRA never emails you to offer money or ask for personal information. If it sounds too good to be true and asks for your SIN — it is a scam.",
  },
  {
    id: 4,
    difficulty: "medium",
    label: "Level 4",
    isPhishing: true,
    email: {
      from_name: "Microsoft 365",
      from_addr: "admin@microsoft365-alerts.com",
      to: "you@yourbusiness.com",
      subject: "Action Required: Your Microsoft 365 subscription is expiring",
      body: `Hello,

Your Microsoft 365 Business subscription is set to expire in 3 days. To avoid service interruption and loss of access to your email, Teams, and OneDrive files, please update your payment information immediately.

Subscription: Microsoft 365 Business Standard
Expiry: In 3 days
Account: you@yourbusiness.com

Failure to update payment will result in immediate suspension of all services.`,
      cta: "Update Payment Now",
      cta_url: "https://microsoft365-alerts.com/billing/update",
    },
    red_flags: [
      "The sender domain is microsoft365-alerts.com — Microsoft only sends from microsoft.com or microsoftonline.com.",
      "The link stays on microsoft365-alerts.com — a fake domain — rather than going to microsoft.com.",
      "Threatening immediate suspension of all services is a pressure tactic to prevent careful thinking.",
      "Microsoft subscription emails always include your actual tenant name and billing details — not just your email address.",
    ],
    what_to_do: "Do not click the link. Check your Microsoft 365 subscription status by going directly to admin.microsoft.com in your browser. If your subscription were actually expiring, it would show there.",
    tip: "When in doubt about any subscription or billing email, always navigate directly to the service's website by typing it in your browser — never through a link in an email.",
  },
  {
    id: 5,
    difficulty: "medium",
    label: "Level 5",
    isPhishing: false,
    email: {
      from_name: "DocuSign",
      from_addr: "dse@docusign.net",
      to: "you@yourbusiness.com",
      subject: "Sarah Mitchell sent you a document to review and sign",
      body: `Sarah Mitchell (s.mitchell@partnerlaw.ca) has sent you a document via DocuSign.

Document: Q4 Service Agreement — Final Version
Message from Sarah: Hi, please review and sign the attached service agreement at your earliest convenience. Let me know if you have any questions.

Please review and sign by: Friday, November 15`,
      cta: "Review Document",
      cta_url: "https://app.docusign.com/sign/documents/abc123",
    },
    red_flags: [],
    what_to_do: "This appears to be a legitimate DocuSign notification. The sender is dse@docusign.net which is DocuSign's real sending domain, and the link goes to app.docusign.com. If you are not expecting a document from this person, call them directly to confirm before signing.",
    tip: "DocuSign sends from docusign.net and links to docusign.com. Always verify you are expecting a document before signing — a quick phone call to the sender is always worth it.",
  },
  {
    id: 6,
    difficulty: "medium",
    label: "Level 6",
    isPhishing: true,
    email: {
      from_name: "Sarah Thompson",
      from_addr: "sarah.thompson@yourbusiness-corp.com",
      to: "accounts@yourbusiness.com",
      subject: "Urgent wire transfer needed — confidential",
      body: `Hi,

I need you to process an urgent wire transfer today. I am in a meeting and cannot speak right now but this needs to be done before 3pm.

Please transfer $14,750 to the following account:

Bank: TD Canada Trust
Account: 1234567
Transit: 00152
Name: Meridian Consulting Group

I will explain everything when I get out of the meeting. Please do not discuss this with anyone else — it is a sensitive business matter.

Thanks,
Sarah Thompson
CEO`,
      cta: null,
      cta_url: null,
    },
    red_flags: [
      "The sender domain is yourbusiness-corp.com — note the -corp added. It looks like your domain but is completely different.",
      "Requests for urgent wire transfers with instructions not to tell anyone are the hallmark of Business Email Compromise (BEC) fraud.",
      "The CEO asking you to bypass normal process and keep it secret should always raise a red flag.",
      "No legitimate business transfer would be initiated this way — without documentation, approvals, or a phone call to verify.",
    ],
    what_to_do: "Do not transfer any money. Call Sarah Thompson directly on a known phone number — not one from this email — to verify the request. This is Business Email Compromise, one of the most costly scams targeting small businesses.",
    tip: "Any urgent request for a wire transfer from an executive, especially with instructions for secrecy, should always be verified by phone before any action is taken. Always.",
  },
  {
    id: 7,
    difficulty: "hard",
    label: "Level 7",
    isPhishing: true,
    email: {
      from_name: "Canada Post",
      from_addr: "notification@canadapost-delivery.ca",
      to: "you@yourbusiness.com",
      subject: "Your package could not be delivered — schedule redelivery",
      body: `Hello,

We attempted to deliver your package today but no one was available to receive it.

Tracking number: CP123456789CA
Sender: Office Depot Canada
Attempted delivery: Today at 11:42 AM

To schedule a redelivery or pick up your package at your local post office, please confirm your delivery address and pay a small redelivery fee of $2.99.

Your package will be held for 5 business days before being returned to sender.`,
      cta: "Schedule Redelivery",
      cta_url: "http://canadapost-delivery.ca/redeliver?id=CP123456789CA",
    },
    red_flags: [
      "The sender domain is canadapost-delivery.ca — Canada Post's real domain is canadapost.ca only.",
      "Canada Post never charges a redelivery fee by email. This $2.99 charge is designed to capture your credit card information.",
      "The link goes to canadapost-delivery.ca — a fake domain not connected to Canada Post.",
      "Vague sender details — no specific office location, no real tracking link to canadapost.ca.",
    ],
    what_to_do: "Do not click the link or pay the fee. If you are expecting a package, track it directly at canadapost.ca using your actual tracking number. Canada Post redelivery is arranged through their website or a card left at your door.",
    tip: "Parcel delivery scams are extremely common. Always verify tracking through the official carrier website by typing the address directly — never through a link in an unexpected email or text.",
  },
  {
    id: 8,
    difficulty: "hard",
    label: "Level 8",
    isPhishing: false,
    email: {
      from_name: "Interac e-Transfer",
      from_addr: "notify@payments.interac.ca",
      to: "you@yourbusiness.com",
      subject: "You have received an Interac e-Transfer for $1,250.00",
      body: `You have received an Interac e-Transfer.

From: James Kowalski (j.kowalski@northwestconstruction.ca)
Amount: $1,250.00
Message: Invoice #2847 — November payment

To deposit this transfer, sign in to your online banking at your financial institution. This transfer will expire in 30 days.

This notification was sent by Interac Corp. on behalf of your sender's financial institution.`,
      cta: "Deposit Transfer",
      cta_url: "https://etransfer.interac.ca/receive",
    },
    red_flags: [],
    what_to_do: "This appears to be a legitimate Interac e-Transfer notification. The sender domain is payments.interac.ca which is Interac's real domain, and the link goes to etransfer.interac.ca. To be extra safe, log in to your online banking directly rather than clicking the link.",
    tip: "Legitimate Interac notifications come from @payments.interac.ca and link to etransfer.interac.ca. When in doubt, just log in to your bank directly and check for pending transfers there.",
  },
  {
    id: 9,
    difficulty: "hard",
    label: "Level 9",
    isPhishing: true,
    email: {
      from_name: "IT Support",
      from_addr: "it.support@yourbusiness.com",
      to: "you@yourbusiness.com",
      subject: "Mandatory security update — action required by end of day",
      body: `Hi team,

As part of our ongoing security improvements, we are rolling out a mandatory update to our email security system today.

All employees must re-authenticate their accounts by end of day to avoid service interruption. This is a one-time process that takes less than 2 minutes.

Please use your current email and password to complete the verification. This request has been approved by management.`,
      cta: "Complete Verification",
      cta_url: "https://yourbusiness-itsupport.com/verify",
    },
    red_flags: [
      "Even though the sender shows your own domain, look carefully at the link — it goes to yourbusiness-itsupport.com, a completely different domain designed to steal your credentials.",
      "Legitimate IT teams never ask employees to enter their password through a link in an email.",
      "The phrase 'approved by management' without naming anyone is a social engineering technique to add false authority.",
      "The end-of-day deadline creates artificial urgency to prevent careful thinking.",
    ],
    what_to_do: "Do not click the link or enter your password. Contact your IT provider or manager directly by phone or in person to verify whether this request is real. Spoofed internal emails are a common and effective attack.",
    tip: "Your IT team will never ask for your password through an email link. If you receive a request like this, verify it directly with the sender before taking any action.",
  },
  {
    id: 10,
    difficulty: "hard",
    label: "Level 10",
    isPhishing: true,
    email: {
      from_name: "QuickBooks Online",
      from_addr: "billing@quickbooks-intuit.com",
      to: "accounts@yourbusiness.com",
      subject: "Your QuickBooks subscription — payment method update needed",
      body: `Hi there,

We were unable to process your most recent QuickBooks Online payment. To keep your account active and avoid losing access to your financial data, please update your payment information.

Your subscription: QuickBooks Online Simple Start
Last charge attempt: Failed
Amount due: $35.00/month

We will retry payment in 3 days. If payment is not received your account will be suspended and your data may be at risk.`,
      cta: "Update Payment Method",
      cta_url: "https://quickbooks-intuit.com/billing/update",
    },
    red_flags: [
      "The sender domain is quickbooks-intuit.com — Intuit's real domain is intuit.com. QuickBooks emails come from intuit.com, not a combined domain.",
      "The link also goes to quickbooks-intuit.com — a convincing but fake domain registered specifically for this scam.",
      "The threat that your data 'may be at risk' if you do not pay is designed to create fear and urgency.",
      "Legitimate QuickBooks billing emails always show your actual account name and last four digits of the card on file.",
    ],
    what_to_do: "Do not click the link. Check your QuickBooks account status by going directly to quickbooks.intuit.com in your browser. If there is a real billing issue it will show in your account settings.",
    tip: "Attackers register convincing domains like quickbooks-intuit.com or microsoft-support.com specifically to fool people. Always check: is this the company's actual domain, or does it just contain the company's name?",
  },
];

const REPORTING_TOOLS = [
  { name: "Microsoft Report Message", desc: "Built-in Outlook button to report phishing directly to Microsoft. Available in Outlook desktop and web.", url: "https://support.microsoft.com/en-us/office/phishing-and-suspicious-behavior-in-outlook-0d882ea5-eedc-4bed-aebc-079ffa1105a3" },
  { name: "Google Gmail Report Phishing", desc: "Use the three-dot menu in Gmail to report phishing emails directly to Google.", url: "https://support.google.com/mail/answer/8253" },
  { name: "CAFC — Canadian Anti-Fraud Centre", desc: "Report phishing and fraud attempts to Canada's national anti-fraud reporting centre.", url: "https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm" },
  { name: "CRA Phishing Reporting", desc: "Report CRA impersonation scams and fake tax emails directly to the Canada Revenue Agency.", url: "https://www.canada.ca/en/revenue-agency/corporate/security/protect-yourself-against-fraud.html" },
  { name: "PhishTank", desc: "Submit suspicious URLs to PhishTank's community database to help protect others.", url: "https://www.phishtank.com" },
  { name: "KnowBe4 Phish Alert Button", desc: "Free browser and email plugin that lets staff report phishing with one click and alerts your IT team.", url: "https://www.knowbe4.com/phish-alert" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --white:#ffffff;--off:#f8faf9;--surf:#f1f5f2;--surf2:#e8f0eb;
    --border:#d4e4da;--bord-hi:#b8d4c2;
    --green:#1a7a3c;--glight:#dcfce7;--gmid:#4caf73;--gglow:rgba(26,122,60,0.15);
    --amber:#c17b00;--ambl:#fef3c7;
    --red:#b91c1c;--redl:#fee2e2;
    --text:#1a2e22;--text2:#3d6b50;--muted:#6b9e80;--dim:#9dbfad;
    --serif:'Merriweather',Georgia,serif;
    --sans:'Inter',system-ui,sans-serif;
  }
  html,body{background:var(--white);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 2rem;}
  .nav-inner{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px;}
  .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:0.9rem;color:var(--text);background:none;border:none;cursor:pointer;font-family:var(--sans);}
  .logo-mark{width:32px;height:32px;border-radius:7px;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;flex-shrink:0;}
  .btn-primary{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green);color:white;border:none;border-radius:8px;padding:0.8rem 1.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn-primary:hover{background:#15693a;transform:translateY(-1px);box-shadow:0 6px 20px var(--gglow);}
  .btn-outline{display:inline-flex;align-items:center;gap:0.5rem;background:white;color:var(--green);border:2px solid var(--green);border-radius:8px;padding:0.75rem 1.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:var(--sans);}
  .btn-outline:hover{background:var(--glight);}
  .intro{min-height:calc(100vh - 60px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 1.5rem;text-align:center;background:var(--off);}
  .intro-badge{display:inline-flex;align-items:center;gap:0.5rem;background:var(--glight);color:var(--green);font-size:0.8rem;font-weight:600;padding:0.4rem 1rem;border-radius:20px;margin-bottom:1.5rem;}
  .intro h1{font-family:var(--serif);font-size:clamp(2rem,4vw,3rem);line-height:1.2;margin-bottom:1rem;max-width:600px;}
  .intro h1 em{color:var(--green);font-style:italic;}
  .intro-sub{font-size:1rem;color:var(--text2);max-width:520px;line-height:1.8;margin-bottom:2rem;}
  .level-row{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:2rem;}
  .level-pip{width:32px;height:8px;border-radius:4px;}
  .stats-row{display:flex;gap:2.5rem;justify-content:center;flex-wrap:wrap;padding:1.5rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:2rem;width:100%;max-width:480px;}
  .stat-n{font-family:var(--serif);font-size:1.6rem;font-weight:700;color:var(--text);display:block;}
  .stat-l{font-size:0.78rem;color:var(--muted);font-weight:500;}
  .game-wrap{max-width:860px;margin:0 auto;padding:2rem 1.5rem;}
  .progress-bar{height:6px;background:var(--border);border-radius:3px;margin-bottom:2rem;overflow:hidden;}
  .progress-fill{height:6px;border-radius:3px;background:var(--green);transition:width 0.4s ease;}
  .game-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:0.75rem;}
  .level-badge{font-size:0.72rem;font-weight:700;color:var(--green);background:var(--glight);padding:0.3rem 0.85rem;border-radius:20px;letter-spacing:0.05em;}
  .diff-badge{font-size:0.72rem;font-weight:600;padding:0.3rem 0.85rem;border-radius:20px;}
  .diff-easy{background:#dcfce7;color:#15803d;}
  .diff-medium{background:#fef3c7;color:#92400e;}
  .diff-hard{background:#fee2e2;color:#991b1b;}
  .score-display{font-size:0.85rem;font-weight:600;color:var(--muted);}
  .email-card{background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
  .email-toolbar{background:#f3f4f6;border-bottom:1px solid #e5e7eb;padding:0.6rem 1rem;display:flex;align-items:center;gap:0.5rem;}
  .toolbar-dot{width:12px;height:12px;border-radius:50%;}
  .email-header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);background:white;}
  .email-field{display:flex;gap:0.75rem;margin-bottom:0.5rem;align-items:flex-start;}
  .email-field:last-child{margin-bottom:0;}
  .field-label{font-size:0.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;width:52px;flex-shrink:0;margin-top:1px;}
  .field-val{font-size:0.9rem;color:var(--text);}
  .field-addr{font-size:0.82rem;color:var(--muted);}
  .email-body{padding:1.5rem;font-size:0.9rem;color:var(--text);line-height:1.8;white-space:pre-line;}
  .email-cta{margin:1rem 1.5rem 1.5rem;display:inline-block;background:var(--green);color:white;padding:0.65rem 1.25rem;border-radius:6px;font-size:0.875rem;font-weight:600;text-decoration:none;cursor:default;}
  .verdict-row{display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap;}
  .verdict-btn{flex:1;min-width:140px;padding:1rem;border-radius:10px;font-size:0.95rem;font-weight:600;cursor:pointer;border:2px solid;transition:all 0.2s;font-family:var(--sans);display:flex;align-items:center;justify-content:center;gap:0.6rem;}
  .verdict-legit{background:white;color:var(--green);border-color:var(--green);}
  .verdict-legit:hover{background:var(--glight);}
  .verdict-phish{background:white;color:var(--red);border-color:var(--red);}
  .verdict-phish:hover{background:var(--redl);}
  .result-card{border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;border:1px solid;}
  .result-correct{background:#f0fdf4;border-color:#86efac;}
  .result-wrong{background:var(--redl);border-color:#fca5a5;}
  .result-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;}
  .result-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
  .icon-correct{background:#dcfce7;}
  .icon-wrong{background:#fee2e2;}
  .result-title{font-size:1rem;font-weight:700;}
  .result-title-correct{color:#15803d;}
  .result-title-wrong{color:var(--red);}
  .red-flags{margin-top:1rem;}
  .red-flags-title{font-size:0.78rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.6rem;}
  .red-flag-item{display:flex;gap:0.6rem;align-items:flex-start;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text);}
  .red-flag-dot{width:6px;height:6px;border-radius:50%;background:var(--red);flex-shrink:0;margin-top:6px;}
  .what-to-do{margin-top:1rem;padding:0.85rem 1rem;background:white;border-radius:8px;border:1px solid var(--border);}
  .what-label{font-size:0.72rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem;}
  .tip-box{margin-top:0.75rem;padding:0.75rem 1rem;background:var(--glight);border-radius:8px;font-size:0.85rem;color:var(--green);line-height:1.65;}
  .tip-label{font-weight:700;margin-right:0.4rem;}
  .next-btn{width:100%;padding:1rem;background:var(--green);color:white;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:var(--sans);transition:all 0.2s;margin-top:0.5rem;}
  .next-btn:hover{background:#15693a;}
  .results-wrap{max-width:860px;margin:0 auto;padding:2rem 1.5rem;}
  .results-hero{text-align:center;padding:2.5rem;background:var(--off);border-radius:16px;border:1px solid var(--border);margin-bottom:2rem;}
  .score-circle{width:130px;height:130px;border-radius:50%;margin:0 auto 1.25rem;display:flex;flex-direction:column;align-items:center;justify-content:center;border:4px solid;background:white;}
  .score-pct{font-family:var(--serif);font-size:2.2rem;font-weight:700;line-height:1;}
  .score-sub{font-size:0.7rem;color:var(--muted);margin-top:3px;}
  .rating-pill{display:inline-block;padding:0.35rem 1.1rem;border-radius:20px;font-size:0.85rem;font-weight:600;margin-bottom:0.75rem;}
  .score-breakdown{margin-bottom:2rem;}
  .breakdown-title{font-size:0.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem;}
  .breakdown-row{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--border);}
  .br-num{font-size:0.72rem;font-weight:700;color:var(--green);width:20px;flex-shrink:0;}
  .br-label{font-size:0.85rem;color:var(--text);flex:1;}
  .br-result{font-size:0.75rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:20px;}
  .br-correct{background:var(--glight);color:var(--green);}
  .br-wrong{background:var(--redl);color:var(--red);}
  .next-steps{background:white;border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:1.5rem;}
  .ns-title{font-size:0.78rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:1rem;}
  .ns-item{display:flex;gap:0.75rem;align-items:flex-start;margin-bottom:0.85rem;font-size:0.9rem;color:var(--text2);line-height:1.6;}
  .ns-dot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:6px;}
  .reporting-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-bottom:1.5rem;}
  .rep-card{background:white;border:1px solid var(--border);border-radius:10px;padding:1.25rem;display:flex;flex-direction:column;gap:0.5rem;transition:all 0.2s;}
  .rep-card:hover{border-color:var(--bord-hi);box-shadow:0 2px 8px rgba(0,0,0,0.06);}
  .rep-name{font-size:0.9rem;font-weight:600;color:var(--text);}
  .rep-desc{font-size:0.82rem;color:var(--muted);line-height:1.6;flex:1;}
  .rep-link{font-size:0.8rem;font-weight:600;color:var(--green);text-decoration:none;margin-top:0.25rem;}
  .rep-link:hover{text-decoration:underline;}
  .restart-btn{width:100%;padding:0.85rem;background:white;color:var(--muted);border:1px solid var(--border);border-radius:10px;font-size:0.875rem;font-weight:500;cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
  .restart-btn:hover{border-color:var(--bord-hi);color:var(--text);}
  @media(max-width:600px){
    .game-wrap,.results-wrap{padding:1.5rem 1rem;}
    .verdict-row{flex-direction:column;}
    .intro{padding:2rem 1.25rem;}
    .email-body{padding:1rem;}
    .email-header{padding:1rem;}
    .reporting-grid{grid-template-columns:1fr;}
  }
`;

const GSGMark = ({ size = 32 }) => (
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
const scoreColor = pct => pct >= 80 ? "#15803d" : pct >= 60 ? "#c17b00" : "#b91c1c";
const scoreBg    = pct => pct >= 80 ? "#dcfce7" : pct >= 60 ? "#fef3c7" : "#fee2e2";
const scoreLabel = pct => pct >= 80 ? "Sharp Eye \u2014 Well Done" : pct >= 60 ? "Getting There" : pct >= 40 ? "Needs Practice" : "High Risk \u2014 Training Needed";

export default function PhishingSpotter() {
  const [view, setView] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const scenario = SCENARIOS[idx];
  const score = answers.filter(a => a.correct).length;
  const pct = Math.round((score / SCENARIOS.length) * 100);

  const answer = (choice) => {
    const correct = (choice === "phishing") === scenario.isPhishing;
    setUserChoice(choice);
    setAnswers(prev => [...prev, { id: scenario.id, correct, choice }]);
    setAnswered(true);
  };

  const next = () => {
    if (idx === SCENARIOS.length - 1) {
      setView("results");
    } else {
      setIdx(i => i + 1);
      setAnswered(false);
      setUserChoice(null);
    }
  };

  const restart = () => {
    setIdx(0); setAnswers([]); setAnswered(false); setUserChoice(null); setView("intro");
  };

  return (
    <div>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo"><GSGMark size={32} /><span>Green Security Group</span></div>
          {view !== "intro" && <span style={{fontSize:"0.82rem",color:"var(--muted)",fontWeight:500}}>
            {view === "results" ? "Results" : `${idx + 1} of ${SCENARIOS.length}`}
          </span>}
        </div>
      </nav>

      {view === "intro" && (
        <div className="intro">
          <div className="intro-badge">&#128247; Free Training Tool</div>
          <h1>Can you spot the <em>phishing email?</em></h1>
          <p className="intro-sub">
            Ten realistic emails. Some are phishing attempts. Some are legitimate. Can you tell the difference?
            Each round gets harder — and every answer comes with an explanation so you actually learn.
          </p>
          <div className="level-row">
            {SCENARIOS.map((s,i) => (
              <div key={s.id} className="level-pip" style={{background: s.difficulty === "easy" ? "#86efac" : s.difficulty === "medium" ? "#fcd34d" : "#fca5a5"}}/>
            ))}
          </div>
          <div className="stats-row">
            {[["10","Emails to review"],["3","Difficulty levels"],["~5 min","To complete"],["Free","No account needed"]].map(([n,l]) => (
              <div key={l} style={{textAlign:"center"}}><span className="stat-n">{n}</span><div className="stat-l">{l}</div></div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setView("game")} style={{fontSize:"1rem",padding:"1rem 2.5rem"}}>
            Start the Challenge &#8594;
          </button>
          <p style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:"1rem"}}>Based on real phishing techniques targeting Canadian small businesses.</p>
        </div>
      )}

      {view === "game" && scenario && (
        <div className="game-wrap">
          <div className="progress-bar"><div className="progress-fill" style={{width: `${((idx) / SCENARIOS.length) * 100}%`}}/></div>

          <div className="game-header">
            <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
              <span className="level-badge">{scenario.label}</span>
              <span className={`diff-badge diff-${scenario.difficulty}`}>{scenario.difficulty.charAt(0).toUpperCase()+scenario.difficulty.slice(1)}</span>
            </div>
            <span className="score-display">Score: {score}/{idx}</span>
          </div>

          <p style={{fontSize:"0.9rem",color:"var(--text2)",marginBottom:"1.25rem",fontWeight:500}}>
            Is this email <strong>legitimate</strong> or a <strong>phishing attempt</strong>?
          </p>

          <div className="email-card">
            <div className="email-toolbar">
              <div className="toolbar-dot" style={{background:"#ff5f57"}}/>
              <div className="toolbar-dot" style={{background:"#febc2e"}}/>
              <div className="toolbar-dot" style={{background:"#28c840"}}/>
            </div>
            <div className="email-header">
              <div className="email-field">
                <span className="field-label">From</span>
                <div><span className="field-val">{scenario.email.from_name}</span> <span className="field-addr">&lt;{scenario.email.from_addr}&gt;</span></div>
              </div>
              <div className="email-field">
                <span className="field-label">To</span>
                <span className="field-val">{scenario.email.to}</span>
              </div>
              <div className="email-field">
                <span className="field-label">Subject</span>
                <span className="field-val" style={{fontWeight:600}}>{scenario.email.subject}</span>
              </div>
            </div>
            <div className="email-body">{scenario.email.body}</div>
            {scenario.email.cta && (
              <div style={{padding:"0 1.5rem 1.5rem"}}>
                <span className="email-cta">{scenario.email.cta}</span>
                <div style={{fontSize:"0.72rem",color:"var(--muted)",marginTop:"0.4rem"}}>Link: {scenario.email.cta_url}</div>
              </div>
            )}
          </div>

          {!answered && (
            <div className="verdict-row">
              <button className="verdict-btn verdict-legit" onClick={() => answer("legitimate")}>
                &#10003; Looks Legitimate
              </button>
              <button className="verdict-btn verdict-phish" onClick={() => answer("phishing")}>
                &#9888; This is Phishing
              </button>
            </div>
          )}

          {answered && (
            <div>
              <div className={`result-card ${answers[answers.length-1].correct ? "result-correct" : "result-wrong"}`}>
                <div className="result-header">
                  <div className={`result-icon ${answers[answers.length-1].correct ? "icon-correct" : "icon-wrong"}`}>
                    {answers[answers.length-1].correct ? "🎉" : "🔍"}
                  </div>
                  <div>
                    <div className={`result-title ${answers[answers.length-1].correct ? "result-title-correct" : "result-title-wrong"}`}>
                      {answers[answers.length-1].correct
                        ? (scenario.isPhishing ? "Correct \u2014 That was phishing!" : "Correct \u2014 That was legitimate!")
                        : (scenario.isPhishing ? "Not quite \u2014 that was phishing" : "Not quite \u2014 that was actually legitimate")}
                    </div>
                    <div style={{fontSize:"0.82rem",color:"var(--text2)",marginTop:"3px"}}>
                      {scenario.isPhishing ? "This email was a phishing attempt." : "This email was legitimate."}
                    </div>
                  </div>
                </div>

                {scenario.isPhishing && scenario.red_flags.length > 0 && (
                  <div className="red-flags">
                    <div className="red-flags-title">Red flags in this email</div>
                    {scenario.red_flags.map((flag, i) => (
                      <div key={i} className="red-flag-item">
                        <div className="red-flag-dot"/>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="what-to-do">
                  <div className="what-label">{scenario.isPhishing ? "What to do" : "Why it's legitimate"}</div>
                  <div style={{fontSize:"0.875rem",color:"var(--text)",lineHeight:1.65}}>{scenario.what_to_do}</div>
                </div>

                <div className="tip-box">
                  <span className="tip-label">Tip:</span>{scenario.tip}
                </div>
              </div>

              <button className="next-btn" onClick={next}>
                {idx === SCENARIOS.length - 1 ? "See My Results \u2192" : "Next Email \u2192"}
              </button>
            </div>
          )}
        </div>
      )}

      {view === "results" && (
        <div className="results-wrap">
          <div className="results-hero">
            <div className="score-circle" style={{borderColor:scoreColor(pct)}}>
              <span className="score-pct" style={{color:scoreColor(pct)}}>{score}/{SCENARIOS.length}</span>
              <span className="score-sub">Correct</span>
            </div>
            <div className="rating-pill" style={{background:scoreBg(pct),color:scoreColor(pct)}}>{scoreLabel(pct)}</div>
            <div style={{fontSize:"0.9rem",color:"var(--muted)"}}>You correctly identified {score} out of {SCENARIOS.length} emails ({pct}%)</div>
          </div>

          <div className="score-breakdown">
            <div className="breakdown-title">Your answers</div>
            {SCENARIOS.map((s,i) => {
              const ans = answers[i];
              return (
                <div key={s.id} className="breakdown-row">
                  <span className="br-num">{s.id}</span>
                  <span className="br-label" style={{fontSize:"0.82rem"}}>{s.email.subject}</span>
                  <span className={`br-result ${ans?.correct ? "br-correct" : "br-wrong"}`}>
                    {ans?.correct ? "Correct" : "Missed"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="next-steps">
            <div className="ns-title">What to do next</div>
            {pct < 60 && <div className="ns-item"><div className="ns-dot"/><span>Your score suggests your team may be at risk. Consider running a phishing simulation and scheduling security awareness training this month.</span></div>}
            {pct >= 60 && pct < 80 && <div className="ns-item"><div className="ns-dot"/><span>Good instincts — but a few slipped through. Focus on verifying sender domains carefully and being skeptical of urgent requests.</span></div>}
            {pct >= 80 && <div className="ns-item"><div className="ns-dot"/><span>Strong result. Share this with your team and see how they do — awareness gaps are often where you least expect them.</span></div>}
            <div className="ns-item"><div className="ns-dot"/><span>Take the full <strong>GSG Business Security Assessment</strong> to get a complete picture of your security posture across 8 areas.</span></div>
            <div className="ns-item"><div className="ns-dot"/><span>Download the free <strong>Security Toolkit</strong> including an Incident Response Plan and policy templates at greensecuritygroup.com.</span></div>
            <div className="ns-item"><div className="ns-dot"/><span>Set up a <strong>blame-free reporting process</strong> so staff can flag suspicious emails without fear — early reporting prevents most incidents.</span></div>
          </div>

          <div style={{marginBottom:"1.5rem"}}>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"1rem"}}>How to report phishing emails</div>
            <div className="reporting-grid">
              {REPORTING_TOOLS.map(t => (
                <div key={t.name} className="rep-card">
                  <div className="rep-name">{t.name}</div>
                  <div className="rep-desc">{t.desc}</div>
                  <a className="rep-link" href={t.url} target="_blank" rel="noreferrer">Learn more &#8594;</a>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:"1rem"}} onClick={restart}>
            Try Again
          </button>
          <button className="restart-btn" onClick={() => window.location.href="/"}>
            Back to greensecuritygroup.com
          </button>
        </div>
      )}
    </div>
  );
}
