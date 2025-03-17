"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Organization, RecipientGroup } from "@/data/types";
import { Info, User, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { toast } from "sonner";

// const MOCK_RECIPIENTS: RecipientGroup[] = [
//   {
//     name: "Donors",
//     emails: ["spacerocket62@gmail.com", "therealphoenix62@gmail.com"],
//   },
//   {
//     name: "Donors 2",
//     emails: ["msaye007@ucr.edu", "citrushack@gmail.com"],
//   },
// ];

type Props = {
  org: Organization;
};

const Recipients = ({ org }: Props) => {
  const [list, setList] = useState<RecipientGroup[]>(org.groups ?? []);
  const [group, setGroup] = useState<[number, RecipientGroup]>([
    -1,
    {
      name: "",
      emails: [],
    },
  ]);
  const [open, setOpen] = useState(false);
  const [recipientInput, setRecipientInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "Space") &&
      recipientInput.trim() !== ""
    ) {
      setGroup((prev) => {
        const emails = [...prev[1].emails, recipientInput.trim()];
        return [prev[0], { ...prev[1], emails: emails }];
      });
      setRecipientInput("");
      e.preventDefault();
    }
    if (e.key === "Backspace" && recipientInput === "") {
      console.log("hmmm");
      setGroup((prev) => {
        const emails = prev[1].emails.slice(0, prev[1].emails.length - 1);
        return [prev[0], { ...prev[1], emails: emails }];
      });
    }
  };
  const handleSave = () => {
    const save = async (groups: RecipientGroup[]) => {
      const toastId = toast.loading("Updating organization...");
      setFetching(true);
      const response = await fetch(`/api/orgs/${org.id}`, {
        method: "POST",
        body: JSON.stringify({
          groups,
        }),
      });
      if (response.ok) {
        toast.success("Recipients list was saved", { id: toastId });
      } else {
        toast.error("Unable to save recipients list", { id: toastId });
      }
      setFetching(false);
    };
    setList((old) => {
      const newItems = [...old];
      newItems[group[0]] = group[1];
      return newItems;
    });
    const newItems = [...list];
    newItems[group[0]] = group[1];
    save(newItems);
  };
  return (
    <div className="w-full h-full flex flex-col items-center gap-y-6">
      {list.map((group, index) => (
        <div
          key={index}
          className="w-1/2 bg-white flex flex-row justify-between rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer p-4"
          onClick={() => {
            setOpen(true);
            setGroup([index, group]);
          }}
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-x-1">
              <Checkbox
                checked={false}
                className="h-3 w-3 text-gray-900 rounded-full border-gray-300 focus:ring-gray-900"
              />
              RECIPIENT GROUP
            </span>
            <span className="font-bold">{group.name}</span>
          </div>
          <span className="flex items-center rounded-xl bg-ttickles-lightblue w-12 h-2/6 py-3 px-1 gap-x-1 text-sm text-white justify-center">
            <User size={20} /> {group.emails.length}
          </span>
        </div>
      ))}
      <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
        <DialogContent className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-xl">
          <DialogTitle>Edit Recipients</DialogTitle>
          <DialogDescription className="flex items-center gap-x-1 ml-2">
            <Info /> Edit the recipients attached to this group
          </DialogDescription>
          <div className="flex flex-col gap-y-4 mt-4">
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded focus-within:border-blue-500 overflow-auto">
              <ul className="flex text-xs gap-x-1">
                {group[1].emails.map((email, index) => (
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
                className="px-3 py-1 rounded"
                onClick={() => {
                  setOpen(false);
                  setGroup([
                    -1,
                    {
                      name: "",
                      emails: [],
                    },
                  ]);
                }}
                disabled={fetching}
              >
                Exit
              </Button>
            </DialogClose>
            <Button
              className="bg-ttickles-blue text-white px-3 py-1 rounded"
              onClick={handleSave}
              disabled={fetching}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recipients;
