import { useState } from "react";

// ─── GSG hexagon mark (matches main site) ─────────────────────────────────────
const GSGMark = ({ size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} style={{flexShrink:0}}>
    <defs>
      <filter id="smglow">
        <feGaussianBlur stdDeviation="2.5" result="b1"/>
        <feGaussianBlur stdDeviation="5" result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="sdglow">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" fill="#000"/>
    <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#050a06" stroke="#00ee66" strokeWidth="2" filter="url(#smglow)"/>
    <polygon points="50,14 82,32 82,68 50,86 18,68 18,32" fill="#030803" stroke="#00dd55" strokeWidth="1.2" filter="url(#smglow)" opacity="0.8"/>
    <path d="M50 28 A22 22 0 1 0 72 50 L58 50" fill="none" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#smglow)"/>
    <line x1="58" y1="50" x2="72" y2="50" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#smglow)"/>
    <line x1="72" y1="50" x2="72" y2="62" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" filter="url(#smglow)"/>
    {[[50,6],[88,28],[88,72],[50,94],[12,72],[12,28]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="3" fill="#00ff66" filter="url(#sdglow)"/>
    ))}
  </svg>
);

// ─── Small inline icons ───────────────────────────────────────────────────────
const IcoShield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoEye = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoArr = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --white:#ffffff;--off-white:#f8faf9;--surface:#f1f5f2;
    --border:#d4e4da;--border-hi:#b8d4c2;
    --green:#1a7a3c;--green-light:#dcfce7;--green-glow:rgba(26,122,60,0.15);
    --text:#1a2e22;--text-2:#3d6b50;--muted:#6b9e80;--dim:#9dbfad;
    --serif:'Merriweather',Georgia,serif;--sans:'Inter',system-ui,sans-serif;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--white);color:var(--text);font-family:var(--sans);line-height:1.65;-webkit-font-smoothing:antialiased;}

  .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 2rem;}
  .nav-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:68px;}
  .logo{display:flex;align-items:center;gap:10px;font-weight:600;font-size:0.95rem;color:var(--text);text-decoration:none;}
  .nav-links{display:flex;gap:2rem;list-style:none;align-items:center;}
  .nav-links a{font-size:0.875rem;color:var(--muted);text-decoration:none;transition:color 0.2s;font-weight:500;}
  .nav-links a:hover{color:var(--green);}
  .nav-cta{background:var(--green);color:white !important;padding:0.5rem 1.25rem;border-radius:6px;font-weight:600;}
  .nav-cta:hover{background:#15693a;}

  .s-hero{max-width:1140px;margin:0 auto;padding:5rem 2rem 3rem;}
  .s-eyebrow{display:inline-flex;align-items:center;gap:0.5rem;background:var(--green-light);color:var(--green);font-size:0.8rem;font-weight:600;padding:0.4rem 1rem;border-radius:20px;margin-bottom:1.5rem;letter-spacing:0.02em;}
  .s-hero h1{font-family:var(--serif);font-size:clamp(2.2rem,4.5vw,3.4rem);line-height:1.2;margin-bottom:1.25rem;color:var(--text);max-width:760px;}
  .s-hero p{font-size:1.08rem;color:var(--text-2);max-width:680px;line-height:1.85;}

  .s-wrap{max-width:1140px;margin:0 auto;padding:1rem 2rem 4rem;}
  .pillar{background:white;border:1px solid var(--border);border-radius:14px;padding:2rem 2.25rem;margin-bottom:1.25rem;position:relative;overflow:hidden;}
  .pillar::before{content:'';position:absolute;top:0;left:0;bottom:0;width:4px;background:var(--green);}
  .pillar-head{display:flex;align-items:center;gap:0.85rem;margin-bottom:1rem;}
  .pillar-ico{width:42px;height:42px;border-radius:10px;background:var(--green-light);color:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .pillar-head h2{font-family:var(--serif);font-size:1.4rem;color:var(--text);line-height:1.3;}
  .pillar-intro{font-size:0.95rem;color:var(--text-2);line-height:1.8;margin-bottom:1.1rem;}
  .pillar-list{list-style:none;display:flex;flex-direction:column;gap:0.85rem;}
  .pillar-list li{display:flex;gap:0.75rem;font-size:0.92rem;color:var(--text-2);line-height:1.7;}
  .pillar-list li strong{color:var(--text);font-weight:600;}
  .pl-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:0.55rem;}

  .s-note{background:var(--off-white);border:1px solid var(--border);border-radius:14px;padding:2rem 2.25rem;margin-bottom:1.25rem;}
  .s-note h3{font-family:var(--serif);font-size:1.2rem;color:var(--text);margin-bottom:0.75rem;}
  .s-note p{font-size:0.95rem;color:var(--text-2);line-height:1.85;}

  .s-cta{background:var(--green);border-radius:14px;padding:2.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem;}
  .s-cta h3{font-family:var(--serif);font-size:1.5rem;color:white;}
  .s-cta p{font-size:0.92rem;color:rgba(255,255,255,0.78);margin-top:0.35rem;}
  .btn-white{display:inline-flex;align-items:center;gap:0.5rem;background:white;color:var(--green);border:none;border-radius:8px;padding:0.85rem 1.6rem;font-size:0.9rem;font-weight:700;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:var(--sans);}
  .btn-white:hover{background:var(--green-light);}

  .footer{background:var(--text);padding:3rem 2rem;}
  .footer-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;}
  .footer-name{font-size:0.95rem;color:white;font-weight:600;margin-bottom:0.25rem;}
  .footer-copy{font-size:0.78rem;color:var(--muted);}
  .footer-links{display:flex;gap:2rem;list-style:none;}
  .footer-links a{font-size:0.8rem;color:var(--dim);text-decoration:none;transition:color 0.2s;}
  .footer-links a:hover{color:white;}

  .s-fine{font-size:0.8rem;color:var(--muted);line-height:1.7;text-align:center;max-width:680px;margin:2.5rem auto 0;font-style:italic;}

  @media(max-width:640px){
    .nav{padding:0 1rem;} .nav-links{gap:0.9rem;} .nav-links a{font-size:0.75rem;}
    .s-hero{padding:3rem 1.25rem 2rem;} .s-wrap{padding:1rem 1.25rem 3rem;}
    .pillar,.s-note{padding:1.5rem 1.35rem;} .s-cta{padding:1.75rem;flex-direction:column;align-items:flex-start;}
    .footer{padding:2.5rem 1.25rem;} .footer-inner{flex-direction:column;align-items:flex-start;}
  }
`;

export default function Security() {
  return (
    <div>
      <style>{css}</style>

      <nav className="nav">
        <div className="nav-inner">
          <a className="logo" href="/"><GSGMark size={36} /><span>Green Security Group</span></a>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/#projects">Resources</a></li>
            <li><a href="/#tools">Tools</a></li>
            <li><a className="nav-cta" href="/">Free Assessment</a></li>
          </ul>
        </div>
      </nav>

      <header className="s-hero">
        <div className="s-eyebrow"><IcoShield /> How we secure our own operation</div>
        <h1>We hold ourselves to the standard we&#8217;d hold you to.</h1>
        <p>
          We build security tools for small businesses, so it would be a poor look to run our own
          operation carelessly &#8212; and we don&#8217;t. This page describes, in plain terms, how
          Green Security Group secures its own systems and handles your information. It&#8217;s
          deliberately high-level: we describe <em>what</em> we do, not the specific configurations
          behind it, because publishing operational detail is exactly the kind of thing this site
          teaches businesses not to do.
        </p>
      </header>

      <div className="s-wrap">

        <section className="pillar">
          <div className="pillar-head">
            <div className="pillar-ico"><IcoEye /></div>
            <h2>How we handle your information</h2>
          </div>
          <p className="pillar-intro">The most secure data is the data we never collect. We designed our tools around that principle.</p>
          <ul className="pillar-list">
            <li><span className="pl-dot"/><span><strong>Our assessment and report tools run entirely in your browser.</strong> Your answers are not transmitted to us and are not stored on any server. Your report is generated on your own device. Close the tab and the data is gone.</span></li>
            <li><span className="pl-dot"/><span><strong>We collect almost no personal information.</strong> We&#8217;re a small, focused operation and we keep it that way on purpose &#8212; a minimal data footprint is itself a security strategy.</span></li>
            <li><span className="pl-dot"/><span><strong>We don&#8217;t store payment card data.</strong> Where products involve payment, processing is handled by a third-party provider that specializes in it; card details never touch our systems.</span></li>
          </ul>
        </section>

        <section className="pillar">
          <div className="pillar-head">
            <div className="pillar-ico"><IcoLock /></div>
            <h2>How we secure our own systems</h2>
          </div>
          <ul className="pillar-list">
            <li><span className="pl-dot"/><span><strong>Strong authentication everywhere.</strong> Every administrative account is protected by multi-factor authentication and a unique, strong credential managed in a password manager. No shared logins, no reused passwords.</span></li>
            <li><span className="pl-dot"/><span><strong>Protected source code.</strong> Our website&#8217;s source is access-controlled and continuously scanned for accidentally committed secrets.</span></li>
            <li><span className="pl-dot"/><span><strong>Recoverable by design.</strong> Our site is maintained in multiple independent copies and can be restored or moved to alternate infrastructure if needed.</span></li>
            <li><span className="pl-dot"/><span><strong>Domain protection.</strong> Our domain is secured with registrar-level locking and registration privacy.</span></li>
          </ul>
        </section>

        <section className="pillar">
          <div className="pillar-head">
            <div className="pillar-ico"><IcoShield /></div>
            <h2>How we&#8217;d respond to an incident</h2>
          </div>
          <p className="pillar-intro">No security is perfect &#8212; for anyone &#8212; so we plan for the day something goes wrong rather than pretend it won&#8217;t. We maintain a documented incident response plan aligned with established standards (NIST and ISO/IEC 27001). Two principles from it are worth stating publicly, because they&#8217;re the ones most small businesses get wrong:</p>
          <ul className="pillar-list">
            <li><span className="pl-dot"/><span><strong>We preserve evidence before we restore.</strong> The instinct under pressure is to wipe and rebuild fast. That destroys the information needed to understand what happened &#8212; and, where personal data is involved, the information needed to meet our legal obligations. Recovery comes second, on purpose.</span></li>
            <li><span className="pl-dot"/><span><strong>We treat notification as a legal duty, not a PR decision.</strong> If a breach ever involved personal information, we&#8217;d assess it against the applicable legal standard (in Canada, PIPEDA&#8217;s &#8220;real risk of significant harm&#8221; test), engage qualified counsel, and notify regulators and affected individuals as required &#8212; on the timeline the law sets, not the one that&#8217;s convenient.</span></li>
          </ul>
        </section>

        <section className="s-note">
          <h3>A note on right-sizing</h3>
          <p>Green Security Group is a small operation, and our controls are sized to match &#8212; which is the same advice we give the businesses we work with. Security isn&#8217;t about buying every tool; it&#8217;s about understanding your actual risks and addressing them deliberately. We hold ourselves to the standard we&#8217;d hold a client to: know what you have, protect what matters most, and have a plan for when something goes wrong.</p>
        </section>

        <section className="s-cta">
          <div>
            <h3>Questions about how we handle your data?</h3>
            <p>We&#8217;re happy to talk through any of it.</p>
          </div>
          <a className="btn-white" href="mailto:paul@greensecuritygroup.com">Get in touch <IcoArr /></a>
        </section>

        <p className="s-fine">This page is a plain-language summary of our internal security practices. Specific operational details are maintained privately, as they should be.</p>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-name">Green Security Group</div>
            <div className="footer-copy">Paul Green, CISSP &#183; Nova Scotia, Canada</div>
          </div>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="https://linkedin.com/in/itpg" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="mailto:paul@greensecuritygroup.com">Email</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
