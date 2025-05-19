import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const prompt = messages
    .map(
      ({ role, content }: { role: string; content: string }) =>
        `${role.toUpperCase()}: ${content}`,
    )
    .join("\n");

  try {
    const result = streamText({
      model: google("gemini-2.0-flash"),
      prompt,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
