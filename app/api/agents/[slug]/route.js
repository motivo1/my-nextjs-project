import { NextResponse } from "next/server";
import { AGENTS } from "../../../../lib/agents/config";
import { getPromptsByAgent, getPromptCategories } from "../../../../lib/agents/prompts";

export async function GET(request, { params }) {
  const agent = AGENTS.find((a) => a.slug === params.slug);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const prompts = getPromptsByAgent(agent.slug);
  const categories = getPromptCategories(agent.slug);

  return NextResponse.json({
    ...agent,
    prompts,
    categories,
    promptCount: prompts.length,
  });
}
