// Next.js instrumentation hook — runs once when the server starts.
// Auto-starts the Odoo Discuss AI bot so it goes live with the app
// (no separate process or git checkout needed). Disable with
// ENABLE_DISCUSS_BOT=false.

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.ENABLE_DISCUSS_BOT === "false") return;

  try {
    const { startDiscussBot } = await import("./lib/discuss-bot.js");
    await startDiscussBot();
  } catch (err) {
    // Never let bot startup crash the app.
    console.error("[instrumentation] discuss bot failed to start:", err);
  }
}
