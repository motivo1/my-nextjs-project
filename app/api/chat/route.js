import { NextResponse } from "next/server";
import { AGENTS } from "../../../lib/agents/config";
import { chatCompletion, isConfigured } from "../../../lib/openrouter";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { messages, agentSlug, model } = body;

  if (!agentSlug || !messages?.length) {
    return NextResponse.json(
      { error: "agentSlug and messages[] are required" },
      { status: 400 }
    );
  }

  const agent = AGENTS.find((a) => a.slug === agentSlug);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    const openrouterRes = await chatCompletion(agent.systemPrompt, messages, true);

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openrouterRes.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") {
                if (trimmed === "data: [DONE]") {
                  controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                  controller.close();
                  return;
                }
                continue;
              }

              if (trimmed.startsWith("data: ")) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    const payload = JSON.stringify({ content });
                    controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
                  }
                } catch {
                  // partial JSON chunk, skip
                }
              }
            }
          }
        } catch (err) {
          const errPayload = JSON.stringify({ error: err.message });
          controller.enqueue(new TextEncoder().encode(`data: ${errPayload}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
