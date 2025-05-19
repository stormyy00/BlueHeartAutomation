import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json();

    const contents = messages.map(
      ({ role, content }: { role: string; content: string }) => ({
        role: role, // "user" or "model"
        parts: [{ text: content }],
      }),
    );

    console.log("Contents:", contents);

    const result = await model.generateContent({ contents });
    const text = await result.response.text();
    console.log("Response:", text);
    return NextResponse.json({ text }); // ✅ Ensure you return a response
  } catch (error) {
    console.error("Error in /api/test:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
