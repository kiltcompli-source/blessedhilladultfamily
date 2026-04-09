import { useState } from "react";

/* ─── PROJECT DATA ───────────────────────────── */

const PROJECTS = [
  {
    id: "01",
    title: "Gym Rebrand Website",
    tag: "BUSINESS WEBSITE",
    problem: "Outdated site, poor mobile UX, no conversion flow.",
    solution: "Redesigned UX, added WhatsApp CTA, optimized performance.",
    results: ["+65% inquiries", "2.1s load time", "Mobile-first rebuild"],
    stack: ["React", "Node", "M-Pesa"],
    accent: "#00C48C",
    images: {
      hero: "/images/gym-desktop.jpg",
      mobile: "/images/gym-mobile.jpg",
    },
  },
  {
    id: "02",
    title: "E-commerce Store",
    tag: "ONLINE STORE",
    problem: "Manual order handling, no online presence.",
    solution: "Built full store with payments + dashboard.",
    results: ["M-Pesa integration", "Admin dashboard", "Real-time orders"],
    stack: ["React", "Express", "PostgreSQL"],
    accent: "#E85D26",
    images: {
      hero: "/images/ecommerce-desktop.jpg",
    },
  },
];

/* ─── CARD ─────────────────────────────────── */

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={() => onClick(project)}
      style={{
        border: "1px solid var(--border)",
        padding: 40,
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <span style={{ color: project.accent }}>{project.id}</span>

      <h2 style={{ fontFamily: "Orbitron", marginTop: 10 }}>
        {project.title}
      </h2>

      <p style={{ opacity: 0.6 }}>{project.tag}</p>

      <button style={{
        marginTop: 20,
        border: `1px solid ${project.accent}`,
        padding: "10px 20px",
        background: "transparent",
        color: project.accent
      }}>
        VIEW CASE →
      </button>
    </div>
  );
}

/* ─── CASE STUDY ───────────────────────────── */

function CaseStudy({ project, onClose }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.95)",
      zIndex: 999,
      overflowY: "auto"
    }}>
      <button onClick={onClose} style={{
        position: "fixed",
        top: 30,
        right: 40,
        fontSize: 20,
        background: "none",
        border: "none",
        color: "#fff",
        cursor: "pointer"
      }}>
        ✕
      </button>

      <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "80px 40px"
      }}>

        {/* HERO IMAGE */}
        {project.images?.hero && (
          <img
            src={project.images.hero}
            alt=""
            style={{
              width: "100%",
              marginBottom: 40,
              border: "1px solid var(--border)"
            }}
          />
        )}

        <h1 style={{ fontFamily: "Orbitron", fontSize: "50px" }}>
          {project.title}
        </h1>

        <p style={{ opacity: 0.6 }}>{project.tag}</p>

        <section style={{ marginTop: 40 }}>
          <h3>Problem</h3>
          <p>{project.problem}</p>
        </section>

        <section style={{ marginTop: 40 }}>
          <h3>Solution</h3>
          <p>{project.solution}</p>
        </section>

        {project.images?.mobile && (
          <div style={{ marginTop: 40 }}>
            <img
              src={project.images.mobile}
              alt=""
              style={{ width: 300 }}
            />
          </div>
        )}

        <section style={{ marginTop: 40 }}>
          <h3>Results</h3>
          {project.results.map((r, i) => (
            <p key={i} style={{ color: project.accent }}>
              • {r}
            </p>
          ))}
        </section>

        <section style={{ marginTop: 40 }}>
          <h3>Stack</h3>
          {project.stack.map((s, i) => (
            <span key={i} style={{ marginRight: 10 }}>
              {s}
            </span>
          ))}
        </section>

        <div style={{ marginTop: 60 }}>
          <a href="/contact" style={{
            padding: "15px 30px",
            background: project.accent,
            color: "#fff",
            textDecoration: "none"
          }}>
            START SIMILAR PROJECT →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────── */

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div style={{ padding: "100px 40px" }}>
      <h1 style={{
        fontFamily: "Orbitron",
        fontSize: "70px",
        marginBottom: 60
      }}>
        Case Files.
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20
      }}>
        {PROJECTS.map(p => (
          <ProjectCard key={p.id} project={p} onClick={setActiveProject} />
        ))}
      </div>

      {activeProject && (
        <CaseStudy
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}