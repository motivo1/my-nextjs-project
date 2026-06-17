# Odoo Discuss AI Bot

Brings the PV Partner manager agents into an Odoo Discuss channel. Watches a
channel for messages starting with `/ai`, routes them to a manager agent,
calls OpenRouter (GLM-5.2), and posts the reply back into the channel.

## Run

Requires Node 20.6+ (for `--env-file`). With `.env.local` filled in:

```bash
npm run bot
```

or directly:

```bash
node --env-file=.env.local scripts/odoo-ai-bot.mjs
```

Keep it running (e.g. `pm2 start "npm run bot" --name pv-ai-bot`, a systemd
service, or a Docker container) so it keeps polling.

## Usage in Discuss

In the channel (default id `28`):

| Command | Result |
| --- | --- |
| `/ai <question>` | Default agent (eCommerce Manager) answers |
| `/ai sales-director: <question>` | A specific agent answers (`slug:` prefix) |
| `/ai @seo-content <question>` | Same, with `@slug` prefix |
| `/ai list` | Lists all 10 agents and their slugs |
| `/ai help` | Shows usage |

The bot only reacts to messages starting with the trigger, and its own
replies never start with it — so it cannot reply to itself.

## Configuration (env)

| Var | Required | Default |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | — |
| `OPENROUTER_MODEL` | no | `z-ai/glm-5.2` (from `.env.local`) |
| `ODOO_URL` | yes | `https://dev-erp.asunim.co` |
| `ODOO_DB` | yes | — |
| `ODOO_USERNAME` | yes | — |
| `ODOO_API_KEY` | yes | — |
| `BOT_CHANNEL_ID` | no | `28` |
| `BOT_TRIGGER` | no | `/ai` |
| `BOT_POLL_MS` | no | `5000` |
| `AI_DEFAULT_AGENT` | no | `ecommerce-manager` |

## If `/ai` doesn't trigger

Odoo's Discuss composer treats a leading `/` as a slash command. In some
Odoo configurations an unrecognized `/ai` is intercepted client-side and is
**not** posted to the channel — meaning the bot never sees it. If that
happens, set a non-slash trigger and tell the team to use that prefix:

```bash
BOT_TRIGGER="ai:" npm run bot      # then type:  ai: your question
```

(A native `/ai` slash command would require a custom Odoo addon instead of
this external bot.)

## State

The bot stores the last processed message id in `scripts/.bot-state.json`
(gitignored). On first run it starts from the newest message so it won't
replay channel history. Delete the file to reset the cursor.
