"use client";

import { Command, CommandInput } from "@/components/ui/command";

import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import { useEditor } from "novel";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { LoaderCircle } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import AICompletionCommands from "./ai-complete";
import AISelectorCommands from "./ai-select-command.";

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatSelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { messages, append, isLoading, error, reload, setMessages } = useChat({
    api: "/api/ai/command",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  // Get the latest AI response
  const latestAiMessage =
    messages.filter((message) => message.role === "assistant").pop()?.content ||
    "";

  const hasCompletion = latestAiMessage.length > 0;

  // Function to reset AI state
  const resetAIState = () => {
    setMessages([]);
  };

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;

    // Get the entire document content
    const documentContent = editor
      ? editor.storage.markdown.serializer.serialize(editor.state.doc)
      : "";

    // If we have a previous completion, we're doing a follow-up interaction
    if (hasCompletion) {
      append({
        role: "user",
        content: inputValue,
        body: {
          option: "zap",
          command: inputValue,
          previousContent: latestAiMessage,
        },
      });
    } else {
      // Initial interaction - passing the entire document
      append({
        role: "user",
        content: inputValue,
        body: {
          option: "zap",
          command: inputValue,
          documentContent: documentContent,
        },
      });
    }

    setInputValue("");
  };

  // Function to insert content into the editor
  const insertIntoEditor = (content: string) => {
    if (!editor) return;

    // Insert the content at the current cursor position
    editor.commands.insertContent(content);

    // Close the AI selector and clear the completion
    onOpenChange(false);
    resetAIState();
  };

  return (
    <Command className="w-[350px]">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{latestAiMessage}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          AI is thinking
          <div className="ml-2 mt-1">
            <LoaderCircle className="animate-spin" />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={
                hasCompletion
                  ? "Tell AI what to do next"
                  : "Ask AI to edit or generate..."
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
              onClick={handleSubmit}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          {hasCompletion ? (
            <div className="flex flex-col space-y-2 p-2">
              <AICompletionCommands
                onDiscard={() => {
                  resetAIState();
                  onOpenChange(false);
                }}
                onInsert={() => {
                  insertIntoEditor(latestAiMessage);
                }}
                onReplace={() => {
                  // The replace logic is handled in the AICompletionCommands component
                  resetAIState();
                  onOpenChange(false);
                }}
                completion={latestAiMessage}
              />
              <Button
                className="w-full bg-purple-500 hover:bg-purple-700 text-white"
                onClick={() => insertIntoEditor(latestAiMessage)}
              >
                Insert into Editor
              </Button>
            </div>
          ) : (
            <AISelectorCommands
              onSelect={(value, option) => {
                append({
                  role: "user",
                  content: value,
                  body: { option },
                });
              }}
            />
          )}
        </>
      )}
    </Command>
  );
}
