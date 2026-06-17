// Core logic for the PV Partner AI bot in Odoo Discuss.
//
// Watches a Discuss channel for messages starting with a trigger (default "ai:"),
// routes them to a manager agent, calls OpenRouter (GLM-5.2), and posts the reply
// back into the channel. Used both by the Next.js app (auto-started via
// instrumentation) and the standalone scripts/odoo-ai-bot.mjs runner.

import { AGENTS } from "./agents/config.js";
import {
  isConfigured as odooConfigured,
  getChannelMessages,
  getLatestMessageId,
  messagePost,
  getConfigParam,
  setConfigParam,
} from "./odoo.js";
import { complete, isConfigured as orConfigured, OPENROUTER_MODEL } from "./openrouter.js";

const CHANNEL_ID = parseInt(process.env.BOT_CHANNEL_ID || "28", 10);
const TRIGGER = (process.env.BOT_TRIGGER || "ai:").toLowerCase();
const POLL_MS = parseInt(process.env.BOT_POLL_MS || "5000", 10);
const DEFAULT_SLUG = process.env.AI_DEFAULT_AGENT || "ecommerce-manager";
const DEFAULT_AGENT = AGENTS.find((a) => a.slug === DEFAULT_SLUG) || AGENTS[0];
const CURSOR_KEY = `pv_ai.discuss_last_id_${CHANNEL_ID}`;

// Shared across module instances (instrumentation vs. route handlers) within
// the same Node process, so the status endpoint reflects the real state.
function isStarted() {
  return globalThis.__PV_AI_BOT_STARTED === true;
}
function markStarted() {
  globalThis.__PV_AI_BOT_STARTED = true;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toHtml(text) {
  return escapeHtml(text).replace(/\n/g, "<br/>");
}

// Parse the part after the trigger into { agent, prompt } or a command.
function parseCommand(rest) {
  const trimmed = rest.trim();
  const lower = trimmed.toLowerCase();

  if (trimmed === "" || lower === "help") return { command: "help" };
  if (lower === "list" || lower === "agents") return { command: "list" };

  // Optional agent selector: "@slug ...", "slug: ...", or "slug ..."
  const m = trimmed.match(/^@?([a-z0-9-]+)[:\s]+([\s\S]+)$/i);
  if (m) {
    const agent = AGENTS.find((a) => a.slug === m[1].toLowerCase());
    if (agent) return { agent, prompt: m[2].trim() };
  }

  return { agent: DEFAULT_AGENT, prompt: trimmed };
}

function usageMessage() {
  return (
    `<p><strong>🤖 PV Partner AI</strong></p>` +
    `<p>Type <code>${escapeHtml(TRIGGER)} your question</code> to ask the default agent ` +
    `(<em>${escapeHtml(DEFAULT_AGENT.name)}</em>).</p>` +
    `<p>Pick a specific agent: <code>${escapeHtml(TRIGGER)} sales-director: qualify this lead…</code></p>` +
    `<p>See all agents: <code>${escapeHtml(TRIGGER)} list</code></p>`
  );
}

function listMessage() {
  const items = AGENTS.map(
    (a) => `<li><code>${a.slug}</code> — ${escapeHtml(a.name)}: ${escapeHtml(a.role)}</li>`
  ).join("");
  return `<p><strong>🤖 Available agents</strong></p><ul>${items}</ul>`;
}

async function handleMessage(msg) {
  const text = stripHtml(msg.body);
  if (!text.toLowerCase().startsWith(TRIGGER)) return false;

  const parsed = parseCommand(text.slice(TRIGGER.length));

  if (parsed.command === "help") {
    await messagePost(CHANNEL_ID, usageMessage());
    return true;
  }
  if (parsed.command === "list") {
    await messagePost(CHANNEL_ID, listMessage());
    return true;
  }
  if (!parsed.prompt) {
    await messagePost(CHANNEL_ID, usageMessage());
    return true;
  }

  const { agent, prompt } = parsed;
  console.log(`[discuss-bot] msg #${msg.id} -> ${agent.slug}: ${prompt.slice(0, 80)}`);

  try {
    const answer = await complete(agent.systemPrompt, [{ role: "user", content: prompt }]);
    const body = `<p><strong>🤖 ${escapeHtml(agent.name)}</strong></p><p>${toHtml(answer)}</p>`;
    await messagePost(CHANNEL_ID, body);
  } catch (err) {
    console.error(`[discuss-bot] error answering #${msg.id}:`, err.message);
    await messagePost(
      CHANNEL_ID,
      `<p><strong>🤖 ${escapeHtml(agent.name)}</strong></p><p>⚠️ Error: ${escapeHtml(err.message)}</p>`
    );
  }
  return true;
}

async function persistCursor(id) {
  try {
    await setConfigParam(CURSOR_KEY, id);
  } catch {
    /* non-fatal: fall back to in-memory cursor */
  }
}

async function pollOnce(state) {
  let messages;
  try {
    messages = await getChannelMessages(CHANNEL_ID, state.lastId || 0);
  } catch (err) {
    console.error("[discuss-bot] poll error:", err.message);
    return;
  }

  for (const msg of messages) {
    // Replies never start with the trigger, so this can't loop on itself.
    try {
      await handleMessage(msg);
    } catch (err) {
      console.error(`[discuss-bot] handler error #${msg.id}:`, err.message);
    }
    if (msg.id > (state.lastId || 0)) {
      state.lastId = msg.id;
      await persistCursor(state.lastId);
    }
  }
}

// Start the polling loop. Safe to call multiple times — only starts once.
async function startDiscussBot() {
  if (isStarted()) return;
  if (!odooConfigured() || !orConfigured()) {
    console.warn(
      "[discuss-bot] not started — missing config " +
        `(odoo=${odooConfigured()} openrouter=${orConfigured()})`
    );
    return;
  }
  markStarted();

  // Initialize cursor from Odoo (shared + durable); else start from newest message.
  const state = { lastId: 0 };
  try {
    const stored = await getConfigParam(CURSOR_KEY);
    state.lastId = parseInt(stored || "0", 10) || 0;
  } catch {
    /* ignore */
  }
  if (!state.lastId) {
    try {
      state.lastId = await getLatestMessageId(CHANNEL_ID);
      await persistCursor(state.lastId);
    } catch (err) {
      console.error("[discuss-bot] could not init cursor:", err.message);
    }
  }

  console.log(
    `[discuss-bot] started channel=${CHANNEL_ID} trigger="${TRIGGER}" ` +
      `model=${OPENROUTER_MODEL} default=${DEFAULT_AGENT.slug} ` +
      `poll=${POLL_MS}ms startId=${state.lastId}`
  );

  const tick = async () => {
    await pollOnce(state);
    setTimeout(tick, POLL_MS);
  };
  tick();
}

function getBotStatus() {
  return {
    started: isStarted(),
    enabled: process.env.ENABLE_DISCUSS_BOT !== "false",
    configured: odooConfigured() && orConfigured(),
    odooConfigured: odooConfigured(),
    openrouterConfigured: orConfigured(),
    channelId: CHANNEL_ID,
    trigger: TRIGGER,
    model: OPENROUTER_MODEL,
    defaultAgent: DEFAULT_AGENT.slug,
    pollMs: POLL_MS,
  };
}

export { startDiscussBot, pollOnce, parseCommand, getBotStatus, CHANNEL_ID, TRIGGER };
