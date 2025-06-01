import { streamText } from "ai";
import { NextResponse, NextRequest } from "next/server";
import { googleProvider } from "@/utils/genai";

//   tools: [
//     {
//       codeExecution: {},
//     },
//   ],

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

export const POST = async (req: NextRequest) => {
  try {
    const { messages } = await req.json();

    console.log(messages);

    const result = await streamText({
      model: googleProvider,
      system: "You are a helpful assistant.",
      prompt: messages[0].content,
    });
    console.log(result);
    for await (const textPart of result.textStream) {
      console.log(textPart); // Confirms streaming works in backend
    }

    return result.toDataStreamResponse(); // Returns the response
  } catch (error) {
    console.error(error);
    return new NextResponse("Error processing request", { status: 500 });
  }
};
