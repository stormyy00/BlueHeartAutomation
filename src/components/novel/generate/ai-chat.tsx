"use client";

import { useState } from "react";
import { useChat, UseChatHelpers } from "@ai-sdk/react";
import { LoaderCircle, Send } from "lucide-react";
import { useEditor } from "novel";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatHelpers: UseChatHelpers;
}

const AIChatbot = ({ open, onOpenChange, chatHelpers }: AIChatbotProps) => {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { messages, append, isLoading, error, reload, setMessages } =
    chatHelpers;

  // Function to reset chat
  const resetChat = () => {
    setMessages([]);
  };

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;

    // Get the entire document content
    const documentContent = editor
      ? editor.storage.markdown.serializer.serialize(editor.state.doc)
      : "";

    append(
      {
        role: "user",
        content: inputValue,
      },
      {
        data: {
          option: "assist",
        },
      },
    );

    setInputValue("");
  };

  const insertIntoEditor = (content: string) => {
    if (!editor) {
      console.log("error");
      return;
    }
    editor.chain().focus().insertContent(content).run();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>AI Assistant</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-lg font-medium">How can I help you today?</p>
                <p className="text-sm mt-2">
                  Ask me anything about your document
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-ttickles-blue bg-opacity-65 text-white self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                <div className="prose prose-sm">
                  <Markdown>{message.content}</Markdown>
                </div>
                {message.role === "assistant" && (
                  <div className="flex gap-2 mt-2 self-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => insertIntoEditor(message.content)}
                    >
                      Insert to Editor
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="border-t p-4 flex-row">
          <div className="relative flex items-center w-full">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg py-3 px-4 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={1}
              style={{ maxHeight: "120px", minHeight: "44px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              size="icon"
              className="absolute right-2 h-8 w-8 rounded-full bg-ttickles-blue hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmit}
              disabled={isLoading || inputValue.trim() === ""}
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AIChatbot;
