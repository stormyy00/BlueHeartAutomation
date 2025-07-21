"use client";
import { Label } from "@/components/ui/label";
import NewsletterCard from "./newsletter-card";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useState, ChangeEvent, useMemo } from "react";
import { NewsletterType } from "@/types/newsletter";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import NewsletterToolbar from "./newsletter-toolbar";
import { Popup } from "@/types/popup";
import NewsletterModal from "./newsletter-modal";
import { useNewsletterQuery } from "@/server/useQuery";
import NewsletterSkeleton from "./newsletter-skeleton";
import { Newsletter, searchable } from "@/utils/search";

// type props = {
//   newsletter: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newsletterId?: string | any;
//   newsletterStatus: string;
//   id: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handleConfigure: () => void;
// };

const NewsletterDashboard = () => {
  const { data = [], isPending } = useNewsletterQuery();
  const [newsletterSearch, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [statusFilter, setStatusFilter] = useState("All");

  const [popup, setPopup] = useState<Popup>({
    title: "",
    message: "",
    visible: false,
    cancel: true,
    submit: true,
  });

  const [newsletter, setNewsletter] = useState<NewsletterType>({
    to: "",
    subject: "",
    preview: "",
    body: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setNewsletter({ ...newsletter, [key]: e.target.value });
  };

  const handleConfigure = () => {
    setPopup({
      ...popup,
      title: "Configure Newsletter",
      message: (
        <NewsletterModal newsletter={newsletter} handleChange={handleChange} />
      ),
      visible: true,
    });
  };

  const searchableItems = useMemo(
    () => searchable(data as Newsletter[], newsletterSearch, statusFilter),
    [data, newsletterSearch, statusFilter],
  );

  return (
    <div className="flex flex-col w-11/12 m-10 gap-4">
      <Label className="font-extrabold text-3xl">Newsletter</Label>
      <NewsletterToolbar
        search={newsletterSearch}
        onSearchChange={(val) => setSearch(val)}
        // data={data}
        setStatusFilter={setStatusFilter}
        // setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        // setNewsletters={setNewsletters}
      />
      {!isPending ? (
        <div className="grid grid-cols-3 gap-5">
          {searchableItems.map(
            ({ newsletter, newsletterId, newsletterStatus }, index) => (
              <NewsletterCard
                title={newsletter === " " ? "Untitled" : newsletter}
                id={newsletterId}
                handleConfigure={handleConfigure}
                status={newsletterStatus || "draft"}
                onClick={() => {
                  setChecked({
                    ...checked,
                    [newsletterId]: !checked[newsletterId],
                  });
                }}
                checked={checked[newsletterId as keyof typeof checked]}
                key={index}
              />
            ),
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <NewsletterSkeleton key={index} />
          ))}
        </div>
      )}
      <AlertDialog open={popup.visible}>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>{popup.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="flex flex-col gap-4">
            {popup.message}
          </AlertDialogDescription>

          <div className="flex flex-row self-end gap-2">
            <AlertDialogCancel
              onClick={() => setPopup({ ...popup, visible: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button
                onClick={() => setPopup({ ...popup, visible: false })}
                className="bg-ttickles-blue text-white hover:bg-ttickles-blue"
              >
                Submit
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsletterDashboard;
