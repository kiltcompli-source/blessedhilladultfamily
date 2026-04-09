import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/bwr.png";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Services", "Gallery", "Reviews", "Schedule a Tour", "Career", "Privacy Policy"];

const SECTIONS = [
  {
    id: "daily",
    number: "01",
    label: "Daily Living",
    headline: "Life's Essentials,\nHandled With Care",
    intro: "From the moment a resident wakes up to the time they rest at night, our caregivers are present — quietly ensuring comfort, routine, and dignity never waiver.",
    color: "#e8f0f8",
    accent: "#2e6da4",
    services: [
      {
        name: "24-Hour Personal Care",
        detail: "Our team works in rotating shifts to guarantee someone is always present — no gaps overnight, on weekends, or on holidays. Every handover is documented so caregivers always know your loved one's current status.",
        tags: ["Overnight staffing", "Holiday coverage", "Documented handovers"],
      },
      {
        name: "Bathing & Grooming Assistance",
        detail: "We support each resident with bathing, oral hygiene, hair care, and dressing — always respecting personal preferences, privacy, and individual routines. Our ADA-compliant bathrooms make this safe and comfortable.",
        tags: ["ADA bathrooms", "Privacy-first approach", "Adaptive clothing help"],
      },
      {
        name: "Three Daily Meals",
        detail: "Breakfast, lunch, and dinner are prepared fresh each day by our in-house staff. Menus are adapted for dietary restrictions — including diabetic-friendly, low-sodium, pureed, and soft-food options.",
        tags: ["Fresh daily preparation", "Dietary customization", "Hydration monitoring"],
      },
      {
        name: "Laundry & Housekeeping",
        detail: "Personal laundry is handled in our on-site washer and dryer. Rooms are tidied daily and linens changed weekly, keeping the home environment clean, fresh, and welcoming at all times.",
        tags: ["On-site laundry", "Daily tidying", "Weekly linen changes"],
      },
    ],
  },
  {
    id: "medical",
    number: "02",
    label: "Health & Medical",
    headline: "Precision Care,\nEvery Dose, Every Day",
    intro: "Managing health as one ages requires consistency, communication, and trained eyes. Our staff coordinate closely with physicians and families to stay ahead of every health need.",
    color: "#edf4ee",
    accent: "#1a6644",
    services: [
      {
        name: "Medication Management",
        detail: "Every medication is administered on schedule and logged in our records system. We handle prescription refills, communicate changes to families, and watch for side effects — so nothing falls through the cracks.",
        tags: ["Medication logs", "Refill coordination", "Side-effect monitoring"],
      },
      {
        name: "Routine Health Assessments",
        detail: "We monitor vitals, weight, and general health indicators regularly. Any changes are noted and communicated to the resident's physician and family, enabling early intervention before small issues become large ones.",
        tags: ["Blood pressure checks", "Weight tracking", "Physician coordination"],
      },
      {
        name: "Doctor Appointment Support",
        detail: "We schedule appointments, provide transportation, accompany residents, and return with documented care instructions. Families receive summaries after every visit so they are never out of the loop.",
        tags: ["Scheduling & transport", "Staff accompaniment", "Post-visit reporting"],
      },
      {
        name: "Fall Prevention & Safety",
        detail: "Every room is fitted with a panic button system that immediately alerts staff. We also run gentle mobility routines and conduct environmental audits to remove hazards before accidents occur.",
        tags: ["Panic button in every room", "Mobility exercises", "Environmental hazard audits"],
      },
    ],
  },
  {
    id: "memory",
    number: "03",
    label: "Specialized Care",
    headline: "Expert Support\nFor Complex Needs",
    intro: "Some residents need more than standard care. Our staff are specially trained in cognitive, behavioral, and developmental conditions — bringing expertise and patience to every interaction.",
    color: "#f5f0ea",
    accent: "#7d4e1a",
    services: [
      {
        name: "Dementia & Memory Care",
        detail: "We use structured daily routines, calm environments, and reassuring communication to help residents with dementia feel secure and oriented. Families receive regular updates on mood, cognition, and behavioral changes.",
        tags: ["Routine-based scheduling", "Cognitive engagement", "Family progress updates"],
      },
      {
        name: "Mental Health Support",
        detail: "For residents managing depression, anxiety, or other mental health conditions, we provide a stable and low-stimulation environment, coordinate with mental health professionals, and monitor behavioral patterns closely.",
        tags: ["Behavioral monitoring", "Counselor coordination", "Calm living spaces"],
      },
      {
        name: "Developmental Disability Care",
        detail: "Each resident's care plan is built around their unique strengths and needs. We focus on fostering independence, dignity, and daily achievement — celebrating what each resident can do.",
        tags: ["Individualized care plans", "Skill-building activities", "Family collaboration"],
      },
      {
        name: "Hospice & End-of-Life Support",
        detail: "In partnership with licensed hospice providers, we ensure every resident in their final chapter receives comfort, peace, and dignity. We also provide guidance and emotional support for families during this time.",
        tags: ["Comfort-focused care", "Hospice coordination", "Family support & guidance"],
      },
    ],
  },
  {
    id: "social",
    number: "04",
    label: "Social & Lifestyle",
    headline: "Days Filled With\nMeaning & Joy",
    intro: "Wellbeing isn't only about physical health. We invest in our residents' happiness — creating a calendar of activities, connections, and experiences that make every day worth living.",
    color: "#f0eef8",
    accent: "#4a3580",
    services: [
      {
        name: "Activities & Recreation",
        detail: "Our weekly activity calendar includes music sessions, arts and crafts, card and board games, light exercise, seasonal celebrations, and themed events. Activities are designed around individual interests and abilities.",
        tags: ["Daily activity calendar", "Seasonal events", "Interest-based programming"],
      },
      {
        name: "Transportation & Outings",
        detail: "We arrange and accompany residents on rides to medical appointments, places of worship, community events, and personal errands — keeping them connected to the world around them.",
        tags: ["Medical transport", "Community outings", "Religious service access"],
      },
      {
        name: "Companionship & Connection",
        detail: "Our caregivers build real relationships with residents — sharing meals, stories, and quiet moments. We also welcome family visits and coordinate with loved ones to keep communication warm and frequent.",
        tags: ["One-on-one time", "Family visit coordination", "Pet-friendly home"],
      },
      {
        name: "Entertainment & Enrichment",
        detail: "Residents enjoy access to cable television, streaming, a library of books and puzzles, and music therapy sessions. We tailor entertainment options to each resident's tastes and cognitive needs.",
        tags: ["TV & streaming", "Books & puzzles library", "Music therapy"],
      },
    ],
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BlessedHillServices({ navigate = () => {} }) {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItems, setOpenItems]     = useState({});
  const [activeSection, setActive]    = useState("daily");
  const [visibleIds, setVisibleIds]   = useState(new Set());
  const sectionRefs                   = useRef({});

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Observer: track which sections are in view for sidebar highlight + reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.dataset.sid;
            setActive(id);
            setVisibleIds((prev) => prev.has(id) ? prev : new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px" }
    );
    const timer = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    }, 60);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  const toggleItem = (sid, idx) => {
    const key = `${sid}-${idx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const isOpen = (sid, idx) => !!openItems[`${sid}-${idx}`];
  const vis    = (id) => visibleIds.has(id);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#fafafa", color: "#1a2b3c", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-deep:  #1a3a5c;
          --blue-mid:   #2e6da4;
          --blue-soft:  #5b9bd5;
          --bs:         #5b9bd5;
          --white:      #ffffff;
          --cream:      #faf8f4;
          --text-dark:  #1a2b3c;
          --text-mid:   #4a6278;
          --text-light: #8a9dae;
          --gold:       #c9a84c;
          --border:     rgba(30,80,140,0.09);
        }
        .sans { font-family: 'DM Sans', sans-serif; }
        body { overflow-x: hidden; }
        /* ── NAV ───────────────────────────────────────────────────────── */

         .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 300;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(12px);
          transition: background 0.4s ease, box-shadow 0.4s ease;
          padding: 0 48px;
        }
        .nav.scrolled { box-shadow: 0 2px 24px rgba(30,80,140,0.10); }
        .nav-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 80px;
          height: 72px;
        }
        .nav-logo-main {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.3px;
          color: var(--bd); /* #1a3a5c */
        }

        .nav-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--bs); /* #5b9bd5 */
        }
        .nav-links { display: flex; gap: 28px; list-style: none; }
        .nav-links a {
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
          color: var(--text-mid); text-decoration: none; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--blue-mid); }
        .nav-links a.active { color: var(--blue-deep); font-weight: 600; border-bottom: 2px solid var(--gold); padding-bottom: 2px; }
        .nav-cta {
          background: var(--blue-deep); color: white;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          border: none; border-radius: 50px; padding: 9px 22px;
          cursor: pointer; transition: background 0.2s, transform 0.2s;
        }
        .nav-cta:hover { background: var(--blue-mid); transform: translateY(-1px); }

        /* ── TOP BAND ──────────────────────────────────────────────────── */
        /* Light warm cream band — totally different from dark Home hero */
        .top-band {
          background: var(--cream);
          border-bottom: 1px solid rgba(201,168,76,0.2);
          padding: 140px 48px 72px;
          position: relative; overflow: hidden;
        }
        .top-band-grid {
          max-width: 1340px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 380px; gap: 80px; align-items: end;
        }
        /* Large decorative text behind headline */
        .top-band-ghost {
          position: absolute; top: 40px; right: 40px;
          font-size: clamp(100px, 14vw, 180px); font-weight: 700; line-height: 1;
          color: rgba(201,168,76,0.07); letter-spacing: -6px;
          pointer-events: none; user-select: none;
          font-family: 'Playfair Display', serif;
        }
        .top-kicker {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 3px; text-transform: uppercase; color: var(--gold);
          margin-bottom: 20px; display: flex; align-items: center; gap: 12px;
        }
        .top-kicker::before { content: ''; display: block; width: 32px; height: 1.5px; background: var(--gold); }
        .top-headline {
          font-size: clamp(36px, 5vw, 68px); font-weight: 700; line-height: 1.05;
          color: var(--blue-deep); letter-spacing: -1.5px;
        }
        .top-headline em { font-style: italic; color: var(--blue-mid); }
        .top-body {
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300;
          color: var(--text-mid); line-height: 1.8; margin-top: 24px; max-width: 540px;
        }
        /* Right side: index cards */
        .top-index {
          display: flex; flex-direction: column; gap: 3px;
          border-left: 1px solid rgba(30,80,140,0.12); padding-left: 32px;
        }
        .top-index-item {
          display: flex; align-items: center; gap: 14px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          color: var(--text-light); padding: 10px 0;
          border-bottom: 1px solid rgba(30,80,140,0.06);
          cursor: pointer; transition: color 0.2s; text-decoration: none;
        }
        .top-index-item:last-child { border-bottom: none; }
        .top-index-item:hover { color: var(--blue-mid); }
        .top-index-num {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: var(--gold); width: 28px; flex-shrink: 0;
        }

        /* ── MAIN LAYOUT: sidebar + content ───────────────────────────── */
        .page-body {
          max-width: 1340px; margin: 0 auto; padding: 0 48px;
          display: grid; grid-template-columns: 200px 1fr; gap: 0;
          position: relative;
        }

        /* Sticky sidebar — floats beside the scrolling content */
        .sidebar {
          position: sticky; top: 100px; height: fit-content;
          padding: 48px 0 0; align-self: start;
        }
        .sidebar-label {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-light);
          margin-bottom: 20px;
        }
        .sidebar-items { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .sidebar-item {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          color: var(--text-light); padding: 8px 12px; border-radius: 8px;
          cursor: pointer; border: none; background: none; text-align: left; width: 100%;
          transition: color 0.2s, background 0.2s;
        }
        .sidebar-item:hover { color: var(--blue-mid); background: rgba(46,109,164,0.05); }
        .sidebar-item.active { color: var(--blue-deep); background: rgba(46,109,164,0.08); font-weight: 600; }
        .sidebar-pip {
          width: 6px; height: 6px; border-radius: 50%; background: var(--border);
          flex-shrink: 0; transition: background 0.2s;
        }
        .sidebar-item.active .sidebar-pip { background: var(--gold); }
        .sidebar-progress {
          margin-top: 32px; padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .sidebar-progress-label {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase; color: var(--text-light);
          margin-bottom: 10px;
        }
        .progress-bar-track {
          width: 100%; height: 3px; background: var(--border); border-radius: 2px;
        }
        .progress-bar-fill {
          height: 100%; background: var(--gold); border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* ── SERVICE SECTIONS ──────────────────────────────────────────── */
        .content-area { border-left: 1px solid var(--border); }

        .service-section {
          padding: 80px 0 80px 64px;
          border-bottom: 1px solid var(--border);
          position: relative;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.025s ease, transform 0.025s ease;
        }
        .service-section.visible { opacity: 1; transform: translateY(0); }

        /* Giant number — the visual identity of this page */
        .section-number {
          font-family: 'Playfair Display', serif;
          font-size: 120px; font-weight: 700; line-height: 0.85;
          color: rgba(30,80,140,0.06); letter-spacing: -4px;
          position: absolute; top: 60px; right: 0;
          pointer-events: none; user-select: none;
        }

        .section-top {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: start; margin-bottom: 56px;
        }
        .section-kicker {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase;
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .kicker-bar { display: block; width: 20px; height: 2px; }
        .section-headline {
          font-size: clamp(26px, 3.5vw, 44px); font-weight: 700;
          color: var(--blue-deep); line-height: 1.1; letter-spacing: -0.5px;
          white-space: pre-line;
        }
        .section-intro {
          font-family: 'DM Sans', sans-serif; font-size: 15.5px; font-weight: 300;
          color: var(--text-mid); line-height: 1.85;
          padding-top: 8px;
        }

        /* Accordion service items */
        .accordion { display: flex; flex-direction: column; gap: 2px; }
        .accordion-item {
          border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .accordion-item.open {
          border-color: rgba(46,109,164,0.2);
          box-shadow: 0 4px 20px rgba(30,80,140,0.07);
        }
        .accordion-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; background: white;
          border: none; cursor: pointer; text-align: left;
          gap: 16px; transition: background 0.2s;
        }
        .accordion-trigger:hover { background: #f7faff; }
        .accordion-item.open .accordion-trigger { background: #f4f8ff; }
        .accordion-name {
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: var(--blue-deep);
        }
        .accordion-chevron {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(30,80,140,0.07);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 11px; color: var(--blue-mid);
          transition: transform 0.3s ease, background 0.2s;
        }
        .accordion-item.open .accordion-chevron {
          transform: rotate(180deg); background: var(--blue-mid); color: white;
        }
        .accordion-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
          background: white;
        }
        .accordion-item.open .accordion-body { max-height: 300px; }
        .accordion-content { padding: 0 24px 24px; }
        .accordion-detail {
          font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 300;
          color: var(--text-mid); line-height: 1.8; margin-bottom: 16px;
        }
        .accordion-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          color: var(--blue-mid); background: rgba(46,109,164,0.08);
          border-radius: 50px; padding: 4px 12px; letter-spacing: 0.2px;
        }

        /* ── ROOMS INTERLUDE ───────────────────────────────────────────── */
        /* Full-width cream break — feels like a page turn */
        .rooms-interlude {
          background: var(--cream);
          border-top: 1px solid rgba(201,168,76,0.15);
          border-bottom: 1px solid rgba(201,168,76,0.15);
          padding: 100px 48px;
          margin: 0;
        }
        .rooms-inner { max-width: 1340px; margin: 0 auto; }
        .rooms-top {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: center; margin-bottom: 64px;
        }
        .rooms-headline {
          font-size: clamp(30px, 4vw, 52px); font-weight: 700;
          color: var(--blue-deep); line-height: 1.1; letter-spacing: -1px;
        }
        .rooms-headline em { font-style: italic; color: var(--blue-mid); }
        .rooms-body {
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300;
          color: var(--text-mid); line-height: 1.8;
        }
        .rooms-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .room-card {
          background: white; border-radius: 20px; padding: 40px 36px;
          border: 1px solid var(--border);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .room-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,80,140,0.09); }
        .room-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25);
          border-radius: 50px; padding: 4px 14px; margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase; color: #8a6b20;
        }
        .room-title { font-size: 22px; font-weight: 700; color: var(--blue-deep); margin-bottom: 10px; }
        .room-desc {
          font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 300;
          color: var(--text-mid); line-height: 1.75; margin-bottom: 24px;
        }
        .room-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .room-feat {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--text-mid);
        }
        .feat-check {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(46,109,164,0.1); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: var(--blue-mid);
        }

        /* ── CLOSING PROMISE ───────────────────────────────────────────── */
        /* Dark section — but used sparingly, only here, not like Home hero */
        .promise-section {
          background: var(--blue-deep);
          padding: 100px 48px; position: relative; overflow: hidden;
        }
        .promise-section::before {
          content: '';
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 40%; background: rgba(255,255,255,0.02);
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .promise-inner {
          max-width: 1340px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .promise-label {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold);
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }
        .promise-label::before { content: ''; display: block; width: 24px; height: 1.5px; background: var(--gold); }
        .promise-headline {
          font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: white;
          line-height: 1.1; letter-spacing: -0.8px;
        }
        .promise-headline em { font-style: italic; color: rgba(143,195,232,0.9); }
        .promise-right {}
        .promise-text {
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300;
          color: rgba(255,255,255,0.65); line-height: 1.85; margin-bottom: 36px;
        }
        .btn-gold {
          background: var(--gold); color: var(--blue-deep);
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
          padding: 16px 40px; border-radius: 50px; border: none;
          cursor: pointer; transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .btn-gold:hover { background: #dfc068; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.4); }
        .promise-contact {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: rgba(255,255,255,0.4); letter-spacing: 0.5px;
          margin-top: 16px;
        }
        .promise-contact a { color: rgba(201,168,76,0.85); text-decoration: none; }
        .promise-contact a:hover { text-decoration: underline; }

        /* ── FOOTER ────────────────────────────────────────────────────── */
        .footer {
          background: #0b1a27; color: rgba(255,255,255,0.55);
          padding: 56px 48px 28px;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px;
        }
        .footer-inner {
          max-width: 1340px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px;
          padding-bottom: 44px; border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .footer-brand { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: white; margin-bottom: 10px; }
        .footer-desc  { line-height: 1.8; max-width: 300px; margin-bottom: 18px; }
        .footer-tel   { color: var(--gold); font-weight: 500; text-decoration: none; font-size: 15px; }
        .footer-tel:hover { text-decoration: underline; }
        .footer-col-h { color: white; font-weight: 600; font-size: 14px; margin-bottom: 18px; letter-spacing: 0.2px; }
        .footer-list  { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .footer-list a { color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
        .footer-list a:hover { color: white; }
        .footer-base {
          max-width: 1340px; margin: 0 auto; padding-top: 24px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: rgba(255,255,255,0.28);
        }

        /* ── ANIMATIONS ────────────────────────────────────────────────── */
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeUp 0.7s ease both; }
        .fade-in-1 { animation-delay: 0.1s; }
        .fade-in-2 { animation-delay: 0.25s; }
        .fade-in-3 { animation-delay: 0.4s; }
                .hamburger{
            display:none; background:none; border:none;
            font-size:22px; cursor:pointer; color:var(--blue-deep);
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
          .mobile-link.active-link{color:var(--gold);font-weight:500}
        /* ── RESPONSIVE ────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .page-body              { grid-template-columns: 1fr; }
          .sidebar                { display: none; }
          .content-area           { border-left: none; }
          .service-section        { padding: 64px 0; }
          .section-number         { font-size: 80px; }
          .section-top            { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 900px) {
          .nav-logo-main { font-size: 16px; }
          .nav-logo-sub  { font-size: 10px; }
          .nav-links,.nav-cta{display:none}
          .hamburger{display:flex}
          .nav-links, .nav-cta    { display: none; }
          .top-band               { padding: 120px 24px 60px; }
          .top-band-grid          { grid-template-columns: 1fr; gap: 40px; }
          .top-index              { border-left: none; padding-left: 0; border-top: 1px solid rgba(30,80,140,0.1); padding-top: 24px; }
          .page-body              { padding: 0 24px; }
          .rooms-interlude        { padding: 72px 24px; }
          .rooms-top              { grid-template-columns: 1fr; gap: 24px; }
          .rooms-cards            { grid-template-columns: 1fr; }
          .promise-section        { padding: 72px 24px; }
          .promise-inner          { grid-template-columns: 1fr; gap: 40px; }
          .footer                 { padding: 48px 24px 24px; }
          .footer-inner           { grid-template-columns: 1fr; gap: 36px; }
          .footer-base            { flex-direction: column; gap: 8px; text-align: center; }
          .nav { padding: 0 20px; }
          .nav-inner { height: 64px; gap: 12px; }
          .nav-logo-img { height: 52px !important; }
        }
          @media (max-width: 540px) {
          .nav-inner { height: 56px; gap: 8px; }
          .nav-logo-img { height: 44px !important; }
        }
           @media(max-width:480px){.why-grid{grid-template-columns:1fr}}
      `}</style>

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
                <a href="#" className={label==="Services"?"active":""} onClick={e=>{e.preventDefault();navigate(label);}}>
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
        className={`mobile-link sans${l==="Services" ? " active-link" : ""}`} 
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


      {/* ── TOP BAND ───────────────────────────────────────────────────── */}
      <header className="top-band">
        <div className="top-band-ghost" aria-hidden="true">CARE</div>
        <div className="top-band-grid">
          <div>
            <p className="top-kicker sans fade-in">What We Provide</p>
            <h1 className="top-headline fade-in fade-in-1">
              A Complete Spectrum<br />of <em>Compassionate</em> Care
            </h1>
            <p className="top-body sans fade-in fade-in-2">
              Every resident of Blessed Hill receives a fully personalized care plan built from four pillars — daily living, health management, specialized support, and social enrichment. Explore each below.
            </p>
          </div>
          {/* Quick-jump index — unique to this page */}
          <nav className="top-index fade-in fade-in-3" aria-label="Jump to section">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                className="top-index-item sans"
                href="#"
                onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
              >
                <span className="top-index-num">{s.number}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN BODY ──────────────────────────────────────────────────── */}
      <div className="page-body">

        {/* Sticky sidebar */}
        <aside className="sidebar" aria-label="Page sections">
          <p className="sidebar-label sans">On this page</p>
          <ul className="sidebar-items">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  className={`sidebar-item sans${activeSection === s.id ? " active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="sidebar-pip" aria-hidden="true" />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="sidebar-progress">
            <p className="sidebar-progress-label sans">Progress</p>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((SECTIONS.findIndex(s => s.id === activeSection) + 1) / SECTIONS.length) * 100}%`
                }}
              />
            </div>
          </div>
        </aside>

        {/* Scrolling content */}
        <div className="content-area">
          {SECTIONS.map((sec) => (
            <section
              key={sec.id}
              className={`service-section${vis(sec.id) ? " visible" : ""}`}
              ref={(el) => { sectionRefs.current[sec.id] = el; }}
              data-sid={sec.id}
            >
              {/* Ghost number */}
              <div className="section-number" aria-hidden="true">{sec.number}</div>

              {/* Two-column top: headline left, intro right */}
              <div className="section-top">
                <div>
                  <p className="section-kicker sans" style={{ color: sec.accent }}>
                    <span className="kicker-bar" style={{ background: sec.accent }} />
                    {sec.label}
                  </p>
                  <h2 className="section-headline">{sec.headline}</h2>
                </div>
                <p className="section-intro sans">{sec.intro}</p>
              </div>

              {/* Accordion services */}
              <div className="accordion" role="list">
                {sec.services.map((svc, i) => (
                  <div
                    key={svc.name}
                    className={`accordion-item${isOpen(sec.id, i) ? " open" : ""}`}
                    role="listitem"
                  >
                    <button
                      className="accordion-trigger"
                      onClick={() => toggleItem(sec.id, i)}
                      aria-expanded={isOpen(sec.id, i)}
                    >
                      <span className="accordion-name sans">{svc.name}</span>
                      <span className="accordion-chevron" aria-hidden="true">▾</span>
                    </button>
                    <div className="accordion-body" aria-hidden={!isOpen(sec.id, i)}>
                      <div className="accordion-content">
                        <p className="accordion-detail sans">{svc.detail}</p>
                        <div className="accordion-tags">
                          {svc.tags.map((t) => (
                            <span key={t} className="tag sans">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── ROOMS INTERLUDE ────────────────────────────────────────────── */}
      <section className="rooms-interlude">
        <div className="rooms-inner">
          <div className="rooms-top">
            <h2 className="rooms-headline">Your Loved One's<br /><em>Room & Space</em></h2>
            <p className="rooms-body sans">
              Residents can choose between a private room or a comfortable shared double room. Both options are fully furnished, safety-equipped with panic buttons, and designed to feel personal and warm — not institutional.
            </p>
          </div>
          <div className="rooms-cards">
            {[
              {
                badge: "🚪  Private Room",
                title: "Your Own Space",
                desc: "Ideal for residents who value personal space, privacy, and the ability to personalize their surroundings with familiar belongings.",
                features: ["Private en-suite bathroom", "Personalized décor welcome", "Panic button system", "Natural window light"],
              },
              {
                badge: "🛏️  Shared Room",
                title: "Companionship & Value",
                desc: "A comfortable shared space, carefully matched with a compatible roommate. Great for sociable residents — and a more affordable option.",
                features: ["Semi-private shared layout", "Shared bathroom nearby", "Panic button system", "Budget-friendly option"],
              },
            ].map((r) => (
              <div key={r.title} className="room-card">
                <div className="room-badge sans">{r.badge}</div>
                <div className="room-title">{r.title}</div>
                <p className="room-desc sans">{r.desc}</p>
                <ul className="room-features">
                  {r.features.map((f) => (
                    <li key={f} className="room-feat sans">
                      <span className="feat-check" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING PROMISE ────────────────────────────────────────────── */}
      <section className="promise-section">
        <div className="promise-inner">
          <div>
            <p className="promise-label sans">Our Commitment</p>
            <h2 className="promise-headline">
              See It For Yourself.<br /><em>Tour Our Home.</em>
            </h2>
          </div>
          <div className="promise-right">
            <p className="promise-text sans">
              Reading about care is one thing — experiencing it is another. We invite you and your family to visit Blessed Hill in person. Walk through our rooms, meet our caregivers, ask every question you have. There's no obligation, just an open door.
            </p>
            <button className="btn-gold sans" onClick={()=>navigate("Schedule a Tour")}>Book a Free Tour →</button>
            <p className="promise-contact sans">
              Or call anytime: <a href="tel:12533974881">253-397-4881</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Blessed Hill Adult Family Home</div>
            <p className="footer-desc">Licensed residential adult care in Auburn, WA — guided by Christian values and a deep commitment to dignity.</p>
            <a href="tel:12533974881" className="footer-tel">253-397-4881</a>
          </div>
          <div>
            <div className="footer-col-h">Quick Links</div>
            <ul className="footer-list">
              {NAV_LINKS.map((l) => <li key={l}><a href="#" onClick={e=>{e.preventDefault();navigate(l);}}>{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-h">Find Us</div>
            <address style={{ fontStyle: "normal", lineHeight: 1.9, color: "rgba(255,255,255,0.5)" }}>
              11803 SE 323rd PL<br />Auburn, WA 98092<br /><br />
              <a href="tel:12533974881" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>253-397-4881</a>
            </address>
          </div>
        </div>
        <div className="footer-base sans">
          <span>© 2026 Blessed Hill Adult Family Home, LLC. All rights reserved.</span>
          <a href="#" onClick={e=>{e.preventDefault();navigate("Privacy Policy");}} style={{ color: "rgba(255,255,255,0.28)", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}
