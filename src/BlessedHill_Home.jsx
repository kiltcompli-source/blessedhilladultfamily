import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];

const SERVICES = [
  { icon: "🏠", title: "24-Hour Care",          desc: "Round-the-clock supervision and assistance, every day of the year." },
  { icon: "💊", title: "Medication Management", desc: "Trained staff ensure accurate and timely medication administration." },
  { icon: "🍽️", title: "Nutritious Meals",      desc: "Three chef-prepared meals daily, tailored to each resident's dietary needs." },
  { icon: "🛁", title: "Personal Care",         desc: "Assistance with bathing, grooming, hygiene, and activities of daily living." },
  { icon: "🧠", title: "Memory Care",           desc: "Expert support for residents living with dementia and cognitive conditions." },
  { icon: "🚗", title: "Transportation",        desc: "Scheduled rides for doctor appointments, errands, and social outings." },
  { icon: "🤝", title: "Social Activities",     desc: "Crafts, music, games, and community events to keep residents engaged." },
  { icon: "🛡️", title: "Safety Systems",       desc: "Panic buttons in every room and fall prevention programs for peace of mind." },
];

const STATS = [
  { value: "24/7", label: "Care Coverage" },
  { value: "100%", label: "Licensed Staff" },
  { value: "3",    label: "Meals Per Day" },
  { value: "ADA",  label: "Compliant Facility" },
];

const VALUES = [
  ["🏡", "Nestled in a serene neighborhood near scenic riverfronts"],
  ["💙", "Specialized care for dementia, mental health, and developmental disabilities"],
  ["👨‍👩‍👧", "Private and shared room options to fit every family's needs"],
  ["🌟", "Caregiver-to-resident ratio that guarantees personalized attention"],
];

// FIX 6: Defined as strings with explicit "px" units.
// Previously these were bare numbers (e.g. 600) passed to React style props,
// which React treats as unitless — correct only for unitless CSS properties.
// Pixel dimensions require explicit "600px" strings.
const CIRCLE_SIZES = ["600px", "450px", "300px", "150px"];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BlessedHillHome({ navigate = () => {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // FIX 1: Removed unused `menuOpen` state. It was declared and set but never
  // consumed anywhere in the JSX, causing a lint warning and dead code.

  const [visibleSections, setVisibleSections] = useState(new Set());

  // FIX 2: Use a single stable ref object keyed by section name.
  // The old pattern — `const addRef = (key) => (el) => { sectionRefs.current[key] = el; }` —
  // returned a NEW function reference on every render. Because the IntersectionObserver
  // useEffect had an empty deps array [], it ran only once (on mount), before those
  // freshly-created callbacks had been called by React. The refs were therefore null
  // when the observer tried to attach. Using inline callbacks that write into a stable
  // object (sectionRefs.current.about = el) fixes this reliably.
  const sectionRefs = useRef({ about: null, services: null, cta: null });

  // Scroll listener — drives sticky-nav style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer — drives section reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.dataset.section;
            setVisibleSections((prev) => {
              if (prev.has(key)) return prev; // skip setState if already visible
              return new Set([...prev, key]);
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (key) => visibleSections.has(key);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#f8fafd", color: "#1a2b3c", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── GLOBAL STYLES ──────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-deep:  #1a3a5c;
          --blue-mid:   #2e6da4;
          --blue-soft:  #5b9bd5;
          --blue-pale:  #ddeeff;
          --blue-ghost: #f0f6ff;
          --white:      #ffffff;
          --text-dark:  #1a2b3c;
          --text-mid:   #4a6278;
          --text-light: #7a95a8;
          --gold:       #c9a84c;
          --radius:     16px;
        }

        .sans { font-family: 'DM Sans', sans-serif; }

        /* ── NAV ───────────────────────────────────────────────────────── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.4s ease, box-shadow 0.4s ease;
          padding: 0 48px;
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 24px rgba(30,80,140,0.10);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 80px;
        }
        .nav-logo { display: flex; flex-direction: column; }

        /* FIX 5: Logo text was --blue-deep (dark navy) rendered on the dark transparent
           hero — completely invisible. Now it starts white and transitions to navy on scroll. */
        .nav-logo-main {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; line-height: 1.1; letter-spacing: -0.3px;
          color: white;
          transition: color 0.4s ease;
        }
        .nav.scrolled .nav-logo-main { color: var(--blue-deep); }

        .nav-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          transition: color 0.4s ease;
        }
        .nav.scrolled .nav-logo-sub { color: var(--blue-soft); }

        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          text-decoration: none; transition: color 0.2s; letter-spacing: 0.2px;
          color: rgba(255,255,255,0.8);
        }
        .nav.scrolled .nav-links a { color: var(--text-mid); }
        .nav-links a:hover { color: white; }
        .nav.scrolled .nav-links a:hover { color: var(--blue-mid); }

        .nav-cta {
          background: rgba(255,255,255,0.15); color: white;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          border: 1px solid rgba(255,255,255,0.35); border-radius: 50px; padding: 10px 24px;
          cursor: pointer; transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .nav.scrolled .nav-cta { background: var(--blue-mid); border-color: var(--blue-mid); }
        .nav-cta:hover { background: rgba(255,255,255,0.25); }
        .nav.scrolled .nav-cta:hover { background: var(--blue-deep); transform: translateY(-1px); }

        /* ── HERO ──────────────────────────────────────────────────────── */
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #1e4f7a 100%);
          /* Use space-between so .hero-content sits in the middle and
             .hero-stats is naturally pushed to the bottom — no overlap possible. */
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
          padding: 0;        /* padding moved into children so stats hugs the edge */
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(91,155,213,0.18) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-circles {
          position: absolute; right: -80px; top: 50%; transform: translateY(-50%);
          width: 700px; height: 700px; opacity: 0.07; pointer-events: none;
        }
        .hero-circle { position: absolute; border-radius: 50%; border: 1px solid #5b9bd5; }
        .hero-orb {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(91,155,213,0.3), transparent);
          pointer-events: none;
        }

        .hero-content {
          max-width: 1200px; margin: 0 auto; width: 100%;
          position: relative; z-index: 2;
          padding: 160px 48px 60px;
          flex: 1;
          display: flex; flex-direction: column; justify-content: center;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(91,155,213,0.15); border: 1px solid rgba(91,155,213,0.3);
          border-radius: 50px; padding: 6px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #8fc3e8; letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeSlideUp 0.8s ease both;
        }
        .hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

        .hero-title {
          font-size: clamp(40px, 6vw, 80px); font-weight: 700; color: white;
          line-height: 1.05; letter-spacing: -1.5px; margin-bottom: 24px;
          animation: fadeSlideUp 0.8s 0.15s ease both;
        }
        .hero-title em { color: #8fc3e8; font-style: italic; }

        .hero-subtitle {
          font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 300;
          color: rgba(255,255,255,0.65); line-height: 1.7;
          max-width: 540px; margin-bottom: 48px;
          animation: fadeSlideUp 0.8s 0.3s ease both;
        }

        .hero-actions {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeSlideUp 0.8s 0.45s ease both;
        }

        .btn-primary {
          background: var(--gold); color: var(--blue-deep);
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
          padding: 16px 36px; border-radius: 50px; border: none;
          cursor: pointer; transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          letter-spacing: 0.2px;
        }
        .btn-primary:hover {
          background: #dfc068; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,76,0.35);
        }

        .btn-outline {
          background: transparent; color: white;
          font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 15px;
          padding: 15px 36px; border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer; transition: background 0.25s, border-color 0.25s;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.6); }

        .hero-stats {
          /* Natural flex child — always below .hero-content, never overlaps */
          width: 100%;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.1);
          animation: fadeSlideUp 0.8s 0.6s ease both;
          flex-shrink: 0;
        }
        .hero-stats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
          display: flex;
        }
        .stat-item {
          flex: 1; padding: 28px 24px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value { font-size: 32px; font-weight: 700; color: white; letter-spacing: -1px; line-height: 1; }
        .stat-label {
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: rgba(255,255,255,0.5); letter-spacing: 1px;
          text-transform: uppercase; margin-top: 6px;
        }

        /* ── ABOUT ─────────────────────────────────────────────────────── */
        .about { padding: 120px 48px; background: var(--white); }
        .about-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }

        /* FIX 4: .about-card previously had overflow:hidden, which clipped .about-badge
           (positioned at bottom:-20px). Fix: removed overflow:hidden from the card and
           moved the badge to be a sibling of .about-card inside .about-visual, which has
           padding-bottom to accommodate the badge height. */
        .about-visual { position: relative; padding-bottom: 36px; }
        .about-card {
          background: linear-gradient(145deg, var(--blue-deep), #1e4f7a);
          border-radius: 24px; padding: 60px 48px;
          color: white; position: relative;
        }
        .about-card::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px; border-radius: 50%;
          background: rgba(91,155,213,0.15); pointer-events: none;
        }
        .about-card-quote { font-size: 56px; line-height: 1; color: var(--gold); margin-bottom: 16px; }
        .about-card-text {
          font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.8;
          color: rgba(255,255,255,0.85); position: relative; z-index: 1;
        }
        /* Badge is now a sibling of .about-card — no longer clipped */
        .about-badge {
          position: absolute; bottom: 0; right: 32px;
          background: var(--gold); color: var(--blue-deep);
          border-radius: 16px; padding: 14px 22px;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
          box-shadow: 0 8px 32px rgba(201,168,76,0.4);
          display: flex; align-items: center; gap: 10px; white-space: nowrap;
        }

        .about-text-block { padding-left: 16px; }

        .section-tag {
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          color: var(--blue-soft); letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .section-tag::before { content: ''; display: block; width: 28px; height: 2px; background: var(--gold); flex-shrink: 0; }

        .section-title {
          font-size: clamp(28px, 4vw, 44px); font-weight: 700;
          color: var(--blue-deep); line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 20px;
        }
        .section-body {
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300;
          color: var(--text-mid); line-height: 1.8; margin-bottom: 32px;
        }
        .value-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .value-item {
          display: flex; align-items: flex-start; gap: 14px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.5;
        }
        .value-icon {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--blue-ghost);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; margin-top: 1px;
        }

        /* ── SERVICES ──────────────────────────────────────────────────── */
        .services { padding: 120px 48px; background: var(--blue-ghost); position: relative; }
        .services::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--blue-pale), transparent);
          pointer-events: none;
        }
        .services-inner { max-width: 1200px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 72px; }
        .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

        .service-card {
          background: white; border-radius: var(--radius); padding: 32px 28px;
          border: 1px solid rgba(30,80,140,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative; overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--blue-mid), var(--blue-soft));
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(30,80,140,0.12); }
        .service-card:hover::before { transform: scaleX(1); }
        .service-icon  { font-size: 32px; margin-bottom: 16px; line-height: 1; }
        .service-title { font-size: 17px; font-weight: 700; color: var(--blue-deep); margin-bottom: 10px; line-height: 1.2; }
        .service-desc  { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; color: var(--text-mid); line-height: 1.7; }

        /* ── CTA STRIP ─────────────────────────────────────────────────── */
        .cta-strip {
          background: linear-gradient(135deg, var(--blue-deep) 0%, #1e4f7a 100%);
          padding: 100px 48px; text-align: center; position: relative; overflow: hidden;
        }
        .cta-strip::before {
          content: '';
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(91,155,213,0.2), transparent);
          pointer-events: none;
        }
        .cta-strip-inner { max-width: 640px; margin: 0 auto; position: relative; z-index: 1; }
        .cta-title {
          font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: white;
          line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 16px;
        }
        .cta-sub {
          font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 300;
          color: rgba(255,255,255,0.65); margin-bottom: 40px; line-height: 1.6;
        }
        .cta-phone {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: rgba(255,255,255,0.5); letter-spacing: 1px;
          text-transform: uppercase; margin-top: 20px;
        }
        .cta-phone a { color: var(--gold); text-decoration: none; }
        .cta-phone a:hover { text-decoration: underline; }

        /* ── FOOTER ────────────────────────────────────────────────────── */
        .footer {
          background: #0d1f30; color: rgba(255,255,255,0.6);
          padding: 60px 48px 32px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px;
          padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: white; margin-bottom: 12px;
        }
        .footer-brand-desc { line-height: 1.8; max-width: 320px; margin-bottom: 20px; }
        .footer-phone { color: var(--gold); font-weight: 500; text-decoration: none; font-size: 16px; }
        .footer-phone:hover { text-decoration: underline; }
        .footer-col-title { color: white; font-weight: 600; font-size: 15px; margin-bottom: 20px; letter-spacing: 0.3px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: white; }
        .footer-bottom {
          max-width: 1200px; margin: 0 auto; padding-top: 28px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; color: rgba(255,255,255,0.3);
        }

        /* ── ANIMATIONS ────────────────────────────────────────────────── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible  { opacity: 1; transform: translateY(0); }
        .reveal-delay-1  { transition-delay: 0.1s; }
        .reveal-delay-2  { transition-delay: 0.2s; }
        .reveal-delay-3  { transition-delay: 0.3s; }
        .reveal-delay-4  { transition-delay: 0.4s; }
        .hamburger{
      display:none;background:none;border:none;
      font-size:22px;cursor:pointer;color:var(--bd);
      padding:6px;align-items:center;justify-content:center;
        /* ── RESPONSIVE ────────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .nav-links,
          .nav-cta { display: none; }
          .hamburger { display: flex; }
          .nav-cta          { display: none; }
          .hero-content     { padding: 120px 24px 48px; }
          .hero-stats-inner { padding: 0 24px; flex-wrap: wrap; }
          .stat-item        { flex: 50%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .stat-item:nth-child(3),
          .stat-item:last-child { border-bottom: none; }
          .about            { padding: 72px 24px; }
          .about-inner      { grid-template-columns: 1fr; gap: 60px; }
          .about-text-block { padding-left: 0; }
          .services         { padding: 72px 24px; }
          .services-grid    { grid-template-columns: repeat(2, 1fr); }
          .cta-strip        { padding: 72px 24px; }
          .footer           { padding: 48px 24px 24px; }
          .footer-inner     { grid-template-columns: 1fr; gap: 40px; }
          .footer-bottom    { flex-direction: column; gap: 8px; text-align: center; }
        }
        @media (max-width: 540px) {
          .services-grid        { grid-template-columns: 1fr; }
          .hero-actions         { flex-direction: column; }
          .btn-primary,
          .btn-outline          { text-align: center; width: 100%; }
          /* Hide decorative circles on small screens to prevent horizontal overflow */
          .hero-circles         { display: none; }
        }
      `}</style>

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={()=>navigate("Home")} style={{cursor:"pointer"}}>
           <span className="nav-logo-main">Blessed Hill</span>
           <span className="nav-logo-sub sans">Adult Family Home</span>
            </div>
          <ul className="nav-links">
            {NAV_LINKS.map((label) => (
              <li key={label}><a href="#" onClick={e=>{e.preventDefault();navigate(label);}}>{label}</a></li>
            ))}
          </ul>
          <button className="nav-cta" onClick={()=>navigate("Schedule a Tour")}>Schedule a Tour</button>
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

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="hero">
        {/* FIX 6: Sizes now passed as "Npx" strings — correct for React style width/height */}
        <div className="hero-circles" aria-hidden="true">
          {CIRCLE_SIZES.map((size) => (
            <div
              key={size}
              className="hero-circle"
              style={{ width: size, height: size, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
          ))}
          <div className="hero-orb" style={{ width: "300px", height: "300px", top: "20%", right: "15%" }} />
        </div>

        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" aria-hidden="true" />
            Licensed &amp; Trusted Care · Auburn, Washington
          </div>
          <h1 className="hero-title">
            Where Every Day Feels<br />
            <em>Like Home.</em>
          </h1>
          <p className="hero-subtitle">
            Compassionate, personalized adult care guided by Christian values — in a warm,
            serene neighborhood that feels like family.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>navigate("Schedule a Tour")}>Schedule a Free Tour</button>
            <button className="btn-outline"onClick={()=>navigate("Services")}>Learn About Our Services</button>
          </div>
        </div>

        <div className="hero-stats" aria-label="Facility highlights">
          <div className="hero-stats-inner">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label sans">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      {/* FIX 2: Inline ref callback writes directly into sectionRefs.current */}
      <section
        className="about"
        ref={(el) => { sectionRefs.current.about = el; }}
        data-section="about"
      >
        <div className="about-inner">
          <div className={`about-visual reveal${vis("about") ? " visible" : ""}`}>
            {/* FIX 4: Badge moved OUT of .about-card to avoid being clipped by overflow:hidden */}
            <div className="about-card">
              <div className="about-card-quote" aria-hidden="true">"</div>
              <p className="about-card-text">
                We thrive in creating a cozy and secure atmosphere for our adult residents,
                promoting their independence through compassionate and personalized care.
              </p>
            </div>
            <div className="about-badge">
              <span aria-hidden="true">✦</span> Guided by Christian Values
            </div>
          </div>

          <div className={`about-text-block reveal reveal-delay-2${vis("about") ? " visible" : ""}`}>
            <p className="section-tag">About Us</p>
            <h2 className="section-title">A Residential Home Built on <em>Compassion</em></h2>
            <p className="section-body">
              Blessed Hill Adult Family Home is a licensed residential care facility in Auburn,
              King County, Washington. We offer a full range of services to ensure each resident
              lives with dignity, comfort, and joy — in a home that truly feels like theirs.
            </p>
            <ul className="value-list">
              {VALUES.map(([icon, text]) => (
                <li key={text} className="value-item sans">
                  <span className="value-icon" aria-hidden="true">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section
        className="services"
        ref={(el) => { sectionRefs.current.services = el; }}
        data-section="services"
      >
        <div className="services-inner">
          <div className={`section-header reveal${vis("services") ? " visible" : ""}`}>
            <p className="section-tag" style={{ justifyContent: "center" }}>What We Offer</p>
            <h2 className="section-title">Comprehensive Care, <em>Every Day</em></h2>
            <p className="section-body" style={{ maxWidth: "560px", margin: "0 auto" }}>
              From daily living assistance to specialized medical support, our team is equipped
              to meet each resident's unique needs with warmth and expertise.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={`service-card reveal reveal-delay-${(i % 4) + 1}${vis("services") ? " visible" : ""}`}
              >
                <div className="service-icon" aria-hidden="true">{service.icon}</div>
                <div className="service-title">{service.title}</div>
                <p className="service-desc sans">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ──────────────────────────────────────────────────── */}
      <section
        className="cta-strip"
        ref={(el) => { sectionRefs.current.cta = el; }}
        data-section="cta"
      >
        <div className={`cta-strip-inner reveal${vis("cta") ? " visible" : ""}`}>
          <h2 className="cta-title">Ready to Find the Right Home for Your Loved One?</h2>
          <p className="cta-sub sans">
            Schedule a complimentary tour and see firsthand why families across King County trust Blessed Hill.
          </p>
          <button className="btn-primary" style={{ fontSize: "16px", padding: "18px 48px" }}>
            Book a Free Tour →
          </button>
          <p className="cta-phone sans">
            Or call us directly:&nbsp;
            <a href="tel:12533974881">253-397-4881</a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">Blessed Hill Adult Family Home</div>
            <p className="footer-brand-desc">
              A licensed residential care facility in Auburn, WA — providing compassionate,
              personalized adult care guided by Christian values.
            </p>
            <a href="tel:12533974881" className="footer-phone">253-397-4881</a>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              {NAV_LINKS.map((label) => (
                <li key={label}><a href="#" onClick={e=>{e.preventDefault();navigate(label);}}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            {/* Semantic: use <address> for contact info */}
            <address style={{ fontStyle: "normal", lineHeight: 1.9 }}>
              11803 SE 323rd PL<br />
              Auburn, WA 98092<br /><br />
              <a href="tel:12533974881" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                253-397-4881
              </a>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Blessed Hill Adult Family Home, LLC. All rights reserved.</span>
          <a href="#" onClick={e=>{e.preventDefault();navigate("Privacy Policy");}} style={{color:"rgba(255,255,255,.28)",textDecoration:"none"}}>Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
