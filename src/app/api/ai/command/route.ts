import { convertToCoreMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOllama } from "ollama-ai-provider";

/**
 * Create your Ollama instance (adjust as needed).
 * If you have some config "P", place it here or
 * import it from environment variables, etc.
 */
const ollama = createOllama({
  /* your config */
});

export async function POST(req: NextRequest) {
  const { messages, model = "llama3.2", system } = await req.json();
  console.log(messages);
  try {
    const resultStream = streamText({
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
      model: ollama(model),
      system,
    });

    // The result is likely a DataStream object with `.toDataStreamResponse()`
    // or similar. We'll transform its `body`.

    const originalResponse = resultStream.toDataStreamResponse();
    if (!originalResponse.body) {
      // If no body, just return the raw response
      return originalResponse;
    }

    // Create a TransformStream that filters out <think>...</think>
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = originalResponse.body.getReader();

    // We’ll keep a running buffer because the <think> tags
    // may be split across chunks.

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // A helper function to remove <think>...</think>
    function removeThinkBlocks(text: string) {
      // The simplest approach: remove anything between these tags
      return text.replace(/<think>[\s\S]*?<\/think>/g, "");
    }

    // Continuously read from the original stream and write filtered chunks
    async function readAndFilter() {
      let partialBuffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (partialBuffer) {
            await writer.write(
              encoder.encode(removeThinkBlocks(partialBuffer)),
            );
          }
          await writer.close();
          break;
        }

        const chunkText = decoder.decode(value, { stream: true });
        partialBuffer += chunkText;
        const filteredText = removeThinkBlocks(partialBuffer);
        await writer.write(encoder.encode(filteredText));
        partialBuffer = ""; // Clear buffer
      }
    }

    // Kick off reading and transforming
    readAndFilter();

    // Return a new streamed response with the filtered text
    console.log(readable);
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream", // or your streaming mime type
      },
    });
  } catch (err) {
    console.error("Error filtering out <think>:", err);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
