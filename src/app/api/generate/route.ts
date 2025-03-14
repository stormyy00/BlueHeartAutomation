// import { openai } from "@ai-sdk/openai";
// import { Ratelimit } from "@upstash/ratelimit";
// import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { match } from "ts-pattern";
import { createOllama } from "ollama-ai-provider";
import { NextResponse } from "next/server";
const ollama = createOllama({
  /* your config */
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set, if not return 400
  //   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
  //     return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
  //       status: 400,
  //     });
  //   }
  //   if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  //     const ip = req.headers.get("x-forwarded-for");
  //     const ratelimit = new Ratelimit({
  //       redis: kv,
  //       limiter: Ratelimit.slidingWindow(50, "1 d"),
  //     });

  //     const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

  //     if (!success) {
  //       return new Response("You have reached your request limit for the day.", {
  //         status: 429,
  //         headers: {
  //           "X-RateLimit-Limit": limit.toString(),
  //           "X-RateLimit-Remaining": remaining.toString(),
  //           "X-RateLimit-Reset": reset.toString(),
  //         },
  //       });
  //     }
  //   }

  const { prompt, option, command } = await req.json();
  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant designed to enhance productivity and creativity in newsletter writing. " +
          "Respond directly to user prompts with clear, concise, and relevant content. Maintain a neutral, helpful tone. " +
          "Use Markdown formatting when appropriate. " +
          "If prompted to use events in any kind of context unless specified make sure to use these events. " +
          `Rules:
          - Anything else is the user prompt.
          - Your response should be tailored to the user's prompt, providing precise assistance to optimize note management.
          - For INSTRUCTIONS: Follow the "improve" exactly. Provide ONLY the content to be inserted or replaced. No explanations or comments.
          - For QUESTIONS: Provide a helpful and concise answer. You may include brief explanations if necessary.
          - CRITICAL: Distinguish between INSTRUCTIONS and QUESTIONS. Instructions typically ask you to modify or add content. Questions ask for information or clarification.
          - CRITICAL: Avoid generating excessively long or complex content that might cause rendering issues.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You area an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text" +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run();

  try {
    const result = streamText({
      prompt: messages[messages.length - 1].content,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      model: ollama("llama3.2"),
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Error filtering out <think>:", err);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
