import { NextResponse } from "next/server";
import { AGENTS } from "../../../../../lib/agents/config";
import { getPromptsByAgent } from "../../../../../lib/agents/prompts";

export async function POST(request, { params }) {
  const agent = AGENTS.find((a) => a.slug === params.slug);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const body = await request.json();
  const { message, promptId } = body;

  if (!message && !promptId) {
    return NextResponse.json(
      { error: "Provide either 'message' or 'promptId'" },
      { status: 400 }
    );
  }

  let userMessage = message;

  if (promptId) {
    const prompts = getPromptsByAgent(agent.slug);
    const prompt = prompts.find((p) => p.id === promptId);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    userMessage = prompt.prompt;
  }

  return NextResponse.json({
    agent: agent.slug,
    agentName: agent.name,
    systemPrompt: agent.systemPrompt,
    userMessage,
    note: "Connect your preferred LLM API (Claude, OpenAI, etc.) to enable chat. Send the systemPrompt as the system message and userMessage as the user message to your LLM endpoint.",
    usage: {
      claude: {
        model: "claude-sonnet-4-6",
        system: agent.systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      },
    },
  });
}
