import type { NextRequest } from "next/server";

// import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
  const {
    // apiKey: key,
    messages,
    model = "llama3.2",
    system,
  } = await req.json();

  console.log(messages, system);

  // const apiKey = key || process.env.OPENAI_API_KEY;

  // if (!apiKey) {
  //   return NextResponse.json(
  //     { error: "Missing OpenAI API key." },
  //     { status: 401 },
  //   );
  // }

  // const openai = createOpenAI({ apiKey });

  try {
    const result = await streamText({
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
      model: model,
      system: system,
    });

    // const result =  streamText({
    //   model,
    //   messages: [
    //     { role: "system", content: system },
    //     { role: "user", content: JSON.stringify(messages)},
    //   ],

    //   model: openai(model),
    //   system: system,

    // });
    console.log(result);

    const response = await ollama.chat({
      model: "llama3.2",
      messages: [
        {
          role: "system",
          content: system,
        },
        { role: "user", content: JSON.stringify(messages) },
      ],
    });
    console.log(response.message.content);

    console.log("test", response.message);
    const content = response.message.content;

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
