"use client";
import { defaultEditorContent } from "@/utils/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  // handleImageDrop,
  // handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extentions";
import { ColorSelector } from "@/components/novel/selectors/color-selector";
import { LinkSelector } from "@/components/novel/selectors/link-selector";
import { MathSelector } from "@/components/novel/selectors/math-selector";
import { NodeSelector } from "@/components/novel/selectors/node-selector";
import { Separator } from "@/components/ui/separator";

import GenerativeMenuSwitch from "@/components/novel/generate/menu-switch";
import { UseChatHelpers } from "@ai-sdk/react";
// import { uploadFn } from "./image-upload";
import { TextButtons } from "@/components/novel/selectors/text-button";
import { slashCommand, suggestionItems } from "./slash";

import hljs from "highlight.js";
import { Button } from "../ui/button";
import { Ellipsis, Sparkle } from "lucide-react";
import AIChatbot from "./generate/ai-chat";

const extensions = [...defaultExtensions, slashCommand];

type EditorProps = {
  chatHelpers: UseChatHelpers;
  onChange?: (json: JSONContent) => void;
  data?: JSONContent;
  ai: boolean;
  setAI: (value: boolean) => void;
  loading: string;
};

const TailwindAdvancedEditor = ({
  onChange,
  data,
  chatHelpers,
  ai,
  setAI,
  loading,
}: EditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null,
  );
  console.log(initialContent);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  useEffect(() => {
    if (data) {
      setInitialContent(data);
    } else {
      const savedContent = window.localStorage.getItem("novel-content");
      setInitialContent(
        savedContent ? JSON.parse(savedContent) : defaultEditorContent,
      );
    }
  }, [data]);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());

      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML()),
      );
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown(),
      );

      setSaveStatus("Saved");

      if (onChange) onChange(json);
    },
    500,
  );

  if (!initialContent) return null;

  return (
    <div className="flex flex-col bg-black/5 p-4 rounded-md border border-black/20 w-full gap-4 h-full">
      {!loading ? (
        <Ellipsis className="motion-preset-pulse-sm motion-duration-1000" />
      ) : (
        <div className="relative w-full max-w-screen-lg">
          <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
            <div className="rounded-lg bg-accent px-2 py-1 text-sm bg-white text-muted-foreground">
              {saveStatus}
            </div>
            <div
              className={
                charsCount
                  ? "rounded-lg bg-accent px-2 py-1 bg-white text-sm text-muted-foreground"
                  : "hidden"
              }
            >
              {charsCount} Words
            </div>
          </div>

          <EditorRoot>
            <Button
              className="gap-1 text-ttickles-blue border-muted bg-background mb-2 p-4 hover:bg-white"
              variant="ghost"
              onClick={() => setAI(!ai)}
              size="sm"
            >
              <Sparkle className="h-4 w-4" />
              Ask AI
            </Button>

            <EditorContent
              initialContent={initialContent}
              extensions={extensions}
              className="relative min-h-[500px] w-full p-8 border-gray-900 border-2 max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-sm"
              editorProps={{
                handleDOMEvents: {
                  keydown: (_view, event) => handleCommandNavigation(event),
                },
                // handleiPaste: (view, event) => handleImagePaste(view, event, uploadFn),
                // handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
                attributes: {
                  class:
                    "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                },
              }}
              onUpdate={({ editor }) => {
                debouncedUpdates(editor);
                setSaveStatus("Unsaved");
                const content = editor.getJSON();
                console.log("Editor content updated:", content);
              }}
              slotAfter={<ImageResizer />}
            >
              <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                <EditorCommandEmpty className="px-2 text-muted-foreground">
                  No results
                </EditorCommandEmpty>
                <EditorCommandList>
                  {suggestionItems.map((item) => (
                    <EditorCommandItem
                      value={item.title}
                      onCommand={(val) => item.command?.(val)}
                      className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                      key={item.title}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </EditorCommandItem>
                  ))}
                </EditorCommandList>
              </EditorCommand>

              <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
                <Separator orientation="vertical" />
                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                <Separator orientation="vertical" />

                <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                <Separator orientation="vertical" />
                <MathSelector />
                <Separator orientation="vertical" />
                <TextButtons />
                <Separator orientation="vertical" />
                <ColorSelector open={openColor} onOpenChange={setOpenColor} />
              </GenerativeMenuSwitch>

              {ai && (
                <div className=" absolute z-50 top-12 right-0 w-fit bg-background border border-muted rounded-md shadow-xl p-2">
                  <AIChatbot
                    open={ai}
                    onOpenChange={setAI}
                    chatHelpers={chatHelpers}
                  />
                </div>
              )}
            </EditorContent>
          </EditorRoot>
        </div>
      )}
    </div>
  );
};

export default TailwindAdvancedEditor;
