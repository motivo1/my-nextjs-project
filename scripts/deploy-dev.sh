#!/usr/bin/env bash
set -euo pipefail

# Deploy & test the PV Partner AI bot on the EC2 dev instance.
# Usage:
#   ./scripts/deploy-dev.sh                  # deploy + test
#   ./scripts/deploy-dev.sh --test-only      # skip deploy, just test
#
# Required env vars (or set them here):
#   EC2_HOST   – IP or hostname of the EC2 instance
#   EC2_KEY    – path to the SSH private key
#   EC2_USER   – SSH user (default: ec2-user)
#   APP_DIR    – app directory on the instance (default: /home/ec2-user/my-nextjs-project)
#   APP_URL    – base URL to test against (default: http://$EC2_HOST:3000)

EC2_HOST="${EC2_HOST:?'Set EC2_HOST (IP or hostname of dev instance)'}"
EC2_KEY="${EC2_KEY:-$HOME/.ssh/id_rsa}"
EC2_USER="${EC2_USER:-ec2-user}"
APP_DIR="${APP_DIR:-/home/$EC2_USER/my-nextjs-project}"
APP_URL="${APP_URL:-http://$EC2_HOST:3000}"
BRANCH="${BRANCH:-claude/pv-partner-manager-agents-dzb46d}"

SSH_CMD="ssh -o StrictHostKeyChecking=no -i $EC2_KEY $EC2_USER@$EC2_HOST"

red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }

# ── Deploy ──────────────────────────────────────────────────────────
deploy() {
  bold "==> Pulling latest code ($BRANCH)..."
  $SSH_CMD "cd $APP_DIR && git fetch origin $BRANCH && git checkout $BRANCH && git pull origin $BRANCH"

  bold "==> Installing dependencies & building..."
  $SSH_CMD "cd $APP_DIR && npm install && npm run build"

  bold "==> Restarting app..."
  # Try pm2 first, fall back to manual restart
  $SSH_CMD "cd $APP_DIR && (command -v pm2 >/dev/null 2>&1 \
    && pm2 restart all \
    || (fuser -k 3000/tcp 2>/dev/null; sleep 1; nohup npm start > /tmp/nextjs.log 2>&1 &))"

  bold "==> Waiting for app to come up..."
  for i in $(seq 1 15); do
    if curl -sf "$APP_URL/api/bot/status" >/dev/null 2>&1; then
      green "    App is up after ${i}s"
      return 0
    fi
    sleep 2
  done
  red "    App did not respond within 30s"
  return 1
}

# ── Test ────────────────────────────────────────────────────────────
test_bot() {
  bold "==> Testing bot status endpoint..."
  STATUS=$(curl -sf "$APP_URL/api/bot/status" 2>&1) || {
    red "FAIL: /api/bot/status not reachable at $APP_URL"
    return 1
  }
  echo "    $STATUS"

  ERRORS=0

  # Check trigger is ai: (not /ai)
  TRIGGER=$(echo "$STATUS" | grep -o '"trigger":"[^"]*"' | cut -d'"' -f4)
  if [ "$TRIGGER" = "ai:" ]; then
    green "PASS: trigger = ai:"
  else
    red  "FAIL: trigger = '$TRIGGER' (expected 'ai:')"
    ERRORS=$((ERRORS + 1))
  fi

  # Check bot is started
  if echo "$STATUS" | grep -q '"started":true'; then
    green "PASS: bot started"
  else
    red  "FAIL: bot not started"
    ERRORS=$((ERRORS + 1))
  fi

  # Check bot is enabled
  if echo "$STATUS" | grep -q '"enabled":true'; then
    green "PASS: bot enabled"
  else
    red  "FAIL: bot not enabled"
    ERRORS=$((ERRORS + 1))
  fi

  # Check Odoo configured
  if echo "$STATUS" | grep -q '"odooConfigured":true'; then
    green "PASS: Odoo configured"
  else
    red  "FAIL: Odoo not configured (check ODOO_* env vars)"
    ERRORS=$((ERRORS + 1))
  fi

  # Check OpenRouter configured
  if echo "$STATUS" | grep -q '"openrouterConfigured":true'; then
    green "PASS: OpenRouter configured"
  else
    red  "FAIL: OpenRouter not configured (check OPENROUTER_API_KEY)"
    ERRORS=$((ERRORS + 1))
  fi

  # Check channel ID
  if echo "$STATUS" | grep -q '"channelId":28'; then
    green "PASS: channel = 28"
  else
    red  "WARN: channel is not 28"
  fi

  bold ""
  bold "==> Testing chat API endpoint..."
  CHAT_RESP=$(curl -sf -X POST "$APP_URL/api/chat" \
    -H "Content-Type: application/json" \
    -d '{"agent":"ecommerce-manager","messages":[{"role":"user","content":"ping"}]}' \
    2>&1) || {
    red  "WARN: /api/chat not reachable (may need OPENROUTER_API_KEY on server)"
  }

  bold ""
  bold "==> Testing Odoo connection..."
  ODOO_RESP=$(curl -sf "$APP_URL/api/odoo" 2>&1) || {
    red  "WARN: /api/odoo not reachable"
  }
  if [ -n "${ODOO_RESP:-}" ]; then
    echo "    $ODOO_RESP"
    if echo "$ODOO_RESP" | grep -q '"configured":true'; then
      green "PASS: Odoo connection configured"
    else
      red  "WARN: Odoo not fully configured"
    fi
  fi

  bold ""
  if [ $ERRORS -eq 0 ]; then
    green "==> All checks passed! Type 'ai: help' in Discuss channel 28 to test."
  else
    red  "==> $ERRORS check(s) failed."
    return 1
  fi
}

# ── Main ────────────────────────────────────────────────────────────
case "${1:-}" in
  --test-only)
    test_bot
    ;;
  *)
    deploy
    echo ""
    test_bot
    ;;
esac
