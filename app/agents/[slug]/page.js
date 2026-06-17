import { notFound } from "next/navigation";
import { AGENTS } from "../../../lib/agents/config";
import { getPromptsByAgent, getPromptCategories } from "../../../lib/agents/prompts";

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.slug }));
}

export function generateMetadata({ params }) {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) return {};
  return { title: `${agent.name} — PV Partner AI` };
}

function PromptCard({ prompt, agentSlug }) {
  return (
    <div className="prompt-card">
      <h4>
        <span className="prompt-id">{prompt.id}</span>
        {prompt.title}
      </h4>
      <p className="prompt-text">{prompt.prompt}</p>
      <a
        href={`/chat/${agentSlug}?prompt=${prompt.id}`}
        className="btn-chat"
        style={{ marginTop: 12, display: "inline-flex", fontSize: 12 }}
      >
        Use in Chat
      </a>
    </div>
  );
}

export default function AgentDetailPage({ params }) {
  const agent = AGENTS.find((a) => a.slug === params.slug);
  if (!agent) notFound();

  const prompts = getPromptsByAgent(agent.slug);
  const categories = getPromptCategories(agent.slug);

  const promptsByCategory = {};
  for (const cat of categories) {
    promptsByCategory[cat] = prompts.filter((p) => p.category === cat);
  }

  return (
    <main>
      <div className="container">
        <div className="agent-detail">
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
            <a href="/agents" className="back-link" style={{ marginBottom: 0 }}>
              &larr; All Agents
            </a>
            <a href={`/chat/${agent.slug}`} className="btn-chat">
              Chat with {agent.name}
            </a>
          </div>

          <div className="agent-detail-header">
            <div className="agent-detail-icon" style={{ background: agent.color }}>
              {agent.name.charAt(0)}
            </div>
            <div className="agent-detail-info">
              <h1>{agent.name}</h1>
              <div className="role">{agent.role}</div>
              <p className="description">{agent.description}</p>
            </div>
          </div>

          <div className="system-prompt-section">
            <div className="system-prompt-box">
              <h3>System Prompt</h3>
              <pre className="system-prompt-text">{agent.systemPrompt}</pre>
            </div>
          </div>

          <section className="section" style={{ padding: "20px 0" }}>
            <h2 className="section-title" style={{ marginBottom: 32 }}>
              Prompts Library ({prompts.length})
            </h2>

            {categories.map((cat) => (
              <div key={cat} className="prompt-section">
                <h3 className="prompt-category">{cat}</h3>
                {promptsByCategory[cat].map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} agentSlug={agent.slug} />
                ))}
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
