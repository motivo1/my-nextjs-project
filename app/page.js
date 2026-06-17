import { AGENTS, COMPANY } from "../lib/agents/config";
import { getAllPrompts } from "../lib/agents/prompts";

export default function Home() {
  const totalPrompts = getAllPrompts().length;
  const categories = new Set(getAllPrompts().map((p) => p.category));

  return (
    <main>
      <div className="container">
        <section className="hero">
          <span className="hero-badge">Odoo Mentor & AI Manager for eCommerce</span>
          <h1>PV Partner AI Agents</h1>
          <p>
            10 AI manager agents for solar eCommerce — connected to your Odoo ERP at
            dev-erp.asunim.co and powered by OpenRouter.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">{AGENTS.length}</div>
              <div className="stat-label">Manager Agents</div>
            </div>
            <div className="stat">
              <div className="stat-value">{totalPrompts}</div>
              <div className="stat-label">Specialist Prompts</div>
            </div>
            <div className="stat">
              <div className="stat-value">{categories.size}</div>
              <div className="stat-label">Business Domains</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Manager Agents</h2>
              <p className="section-subtitle">
                Select an agent to chat — each one is a specialist for {COMPANY.domain}
              </p>
            </div>
          </div>
          <div className="agent-grid">
            {AGENTS.map((agent) => (
              <div key={agent.slug} className="agent-card" style={{ cursor: "default" }}>
                <div className="agent-card-header">
                  <div className="agent-icon" style={{ background: agent.color }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h3>{agent.name}</h3>
                    <div className="agent-role">{agent.role}</div>
                  </div>
                </div>
                <p className="agent-description">{agent.description}</p>
                <div className="agent-card-actions">
                  <a href={`/chat/${agent.slug}`} className="btn-chat">
                    Chat
                  </a>
                  <a href={`/agents/${agent.slug}`} className="btn-prompts">
                    Prompts
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Platform</h2>
              <p className="section-subtitle">
                {COMPANY.name} — {COMPANY.industry} on Odoo
              </p>
            </div>
          </div>
          <div className="agent-grid">
            <div className="agent-card" style={{ cursor: "default" }}>
              <h3 style={{ marginBottom: 12 }}>Products</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COMPANY.products.map((p) => (
                  <span
                    key={p}
                    style={{
                      padding: "4px 12px",
                      background: "var(--bg-hover)",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="agent-card" style={{ cursor: "default" }}>
              <h3 style={{ marginBottom: 12 }}>Brand Partners</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COMPANY.brands.map((b) => (
                  <span
                    key={b}
                    style={{
                      padding: "4px 12px",
                      background: "var(--bg-hover)",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="agent-card" style={{ cursor: "default" }}>
              <h3 style={{ marginBottom: 12 }}>Markets & Languages</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COMPANY.markets.map((m) => (
                  <span
                    key={m}
                    style={{
                      padding: "4px 12px",
                      background: "var(--bg-hover)",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    {m}
                  </span>
                ))}
                {COMPANY.languages.map((l) => (
                  <span
                    key={l}
                    style={{
                      padding: "4px 12px",
                      background: "var(--accent-glow)",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--accent)",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
