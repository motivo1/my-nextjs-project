import { LINKEDIN_PROFILE } from "../../lib/agents/linkedin-profile";

export const metadata = {
  title: "LinkedIn Profile Strategy — PV Partner AI",
};

export default function LinkedInPage() {
  return (
    <main>
      <div className="container">
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">LinkedIn Profile Strategy</h2>
              <p className="section-subtitle">
                Elite Odoo Mentor & AI Manager for eCommerce — Personal Brand Blueprint
              </p>
            </div>
          </div>

          <div className="linkedin-card">
            <h3>Headline</h3>
            <p style={{ fontSize: 18, color: "var(--text)", fontWeight: 600 }}>
              {LINKEDIN_PROFILE.headline}
            </p>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                Alternatives:
              </p>
              {LINKEDIN_PROFILE.headlineAlternatives.map((alt, i) => (
                <p key={i} style={{ fontSize: 14, marginBottom: 4 }}>
                  {i + 1}. {alt}
                </p>
              ))}
            </div>
          </div>

          <div className="linkedin-card">
            <h3>About Section</h3>
            <pre>{LINKEDIN_PROFILE.about}</pre>
          </div>

          <div className="linkedin-card">
            <h3>Experience Highlights</h3>
            {LINKEDIN_PROFILE.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 16 }}>{exp.title}</p>
                <p style={{ color: "#60a5fa", fontSize: 14, marginBottom: 8 }}>{exp.company}</p>
                <p style={{ fontSize: 14 }}>{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="linkedin-card">
            <h3>Featured Content</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 12,
                marginTop: 12,
              }}
            >
              {LINKEDIN_PROFILE.featured.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "#60a5fa",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                  <p
                    style={{
                      color: "var(--text)",
                      fontWeight: 600,
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="linkedin-card">
            <h3>Content Pillars</h3>
            <div className="pillar-grid">
              {LINKEDIN_PROFILE.contentPillars.map((pillar, i) => (
                <div key={i} className="pillar-card">
                  <h4>{pillar.pillar}</h4>
                  <div className="freq">{pillar.frequency}</div>
                  <ul>
                    {pillar.types.map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="linkedin-card">
            <h3>Top Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {LINKEDIN_PROFILE.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="linkedin-card">
            <h3>Hashtag Strategy</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {LINKEDIN_PROFILE.hashtags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(0, 119, 181, 0.1)",
                    border: "1px solid rgba(0, 119, 181, 0.3)",
                    borderRadius: 20,
                    fontSize: 13,
                    color: "#60a5fa",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
