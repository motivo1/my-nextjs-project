#!/usr/bin/env node
// PV Partner AI bot for Odoo Discuss.
//
// Watches a Discuss channel for messages that start with a trigger (default "/ai"),
// routes them to one of the PV Partner manager agents, calls OpenRouter (GLM-5.2),
// and posts the reply back into the channel.
//
// Run:  node --env-file=.env.local scripts/odoo-ai-bot.mjs
// (Node 20.6+ for --env-file; otherwise export the vars yourself.)
//
// Env: OPENROUTER_API_KEY, OPENROUTER_MODEL, ODOO_URL, ODOO_DB,
//      ODOO_USERNAME, ODOO_API_KEY
// Optional: BOT_CHANNEL_ID (default 28), BOT_TRIGGER (default "/ai"),
//           BOT_POLL_MS (default 5000), AI_DEFAULT_AGENT (default "ecommerce-manager")

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AGENTS } from "../lib/agents/config.js";
import {
  isConfigured as odooConfigured,
  getChannelMessages,
  getLatestMessageId,
  messagePost,
} from "../lib/odoo.js";
import { complete, isConfigured as orConfigured, OPENROUTER_MODEL } from "../lib/openrouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHANNEL_ID = parseInt(process.env.BOT_CHANNEL_ID || "28", 10);
const TRIGGER = (process.env.BOT_TRIGGER || "/ai").toLowerCase();
const POLL_MS = parseInt(process.env.BOT_POLL_MS || "5000", 10);
const DEFAULT_SLUG = process.env.AI_DEFAULT_AGENT || "ecommerce-manager";
const DEFAULT_AGENT = AGENTS.find((a) => a.slug === DEFAULT_SLUG) || AGENTS[0];
const STATE_FILE = join(__dirname, ".bot-state.json");

function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, "utf8"));
    } catch {
      /* ignore corrupt state */
    }
  }
  return {};
}

function saveState(state) {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("[bot] could not persist state:", err.message);
  }
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
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

  const rest = text.slice(TRIGGER.length);
  const parsed = parseCommand(rest);

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
  console.log(`[bot] msg #${msg.id} -> ${agent.slug}: ${prompt.slice(0, 80)}`);

  try {
    const answer = await complete(agent.systemPrompt, [{ role: "user", content: prompt }]);
    const body = `<p><strong>🤖 ${escapeHtml(agent.name)}</strong></p><p>${toHtml(answer)}</p>`;
    await messagePost(CHANNEL_ID, body);
  } catch (err) {
    console.error(`[bot] error answering #${msg.id}:`, err.message);
    await messagePost(
      CHANNEL_ID,
      `<p><strong>🤖 ${escapeHtml(agent.name)}</strong></p><p>⚠️ Error: ${escapeHtml(err.message)}</p>`
    );
  }
  return true;
}

async function poll(state) {
  let messages;
  try {
    messages = await getChannelMessages(CHANNEL_ID, state.lastId || 0);
  } catch (err) {
    console.error("[bot] poll error:", err.message);
    return;
  }

  for (const msg of messages) {
    // Replies never start with the trigger, so this can't loop on itself.
    try {
      await handleMessage(msg);
    } catch (err) {
      console.error(`[bot] handler error #${msg.id}:`, err.message);
    }
    state.lastId = Math.max(state.lastId || 0, msg.id);
    saveState(state);
  }
}

async function main() {
  if (!odooConfigured()) {
    console.error("[bot] Odoo not configured. Set ODOO_DB, ODOO_USERNAME, ODOO_API_KEY.");
    process.exit(1);
  }
  if (!orConfigured()) {
    console.error("[bot] OpenRouter not configured. Set OPENROUTER_API_KEY.");
    process.exit(1);
  }

  const state = loadState();
  if (!state.lastId) {
    // Start from "now" so we don't reprocess the channel history.
    state.lastId = await getLatestMessageId(CHANNEL_ID);
    saveState(state);
  }

  console.log(
    `[bot] PV Partner AI bot started\n` +
      `      channel=${CHANNEL_ID} trigger="${TRIGGER}" model=${OPENROUTER_MODEL}\n` +
      `      default agent=${DEFAULT_AGENT.slug} poll=${POLL_MS}ms startId=${state.lastId}`
  );

  // Polling loop (setTimeout chain avoids overlapping runs).
  const tick = async () => {
    await poll(state);
    setTimeout(tick, POLL_MS);
  };
  tick();
}

main().catch((err) => {
  console.error("[bot] fatal:", err);
  process.exit(1);
});
