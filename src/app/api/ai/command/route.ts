import { convertToCoreMessages, streamText } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOllama } from "ollama-ai-provider";
import fs from "fs/promises";

type Message = {
  role: string;
  content: string;
  parts?: string;
};

type UserMessage = {
  role: string;
  content: string;
};

/**
 * Create your Ollama instance (adjust as needed).
 * If you have some config "P", place it here or
 * import it from environment variables, etc.
 */
const ollama = createOllama({
  // baseURL:
  //   process.env.NODE_ENV === "production"
  //     ? process.env.OLLAMA_URL
  //     : "http://localhost:11434",
});
// export async function POST(req: NextRequest) {
//   try {
//     const { messages, model = "llama3.2" } = await req.json();
//     console.log(messages);
// // console.log(messages.parts)
//     const noThinkingInstruction =
//       "IMPORTANT: You must respond with ONLY the final output text. " +
//       "DO NOT include ANY explanations, introductions, or comments like 'Here is', 'Sure', 'I'll help', etc. " +
//       "START YOUR RESPONSE WITH THE ACTUAL CONTENT THE USER REQUESTED. " +
//       "If you include ANY preamble text, your response will be rejected. " +
//       "Never start with phrases like 'Here's' or 'Here is' or any similar phrase.";

//     const systemMessage = {
//       role: "system",
//       content:
//         "You are an AI writing assistant for newsletter writing. " +
//         noThinkingInstruction +
//         `The current information on the document is provided` +
//         "Use Markdown formatting when appropriate. " +
//         "If prompted to use events in context unless specified, use these events. " +
//         `Rules:
//         - Your response must contain ONLY the exact text to be inserted.
//         - No explanations. No introductions. No comments.
//         - CRITICAL: Begin your response with the first word of the actual content.`,
//     };

//     const resultStream = streamText({
//       maxTokens: 2048,
//       messages: convertToCoreMessages(messages),
//       model: ollama(model),
//       system: systemMessage.content,
//     });

//     // The result is likely a DataStream object with `.toDataStreamResponse()`
//     // or similar. We'll transform its `body`.

//     const originalResponse = resultStream.toDataStreamResponse();
//     if (!originalResponse.body) {
//       // If no body, just return the raw response
//       return originalResponse;
//     }

//     // // Create a TransformStream that filters out <think>...</think>
//     // const { readable, writable } = new TransformStream();
//     // const writer = writable.getWriter();
//     // const reader = originalResponse.body.getReader();

//     // We’ll keep a running buffer because the <think> tags
//     // may be split across chunks.

//     // const decoder = new TextDecoder();
//     // const encoder = new TextEncoder();

//     // // Continuously read from the original stream and write filtered chunks
//     // async function readAndFilter() {
//     //   let write = true;
//     //   while (true) {
//     //     const { value, done } = await reader.read();
//     //     if (done) {
//     //       // Process any leftover data in buffer:
//     //       if (buffer) {
//     //         await writer.write(encoder.encode(buffer));
//     //       }
//     //       // Close the writer, ending the transformed stream
//     //       await writer.close();
//     //       break;
//     //     }

//     //     // Decode the current chunk and add to our buffer
//     //     const chunkText = decoder.decode(value, { stream: true });
//     //     const rawText = chunkText.substring(3, chunkText.lastIndexOf('"'));
//     //     if (rawText.trim() == "<think>") {
//     //       write = false;
//     //       continue;
//     //     }
//     //     if (!write && rawText.trim() == "</think>") {
//     //       write = true;
//     //       continue;
//     //     }
//     //     if (!write) {
//     //       continue;
//     //     }
//     //     buffer += chunkText;
//     //     console.log(chunkText);
//     //     if (buffer.trim()) {
//     //       await writer.write(encoder.encode(chunkText));
//     //       console.log("wrote", chunkText)
//     //     }
//     //     buffer = "";
//     //   }
//     // }

//     // // Kick off reading and transforming
//     // readAndFilter();

//     // Return a new streamed response with the filtered text
//     return new Response(resultStream.toDataStream(), {
//       status: 200,
//       headers: {
//         "Content-Type": "text/event-stream", // or your streaming mime type
//       },
//     });
//   } catch (err) {
//     console.error("Error filtering out <think>:", err);
//     return NextResponse.json(
//       { error: "Failed to process AI request" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "llama3.2" } = await req.json();

    const latestMessage = messages[messages.length - 1];
    const documentContent = latestMessage.parts || "";
    console.log(documentContent);

    let training;
    if (!training) {
      try {
        training = await fs.readFile("src/data/training.txt", "utf8");
      } catch (error) {
        console.error("Failed to read training file:", error);
        training = "";
      }
    }

    const noThinkingInstruction =
      "IMPORTANT: You must respond with ONLY the final output text. " +
      "DO NOT include ANY explanations, introductions, or comments like 'Here is', 'Sure', 'I'll help', etc. " +
      "START YOUR RESPONSE WITH THE ACTUAL CONTENT THE USER REQUESTED. " +
      "If you include ANY preamble text, your response will be rejected. " +
      "Never start with phrases like 'Here's' or 'Here is' or any similar phrase.";

    const systemMessage = {
      role: "system",
      content:
        "You are an AI writing assistant for newsletter writing. " +
        noThinkingInstruction +
        "\n\nCURRENT DOCUMENT CONTEXT:\n" +
        documentContent +
        "\n\nTRAINING DATA\n" +
        "CRITICAL: USE AS WRITING STYLE REFERENCE (match this tone, vocabulary, and style):\n" +
        training +
        "When explaining a document, do not reference this text. It is only meant to guide writing style." +
        "\n\n" +
        "Use Markdown formatting when appropriate. " +
        "Feel free to add color and emphasize certain points with different symbols. " +
        "If prompted to use events in context unless specified, use these events. " +
        "Rules:\n" +
        "- Your response must contain ONLY the exact text to be inserted.\n" +
        "- Match the tone, style, and vocabulary of the writing style reference.\n" +
        "- No explanations. No introductions. No comments.\n" +
        "- CRITICAL: Begin your response with the first word of the actual content.",
    };

    const userMessages = convertToCoreMessages(
      messages.map(
        (msg: Message): UserMessage => ({
          role: msg.role,
          content: msg.content,
        }),
      ),
    );

    const resultStream = streamText({
      maxTokens: 2048,
      temperature: 0.7,
      topP: 1,
      messages: userMessages,
      model: ollama(model),
      system: systemMessage.content,
    });

    return new Response(resultStream.toDataStream(), {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
