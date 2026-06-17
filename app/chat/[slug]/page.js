"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AGENTS } from "../../../lib/agents/config";
import { PROMPTS } from "../../../lib/agents/prompts";

const ODOO_ACTIONS = [
  { key: "products", label: "Products", icon: "P" },
  { key: "orders", label: "Sale Orders", icon: "O" },
  { key: "contacts", label: "Contacts", icon: "C" },
  { key: "invoices", label: "Invoices", icon: "I" },
  { key: "inventory", label: "Inventory", icon: "S" },
  { key: "leads", label: "CRM Leads", icon: "L" },
];

export default function ChatPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const agent = AGENTS.find((a) => a.slug === slug);
  const agentPrompts = PROMPTS[slug] || [];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [odooData, setOdooData] = useState(null);
  const [odooLoading, setOdooLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const promptId = searchParams.get("prompt");
    if (promptId) {
      const prompt = agentPrompts.find((p) => p.id === promptId);
      if (prompt) setInput(prompt.prompt);
    }
  }, [searchParams, agentPrompts]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOdooData = useCallback(async (action) => {
    setOdooLoading(true);
    try {
      const res = await fetch("/api/odoo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, limit: 10 }),
      });
      const data = await res.json();
      if (data.error) {
        setOdooData({ action, error: data.error });
      } else {
        setOdooData({ action, records: data.data, count: data.count });
      }
    } catch (err) {
      setOdooData({ action, error: err.message });
    }
    setOdooLoading(false);
  }, []);

  const injectOdooContext = useCallback(() => {
    if (!odooData?.records) return;
    const summary = JSON.stringify(odooData.records, null, 2);
    const context = `\n\n[Odoo ${odooData.action} data - ${odooData.count} records]:\n\`\`\`json\n${summary}\n\`\`\``;
    setInput((prev) => prev + context);
    setOdooData(null);
  }, [odooData]);

  const sendMessage = useCallback(
    async (e) => {
      e?.preventDefault();
      const content = input.trim();
      if (!content || isStreaming) return;

      const userMsg = { role: "user", content, id: Date.now() };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setIsStreaming(true);

      const assistantId = Date.now() + 1;
      setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId }]);

      try {
        const chatMessages = history.map(({ role, content }) => ({ role, content }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentSlug: slug, messages: chatMessages }),
        });

        if (!res.ok) {
          const err = await res.json();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: `Error: ${err.error}` } : m
            )
          );
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed === "data: [DONE]") break;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              if (json.error) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + `\n\nError: ${json.error}` } : m
                  )
                );
                break;
              }
              if (json.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + json.content } : m
                  )
                );
              }
            } catch {
              // partial JSON
            }
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: `Connection error: ${err.message}` } : m
          )
        );
      }

      setIsStreaming(false);
      inputRef.current?.focus();
    },
    [input, isStreaming, messages, slug]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  if (!agent) {
    return (
      <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1>Agent not found</h1>
        <a href="/" style={{ marginTop: 16, display: "inline-block" }}>Back to Dashboard</a>
      </main>
    );
  }

  return (
    <div className="chat-layout">
      <div className="chat-main">
        <div className="chat-header">
          <a href="/" className="back-link">&larr;</a>
          <div className="chat-header-icon" style={{ background: agent.color }}>
            {agent.name.charAt(0)}
          </div>
          <div className="chat-header-info">
            <h2>{agent.name}</h2>
            <span>{agent.role}</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Prompts & Odoo Data"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-icon" style={{ background: agent.color }}>
                {agent.name.charAt(0)}
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.description}</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>
                Send a message or pick a prompt from the sidebar to get started.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message chat-message-${msg.role}`}>
              <div className="chat-message-role">
                {msg.role === "user" ? "You" : agent.name}
              </div>
              <div className="chat-message-content">
                {msg.content || (isStreaming && msg.role === "assistant" ? "..." : "")}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={sendMessage}>
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name}...`}
            rows={3}
            disabled={isStreaming}
          />
          <button className="chat-send" type="submit" disabled={isStreaming || !input.trim()}>
            {isStreaming ? "..." : "Send"}
          </button>
        </form>
      </div>

      {sidebarOpen && (
        <div className="chat-sidebar">
          <div className="chat-sidebar-section">
            <h4>Odoo Data</h4>
            <p className="chat-sidebar-hint">
              Fetch live data from dev-erp.asunim.co and inject it into your message.
            </p>
            <div className="odoo-actions">
              {ODOO_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  className="odoo-action-btn"
                  onClick={() => fetchOdooData(a.key)}
                  disabled={odooLoading}
                >
                  <span className="odoo-action-icon">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
            {odooData && (
              <div className="odoo-result">
                {odooData.error ? (
                  <p className="odoo-error">{odooData.error}</p>
                ) : (
                  <>
                    <p>{odooData.count} {odooData.action} fetched</p>
                    <button className="odoo-inject-btn" onClick={injectOdooContext}>
                      Inject into message
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="chat-sidebar-section">
            <h4>Quick Prompts</h4>
            <div className="prompt-chips">
              {agentPrompts.map((p) => (
                <button
                  key={p.id}
                  className="prompt-chip"
                  onClick={() => {
                    setInput(p.prompt);
                    inputRef.current?.focus();
                  }}
                >
                  <span className="prompt-chip-id">{p.id}</span>
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
