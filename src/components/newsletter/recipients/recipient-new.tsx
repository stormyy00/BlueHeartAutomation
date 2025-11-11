import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FullOrganization } from "@/types/organization";
import { RecipientGroup } from "@/types/metadata";
import { X } from "lucide-react";
import { Dispatch, KeyboardEvent, SetStateAction, useState } from "react";
import { toast } from "sonner";
type Props = {
  orgId: string | null;
  open: boolean;
  list: RecipientGroup[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setList: Dispatch<SetStateAction<RecipientGroup[]>>;
};

const RecipientNew = ({ open, setOpen, setList, list, orgId }: Props) => {
  const [recipientInput, setRecipientInput] = useState("");
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "Space") &&
      recipientInput.trim() !== ""
    ) {
      setEmails((prev) => {
        return [...prev, recipientInput.trim()];
      });
      setRecipientInput("");
      e.preventDefault();
    }
    if (e.key === "Backspace" && recipientInput === "") {
      setEmails((prev) => {
        const emails = prev.slice(0, prev.length - 1);
        return emails;
      });
    }
  };
  const handleCreate = () => {
    const newList = [
      ...list,
      {
        name: groupName,
        emails: emails,
      },
    ];
    setList(newList);
    const create = async () => {
      const toastId = toast.loading("Adding new group to organization...");
      setFetching(true);
      const response = await fetch(`/api/orgs/${orgId}`, {
        method: "POST",
        body: JSON.stringify({
          groups: newList,
        }),
      });
      if (response.ok) {
        toast.success("Group has been created!", { id: toastId });
        setRecipientInput("");
        setEmails([]);
        setOpen(false);
      } else {
        toast.error("Unable to create group.", { id: toastId });
      }
      setFetching(false);
    };
    create();
  };
  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogContent className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-xl">
        <DialogTitle>Add Recipient Group</DialogTitle>
        <DialogDescription className="flex items-center gap-x-1">
          Create a new recipient group
        </DialogDescription>
        <div className="flex flex-col gap-y-4 mt-4">
          <Label>Group Name</Label>

          <input
            type="text"
            placeholder="Enter name"
            className="flex-grow p-2 text-sm border border-gray-300 rounded"
            onChange={(value) => setGroupName(value.currentTarget.value)}
          />
          <Label>Recipients</Label>

          <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded focus-within:border-blue-500 overflow-auto">
            <ul className="flex text-xs gap-x-1">
              {emails.map((email, index) => (
                <li
                  key={index}
                  className="px-2 py-1 bg-ttickles-darkblue text-white rounded-md flex items-center gap-x-1"
                >
                  {email} <X size={20} />
                </li>
              ))}
            </ul>
            <input
              type="email"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter email"
              className="flex-grow p-1 text-sm border-none focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-row self-end gap-2">
          <DialogClose asChild>
            <Button
              className="px-3 py-1 rounded bg-white text-black hover:bg-white border border-black"
              onClick={() => {
                setOpen(false);
                setEmails([]);
              }}
              disabled={fetching}
            >
              Exit
            </Button>
          </DialogClose>
          <Button
            className="bg-ttickles-blue text-white px-3 py-1 rounded"
            onClick={handleCreate}
            disabled={fetching}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientNew;
