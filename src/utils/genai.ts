import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider";

const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});
const geminiModel = "gemini-2.0-flash";

const ollama = createOllama({
  /* your config */
  baseURL: process.env.OLLAMA_URL || "http://localhost:11434",
});
const ollamaModel = "llama3.2";

export const googleProvider = genAI(geminiModel);
export const ollamaProvider = ollama(ollamaModel);
