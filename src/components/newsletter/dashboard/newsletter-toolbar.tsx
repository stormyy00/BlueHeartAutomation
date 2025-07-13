import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/global/select";
import { STATUSES } from "@/data/newsletter/toolbar";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import {
  useAddNewsletterMutation,
  useDeleteNewsletterMutation,
} from "@/server/mutateQuery";

interface props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: string;
  onSearchChange: (value: string) => void;
  // setSearch: (value: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];

  checked: { [key: string]: boolean };
  setChecked: (value: { [key: string]: boolean }) => void;
  setStatusFilter: (value: string) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // setNewsletters: (value: any[] | ((prev: any[]) => any[])) => void;
}

const NewsletterToolbar = ({
  search,
  onSearchChange,
  data,
  setStatusFilter,

  checked,
}: props) => {
  const router = useRouter();
  // const [value, setValue] = useState("");
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });
  const { mutate: addNewsletter } = useAddNewsletterMutation();
  const { mutate: deleteNewsletter } = useDeleteNewsletterMutation();

  const ids = Object.keys(checked).filter((id) => checked[id]);

  const handleNewletter = () => {
    addNewsletter(undefined, {
      onSuccess: ({ newsletterId }) => {
        router.push(`newsletter/${newsletterId}`);
      },
      onError: (error) => {
        toast.error("Failed to create newsletter");
      },
    });
  };

  const handleDeleteNewsletter = () => {
    deleteNewsletter(ids, {
      onSuccess: () => {
        toast.success("Deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete newsletter(s)");
      },
    });
  };
  // const handleDeleteNewsletter = () => {
  // const keep = data.filter((item) => !ids.includes(item.newsletterId));
  // console.log("keep", keep);

  // setSearch(keep);
  // setNewsletters(keep);
  // fetch("/api/newsletter", {
  //   method: "DELETE",
  //   body: JSON.stringify({ newsletterId: ids }),
  // })
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }
  //   })
  // .then(() => {
  //   toast.success("Deleted successfully");
  // })
  // .catch((error) => {
  //   console.error("Error creating newsletters:", error);
  // });

  const confirmDelete = () => {
    if (ids.length === 0) {
      alert("No newsletters selected for deletion.");
      return;
    }

    setPopup({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this newsletter This action is irreversible.",
      color: "red",
      visible: true,
      onClick: handleDeleteNewsletter,
      button: "Confirm",
    });
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        value={search}
        className="bg-white shadow-none"
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="search"
      />
      <Select
        options={STATUSES.map(({ status }) => ({
          label: status,
          value: status,
        }))}
        onChange={(selected) => {
          setStatusFilter(selected);
        }}
        placeholder="filter by status"
      />
      <Plus
        size={48}
        onClick={handleNewletter}
        className="cursor-pointer text-gray-500"
      />
      <Trash
        size={48}
        onClick={confirmDelete}
        className="cursor-pointer text-gray-500"
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

export default NewsletterToolbar;
