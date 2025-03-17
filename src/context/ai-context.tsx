"use client";
import { createContext, useContext } from "react";

type AIContextType = {
  generateFromEvents: (content: string[]) => Promise<void>;
};

export const AIContext = createContext<AIContextType | null>(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
