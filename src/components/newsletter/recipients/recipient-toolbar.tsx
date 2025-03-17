"use client";
import { useState } from "react";
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

const RecipientToolbar = () => {
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    // onClick: () => { },
    button: "",
  });

  // const ids = Object.keys(checked).filter((id) => checked[id]);

  const confirmDelete = () => {
    // if (ids.length === 0) {
    //   alert("No newsletters selected for deletion.");
    //   return;
    // }

    setPopup({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this group? This action is irreversible.",
      color: "red",
      visible: true,
      // onClick: deleteNewsletter,
      button: "Confirm",
    });
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <div className="bg-ttickles-lightblue hover:bg-ttickles-darkblue duration-300 p-2 rounded-xl cursor-pointer text-white">
        <Plus
          size={24}
          // onClick={handleNewletter}
        />
      </div>
      <div className="bg-red-500 hover:bg-red-700 duration-300 p-2 rounded-xl cursor-pointer text-white">
        <Trash size={24} onClick={confirmDelete} />
      </div>

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
                // popup.onClick();
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
