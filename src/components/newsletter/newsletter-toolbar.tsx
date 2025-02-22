import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";
import Select from "@/components/global/select";
// import { useRouter } from "next/navigation";
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

interface props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearch: (value: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];

  checked: { [key: string]: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setNewsletters: (value: any[]) => void;
}

const NewsletterToolbar = ({
  data,
  setSearch,
  checked,
  setNewsletters,
}: props) => {
  //   const router = useRouter();
  const [value, setValue] = useState("");
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });
  const ids = Object.keys(checked).filter((id) => checked[id]);
  const handleChange = (e: string) => {
    setValue(e);
    if (e === "") {
      setSearch(data);
    } else {
      const filter = data.filter((item) =>
        item.newsletter.toLowerCase().includes(e.toLowerCase()),
      );
      setSearch(filter);
    }
  };

  const handleNewletter = () => {
    fetch("/api/newsletter", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Created newsletter:", data);
        // router.push(`/newsletter/${data.newsletterId}`); slow loading
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

  const deleteNewsletter = () => {
    const keep = data.filter((item) => !ids.includes(item.newsletterId));

    setNewsletters(keep);
    fetch("/api/newsletter", {
      method: "DELETE",
      body: JSON.stringify({ newsletterId: ids }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then(() => {
        // window.location.reload();
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

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
      onClick: deleteNewsletter,
      button: "Confirm",
    });
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="search"
      />
      <Select />
      <Plus size={48} onClick={handleNewletter} className="cursor-pointer" />
      <Trash size={48} onClick={confirmDelete} className="cursor-pointer" />
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
