import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/bwr.png";

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];

const CATEGORIES = [
  { id: "all",        label: "All Photos",    icon: "⊞" },
  { id: "rooms",      label: "Rooms",         icon: "🛏️" },
  { id: "common",     label: "Common Areas",  icon: "🛋️" },
  { id: "meals",      label: "Meals",         icon: "🍽️" },
  { id: "activities", label: "Activities",    icon: "🎨" },
  { id: "outdoor",    label: "Outdoor",       icon: "🌿" },
  { id: "care",       label: "Care & Staff",  icon: "💙" },
];

// Masonry layout: span = how many rows tall (1 = normal, 2 = tall)
const PHOTOS = [
  { id:1,  cat:"rooms",      span:2, icon:"🛏️", label:"Private Room — Sunlit & Spacious",      gradient:"linear-gradient(145deg,#d4e6f1,#a9cce3)", sub:"Furnished with warmth and personal touches" },
  { id:2,  cat:"common",     span:1, icon:"🛋️", label:"Living Room",                           gradient:"linear-gradient(145deg,#fde8d8,#f0b27a)", sub:"Where residents gather & connect daily" },
  { id:3,  cat:"meals",      span:1, icon:"🍽️", label:"Breakfast Service",                     gradient:"linear-gradient(145deg,#d5f5e3,#a9dfbf)", sub:"Fresh, nutritious meals every morning" },
  { id:4,  cat:"outdoor",    span:2, icon:"🌿", label:"Garden Patio",                          gradient:"linear-gradient(145deg,#d0ece7,#a2d9ce)", sub:"Peaceful outdoor space in our backyard" },
  { id:5,  cat:"activities", span:1, icon:"🎨", label:"Art & Crafts Session",                  gradient:"linear-gradient(145deg,#f9ebea,#f1948a)", sub:"Weekly creative activities for all" },
  { id:6,  cat:"rooms",      span:1, icon:"🚿", label:"ADA-Compliant Bathroom",                gradient:"linear-gradient(145deg,#d6eaf8,#a9cce3)", sub:"Safe, accessible, and spotlessly clean" },
  { id:7,  cat:"care",       span:2, icon:"💙", label:"Caregiver & Resident Moment",           gradient:"linear-gradient(145deg,#e8daef,#c39bd3)", sub:"Genuine bonds built through daily care" },
  { id:8,  cat:"meals",      span:1, icon:"☕", label:"Afternoon Coffee & Tea",                gradient:"linear-gradient(145deg,#fef9e7,#f9e79f)", sub:"A daily ritual residents look forward to" },
  { id:9,  cat:"common",     span:1, icon:"📚", label:"Reading Nook",                          gradient:"linear-gradient(145deg,#fdebd0,#f0b27a)", sub:"Quiet corner stocked with books & puzzles" },
  { id:10, cat:"activities", span:1, icon:"🎵", label:"Music Therapy",                        gradient:"linear-gradient(145deg,#d5f5e3,#82e0aa)", sub:"Weekly sessions with a visiting musician" },
  { id:11, cat:"outdoor",    span:1, icon:"☀️", label:"Morning Walk Path",                    gradient:"linear-gradient(145deg,#d4efdf,#a9dfbf)", sub:"Safe walking paths along the perimeter" },
  { id:12, cat:"rooms",      span:2, icon:"🪟", label:"Shared Room — Bright & Airy",          gradient:"linear-gradient(145deg,#d6eaf8,#85c1e9)", sub:"Comfortable shared option with ample light" },
  { id:13, cat:"care",       span:1, icon:"💊", label:"Medication Management",                 gradient:"linear-gradient(145deg,#e8daef,#bb8fce)", sub:"Precise daily administration by trained staff" },
  { id:14, cat:"meals",      span:1, icon:"🥗", label:"Lunch — Balanced & Fresh",             gradient:"linear-gradient(145deg,#d5f5e3,#a9dfbf)", sub:"Tailored to each resident's dietary needs" },
  { id:15, cat:"activities", span:2, icon:"🃏", label:"Game Afternoon",                       gradient:"linear-gradient(145deg,#fde8d8,#f5b7b1)", sub:"Cards, board games & friendly competition" },
  { id:16, cat:"common",     span:1, icon:"🌅", label:"Dining Room — Morning Light",          gradient:"linear-gradient(145deg,#fef9e7,#fad7a0)", sub:"Where all three daily meals are shared" },
  { id:17, cat:"care",       span:1, icon:"🩺", label:"Health Check — Weekly Vitals",         gradient:"linear-gradient(145deg,#d6eaf8,#a9cce3)", sub:"Routine monitoring by our nursing staff" },
  { id:18, cat:"outdoor",    span:1, icon:"🌸", label:"Front Garden in Bloom",                gradient:"linear-gradient(145deg,#fce4ec,#f48fb1)", sub:"Seasonal planting tended by residents" },
];

export default function BlessedHillGallery({ navigate = () => {} }) {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activecat, setActivecat]     = useState("all");
  const [lightbox, setLightbox]       = useState(null); // index into filtered
  const [revealed, setRevealed]       = useState(new Set());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Reveal all cards shortly after mount / category change
  useEffect(() => {
    setRevealed(new Set());
    const timers = filtered.map((p, i) =>
      setTimeout(() => setRevealed(prev => new Set([...prev, p.id])), 60 + i * 40)
    );
    return () => timers.forEach(clearTimeout);
  }, [activecat]);

  // Keyboard nav for lightbox
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === "Escape")     setLightbox(null);
    if (e.key === "ArrowRight") setLightbox(i => Math.min(i + 1, filtered.length - 1));
    if (e.key === "ArrowLeft")  setLightbox(i => Math.max(i - 1, 0));
  }, [lightbox]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const filtered = activecat === "all" ? PHOTOS : PHOTOS.filter(p => p.cat === activecat);
  const lbPhoto  = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#f7f5f0", minHeight:"100vh" }}>
      <style>{`
        body { overflow-x: hidden; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;
          --cr:#f7f5f0;--cd:#eeebe3;--wh:#ffffff;
          --tm:#4a6278;--tl:#8a9dae;
          --gd:#c9a84c;--br:rgba(30,80,140,0.09);--rd:16px;
        }
        .sans{font-family:'DM Sans',sans-serif}

        /* NAV */
        .nav
        {position:fixed;top:0;left:0;right:0;z-index:300;background:rgba(247,245,240,.97);backdrop-filter:blur(12px);border-bottom:1px solid var(--br);transition:box-shadow .3s;padding:0 48px}
        .nav.scrolled{box-shadow:0 2px 20px rgba(30,80,140,.07)}
        .nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:80px;height:72px}        
        .nav-logo-main{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;line-height:1.1;letter-spacing:-0.3px;color:var(--bd)}
        .nav-logo-sub{font-family:'DM Sans',sans-serif;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:var(--bs)}        .nlm{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--bd)}
        .nls{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--bs);letter-spacing:1.5px;text-transform:uppercase}
        .nav-links{display:flex;gap:28px;list-style:none}
        .nav-links a{font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:var(--tm);text-decoration:none;transition:color .2s}
        .nav-links a:hover{color:var(--bm)}
        .nav-links a.active{color:var(--bd);font-weight:600;border-bottom:2px solid var(--gd);padding-bottom:2px}
        .nav-cta{background:var(--bd);color:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:none;border-radius:50px;padding:9px 22px;cursor:pointer;transition:background .2s,transform .2s}
        .nav-cta:hover{background:var(--bm);transform:translateY(-1px)}

        /* PAGE HEADER */
        .page-header{
          padding:140px 48px 0;
          background:var(--cr);
          position:relative; overflow:hidden;
        }
        /* Subtle dot-grid texture */
        .page-header::before{
          content:'';position:absolute;inset:0;
          background-image:radial-gradient(circle,rgba(30,80,140,0.06) 1px,transparent 1px);
          background-size:28px 28px;
          pointer-events:none;
        }
        .header-inner{
          max-width:1300px;margin:0 auto;
          display:grid;grid-template-columns:1fr auto;
          align-items:end;gap:48px;
          padding-bottom:0;
          position:relative;z-index:1;
        }
        .header-kicker{
          font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;
          letter-spacing:3px;text-transform:uppercase;color:var(--gd);
          display:flex;align-items:center;gap:12px;margin-bottom:16px;
        }
        .header-kicker::before{content:'';display:block;width:28px;height:1.5px;background:var(--gd)}
        .header-title{
          font-size:clamp(40px,6vw,76px);font-weight:700;color:var(--bd);
          line-height:0.95;letter-spacing:-2px;
        }
        .header-title em{font-style:italic;color:var(--bm);display:block}
        .header-count{
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
          color:var(--tl);letter-spacing:.5px;align-self:flex-end;padding-bottom:8px;
          white-space:nowrap;
        }
        .header-count strong{color:var(--bd);font-size:18px;font-weight:700;font-family:'Playfair Display',serif}

        /* CATEGORY BAR */
        .cat-bar{
          background:var(--cr);
          border-bottom:1px solid var(--br);
          z-index:200;
        }
        .cat-inner{
          max-width:1300px;margin:0 auto;padding:0 48px;
          display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;
          align-items:center;
        }
        .cat-inner::-webkit-scrollbar{display:none}
        .cat-btn{
          flex-shrink:0;display:flex;align-items:center;gap:7px;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
          color:var(--tl);background:none;border:none;
          padding:18px 16px;cursor:pointer;
          border-bottom:2.5px solid transparent;
          transition:color .2s,border-color .2s;white-space:nowrap;
        }
        .cat-btn:hover{color:var(--bm)}
        .cat-btn.active{color:var(--bd);border-bottom-color:var(--gd);font-weight:600}
        .cat-icon{font-size:14px}
        .cat-divider{width:1px;height:20px;background:var(--br);flex-shrink:0;margin:0 4px}

        /* MASONRY GRID */
        .gallery-wrap{padding:48px 48px 80px;max-width:1300px;margin:0 auto}
        .masonry{
          columns:4;column-gap:16px;
        }
        .photo-card{
          break-inside:avoid;
          margin-bottom:16px;
          border-radius:var(--rd);overflow:hidden;
          cursor:pointer;position:relative;
          opacity:0;transform:translateY(20px);
          transition:opacity .5s ease,transform .5s ease,box-shadow .3s;
        }
        .photo-card.revealed{opacity:1;transform:translateY(0)}
        .photo-card:hover{box-shadow:0 12px 40px rgba(0,0,0,0.15)}
        .photo-card:hover .card-overlay{opacity:1}
        .photo-card:hover .card-zoom{transform:scale(1.03)}

        /* Tall cards via padding-bottom trick */
        .photo-img{
          width:100%;display:block;position:relative;overflow:hidden;
        }
        .photo-img.h1{padding-bottom:75%}   /* normal */
        .photo-img.h2{padding-bottom:140%}  /* tall */

        .card-bg{
          position:absolute;inset:0;
          transition:transform .4s ease;
        }
        .card-zoom{position:absolute;inset:0;transition:transform .5s ease}

        /* Category chip on card */
        .card-chip{
          position:absolute;top:14px;left:14px;z-index:2;
          font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
          letter-spacing:1px;text-transform:uppercase;
          background:rgba(255,255,255,0.9);backdrop-filter:blur(6px);
          color:var(--bd);border-radius:50px;padding:4px 10px;
        }

        /* Hover overlay */
        .card-overlay{
          position:absolute;inset:0;z-index:3;
          background:linear-gradient(0deg,rgba(15,30,50,0.75) 0%,rgba(15,30,50,0.1) 55%,transparent 100%);
          opacity:0;transition:opacity .3s ease;
          display:flex;flex-direction:column;justify-content:flex-end;padding:20px;
        }
        .card-label{
          font-family:'Playfair Display',serif;font-size:15px;font-weight:600;
          color:white;line-height:1.25;margin-bottom:4px;
        }
        .card-sub{
          font-family:'DM Sans',sans-serif;font-size:12px;font-weight:300;
          color:rgba(255,255,255,.75);line-height:1.4;
        }
        .card-expand{
          position:absolute;top:14px;right:14px;z-index:4;
          width:32px;height:32px;border-radius:50%;
          background:rgba(255,255,255,0.15);backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,0.25);
          display:flex;align-items:center;justify-content:center;
          font-size:12px;color:white;
        }
        /* Icon centred in placeholder */
        .card-icon{
          position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
          font-size:48px;opacity:0.35;pointer-events:none;
        }

        /* EMPTY STATE */
        .empty{text-align:center;padding:80px 24px;color:var(--tl);font-family:'DM Sans',sans-serif}

        /* LIGHTBOX */
        .lb-backdrop{
          position:fixed;inset:0;z-index:500;
          background:rgba(8,18,32,0.95);backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;
          animation:lbIn .25s ease both;
        }
        @keyframes lbIn{from{opacity:0}to{opacity:1}}
        .lb-close{
          position:absolute;top:24px;right:28px;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
          color:rgba(255,255,255,.5);background:none;border:none;
          cursor:pointer;display:flex;align-items:center;gap:8px;
          transition:color .2s;padding:8px;
        }
        .lb-close:hover{color:white}
        .lb-close-x{
          width:32px;height:32px;border-radius:50%;
          background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);
          display:flex;align-items:center;justify-content:center;font-size:16px;
        }
        .lb-content{
          display:flex;flex-direction:column;align-items:center;
          max-width:720px;width:90%;animation:lbUp .3s ease both;
        }
        @keyframes lbUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .lb-image{
          width:100%;border-radius:20px;overflow:hidden;
          box-shadow:0 32px 80px rgba(0,0,0,.5);
          position:relative;
        }
        .lb-img-inner{padding-bottom:66%;position:relative}
        .lb-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        .lb-icon{font-size:80px;opacity:.35}
        .lb-info{width:100%;padding:20px 4px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
        .lb-label{font-size:20px;font-weight:700;color:white;letter-spacing:-.3px;margin-bottom:4px}
        .lb-sub{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(255,255,255,.55);line-height:1.5}
        .lb-counter{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,.4);white-space:nowrap;padding-top:4px}
        .lb-nav{display:flex;gap:10px;margin-top:20px}
        .lb-arrow{
          width:48px;height:48px;border-radius:50%;
          background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
          display:flex;align-items:center;justify-content:center;
          font-size:18px;color:white;cursor:pointer;
          transition:background .2s,border-color .2s;
        }
        .lb-arrow:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.35)}
        .lb-arrow:disabled{opacity:.25;cursor:default}

        /* CTA BAND */
        .cta-band{
          background:var(--bd);padding:80px 48px;
          display:flex;align-items:center;justify-content:space-between;
          gap:48px;flex-wrap:wrap;
        }
        .cta-band-inner{max-width:1300px;margin:0 auto;width:100%;display:flex;align-items:center;justify-content:space-between;gap:48px;flex-wrap:wrap}
        .cta-left{}
        .cta-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);margin-bottom:12px}
        .cta-title{font-size:clamp(24px,3.5vw,40px);font-weight:700;color:white;line-height:1.1;letter-spacing:-.5px}
        .cta-title em{font-style:italic;color:#8fc3e8}
        .cta-sub{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.7;margin-top:10px;max-width:420px}
        .btn-gold{background:var(--gd);color:var(--bd);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;padding:16px 40px;border-radius:50px;border:none;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s;white-space:nowrap}
        .btn-gold:hover{background:#dfc068;transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4)}

        /* FOOTER */
        .footer{background:#0b1a27;color:rgba(255,255,255,.55);padding:52px 48px 28px;font-family:'DM Sans',sans-serif;font-size:13.5px}
        .footer-inner{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.07)}
        .fb{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:white;margin-bottom:10px}
        .fd{line-height:1.8;max-width:300px;margin-bottom:16px}
        .ft{color:var(--gd);font-weight:500;text-decoration:none;font-size:15px}
        .ft:hover{text-decoration:underline}
        .fch{color:white;font-weight:600;font-size:14px;margin-bottom:16px}
        .fl{list-style:none;display:flex;flex-direction:column;gap:9px}
        .fl a{color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s}
        .fl a:hover{color:white}
        .fbot{max-width:1300px;margin:0 auto;padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.28)}
      .hamburger{
          display:none; background:none; border:none;
          font-size:22px; cursor:pointer; color:var(--bd);
          padding:8px; align-items:center; justify-content:center;
          min-width:44px; min-height:44px; border-radius:8px;
        }
        .mobile-menu{
          position:fixed; top:0; left:0; right:0; bottom:0;
          z-index:100;
          background:rgba(13,33,55,0.98);
          backdrop-filter:blur(12px);
          display:flex; flex-direction:column;
          align-items:center; justify-content:flex-start;
          gap:8px;
          overflow-y:auto;
          padding:80px 24px 40px;
}
        .mobile-menu-close{
          position:absolute; top:20px; right:20px;
          background:none; border:none;
          font-size:24px; color:rgba(255,255,255,0.7);
          cursor:pointer; padding:8px;
          min-width:44px; min-height:44px;
          display:flex; align-items:center; justify-content:center;
        }
        .mobile-link{
          font-family:'DM Sans',sans-serif; font-size:20px; font-weight:400;
          color:rgba(255,255,255,0.85); text-decoration:none;
          padding:14px 32px; border-radius:12px;
          width:100%; max-width:320px; text-align:center;
          transition:background 0.2s, color 0.2s;
        }
        .mobile-link:hover{background:rgba(255,255,255,0.08);color:white}
        .mobile-link.active-link{color:var(--gd);font-weight:500}

        /* RESPONSIVE */
        @media(max-width:1024px){
          .page-body{grid-template-columns:1fr;gap:48px}
          .sidebar{position:static}
        }
        @media(max-width:900px){
          .nav{padding:0 20px}
          .nl,.ncta,.nav-links,.nav-cta{display:none}
          .hamburger{display:flex}
          .nav-inner{height:64px;gap:12px}
          .nav-logo-img{height:52px !important}
          .nav-logo-main{font-size:16px}
          .nav-logo-sub{font-size:10px}
          .page-header{padding:80px 24px 48px}
          .header-inner{grid-template-columns:1fr;gap:40px}
          .why-grid{grid-template-columns:1fr 1fr}
          .page-body{padding:48px 24px 60px}
          .field-row{grid-template-columns:1fr}
          .footer{padding:44px 24px 24px}
          .footer-inner{grid-template-columns:1fr;gap:32px}
          .fbot{flex-direction:column;gap:6px;text-align:center}
        }
        @media(max-width:540px){
          .nav-inner{height:56px;gap:8px}
          .nav-logo-img{height:44px !important}
        }
        @media(max-width:480px){.why-grid{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      {/* NAV */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-inner">
          <div onClick={()=>navigate("Home")} style={{display:"flex", alignItems:"center", gap:"0px", cursor:"pointer", marginLeft:"-15px"}}>
          <img src={logo} alt="Blessed Hill" className="nav-logo-img" style={{height:"140px", width:"auto"}} />            <div>
              <div className="nav-logo-main">Blessed Hill</div>
              <div className="nav-logo-sub sans">Adult Family Home</div>
            </div>
          </div>
          <ul className="nav-links">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className={label==="Gallery"?"active":""} onClick={e=>{e.preventDefault();navigate(label);}}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          
        <button className="hamburger" style={{marginLeft:"auto"}} onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      <AnimatePresence>
      {menuOpen && (
      <motion.div 
        className="mobile-menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button className="mobile-menu-close" onClick={()=>setMenuOpen(false)} aria-label="Close menu">✕</button>
        {NAV_LINKS.map((l, i) => (
          <motion.a 
            key={l} 
            href="#" 
            className={`mobile-link sans${l==="Gallery" ? " active-link" : ""}`} 
            onClick={e=>{e.preventDefault();navigate(l);setMenuOpen(false);}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            {l}
          </motion.a>
        ))}
      </motion.div>
      )}
      </AnimatePresence>

      {/* PAGE HEADER */}
      <header className="page-header">
        <div className="header-inner">
          <div>
            <p className="header-kicker sans">Photo Gallery</p>
            <h1 className="header-title">
              See Our<br /><em>Home.</em>
            </h1>
          </div>
          <p className="header-count sans">
            <strong>{filtered.length}</strong><br />photos
          </p>
        </div>
      </header>

      {/* CATEGORY BAR */}
      <div className="cat-bar">
        <div className="cat-inner">
          {CATEGORIES.map((cat, i) => (
            <span key={cat.id} style={{display:"contents"}}>
              {i === 1 && <div className="cat-divider" />}
              <button
                className={`cat-btn sans${activecat===cat.id?" active":""}`}
                onClick={() => setActivecat(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                {cat.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* MASONRY GALLERY */}
      <main className="gallery-wrap">
        {filtered.length === 0 ? (
          <div className="empty sans">No photos in this category yet.</div>
        ) : (
          <div className="masonry">
            {filtered.map((photo, idx) => (
              <div
                key={photo.id}
                className={`photo-card${revealed.has(photo.id)?" revealed":""}`}
                style={{ transitionDelay: `${(idx % 8) * 30}ms` }}
                onClick={() => setLightbox(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View: ${photo.label}`}
                onKeyDown={e => e.key==="Enter" && setLightbox(idx)}
              >
                <div className={`photo-img ${photo.span===2?"h2":"h1"}`}>
                  {/* Gradient placeholder — swap src= on real img tag when photos are ready */}
                  <div className="card-bg card-zoom" style={{ background: photo.gradient }} />
                  <div className="card-icon" aria-hidden="true">{photo.icon}</div>
                  <div className="card-chip sans">
                    {CATEGORIES.find(c=>c.id===photo.cat)?.label}
                  </div>
                  <div className="card-overlay">
                    <div className="card-label">{photo.label}</div>
                    <div className="card-sub sans">{photo.sub}</div>
                  </div>
                  <div className="card-expand" aria-hidden="true">⤢</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* LIGHTBOX */}
      {lbPhoto && (
        <div
          className="lb-backdrop"
          onClick={e => e.target===e.currentTarget && setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${lbPhoto.label}`}
        >
          <button className="lb-close sans" onClick={() => setLightbox(null)}>
            <span className="lb-close-x">✕</span> Close
          </button>

          <div className="lb-content">
            <div className="lb-image">
              <div className="lb-img-inner">
                <div className="lb-bg" style={{ background: lbPhoto.gradient }}>
                  <span className="lb-icon">{lbPhoto.icon}</span>
                </div>
              </div>
            </div>

            <div className="lb-info">
              <div>
                <div className="lb-label">{lbPhoto.label}</div>
                <div className="lb-sub sans">{lbPhoto.sub}</div>
              </div>
              <div className="lb-counter sans">{lightbox + 1} / {filtered.length}</div>
            </div>

            <div className="lb-nav">
              <button
                className="lb-arrow"
                onClick={() => setLightbox(i => Math.max(i-1,0))}
                disabled={lightbox===0}
                aria-label="Previous photo"
              >←</button>
              <button
                className="lb-arrow"
                onClick={() => setLightbox(i => Math.min(i+1,filtered.length-1))}
                disabled={lightbox===filtered.length-1}
                aria-label="Next photo"
              >→</button>
            </div>
          </div>
        </div>
      )}

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-left">
            <p className="cta-kicker sans">Ready to Visit?</p>
            <h2 className="cta-title">Photos are just the beginning.<br /><em>Come see it in person.</em></h2>
            <p className="cta-sub sans">
              A 45-minute tour gives you a far richer sense of the warmth, cleanliness, and genuine care that defines life at Blessed Hill.
            </p>
          </div>
          <button className="btn-gold sans" onClick={()=>navigate("Schedule a Tour")}>Book a Free Tour →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="fb">Blessed Hill Adult Family Home</div>
            <p className="fd">Licensed residential adult care in Auburn, WA — guided by Christian values and a deep commitment to dignity.</p>
            <a href="tel:12533974881" className="ft">253-397-4881</a>
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
