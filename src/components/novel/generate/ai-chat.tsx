"use client";

import { useState } from "react";
import { useChat, UseChatHelpers } from "@ai-sdk/react";
import { ArrowUp, LoaderCircle, Send } from "lucide-react";
import { useEditor } from "novel";
import Markdown from "react-markdown";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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

    append({
      role: "user",
      content: inputValue,
    });

    setInputValue("");
  };

  const insertIntoEditor = (content: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(content).run();
    // editor.chain().focus().deleteRange(range).insertContent("hello").run();
  };

  return (
    <div className="flex flex-col h-[400px] w-[400px] border rounded-lg shadow-lg bg-white overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b flex justify-between items-center bg-purple-50">
        {/* <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <h3 className="font-medium">AI Assistant</h3>
        </div> */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetChat();
            onOpenChange(false);
          }}
        >
          Close
        </Button>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
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
                  ? "bg-purple-100 self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {/* <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-ttickles-blue" : "bg-gray-500"
                  }`}
                > */}
                {/* <span className="text-white text-xs">
                    {message.role === "user" ? "You" : "AI"}
                  </span> */}
                {/* </div> */}
                {/* <span className="text-xs font-medium">
                  {message.role === "user" ? "You" : "Assistant"}
                </span> */}
              </div>
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

      <div className="border-t p-4">
        <div className="relative flex items-center">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg py-3 px-4 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-ttickles-blue"
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
            className="absolute right-2 h-8 w-8 rounded-full bg-ttickles-blue hover:bg-ttickles-darkblue text-white"
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
      </div>
    </div>
  );
};

export default AIChatbot;
