import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Search, Trash } from "lucide-react";
import Select from "../global/select";
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
import { useState } from "react";

type props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  setFilterStatus: (status: string) => void;
  getFilteredSelectedRowModel: () => {
    rows: Array<{ original: { id: string; name: string; email: string } }>;
  };
  refetch: () => void;
  checked: { [key: string]: boolean };
  isRefetching: boolean;
};

const Toolbar = ({
  searchValue,
  onSearchChange,
  setFilterStatus,
  getFilteredSelectedRowModel,
  refetch,
  checked,
  isRefetching,
}: props) => {
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });
  const role = "director";

  const selectedRows = getFilteredSelectedRowModel();
  const rows = selectedRows.rows.map(({ original }) => original);
  console.log("Selected Rows:", rows);

  const ids = Object.keys(checked).filter((id) => checked[id]);

  const handleDeleteNewsletter = () => {
    // deleteNewsletter(ids, {
    //   onSuccess: () => {
    //     toast.success("Member deleted successfully");
    //   },
    //   onError: () => {
    //     toast.error("Failed to delete member(s)");
    //   },
    // });
  };

  const confirmDelete = () => {
    if (ids.length === 0) {
      alert("No newsletters selected for deletion.");
      return;
    }

    setPopup({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this member? This action is irreversible.",
      color: "red",
      visible: true,
      onClick: handleDeleteNewsletter,
      button: "Confirm",
    });
  };

  return (
    <div className="flex flex-row items-center gap-2 w-full p-3 bg-white rounded-lg shadow-sm">
      <div className="relative w-full flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm"
        />
      </div>
      <Select
        options={[
          { label: "All", value: "all" },
          { label: "Administrator", value: "Administrator" },
          { label: "Moderator", value: "Moderator" },
          { label: "User", value: "User" },
        ]}
        placeholder="Filter by"
        onChange={(selected) => {
          setFilterStatus(selected);
        }}
      />
      {role === "director" && (
        <>
          <Button
            onClick={() => {
              console.log("Accept action");
            }}
            className="bg-ttickles-blue hover:bg-ttickles-blue/90 text-white"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              console.log("Reject action", { rows: rows.map((row) => row.id) });
            }}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Reject
          </Button>
          <Trash
            size={48}
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={confirmDelete}
          />
        </>
      )}
      <RefreshCcw
        size={48}
        className={`text-gray-500 hover:text-gray-700 cursor-pointer ${isRefetching ? "animate-spin" : ""}`}
        onClick={() => refetch()}
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

export default Toolbar;
