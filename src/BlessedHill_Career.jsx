import { useState, useEffect } from "react";

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];

const POSITIONS = [
  "Home Aide Caregiver",
  "Certified Nursing Assistant (CNA)",
  "Licensed Practical Nurse (LPN)",
  "Registered Nurse (RN)",
  "Other",
];

const HOURS = ["Full Time", "Part Time", "Flexible", "On Call"];

const WHY_US = [
  { icon: "🏠", title: "Intimate Home Setting", desc: "Work in a real home, not a large institution. Our small resident count means you build genuine relationships." },
  { icon: "💙", title: "Mission-Driven Culture", desc: "We're guided by Christian values of compassion, dignity, and service — a team that truly cares for one another." },
  { icon: "📋", title: "Supportive Management", desc: "Anne and our leadership are hands-on and accessible. You'll never feel like a number on a roster." },
  { icon: "🌿", title: "Quiet, Safe Environment", desc: "Located in a peaceful Auburn neighborhood — a calm, professional setting to do your best work." },
];

export default function BlessedHillCareer({ navigate = () => {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", address: "",
    phone: "", position: "", positionOther: "",
    hours: "", workedBefore: "", additionalInfo: "",
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = "Required";
    if (!form.lastName.trim())   e.lastName  = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.address.trim())    e.address   = "Required";
    if (!form.phone.trim())      e.phone     = "Required";
    if (!form.position)          e.position  = "Please select a position";
    if (form.position === "Other" && !form.positionOther.trim()) e.positionOther = "Please specify";
    if (!form.hours)             e.hours     = "Please select preferred hours";
    if (!form.workedBefore)      e.workedBefore = "Please select one";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#f7f5f0", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;--bg:#f0f6ff;
          --cr:#f7f5f0;--cd:#eeebe3;--wh:#ffffff;
          --tm:#4a6278;--tl:#8a9dae;
          --gd:#c9a84c;--gn:#1a6644;
          --er:#c0392b;--br:rgba(30,80,140,0.09);--rd:14px;
        }
        .sans{font-family:'DM Sans',sans-serif}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(247,245,240,.97);backdrop-filter:blur(12px);border-bottom:1px solid var(--br);transition:box-shadow .3s;padding:0 48px}
        .nav.scrolled{box-shadow:0 2px 20px rgba(30,80,140,.07)}
        .nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px}
        .nlm{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--bd)}
        .nls{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--bs);letter-spacing:1.5px;text-transform:uppercase}
        .nl{display:flex;gap:28px;list-style:none}
        .nl a{font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:var(--tm);text-decoration:none;transition:color .2s}
        .nl a:hover{color:var(--bm)}
        .nl a.active{color:var(--bd);font-weight:600;border-bottom:2px solid var(--gd);padding-bottom:2px}
        .ncta{background:var(--bd);color:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:50px;padding:9px 22px;cursor:pointer;transition:background .2s,transform .2s}
        .ncta:hover{background:var(--bm);transform:translateY(-1px)}

        /* PAGE HEADER — warm olive/cream, different from all other pages */
        .page-header{
          padding:140px 48px 72px;
          background:linear-gradient(135deg,#2c3e2d 0%,#1a2e1b 100%);
          position:relative;overflow:hidden;
        }
        .page-header::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 70% 50%,rgba(201,168,76,0.12),transparent 65%);
          pointer-events:none;
        }
        .page-header::after{
          content:'';position:absolute;bottom:-1px;left:0;right:0;height:64px;
          background:var(--cr);clip-path:polygon(0 100%,100% 0,100% 100%);
        }
        .header-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;position:relative;z-index:1}
        .header-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:12px;margin-bottom:20px}
        .header-kicker::before{content:'';display:block;width:28px;height:1.5px;background:var(--gd)}
        .header-title{font-size:clamp(36px,5vw,64px);font-weight:700;color:white;line-height:1.05;letter-spacing:-1.5px;margin-bottom:18px}
        .header-title em{font-style:italic;color:rgba(201,168,76,.9)}
        .header-body{font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.8}
        /* Right: why-us cards */
        .why-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .why-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:20px}
        .why-icon{font-size:22px;margin-bottom:10px;line-height:1}
        .why-title{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:white;margin-bottom:5px}
        .why-desc{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,.55);line-height:1.6}

        /* MAIN SPLIT */
        .page-body{
          max-width:1280px;margin:0 auto;padding:64px 48px 80px;
          display:grid;grid-template-columns:1fr 380px;gap:72px;align-items:start;
        }

        /* FORM SIDE */
        .form-wrap{}
        .form-heading{margin-bottom:36px}
        .form-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:10px;margin-bottom:12px}
        .form-kicker::before{content:'';display:block;width:20px;height:1.5px;background:var(--gd)}
        .form-title{font-size:clamp(24px,3vw,36px);font-weight:700;color:var(--bd);letter-spacing:-.5px;line-height:1.15;margin-bottom:10px}
        .form-title em{font-style:italic;color:var(--bm)}
        .form-sub{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:var(--tm);line-height:1.75}

        /* Fields */
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
        .field-full{margin-bottom:18px}
        .lbl{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--tm);display:block;margin-bottom:7px}
        .req{color:var(--gd);margin-left:2px}
        .fi,.fsl,.fta{width:100%;font-family:'DM Sans',sans-serif;font-size:15px;color:#1a2b3c;background:var(--wh);border:1.5px solid var(--br);border-radius:var(--rd);padding:13px 16px;outline:none;transition:border-color .2s,box-shadow .2s;appearance:none}
        .fi:focus,.fsl:focus,.fta:focus{border-color:var(--bs);box-shadow:0 0 0 3px rgba(91,155,213,.12)}
        .fi.err,.fsl.err{border-color:var(--er)}
        .fta{resize:vertical;min-height:100px}
        .ferr{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--er);margin-top:4px}

        /* Radio pill groups */
        .pill-group{display:flex;flex-wrap:wrap;gap:8px}
        .pill{
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
          border:1.5px solid var(--br);border-radius:50px;padding:9px 18px;
          cursor:pointer;background:var(--wh);color:var(--tm);
          transition:all .18s;user-select:none;
        }
        .pill:hover{border-color:var(--bs);color:var(--bm);background:var(--bg)}
        .pill.selected{background:var(--bd);border-color:var(--bd);color:white;font-weight:600}
        .pill.err-ring{border-color:var(--er)}

        /* Yes/No toggle */
        .yn-group{display:flex;gap:10px}
        .yn{
          flex:1;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;
          border:1.5px solid var(--br);border-radius:var(--rd);padding:13px;
          text-align:center;cursor:pointer;background:var(--wh);color:var(--tm);
          transition:all .18s;
        }
        .yn:hover{border-color:var(--bs);background:var(--bg)}
        .yn.selected{background:var(--bd);border-color:var(--bd);color:white;font-weight:600}

        /* Submit */
        .btn-submit{
          width:100%;background:var(--gd);color:var(--bd);
          font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;
          border:none;border-radius:50px;padding:18px 32px;
          cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s;
          margin-top:8px;
        }
        .btn-submit:hover{background:#dfc068;transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4)}

        /* Success */
        .success{
          background:var(--wh);border:1px solid rgba(26,102,68,.15);border-radius:20px;
          padding:48px 36px;text-align:center;
          animation:fadeUp .6s ease both;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .succ-icon{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#1a6644,#27ae60);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 24px;box-shadow:0 8px 28px rgba(26,102,68,.25)}
        .succ-title{font-size:28px;font-weight:700;color:var(--bd);letter-spacing:-.5px;margin-bottom:10px}
        .succ-title em{font-style:italic;color:var(--bm)}
        .succ-body{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:var(--tm);line-height:1.75}

        /* SIDEBAR */
        .sidebar{position:sticky;top:104px}
        .contact-card{background:var(--bd);border-radius:20px;padding:36px;margin-bottom:20px}
        .cc-label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:16px}
        .cc-title{font-size:22px;font-weight:700;color:white;line-height:1.15;margin-bottom:12px}
        .cc-title em{font-style:italic;color:#8fc3e8}
        .cc-body{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.75;margin-bottom:24px}
        .cc-phone{display:block;font-family:'DM Sans',sans-serif;font-size:18px;font-weight:600;color:var(--gd);text-decoration:none;margin-bottom:6px}
        .cc-phone:hover{text-decoration:underline}
        .cc-addr{font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,.4);line-height:1.7;font-style:normal}

        /* Position info cards */
        .positions-card{background:var(--wh);border:1px solid var(--br);border-radius:20px;padding:28px}
        .pc-label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--tl);margin-bottom:16px}
        .pc-title{font-size:18px;font-weight:700;color:var(--bd);margin-bottom:16px}
        .pos-list{list-style:none;display:flex;flex-direction:column;gap:10px}
        .pos-item{display:flex;align-items:center;gap:10px;font-family:'DM Sans',sans-serif;font-size:13.5px;color:var(--tm)}
        .pos-dot{width:7px;height:7px;border-radius:50%;background:var(--gd);flex-shrink:0}

        /* FOOTER */
        .footer{background:#0b1a27;color:rgba(255,255,255,.55);padding:52px 48px 28px;font-family:'DM Sans',sans-serif;font-size:13.5px}
        .footer-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.07)}
        .fbr{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:white;margin-bottom:10px}
        .fbd{line-height:1.8;max-width:300px;margin-bottom:16px}
        .fbt{color:var(--gd);font-weight:500;text-decoration:none;font-size:15px}
        .fbt:hover{text-decoration:underline}
        .fch{color:white;font-weight:600;font-size:14px;margin-bottom:16px}
        .fl{list-style:none;display:flex;flex-direction:column;gap:9px}
        .fl a{color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s}
        .fl a:hover{color:white}
        .fbot{max-width:1280px;margin:0 auto;padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.28)}
        .hamburger{
            display:none;background:none;border:none;
              font-size:22px;cursor:pointer;color:var(--bd);
          padding:6px;align-items:center;justify-content:center;
        /* RESPONSIVE */
        @media(max-width:1024px){
          .page-body{grid-template-columns:1fr;gap:48px}
          .sidebar{position:static}
        }
        @media(max-width:900px){
          .nav{padding:0 24px}.nl,.ncta{display:none}
          .hamburger{display:flex}
          .page-header{padding:120px 24px 64px}
          .header-inner{grid-template-columns:1fr;gap:40px}
          .why-grid{grid-template-columns:1fr 1fr}
          .page-body{padding:48px 24px 60px}
          .field-row{grid-template-columns:1fr}
          .footer{padding:44px 24px 24px}
          .footer-inner{grid-template-columns:1fr;gap:32px}
          .fbot{flex-direction:column;gap:6px;text-align:center}
        }
        @media(max-width:480px){.why-grid{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-inner">
          <div><div className="nlm"onClick={()=>navigate("Home")}style={{cursor:"pointer"}}>Blessed Hill</div><div className="nls sans"onClick={()=>navigate("Home")}style={{cursor:"pointer"}}>Adult Family Home</div></div>
          <ul className="nl">
            {NAV_LINKS.map(l=><li key={l}><a href="#" className={l==="Career"?"active":""} onClick={e=>{e.preventDefault();navigate(l);}}>{l}</a></li>)}
          </ul>
          <button className="ncta sans">253-397-4881</button>
          <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
  {menuOpen ? "✕" : "☰"}
  {menuOpen && (
  <div className="mobile-menu">
    {NAV_LINKS.map(l=>(
      <a key={l} href="#" className="mobile-link sans" onClick={e=>{e.preventDefault();navigate(l);setMenuOpen(false);}}>
        {l}
      </a>
    ))}
  </div>
)}
</button>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <header className="page-header">
        <div className="header-inner">
          <div>
            <p className="header-kicker sans">Join Our Team</p>
            <h1 className="header-title">
              Do Work That<br /><em>Truly Matters.</em>
            </h1>
            <p className="header-body sans">
              At Blessed Hill, caregiving isn't just a job — it's a calling. We're looking for compassionate, dedicated individuals who want to make a real difference in the lives of our residents every single day.
            </p>
          </div>
          <div className="why-grid">
            {WHY_US.map(w => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <div className="why-title sans">{w.title}</div>
                <div className="why-desc sans">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="page-body">

        {/* APPLICATION FORM */}
        <div className="form-wrap">
          <div className="form-heading">
            <p className="form-kicker sans">Application</p>
            <h2 className="form-title">Fill Out Your <em>Application</em></h2>
            <p className="form-sub sans">
              Complete the form below and we'll be in touch shortly. All positions are based at our Auburn, WA location.
            </p>
          </div>

          {submitted ? (
            <div className="success">
              <div className="succ-icon">✓</div>
              <h3 className="succ-title">Application <em>Received!</em></h3>
              <p className="succ-body sans">
                Thank you, <strong>{form.firstName}</strong>! We've received your application for <strong>{form.position === "Other" ? form.positionOther : form.position}</strong>.<br /><br />
                Our team will review it and reach out to you at <strong>{form.email}</strong> or <strong>{form.phone}</strong> within a few business days.
              </p>
            </div>
          ) : (
            <div>
              {/* Name */}
              <div className="field-row">
                <div>
                  <label className="lbl sans">First Name <span className="req">*</span></label>
                  <input className={`fi sans${errors.firstName?" err":""}`} placeholder="Jane" value={form.firstName} onChange={e=>set("firstName",e.target.value)} />
                  {errors.firstName && <p className="ferr sans">⚠ {errors.firstName}</p>}
                </div>
                <div>
                  <label className="lbl sans">Last Name <span className="req">*</span></label>
                  <input className={`fi sans${errors.lastName?" err":""}`} placeholder="Smith" value={form.lastName} onChange={e=>set("lastName",e.target.value)} />
                  {errors.lastName && <p className="ferr sans">⚠ {errors.lastName}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="field-row">
                <div>
                  <label className="lbl sans">Email <span className="req">*</span></label>
                  <input className={`fi sans${errors.email?" err":""}`} type="email" placeholder="jane@email.com" value={form.email} onChange={e=>set("email",e.target.value)} />
                  {errors.email && <p className="ferr sans">⚠ {errors.email}</p>}
                </div>
                <div>
                  <label className="lbl sans">Contact # <span className="req">*</span></label>
                  <input className={`fi sans${errors.phone?" err":""}`} type="tel" placeholder="(253) 000-0000" value={form.phone} onChange={e=>set("phone",e.target.value)} />
                  {errors.phone && <p className="ferr sans">⚠ {errors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="field-full">
                <label className="lbl sans">Address <span className="req">*</span></label>
                <input className={`fi sans${errors.address?" err":""}`} placeholder="Street, City, State, ZIP" value={form.address} onChange={e=>set("address",e.target.value)} />
                {errors.address && <p className="ferr sans">⚠ {errors.address}</p>}
              </div>

              {/* Position */}
              <div className="field-full">
                <label className="lbl sans">Position Seeking <span className="req">*</span></label>
                <div className="pill-group">
                  {POSITIONS.map(p => (
                    <div
                      key={p}
                      className={`pill sans${form.position===p?" selected":""}${errors.position&&form.position===""?" err-ring":""}`}
                      onClick={()=>set("position",p)}
                      role="button" tabIndex={0}
                      onKeyDown={e=>e.key==="Enter"&&set("position",p)}
                    >{p}</div>
                  ))}
                </div>
                {errors.position && <p className="ferr sans">⚠ {errors.position}</p>}
              </div>

              {/* Other position specify */}
              {form.position === "Other" && (
                <div className="field-full">
                  <label className="lbl sans">Please Specify <span className="req">*</span></label>
                  <input className={`fi sans${errors.positionOther?" err":""}`} placeholder="Describe the role you're interested in" value={form.positionOther} onChange={e=>set("positionOther",e.target.value)} />
                  {errors.positionOther && <p className="ferr sans">⚠ {errors.positionOther}</p>}
                </div>
              )}

              {/* Hours */}
              <div className="field-full">
                <label className="lbl sans">Preferred Working Hours <span className="req">*</span></label>
                <div className="pill-group">
                  {HOURS.map(h => (
                    <div
                      key={h}
                      className={`pill sans${form.hours===h?" selected":""}${errors.hours&&form.hours===""?" err-ring":""}`}
                      onClick={()=>set("hours",h)}
                      role="button" tabIndex={0}
                      onKeyDown={e=>e.key==="Enter"&&set("hours",h)}
                    >{h}</div>
                  ))}
                </div>
                {errors.hours && <p className="ferr sans">⚠ {errors.hours}</p>}
              </div>

              {/* Worked before */}
              <div className="field-full">
                <label className="lbl sans">Have you previously worked with us? <span className="req">*</span></label>
                <div className="yn-group">
                  {["Yes","No"].map(v => (
                    <div
                      key={v}
                      className={`yn sans${form.workedBefore===v?" selected":""}`}
                      onClick={()=>set("workedBefore",v)}
                      role="button" tabIndex={0}
                      onKeyDown={e=>e.key==="Enter"&&set("workedBefore",v)}
                    >{v}</div>
                  ))}
                </div>
                {errors.workedBefore && <p className="ferr sans">⚠ {errors.workedBefore}</p>}
              </div>

              {/* Additional info */}
              <div className="field-full">
                <label className="lbl sans">Additional Information</label>
                <textarea
                  className="fta sans"
                  placeholder="Tell us anything else relevant — experience, availability, certifications, why you'd like to join our team…"
                  value={form.additionalInfo}
                  onChange={e=>set("additionalInfo",e.target.value)}
                />
              </div>

              <button className="btn-submit sans" onClick={submit}>
                Submit Application →
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="contact-card">
            <p className="cc-label sans">Questions?</p>
            <h3 className="cc-title">Reach out <em>directly</em></h3>
            <p className="cc-body sans">
              If you'd prefer to speak with someone before applying, we'd love to hear from you. Call or visit us anytime.
            </p>
            <a href="tel:12533974881" className="cc-phone sans">253-397-4881</a>
            <address className="cc-addr sans">
              11803 SE 323rd PL<br />
              Auburn, WA 98092
            </address>
          </div>

          <div className="positions-card">
            <p className="pc-label sans">Open Roles</p>
            <h3 className="pc-title">Positions We Hire</h3>
            <ul className="pos-list">
              {POSITIONS.filter(p=>p!=="Other").map(p => (
                <li key={p} className="pos-item sans">
                  <span className="pos-dot" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="fbr">Blessed Hill Adult Family Home</div>
            <p className="fbd">Licensed residential adult care in Auburn, WA — guided by Christian values and a deep commitment to dignity.</p>
            <a href="tel:12533974881" className="fbt">253-397-4881</a>
          </div>
          <div>
            <div className="fch">Quick Links</div>
            <ul className="fl">{NAV_LINKS.map(l=><li key={l}><a href="#" onClick={e=>{e.preventDefault();navigate(l);}}>{l}</a></li>)}</ul>
          </div>
          <div>
            <div className="fch">Find Us</div>
            <address style={{fontStyle:"normal",lineHeight:1.9,color:"rgba(255,255,255,.5)"}}>
              11803 SE 323rd PL<br/>Auburn, WA 98092<br/><br/>
              <a href="tel:12533974881" style={{color:"rgba(255,255,255,.5)",textDecoration:"none"}}>253-397-4881</a>
            </address>
          </div>
        </div>
        <div className="fbot sans">
          <span>© 2026 Blessed Hill Adult Family Home, LLC. All rights reserved.</span>
          <a href="#" onClick={e=>{e.preventDefault();navigate("Privacy Policy");}} style={{color:"rgba(255,255,255,.28)",textDecoration:"none"}}>Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
