"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Plus, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Organization, RecipientGroup } from "@/data/types";
import { toast } from "sonner";
import RecipientNew from "./recipient-new";

type Props = {
  org: Organization;
  checked: number[];
  setChecked: Dispatch<SetStateAction<number[]>>;
  setList: Dispatch<SetStateAction<RecipientGroup[]>>;
  list: RecipientGroup[];
};

const RecipientToolbar = ({
  checked,
  setChecked,
  setList,
  list,
  org,
}: Props) => {
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });
  const [adding, setAdding] = useState(false);

  // const ids = Object.keys(checked).filter((id) => checked[id]);

  const deleteGroup = () => {
    const newList = list.filter((val, index) => !checked.includes(index));
    setList(newList);
    const save = async () => {
      const toastId = toast.loading("Updating organization...");
      const response = await fetch(`/api/orgs/${org.id}`, {
        method: "POST",
        body: JSON.stringify({
          groups: newList,
        }),
      });
      if (response.ok) {
        toast.success(`${checked.length} group(s) deleted.`, { id: toastId });
      } else {
        toast.error("Unable to delete group(s)", { id: toastId });
      }
    };
    setChecked([]);
    save();
  };

  const confirmDelete = () => {
    if (checked.length === 0) {
      alert("No newsletters selected for deletion.");
      return;
    }

    setPopup({
      title: "Delete Confirmation",
      text: `Are you sure you want to delete ${checked.length > 1 ? `${checked.length} groups` : "1 group"}? This action is irreversible.`,
      color: "red",
      visible: true,
      onClick: deleteGroup,
      button: "Confirm",
    });
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <div className=" bg-ttickles-blue hover:bg-ttickles-blue hover:brightness-110 duration-300 p-2 rounded-xl cursor-pointer text-white flex flex-row items-center text-sm gap-2">
        <Plus size={20} onClick={() => setAdding(true)} />
        Add Group
      </div>
      <div className="bg-red-500 hover:bg-red-500 hover:brightness-110 duration-300 p-2 rounded-xl cursor-pointer text-white flex flex-row items-center text-sm gap-2">
        <Trash size={20} onClick={confirmDelete} />
        Delete Groups
      </div>

      <RecipientNew
        org={org}
        setList={setList}
        list={list}
        open={adding}
        setOpen={setAdding}
      />

      <AlertDialog open={popup.visible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>{popup.text}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPopup({ ...popup, visible: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                popup.onClick();
                setPopup({ ...popup, visible: false });
              }}
            >
              {popup.button}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecipientToolbar;
