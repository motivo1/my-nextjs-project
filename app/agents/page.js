import { AGENTS } from "../../lib/agents/config";
import { getPromptsByAgent, getPromptCategories } from "../../lib/agents/prompts";

export const metadata = {
  title: "Manager Agents — PV Partner AI",
};

export default function AgentsPage() {
  return (
    <main>
      <div className="container">
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">All Manager Agents</h2>
              <p className="section-subtitle">
                {AGENTS.length} specialized AI agents managing solar eCommerce operations
              </p>
            </div>
          </div>
          <div className="agent-grid">
            {AGENTS.map((agent) => {
              const prompts = getPromptsByAgent(agent.slug);
              const categories = getPromptCategories(agent.slug);
              return (
                <a key={agent.slug} href={`/agents/${agent.slug}`} className="agent-card">
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
                  <div className="agent-meta">
                    <span>{prompts.length} prompts</span>
                    <span>{categories.length} categories</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
