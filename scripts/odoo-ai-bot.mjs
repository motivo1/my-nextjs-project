#!/usr/bin/env node
// Optional standalone runner for the PV Partner AI Discuss bot.
//
// You normally do NOT need this — the bot auto-starts inside the Next.js app
// (see instrumentation.js). Use this only if you want to run the bot as its
// own process, separate from the web app.
//
// Run:  node --env-file=.env.local scripts/odoo-ai-bot.mjs
// (Node 20.6+ for --env-file; otherwise export the env vars yourself.)

import { startDiscussBot } from "../lib/discuss-bot.js";

startDiscussBot().catch((err) => {
  console.error("[bot] fatal:", err);
  process.exit(1);
});
