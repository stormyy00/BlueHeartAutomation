import type { NextRequest } from "next/server";

// import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

import ollama from "ollama";

export async function POST(req: NextRequest) {
  const {
    // apiKey: key,
    model = "llama3.2",
    prompt,
    system,
  } = await req.json();
  console.log(prompt, system);

  // const apiKey = key || process.env.OPENAI_API_KEY;

  // if (!apiKey) {
  //   return NextResponse.json(
  //     { error: "Missing OpenAI API key." },
  //     { status: 401 },
  //   );
  // }

  // const openai = createOpenAI({ apiKey });

  try {
    // const result = await generateText({
    //   abortSignal: req.signal,
    //   model: model,
    //   prompt: prompt,
    //   system,
    //   temperature: 0.7,
    // });

    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: "system",
          content: system,
        },
        { role: "user", content: prompt },
      ],
    });

    console.log(response);

    return NextResponse.json(response.message);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
