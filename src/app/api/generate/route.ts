import { streamText } from "ai";
import { match } from "ts-pattern";
import { NextResponse } from "next/server";
import { googleProvider } from "@/utils/genai";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt, option, command } = await req.json();
  console.log(prompt);

  const noThinkingInstruction =
    "IMPORTANT: You must respond with ONLY the final output text. " +
    "DO NOT include ANY explanations, introductions, or comments like 'Here is', 'Sure', 'I'll help', etc. " +
    "START YOUR RESPONSE WITH THE ACTUAL CONTENT THE USER REQUESTED. " +
    "If you include ANY preamble text, your response will be rejected. " +
    "Never start with phrases like 'Here's' or 'Here is' or any similar phrase.";

  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant for newsletter writing. " +
          noThinkingInstruction +
          " " +
          "Use Markdown formatting when appropriate. " +
          "If prompted to use events in context unless specified, use these events. " +
          `Rules:
          - Your response must contain ONLY the exact text to be inserted.
          - No explanations. No introductions. No comments.
          - CRITICAL: Begin your response with the first word of the actual content.`,
      },
      {
        role: "user",
        content: "Remember, respond with ONLY the final text I need. " + prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          noThinkingInstruction +
          " " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content:
          "Remember, respond with ONLY the improved text. The existing text is: " +
          prompt,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " +
          noThinkingInstruction +
          " " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content:
          "Remember, respond with ONLY the shortened text. The existing text is: " +
          prompt,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          noThinkingInstruction +
          " " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content:
          "Remember, respond with ONLY the lengthened text. The existing text is: " +
          prompt,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          noThinkingInstruction +
          " " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content:
          "Remember, respond with ONLY the corrected text. The existing text is: " +
          prompt,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates text based on a prompt. " +
          noThinkingInstruction +
          " " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content:
          "Remember, respond with ONLY the generated text. For this text: " +
          prompt +
          ". You have to respect the command: " +
          command,
      },
    ])
    .run();

  try {
    const result = await streamText({
      prompt: messages[messages.length - 1].content,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      model: googleProvider,
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
