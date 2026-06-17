const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function isConfigured() {
  return !!OPENROUTER_API_KEY;
}

async function chatCompletion(systemPrompt, messages, stream = true) {
  const body = {
    model: OPENROUTER_MODEL,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream,
    max_tokens: 4096,
  };

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://pv-partner.com",
      "X-Title": "PV Partner AI Agents",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  return res;
}

export { chatCompletion, isConfigured, OPENROUTER_MODEL };
