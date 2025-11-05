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
import NewsletterListItem from "./newsletter-list";
import { Tabs } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
  const { id } = useParams();
  const { data = [], isPending } = useNewsletterQuery();
  const { data: campaignsData, isPending: isCampaignsPending } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
    enabled: !!id,
  });
  console.log("Campaigns Data:", campaignsData);
  const [newsletterSearch, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Fetch newsletter data using React Query
  const handleConfigure = (newsletterId: string, campaignId: string) => {
    setPopup({
      ...popup,
      title: "Configure Newsletter",
      message: (
        <NewsletterModal
          newsletter={newsletter}
          handleChange={handleChange}
          campaigns={campaignsData?.items || []}
          newsletterId={newsletterId || ""}
          campaignId={campaignId || ""}
        />
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
      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as "grid" | "list")}
      >
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
        {!isPending && !isCampaignsPending ? (
          searchableItems.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center py-16 rounded-xl ">
              <p className="text-gray-700 font-medium">
                You don{"'"}t have any newsletters yet.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Create your first newsletter to get started.
              </p>
              <div className="mt-4">
                <Button
                  className="bg-ttickles-blue text-white hover:bg-ttickles-blue"
                  onClick={() => {}}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                  {searchableItems.map(
                    (
                      {
                        newsletter,
                        newsletterId,
                        newsletterStatus,
                        preview,
                        campaignId,
                      },
                      index,
                    ) => (
                      <NewsletterCard
                        title={newsletter === " " ? "Untitled" : newsletter}
                        id={newsletterId}
                        handleConfigure={() =>
                          handleConfigure(newsletterId, campaignId)
                        }
                        status={newsletterStatus || "draft"}
                        preview={preview}
                        campaignId={campaignId}
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
                <div className="flex flex-col gap-3 mt-4">
                  <div className="px-4 py-0 flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="w-4"></div>
                    <div className="w-10"></div>
                    <div className="flex-1">Name</div>
                    <div className="w-16">Status</div>
                    <div className="w-16 hidden md:block">Date</div>
                    <div className="w-16">Actions</div>
                  </div>

                  {searchableItems.map(
                    (
                      {
                        newsletter,
                        newsletterId,
                        newsletterStatus,
                        preview,
                        date,
                        campaignId,
                      },
                      index,
                    ) => (
                      <NewsletterListItem
                        key={index}
                        title={newsletter === " " ? "Untitled" : newsletter}
                        id={newsletterId}
                        status={newsletterStatus || "draft"}
                        preview={preview}
                        date={date}
                        campaignId={campaignId}
                        handleConfigure={() =>
                          handleConfigure(newsletterId, campaignId)
                        }
                        onClick={() => {
                          setChecked({
                            ...checked,
                            [newsletterId]: !checked[newsletterId],
                          });
                        }}
                        checked={checked[newsletterId as keyof typeof checked]}
                      />
                    ),
                  )}
                </div>
              )}
            </>
          )
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, index) => (
              <NewsletterSkeleton key={index} />
            ))}
          </div>
        )}
      </Tabs>
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
                onClick={() => {
                  setPopup({ ...popup, visible: false });
                }}
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
