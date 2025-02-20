import { generateText } from "ai";
import type { NextRequest } from "next/server";

// import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { createOllama } from "ollama-ai-provider";
const ollama = createOllama();

export async function POST(req: NextRequest) {
  // console.log(await req.json())
  const { prompt, system } = await req.json();
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
    const result = await generateText({
      abortSignal: req.signal,
      model: ollama("llama3.2"),
      prompt: prompt,
      system,
      temperature: 0.7,
    });

    // const response = await ollama.chat({
    //   model: "llama3.2",
    //   messages: [
    //     {
    //       role: "system",
    //       content: system,
    //     },
    //     { role: "user", content: prompt },
    //   ],
    // });
    return NextResponse.json(result);
  } catch (error: any) {
    console.log("error", error);
    if (error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
