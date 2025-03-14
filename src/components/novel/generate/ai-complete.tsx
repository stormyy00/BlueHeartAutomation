import { CommandGroup, CommandItem, CommandSeparator } from "../../ui/command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon, ArrowDownToLine } from "lucide-react";

interface AICompletionCommandsProps {
  completion: string;
  onDiscard: () => void;
  onInsert: () => void;
  onReplace: () => void;
}

const AICompletionCommands = ({
  completion,
  onDiscard,
  onInsert,
  onReplace,
}: AICompletionCommandsProps) => {
  const { editor } = useEditor();

  return (
    <CommandGroup heading="Apply completion">
      <CommandItem
        onSelect={() => {
          if (!editor) return;
          const { from, to } = editor.state.selection;

          // Insert the completion at cursor
          editor
            .chain()
            .focus()
            .insertContentAt({ from, to }, completion)
            .run();

          // Call the onInsert callback to reset the AI state
          onInsert();
        }}
        value="insert"
        className="gap-2 px-4"
      >
        <Check className="h-4 w-4 text-purple-500" />
        Insert at cursor
      </CommandItem>

      <CommandItem
        onSelect={() => {
          if (!editor) return;
          const { from, to } = editor.state.selection;

          // Replace the selected text with the completion
          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContentAt(from, completion)
            .run();

          // Call the onReplace callback to reset the AI state
          onReplace();
        }}
        value="replace"
        className="gap-2 px-4"
      >
        <TextQuote className="h-4 w-4 text-purple-500" />
        Replace selection
      </CommandItem>

      <CommandItem
        onSelect={() => {
          if (!editor) return;

          // Get the current position
          const { pos } = editor.view.state.selection.$head;

          // Insert the completion at the end of the document
          const endPos = editor.state.doc.content.size;
          editor
            .chain()
            .focus()
            .insertContentAt(endPos, "\n\n" + completion)
            .run();

          // Call the onInsert callback to reset the AI state
          onInsert();
        }}
        value="append"
        className="gap-2 px-4"
      >
        <ArrowDownToLine className="h-4 w-4 text-purple-500" />
        Append to document
      </CommandItem>

      <CommandItem onSelect={onDiscard} value="discard" className="gap-2 px-4">
        <TrashIcon className="h-4 w-4 text-purple-500" />
        Discard
      </CommandItem>
    </CommandGroup>
  );
};

export default AICompletionCommands;
