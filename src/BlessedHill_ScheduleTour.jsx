import { useState, useEffect } from "react";

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];
const TIME_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM"];
const TOUR_TYPES = [
  { id: "in-person", label: "In-Person Tour", icon: "🏠", desc: "Walk through the home & meet our team" },
  { id: "virtual",   label: "Virtual Tour",   icon: "💻", desc: "Video call from anywhere, 30 minutes" },
];
const HOW_HEARD = ["Google Search","Family / Friend Referral","Doctor Referral","Social Media","A Place for Mom","Other"];
const TRUST_POINTS = [
  "No obligation — just an open door",
  "Tours last approx. 45–60 minutes",
  "Bring as many family members as you like",
  "Ask any question — nothing is off-limits",
  "Same-week availability most of the year",
];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getAvailableDays() {
  const days = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < 14) {
    if (d.getDay() !== 0) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}
const DAYS = getAvailableDays();

export default function BlessedHillTour({ navigate = () => {} }) {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep]             = useState(1);
  const [direction, setDirection]   = useState("forward");
  const [errors, setErrors]         = useState({});
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    relationship:"", tourType:"in-person",
    date:null, time:"", notes:"", howHeard:"",
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
    if (step === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim())  e.lastName  = "Required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim())     e.phone     = "Required";
      if (!form.relationship)     e.relationship = "Please select one";
    }
    if (step === 2) {
      if (!form.date) e.date = "Please select a date";
      if (!form.time) e.time = "Please select a time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next   = () => { if (!validate()) return; setDirection("forward"); setStep(s => s + 1); };
  const back   = () => { setDirection("back");    setStep(s => s - 1); };
  const submit = () => { setDirection("forward"); setStep(4); };
  const progress = step <= 3 ? ((step - 1) / 3) * 100 : 100;

  const formatDate = (d) => d ? `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` : "—";

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#faf8f4", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;--bg:#f0f6ff;
          --wh:#ffffff;--cr:#faf8f4;--tm:#4a6278;--tl:#8a9dae;
          --gd:#c9a84c;--gp:#fdf5e0;--gn:#1a6644;--er:#c0392b;
          --br:rgba(30,80,140,0.1);--rd:14px;
        }
        .sans{font-family:'DM Sans',sans-serif}
        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(250,248,244,0.97);backdrop-filter:blur(12px);border-bottom:1px solid var(--br);transition:box-shadow .3s;padding:0 48px}
        .nav.scrolled{box-shadow:0 2px 20px rgba(30,80,140,0.07)}
        .nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px}
        .nlm{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--bd)}
        .nls{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--bs);letter-spacing:1.5px;text-transform:uppercase}
        .nav-links{display:flex;gap:28px;list-style:none}
        .nav-links a{font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:var(--tm);text-decoration:none;transition:color .2s}
        .nav-links a:hover{color:var(--bm)}
        .nav-links a.active{color:var(--bd);font-weight:600;border-bottom:2px solid var(--gd);padding-bottom:2px}
        .nav-cta{background:var(--bd);color:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:50px;padding:9px 22px;cursor:pointer;transition:background .2s,transform .2s}
        .nav-cta:hover{background:var(--bm);transform:translateY(-1px)}
        /* SHELL */
        .shell{min-height:100vh;display:grid;grid-template-columns:1fr 400px;padding-top:72px}
        /* FORM PANEL */
        .fp{background:var(--wh);padding:56px 64px 72px;display:flex;flex-direction:column;border-right:1px solid var(--br);min-height:calc(100vh - 72px)}
        /* PROGRESS */
        .pw{margin-bottom:44px}
        .ps{display:flex;align-items:center;gap:0;margin-bottom:12px}
        .sp{display:flex;align-items:center;gap:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.5px;color:var(--tl);transition:color .3s}
        .sp.done{color:var(--gn)}.sp.active{color:var(--bd)}
        .sc{width:26px;height:26px;border-radius:50%;border:2px solid var(--br);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--tl);background:white;transition:all .3s;flex-shrink:0}
        .sp.done .sc{background:var(--gn);border-color:var(--gn);color:white}
        .sp.active .sc{background:var(--bd);border-color:var(--bd);color:white}
        .conn{flex:1;height:1px;background:var(--br);margin:0 8px;position:relative;overflow:hidden}
        .connf{position:absolute;top:0;left:0;height:100%;background:var(--gn);transition:width .5s ease}
        .pbt{width:100%;height:3px;background:var(--br);border-radius:2px;overflow:hidden}
        .pbf{height:100%;background:linear-gradient(90deg,var(--bm),var(--bs));border-radius:2px;transition:width .5s ease}
        /* STEP HEADER */
        .sh{margin-bottom:32px}
        .sey{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .sey::before{content:'';display:block;width:20px;height:1.5px;background:var(--gd)}
        .st{font-size:28px;font-weight:700;color:var(--bd);letter-spacing:-.5px;line-height:1.15}
        .st em{font-style:italic;color:var(--bm)}
        .ss{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:var(--tm);line-height:1.7;margin-top:8px}
        /* STEP ANIM */
        .sb{flex:1;animation:sIn .35s ease both}
        .sb.bk{animation:sInB .35s ease both}
        @keyframes sIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sInB{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        /* FIELDS */
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
        .ff{margin-bottom:18px}
        .lbl{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--tm);display:block;margin-bottom:7px}
        .fi,.fsl,.fta{width:100%;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;color:#1a2b3c;background:white;border:1.5px solid var(--br);border-radius:var(--rd);padding:13px 16px;outline:none;transition:border-color .2s,box-shadow .2s;appearance:none}
        .fi:focus,.fsl:focus,.fta:focus{border-color:var(--bs);box-shadow:0 0 0 3px rgba(91,155,213,0.12)}
        .fi.err,.fsl.err{border-color:var(--er)}
        .fta{resize:vertical;min-height:96px}
        .ferr{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--er);margin-top:4px}
        /* TOUR TYPE */
        .tt{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
        .ttc{border:1.5px solid var(--br);border-radius:var(--rd);padding:16px;cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;display:flex;align-items:flex-start;gap:12px;background:white}
        .ttc:hover{border-color:var(--bs);background:var(--bg)}
        .ttc.sel{border-color:var(--bm);background:var(--bg);box-shadow:0 0 0 3px rgba(46,109,164,0.1)}
        .ttl{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--bd);margin-bottom:2px}
        .ttd{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:300;color:var(--tm);line-height:1.4}
        /* DATE */
        .dg{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:22px}
        .dc{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;border:1.5px solid var(--br);background:white;transition:all .18s;font-family:'DM Sans',sans-serif}
        .dc:hover{border-color:var(--bs);background:var(--bg)}
        .dc.sel{background:var(--bd);border-color:var(--bd);color:white}
        .ddn{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--tl)}
        .dc.sel .ddn{color:rgba(255,255,255,.7)}
        .dnum{font-size:14px;font-weight:700;color:#1a2b3c;line-height:1;margin-top:2px}
        .dc.sel .dnum{color:white}
        .dmo{font-size:9px;color:var(--tl)}
        .dc.sel .dmo{color:rgba(255,255,255,.6)}
        /* TIME */
        .tg{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
        .ts{padding:10px 6px;text-align:center;border-radius:10px;border:1.5px solid var(--br);background:white;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--tm);transition:all .18s}
        .ts:hover{border-color:var(--bs);color:var(--bm);background:var(--bg)}
        .ts.sel{background:var(--bd);border-color:var(--bd);color:white;font-weight:600}
        /* REVIEW */
        .rb{background:var(--bg);border:1px solid rgba(46,109,164,.15);border-radius:var(--rd);padding:22px;margin-bottom:22px}
        .rr{display:flex;justify-content:space-between;align-items:flex-start;padding:9px 0;border-bottom:1px solid rgba(46,109,164,.1);font-family:'DM Sans',sans-serif}
        .rr:last-child{border-bottom:none;padding-bottom:0}
        .rk{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--tl)}
        .rv{font-size:13.5px;font-weight:500;color:#1a2b3c;text-align:right;max-width:60%}
        /* BUTTONS */
        .br2{display:flex;gap:12px;margin-top:32px}
        .bbk{background:transparent;color:var(--tm);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:1.5px solid var(--br);border-radius:50px;padding:13px 26px;cursor:pointer;transition:all .2s}
        .bbk:hover{border-color:var(--bs);color:var(--bm)}
        .bnx{flex:1;background:var(--bd);color:white;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;border:none;border-radius:50px;padding:14px 28px;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:7px}
        .bnx:hover{background:var(--bm);transform:translateY(-1px);box-shadow:0 6px 24px rgba(30,80,140,.2)}
        .bsb{flex:1;background:var(--gd);color:var(--bd);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;border:none;border-radius:50px;padding:16px 28px;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s}
        .bsb:hover{background:#dfc068;transform:translateY(-1px);box-shadow:0 8px 28px rgba(201,168,76,.4)}
        /* SUCCESS */
        .succ{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;flex:1;padding:40px 0;animation:fadeUp .6s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .si{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,#1a6644,#27ae60);display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto 24px;box-shadow:0 8px 28px rgba(26,102,68,.25)}
        .stit{font-size:32px;font-weight:700;color:var(--bd);letter-spacing:-.5px;line-height:1.15;margin-bottom:12px}
        .stit em{font-style:italic;color:var(--bm)}
        .ssb{font-family:'DM Sans',sans-serif;font-size:15.5px;font-weight:300;color:var(--tm);line-height:1.75;max-width:400px;margin:0 auto 32px}
        .sdet{background:var(--gp);border:1px solid rgba(201,168,76,.25);border-radius:var(--rd);padding:18px 24px;margin-bottom:28px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#1a2b3c;line-height:1.9}
        .snote{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--tl);margin-top:12px}
        /* INFO PANEL */
        .ip{background:var(--bd);padding:56px 44px;display:flex;flex-direction:column;position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto}
        .ik{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:10px;margin-bottom:18px}
        .ik::before{content:'';display:block;width:20px;height:1.5px;background:var(--gd)}
        .ih{font-size:30px;font-weight:700;color:white;line-height:1.1;letter-spacing:-.5px;margin-bottom:14px}
        .ih em{font-style:italic;color:#8fc3e8}
        .ib{font-family:'DM Sans',sans-serif;font-size:14.5px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.8;margin-bottom:36px}
        .tl2{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:40px}
        .ti{display:flex;align-items:flex-start;gap:11px}
        .tb{width:20px;height:20px;border-radius:50%;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--gd);margin-top:1px}
        .tt2{font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:300;color:rgba(255,255,255,.7);line-height:1.5}
        .ac{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:var(--rd);padding:22px;margin-top:auto}
        .al{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:9px}
        .at{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:400;color:rgba(255,255,255,.8);line-height:1.75}
        .ap{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(255,255,255,.4)}
        .ap a{color:var(--gd);text-decoration:none;font-weight:500;font-size:14px}
        .ap a:hover{text-decoration:underline}
       .hamburger{
       display:none;background:none;border:none;
        font-size:22px;cursor:pointer;color:var(--bd);
        padding:6px;align-items:center;justify-content:center;
       
        /* RESPONSIVE */
        @media(max-width:900px){
          .nav-links,.nav-cta{display:none}
          .hamburger{display:flex}
          .nav-links,.nav-cta{display:none}
          .shell{grid-template-columns:1fr}
          .ip{display:none}
          .fp{padding:36px 24px 60px}
          .fr{grid-template-columns:1fr}
          .dg{grid-template-columns:repeat(5,1fr)}
          .tg{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:480px){
          .dg{grid-template-columns:repeat(4,1fr)}
          .tg{grid-template-columns:repeat(2,1fr)}
          .tt{grid-template-columns:1fr}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div onClick={()=>navigate("Home")}style={{cursor:"pointer"}}><div className="nlm">Blessed Hill</div><div className="nls sans">Adult Family Home</div></div>
          <ul className="nav-links">
            {NAV_LINKS.map(l => <li key={l}><a href="#" className={l==="Schedule a Tour"?"active":""} onClick={e=>{e.preventDefault();navigate(l);}}>{l}</a></li>)}
          </ul>
          <button className="nav-cta sans" onClick={()=>navigate("Schedule a Tour")}>253-397-4881</button>
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

      {/* SHELL */}
      <div className="shell">

        {/* FORM PANEL */}
        <div className="fp">

          {step <= 3 && (
            <div className="pw">
              <div className="ps">
                {["Your Info","Date & Time","Confirm"].map((label, i) => {
                  const n = i + 1;
                  const s = step > n ? "done" : step === n ? "active" : "";
                  return (
                    <span key={label} style={{display:"contents"}}>
                      <div className={`sp sans ${s}`}>
                        <div className="sc">{step > n ? "✓" : n}</div>
                        {label}
                      </div>
                      {i < 2 && (
                        <div className="conn">
                          <div className="connf" style={{width: step > n ? "100%" : "0%"}} />
                        </div>
                      )}
                    </span>
                  );
                })}
              </div>
              <div className="pbt"><div className="pbf" style={{width:`${progress}%`}} /></div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className={`sb${direction==="back"?" bk":""}`}>
              <div className="sh">
                <p className="sey sans">Step 1 of 3</p>
                <h1 className="st">Tell us about <em>yourself</em></h1>
                <p className="ss sans">We'll use this to confirm your booking and send a reminder before your visit.</p>
              </div>
              <div className="fr">
                <div>
                  <label className="lbl sans">First Name</label>
                  <input className={`fi sans${errors.firstName?" err":""}`} placeholder="Jane" value={form.firstName} onChange={e=>set("firstName",e.target.value)} />
                  {errors.firstName && <p className="ferr sans">⚠ {errors.firstName}</p>}
                </div>
                <div>
                  <label className="lbl sans">Last Name</label>
                  <input className={`fi sans${errors.lastName?" err":""}`} placeholder="Smith" value={form.lastName} onChange={e=>set("lastName",e.target.value)} />
                  {errors.lastName && <p className="ferr sans">⚠ {errors.lastName}</p>}
                </div>
              </div>
              <div className="fr">
                <div>
                  <label className="lbl sans">Email Address</label>
                  <input className={`fi sans${errors.email?" err":""}`} type="email" placeholder="jane@email.com" value={form.email} onChange={e=>set("email",e.target.value)} />
                  {errors.email && <p className="ferr sans">⚠ {errors.email}</p>}
                </div>
                <div>
                  <label className="lbl sans">Phone Number</label>
                  <input className={`fi sans${errors.phone?" err":""}`} type="tel" placeholder="(253) 000-0000" value={form.phone} onChange={e=>set("phone",e.target.value)} />
                  {errors.phone && <p className="ferr sans">⚠ {errors.phone}</p>}
                </div>
              </div>
              <div className="ff">
                <label className="lbl sans">Your Relationship to the Resident</label>
                <select className={`fsl sans${errors.relationship?" err":""}`} value={form.relationship} onChange={e=>set("relationship",e.target.value)}>
                  <option value="">Select one…</option>
                  {["Adult Child","Spouse / Partner","Sibling","Parent","Friend","Social Worker / Case Manager","Other"].map(r=><option key={r}>{r}</option>)}
                </select>
                {errors.relationship && <p className="ferr sans">⚠ {errors.relationship}</p>}
              </div>
              <div className="ff">
                <label className="lbl sans">Preferred Tour Format</label>
                <div className="tt">
                  {TOUR_TYPES.map(t=>(
                    <div key={t.id} className={`ttc${form.tourType===t.id?" sel":""}`} onClick={()=>set("tourType",t.id)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&set("tourType",t.id)}>
                      <span style={{fontSize:22,flexShrink:0}}>{t.icon}</span>
                      <div><div className="ttl sans">{t.label}</div><div className="ttd sans">{t.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="br2">
                <button className="bnx sans" onClick={next}>Continue to Date &amp; Time →</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={`sb${direction==="back"?" bk":""}`}>
              <div className="sh">
                <p className="sey sans">Step 2 of 3</p>
                <h2 className="st">Pick a <em>date &amp; time</em></h2>
                <p className="ss sans">All times are Pacific Time. Available Monday–Saturday, 9 AM–4 PM.</p>
              </div>
              <div className="ff">
                <label className="lbl sans">Select a Date</label>
                <div className="dg">
                  {DAYS.map(day=>{
                    const sel = form.date && day.toDateString()===form.date.toDateString();
                    return (
                      <div key={day.toDateString()} className={`dc${sel?" sel":""}`} onClick={()=>set("date",day)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&set("date",day)}>
                        <span className="ddn sans">{DAY_NAMES[day.getDay()]}</span>
                        <span className="dnum">{day.getDate()}</span>
                        <span className="dmo sans">{MONTH_NAMES[day.getMonth()]}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.date && <p className="ferr sans">⚠ {errors.date}</p>}
              </div>
              <div className="ff">
                <label className="lbl sans">Select a Time</label>
                <div className="tg">
                  {TIME_SLOTS.map(t=>(
                    <div key={t} className={`ts sans${form.time===t?" sel":""}`} onClick={()=>set("time",t)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&set("time",t)}>{t}</div>
                  ))}
                </div>
                {errors.time && <p className="ferr sans" style={{marginTop:8}}>⚠ {errors.time}</p>}
              </div>
              <div className="br2">
                <button className="bbk sans" onClick={back}>← Back</button>
                <button className="bnx sans" onClick={next}>Review Booking →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className={`sb${direction==="back"?" bk":""}`}>
              <div className="sh">
                <p className="sey sans">Step 3 of 3</p>
                <h2 className="st">Review &amp; <em>confirm</em></h2>
                <p className="ss sans">Double-check your details below, then confirm your tour.</p>
              </div>
              <div className="rb">
                {[
                  ["Name",         `${form.firstName} ${form.lastName}`],
                  ["Email",        form.email],
                  ["Phone",        form.phone],
                  ["Relationship", form.relationship],
                  ["Tour Type",    TOUR_TYPES.find(t=>t.id===form.tourType)?.label],
                  ["Date",         formatDate(form.date)],
                  ["Time",         form.time || "—"],
                ].map(([k,v])=>(
                  <div key={k} className="rr">
                    <span className="rk sans">{k}</span>
                    <span className="rv sans">{v}</span>
                  </div>
                ))}
              </div>
              <div className="ff">
                <label className="lbl sans">Anything we should know? (optional)</label>
                <textarea className="fta sans" placeholder="E.g. specific care needs, mobility considerations, questions you'd like answered…" value={form.notes} onChange={e=>set("notes",e.target.value)} />
              </div>
              <div className="ff">
                <label className="lbl sans">How did you hear about us? (optional)</label>
                <select className="fsl sans" value={form.howHeard} onChange={e=>set("howHeard",e.target.value)}>
                  <option value="">Select one…</option>
                  {HOW_HEARD.map(h=><option key={h}>{h}</option>)}
                </select>
              </div>
              <div className="br2">
                <button className="bbk sans" onClick={back}>← Back</button>
                <button className="bsb sans" onClick={submit}>Confirm My Tour ✓</button>
              </div>
            </div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step === 4 && (
            <div className="succ">
              <div className="si">✓</div>
              <h2 className="stit">You're <em>all set!</em></h2>
              <p className="ssb sans">
                Your tour at Blessed Hill has been requested. We'll send a confirmation to <strong>{form.email}</strong> within a few hours.
              </p>
              <div className="sdet sans">
                📅 &nbsp;{formatDate(form.date)} &nbsp;at&nbsp; <strong>{form.time}</strong><br />
                {TOUR_TYPES.find(t=>t.id===form.tourType)?.icon}&nbsp; {TOUR_TYPES.find(t=>t.id===form.tourType)?.label}<br />
                📍 &nbsp;11803 SE 323rd PL, Auburn, WA 98092
              </div>
              <p className="snote sans">Questions? Call <a href="tel:12533974881" style={{color:"var(--bm)"}}>253-397-4881</a></p>
            </div>
          )}

        </div>

        {/* INFO PANEL */}
        <aside className="ip">
          <p className="ik sans">Why Visit Us?</p>
          <h2 className="ih">See the Warmth<br /><em>for Yourself</em></h2>
          <p className="ib sans">No brochure can replace walking through the front door, meeting our caregivers, and seeing firsthand the home we've built. Bring your whole family.</p>
          <ul className="tl2">
            {TRUST_POINTS.map(p=>(
              <li key={p} className="ti">
                <span className="tb" aria-hidden="true">✦</span>
                <span className="tt2 sans">{p}</span>
              </li>
            ))}
          </ul>
          <div className="ac">
            <p className="al sans">Our Location</p>
            <address className="at sans" style={{fontStyle:"normal"}}>
              Blessed Hill Adult Family Home<br />
              11803 SE 323rd PL<br />
              Auburn, WA 98092
            </address>
            <div className="ap sans">Call or text: <a href="tel:12533974881">253-397-4881</a></div>
          </div>
        </aside>

      </div>
    </div>
  );
}
