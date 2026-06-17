# Odoo Discuss AI Bot

Brings the PV Partner manager agents into an Odoo Discuss channel. Watches a
channel for messages starting with `/ai`, routes them to a manager agent,
calls OpenRouter (GLM-5.2), and posts the reply back into the channel.

## How it runs (the app way)

**The bot starts automatically with the Next.js app** — no separate process or
git checkout needed. On server boot, `instrumentation.js` calls
`startDiscussBot()` (see `lib/discuss-bot.js`).

In the Docker / blue-green setup it runs on **one instance only** (`web_blue`,
via `ENABLE_DISCUSS_BOT=true`) so blue and green don't both answer.

Check it's live:

```
GET /api/bot/status
```

```json
{ "started": true, "enabled": true, "configured": true,
  "channelId": 28, "trigger": "/ai", "model": "z-ai/glm-5.2" }
```

The deployed container must have the env vars (`OPENROUTER_API_KEY`,
`ODOO_*`). `docker-compose.yml` loads them from `.env.local` on the host if
present (`env_file`, optional). To turn the bot off: `ENABLE_DISCUSS_BOT=false`.

## Usage in Discuss

In the channel (default id `28`):

| Command | Result |
| --- | --- |
| `/ai <question>` | Default agent (eCommerce Manager) answers |
| `/ai sales-director: <question>` | A specific agent answers (`slug:` prefix) |
| `/ai @seo-content <question>` | Same, with `@slug` prefix |
| `/ai list` | Lists all 10 agents and their slugs |
| `/ai help` | Shows usage |

The bot only reacts to messages starting with the trigger, and its own replies
never start with it — so it cannot reply to itself.

## Optional: run as a standalone process

You normally don't need this, but if you want the bot separate from the web app
(Node 20.6+ for `--env-file`):

```bash
npm run bot
# = node --env-file=.env.local scripts/odoo-ai-bot.mjs
```

## Configuration (env)

| Var | Required | Default |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | — |
| `OPENROUTER_MODEL` | no | `z-ai/glm-5.2` |
| `ODOO_URL` | yes | `https://dev-erp.asunim.co` |
| `ODOO_DB` | yes | — |
| `ODOO_USERNAME` | yes | — |
| `ODOO_API_KEY` | yes | — |
| `ENABLE_DISCUSS_BOT` | no | `true` (set `false` to disable) |
| `BOT_CHANNEL_ID` | no | `28` |
| `BOT_TRIGGER` | no | `/ai` |
| `BOT_POLL_MS` | no | `5000` |
| `AI_DEFAULT_AGENT` | no | `ecommerce-manager` |

The message cursor is stored in Odoo (`ir.config_parameter`, key
`pv_ai.discuss_last_id_<channel>`), so it survives restarts and is shared
across instances. On first run it starts from the newest message (no history
replay).

## If `/ai` doesn't trigger

Odoo's Discuss composer treats a leading `/` as a slash command. In some
configurations an unrecognized `/ai` is intercepted client-side and is **not**
posted to the channel — so the bot never sees it. If that happens, switch to a
non-slash trigger and tell the team to use it:

```
BOT_TRIGGER=ai:      # team types:  ai: your question
```

(A native `/ai` slash command would require a custom Odoo addon instead.)
