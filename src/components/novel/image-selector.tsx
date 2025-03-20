import React from "react";
import { EditorBubble, useEditor } from "novel";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/utils/utils";

export const WrappedImageSelector = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  const isWrappedImage = editor.isActive("wrappedImage");

  if (!isWrappedImage) return null;

  const currentAlignment =
    editor.getAttributes("wrappedImage").alignment || "left";

  const setAlignment = (alignment: "left" | "center" | "right") => {
    editor.commands.updateWrappedImageAlignment(alignment);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-1 text-muted-foreground hover:text-foreground",
          currentAlignment === "left" && "bg-accent text-foreground",
        )}
        onClick={() => setAlignment("left")}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-1 text-muted-foreground hover:text-foreground",
          currentAlignment === "center" && "bg-accent text-foreground",
        )}
        onClick={() => setAlignment("center")}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "p-1 text-muted-foreground hover:text-foreground",
          currentAlignment === "right" && "bg-accent text-foreground",
        )}
        onClick={() => setAlignment("right")}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
