import { NextResponse } from "next/server";
import { generateAgentResponse } from "@/lib/agent";
import type { AgentMessage } from "@/lib/agent";

export const runtime = "edge";

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || !("messages" in body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const messages = Array.isArray((body as { messages: unknown }).messages)
      ? ((body as { messages: unknown[] }).messages as { role?: string; content?: unknown }[])
      : [];

    const sanitized: AgentMessage[] = messages
      .filter((message) => message && typeof message.content === "string" && typeof message.role === "string")
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user", // default to user for unsupported roles
        content: (message.content as string).slice(0, 2000)
      }));

    const reply = generateAgentResponse(sanitized);
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process request" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
};
