import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];

const HERO_REVIEW = {
  quote: "Blessed Hill Adult Family Home truly stands out as an exceptional living facility, meticulously designed with resident care and comfort in mind. The ADA compliant bathrooms ensure safety and accessibility for all — this, paired with their attentive safe mobility assistance, offers residents the genuine peace of mind that comes from knowing they are in capable and caring hands.",
  author: "Lorraine Morgan",
  relation: "Verified Reviewer",
  source: "Direct",
  stars: 5,
};

const RATING_SUMMARY = {
  overall: 5.0,
  total: 5,
  breakdown: [
    { stars: 5, count: 5 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

const PLATFORMS = [
  { name: "BlessedHillAdultFamilyHome.com", score: "5.0", reviews: "5 reviews", color: "#2e6da4" },
];

const REVIEWS = [
  {
    id: 1, stars: 5, size: "large",
    quote: "I was immediately taken by how warm and inviting the atmosphere was. Anne, who oversees the home, is an embodiment of hospitality and kindness. Her friendly demeanor and genuine affection for the members are noticeable, making it a warm and nurturing environment for anyone in need of adult family home services. Keep it up Anne!!",
    author: "Hayley Matthews", relation: "Verified Reviewer", source: "Direct", date: "Jan 2022",
  },
  {
    id: 2, stars: 5, size: "medium",
    quote: "Very Patient and Loving Staff who care for my mother who has dementia. So glad she is in such a loving home.",
    author: "Cheryl Ehrenheim", relation: "Family of resident", source: "Direct", date: "Jan 2017",
  },
  {
    id: 3, stars: 5, size: "medium",
    quote: "I recently had the opportunity to visit Blessed Hill Adult Family Home and was genuinely impressed with their comprehensive approach to adult care. My mother is happy to be here.",
    author: "Jackie M.", relation: "Family of resident", source: "Direct", date: "Feb 2022",
  },
  {
    id: 4, stars: 5, size: "small",
    quote: "Organized, nice and clean floors. Located in a quiet neighborhood.",
    author: "Emilio Albeit", relation: "Verified Reviewer", source: "Direct", date: "Jul 2023",
  },
];

const SOURCE_COLORS = {
  "Direct": { bg:"#EEF4FB", text:"#2e6da4", dot:"#2e6da4" },
};

function Stars({ n, size = 14 }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:size, color: i<=n ? "#c9a84c" : "#ddd", lineHeight:1 }}>★</span>
      ))}
    </span>
  );
}

export default function BlessedHillReviews({ navigate = () => {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleIds, setVisibleIds] = useState(new Set());
  const cardRefs = useRef({});

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.dataset.rid;
          setVisibleIds(prev => prev.has(id) ? prev : new Set([...prev, id]));
        }
      }),
      { threshold: 0.12 }
    );
    const timer = setTimeout(() => {
      Object.values(cardRefs.current).forEach(el => el && observer.observe(el));
    }, 80);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  const vis = id => visibleIds.has(String(id));

  return (
    <div style={{ fontFamily:"'Playfair Display',Georgia,serif", background:"#faf8f4", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bd:#1a3a5c;--bm:#2e6da4;--bs:#5b9bd5;
          --cr:#faf8f4;--cd:#f0ece2;--wh:#ffffff;
          --tm:#4a6278;--tl:#8a9dae;
          --gd:#c9a84c;--gl:#fdf5e0;--br:rgba(30,80,140,0.09);--rd:16px;
        }
        .sans{font-family:'DM Sans',sans-serif}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:300;background:rgba(250,248,244,.97);backdrop-filter:blur(12px);border-bottom:1px solid var(--br);transition:box-shadow .3s;padding:0 48px}
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

        /* HERO QUOTE SECTION */
        .hero{
          padding:140px 48px 0;background:var(--bd);
          position:relative;overflow:hidden;
        }
        /* Large quotation mark watermark */
        .hero::before{
          content:'"';
          position:absolute;top:-40px;left:40px;
          font-family:'Playfair Display',serif;
          font-size:480px;font-weight:700;line-height:1;
          color:rgba(255,255,255,0.04);
          pointer-events:none;user-select:none;
          letter-spacing:-20px;
        }
        /* Diagonal cream cut at bottom */
        .hero::after{
          content:'';position:absolute;bottom:-1px;left:0;right:0;height:80px;
          background:var(--cr);
          clip-path:polygon(0 100%,100% 0,100% 100%);
        }
        .hero-inner{max-width:1280px;margin:0 auto;position:relative;z-index:1;padding-bottom:100px}
        .hero-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:12px;margin-bottom:28px}
        .hero-kicker::before{content:'';display:block;width:28px;height:1.5px;background:var(--gd)}
        .hero-quote{
          font-size:clamp(22px,3.5vw,38px);font-weight:400;font-style:italic;
          color:white;line-height:1.5;letter-spacing:-.3px;
          max-width:860px;margin-bottom:40px;
        }
        .hero-attr{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
        .hero-avatar{
          width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,var(--bs),var(--bm));
          display:flex;align-items:center;justify-content:center;
          font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:white;
          flex-shrink:0;border:2px solid rgba(255,255,255,.2);
        }
        .hero-name{font-size:17px;font-weight:700;color:white;margin-bottom:2px}
        .hero-rel{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,.55)}
        .hero-source-badge{
          margin-left:auto;display:flex;align-items:center;gap:8px;
          font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
          background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
          border-radius:50px;padding:7px 16px;color:rgba(255,255,255,.7);
        }

        /* RATING SUMMARY + PLATFORMS */
        .summary-section{padding:80px 48px 0;background:var(--cr)}
        .summary-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:auto 1fr auto;gap:80px;align-items:start}
        /* Big score */
        .score-block{text-align:center}
        .score-num{font-size:88px;font-weight:700;color:var(--bd);line-height:.9;letter-spacing:-4px}
        .score-stars{margin:12px 0 6px}
        .score-label{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--tl);letter-spacing:.5px}
        /* Breakdown bars */
        .breakdown{display:flex;flex-direction:column;gap:10px;padding-top:4px}
        .bk-row{display:flex;align-items:center;gap:12px}
        .bk-label{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--tm);width:28px;text-align:right;flex-shrink:0}
        .bk-track{flex:1;height:8px;background:var(--cd);border-radius:4px;overflow:hidden}
        .bk-fill{height:100%;background:var(--gd);border-radius:4px;transition:width .8s ease}
        .bk-count{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--tl);width:20px;flex-shrink:0}
        /* Platform cards */
        .platforms{display:flex;flex-direction:column;gap:12px}
        .plat-card{
          background:var(--wh);border:1px solid var(--br);border-radius:12px;
          padding:16px 20px;display:flex;align-items:center;gap:14px;
        }
        .plat-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .plat-name{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--bd);margin-bottom:2px}
        .plat-meta{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--tl)}
        .plat-score{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--bd);margin-left:auto}

        /* DIVIDER */
        .divider{max-width:1280px;margin:72px auto 0;padding:0 48px;height:1px;background:linear-gradient(90deg,transparent,var(--br),transparent)}

        /* REVIEWS GRID */
        .reviews-section{padding:72px 48px 80px;background:var(--cr)}
        .reviews-header{max-width:1280px;margin:0 auto 48px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
        .reviews-title{font-size:clamp(26px,3.5vw,42px);font-weight:700;color:var(--bd);letter-spacing:-.5px;line-height:1.1}
        .reviews-title em{font-style:italic;color:var(--bm)}
        .reviews-sub{font-family:'DM Sans',sans-serif;font-size:14px;color:var(--tl);margin-top:8px}
        /* Masonry columns */
        .reviews-masonry{max-width:1280px;margin:0 auto;columns:3;column-gap:20px}
        /* Review card */
        .rc{
          break-inside:avoid;margin-bottom:20px;
          background:var(--wh);border:1px solid var(--br);border-radius:var(--rd);
          padding:28px;
          opacity:0;transform:translateY(24px);
          transition:opacity .55s ease,transform .55s ease,box-shadow .3s;
          position:relative;
        }
        .rc.visible{opacity:1;transform:translateY(0)}
        .rc:hover{box-shadow:0 8px 32px rgba(30,80,140,.09)}
        /* Accent bar — left edge on hover */
        .rc::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;border-radius:var(--rd) 0 0 var(--rd);background:var(--gd);transform:scaleY(0);transform-origin:top;transition:transform .3s ease}
        .rc:hover::before{transform:scaleY(1)}
        /* Large card gets cream tint */
        .rc.large{background:#fefcf8}
        .rc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .rc-source{
          display:inline-flex;align-items:center;gap:6px;
          font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;
          letter-spacing:.5px;text-transform:uppercase;
          border-radius:50px;padding:4px 10px;
        }
        .rc-src-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .rc-quote{
          font-size:15.5px;font-weight:400;font-style:italic;
          color:#2a3d50;line-height:1.7;margin-bottom:20px;
          position:relative;
        }
        /* Decorative opening quote */
        .rc-quote::before{
          content:'"';
          font-family:'Playfair Display',serif;font-size:48px;font-weight:700;
          color:rgba(201,168,76,.2);line-height:1;
          position:absolute;top:-12px;left:-8px;
          pointer-events:none;
        }
        .rc-foot{display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--br)}
        .rc-avatar{
          width:36px;height:36px;border-radius:50%;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:white;
        }
        .rc-name{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--bd)}
        .rc-rel{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--tl)}
        .rc-date{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--tl);margin-left:auto}

        /* LEAVE A REVIEW CTA */
        .leave-section{background:var(--cd);padding:80px 48px;position:relative;overflow:hidden}
        .leave-section::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(201,168,76,.08);pointer-events:none}
        .leave-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .leave-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);display:flex;align-items:center;gap:10px;margin-bottom:16px}
        .leave-kicker::before{content:'';display:block;width:20px;height:1.5px;background:var(--gd)}
        .leave-title{font-size:clamp(26px,3.5vw,44px);font-weight:700;color:var(--bd);letter-spacing:-.5px;line-height:1.1;margin-bottom:12px}
        .leave-title em{font-style:italic;color:var(--bm)}
        .leave-body{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:var(--tm);line-height:1.8}
        .leave-platforms{display:flex;flex-direction:column;gap:12px}
        .lp-btn{
          display:flex;align-items:center;gap:14px;
          background:var(--wh);border:1.5px solid var(--br);border-radius:12px;
          padding:16px 20px;cursor:pointer;text-decoration:none;
          transition:border-color .2s,box-shadow .2s,transform .2s;
        }
        .lp-btn:hover{border-color:var(--bs);box-shadow:0 4px 20px rgba(30,80,140,.1);transform:translateY(-2px)}
        .lp-dot2{width:12px;height:12px;border-radius:50%;flex-shrink:0}
        .lp-name{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--bd)}
        .lp-sub{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--tl)}
        .lp-arrow{margin-left:auto;font-size:16px;color:var(--tl)}

        /* CTA BAND */
        .cta-band{background:var(--bd);padding:80px 48px}
        .cta-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:48px;flex-wrap:wrap}
        .cta-kicker{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gd);margin-bottom:12px}
        .cta-title{font-size:clamp(24px,3.5vw,40px);font-weight:700;color:white;line-height:1.1;letter-spacing:-.5px}
        .cta-title em{font-style:italic;color:#8fc3e8}
        .cta-sub{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.7;margin-top:10px;max-width:420px}
        .btn-gold{background:var(--gd);color:var(--bd);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;padding:16px 40px;border-radius:50px;border:none;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s;white-space:nowrap}
        .btn-gold:hover{background:#dfc068;transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4)}

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

        /* ANIMATIONS */
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeUp .7s ease both}
        .fi1{animation-delay:.1s}.fi2{animation-delay:.2s}.fi3{animation-delay:.3s}
        .hamburger{
          display:none;background:none;border:none;
          font-size:22px;cursor:pointer;color:var(--bd);
          padding:6px;align-items:center;justify-content:center;
        /* RESPONSIVE */
        @media(max-width:1100px){.reviews-masonry{columns:2}.summary-inner{grid-template-columns:auto 1fr;grid-template-rows:auto auto}.platforms{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr)}}
        @media(max-width:900px){
          .nav{padding:0 24px}.nl,.ncta{display:none}
          .hamburger{display:flex}
          .hero{padding:120px 24px 0}
          .summary-section{padding:60px 24px 0}
          .summary-inner{grid-template-columns:1fr;gap:40px}
          .platforms{grid-template-columns:1fr}
          .reviews-section{padding:56px 24px 60px}
          .reviews-masonry{columns:1}
          .leave-section{padding:64px 24px}
          .leave-inner{grid-template-columns:1fr;gap:40px}
          .cta-band{padding:64px 24px}
          .footer{padding:44px 24px 24px}
          .footer-inner{grid-template-columns:1fr;gap:32px}
          .fbot{flex-direction:column;gap:6px;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-inner">
          <div onClick={()=>navigate("Home")}style={{cursor:"pointer"}}><div className="nlm">Blessed Hill</div><div className="nls sans">Adult Family Home</div></div>
          <ul className="nl">
            {NAV_LINKS.map(l=><li key={l}><a href="#" className={l==="Reviews"?"active":""} onClick={e=>{e.preventDefault();navigate(l);}}>{l}</a></li>)}
          </ul>
          <button className="ncta sans" onClick={()=>navigate("Schedule a Tour")}>Schedule a Tour</button>
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

      {/* HERO QUOTE */}
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-kicker sans fade-in">What Families Say</p>
          <blockquote className="hero-quote fade-in fi1">
            "{HERO_REVIEW.quote}"
          </blockquote>
          <div className="hero-attr fade-in fi2">
            <div className="hero-avatar">{HERO_REVIEW.author[0]}</div>
            <div>
              <div className="hero-name">{HERO_REVIEW.author}</div>
              <div className="hero-rel sans">{HERO_REVIEW.relation}</div>
            </div>
            <Stars n={HERO_REVIEW.stars} size={16} />
            <div className="hero-source-badge sans">
              <span style={{width:8,height:8,borderRadius:"50%",background:SOURCE_COLORS[HERO_REVIEW.source].dot,display:"inline-block"}} />
              {HERO_REVIEW.source}
            </div>
          </div>
        </div>
      </header>

      {/* RATING SUMMARY */}
      <section className="summary-section">
        <div className="summary-inner">
          {/* Big score */}
          <div className="score-block fade-in">
            <div className="score-num">{RATING_SUMMARY.overall}</div>
            <div className="score-stars"><Stars n={5} size={20} /></div>
            <div className="score-label sans">out of 5 · {RATING_SUMMARY.total} reviews</div>
          </div>

          {/* Breakdown bars */}
          <div className="breakdown fade-in fi1">
            {RATING_SUMMARY.breakdown.map(row => (
              <div key={row.stars} className="bk-row">
                <span className="bk-label sans">{row.stars}★</span>
                <div className="bk-track">
                  <div className="bk-fill" style={{width:`${(row.count/RATING_SUMMARY.total)*100}%`}} />
                </div>
                <span className="bk-count sans">{row.count}</span>
              </div>
            ))}
          </div>

          {/* Platform cards */}
          <div className="platforms fade-in fi2">
            {PLATFORMS.map(p => (
              <div key={p.name} className="plat-card">
                <div className="plat-dot" style={{background:p.color}} />
                <div>
                  <div className="plat-name sans">{p.name}</div>
                  <div className="plat-meta sans">{p.reviews}</div>
                </div>
                <div className="plat-score">{p.score}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* REVIEWS GRID */}
      <section className="reviews-section">
        <div className="reviews-header">
          <div>
            <h2 className="reviews-title">Stories from <em>Our Families</em></h2>
            <p className="reviews-sub sans">5 verified reviews from real families</p>
          </div>
        </div>

        <div className="reviews-masonry">
          {REVIEWS.map((r, i) => {
            const sc  = SOURCE_COLORS[r.source];
            const avatarColors = ["#2e6da4","#1a6644","#7d4e1a","#4a3580","#1a3a5c","#c0392b"];
            const ac  = avatarColors[i % avatarColors.length];
            return (
              <div
                key={r.id}
                className={`rc${r.size==="large"?" large":""} ${vis(r.id)?"visible":""}`}
                style={{ transitionDelay:`${(i%3)*80}ms` }}
                ref={el => { cardRefs.current[r.id] = el; }}
                data-rid={r.id}
              >
                <div className="rc-top">
                  <Stars n={r.stars} size={13} />
                  <span className="rc-source sans" style={{background:sc.bg,color:sc.text}}>
                    <span className="rc-src-dot" style={{background:sc.dot}} />
                    {r.source}
                  </span>
                </div>
                <p className="rc-quote">
                  {r.quote}
                </p>
                <div className="rc-foot">
                  <div className="rc-avatar" style={{background:ac}}>{r.author[0]}</div>
                  <div>
                    <div className="rc-name sans">{r.author}</div>
                    <div className="rc-rel sans">{r.relation}</div>
                  </div>
                  <span className="rc-date sans">{r.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LEAVE A REVIEW */}
      <section className="leave-section">
        <div className="leave-inner">
          <div>
            <p className="leave-kicker sans">Share Your Experience</p>
            <h2 className="leave-title">Helped by Blessed Hill?<br /><em>Let others know.</em></h2>
            <p className="leave-body sans">
              Families searching for the right care home rely on honest reviews from people like you. If Blessed Hill made a difference for your loved one, your words could guide another family to find their peace of mind.
            </p>
          </div>
          <div className="leave-platforms">
            {PLATFORMS.map(p => (
              <a key={p.name} href="https://blessedhilladultfamilyhome.com/reviews" className="lp-btn" target="_blank" rel="noreferrer">
                <span className="lp-dot2" style={{background:p.color}} />
                <div>
                  <div className="lp-name sans">Submit your review on our website</div>
                  <div className="lp-sub sans">{p.score} stars · {p.reviews}</div>
                </div>
                <span className="lp-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="cta-inner">
          <div>
            <p className="cta-kicker sans">Take the Next Step</p>
            <h2 className="cta-title">Come see what our<br /><em>families already know.</em></h2>
            <p className="cta-sub sans">Schedule a free, no-obligation tour and experience the warmth of Blessed Hill in person.</p>
          </div>
          <button className="btn-gold sans" onClick={()=>navigate("Schedule a Tour")}>Book a Free Tour →</button>
        </div>
      </section>

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
