import { NextResponse } from "next/server";
import { AGENTS, COMPANY } from "../../../lib/agents/config";
import { getPromptsByAgent, getPromptCategories } from "../../../lib/agents/prompts";

export async function GET() {
  const agents = AGENTS.map((agent) => ({
    slug: agent.slug,
    name: agent.name,
    role: agent.role,
    description: agent.description,
    color: agent.color,
    promptCount: getPromptsByAgent(agent.slug).length,
    categories: getPromptCategories(agent.slug),
  }));

  return NextResponse.json({
    company: COMPANY,
    totalAgents: agents.length,
    totalPrompts: agents.reduce((sum, a) => sum + a.promptCount, 0),
    agents,
  });
}
