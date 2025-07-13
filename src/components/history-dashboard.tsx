"use client";
import { Label } from "@/components/ui/label";
import NewsletterCard from "./history-card";

import { useState, useMemo } from "react";

import NewsletterToolbar from "@/components/newsletter/dashboard/newsletter-toolbar";
import { useHistoryQuery } from "@/server/useQuery";
import { Newsletter, searchable } from "@/utils/search";
import HistorySkeleton from "./history-skeleton";

// type props = {
//   newsletter: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newsletterId?: string | any;
//   newsletterStatus: string;
//   id: string;
//   newsletterTimestamp: string;
// };

const HistoryDashboard = () => {
  const { data = [], isPending } = useHistoryQuery();
  const [newsletterSearch, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [statusFilter, setStatusFilter] = useState("All");

  const searchableItems = useMemo(
    () => searchable(data as Newsletter[], newsletterSearch, statusFilter),
    [data, newsletterSearch, statusFilter],
  );

  return (
    <div className="flex flex-col w-11/12 m-10 mx-10 gap-4">
      <Label className="font-extrabold text-3xl">History</Label>
      <NewsletterToolbar
        search={newsletterSearch}
        onSearchChange={(val) => setSearch(val)}
        setStatusFilter={setStatusFilter}
        checked={checked}
        setChecked={setChecked}
      />
      {!isPending ? (
        <div className="flex flex-col gap-2">
          {searchableItems.map(
            (
              {
                newsletter,
                newsletterId,
                newsletterStatus,
                newsletterSentDate,
              },
              index,
            ) => (
              <NewsletterCard
                title={newsletter === " " ? "Untitled" : newsletter}
                id={newsletterId}
                status={newsletterStatus || "draft"}
                timestamp={newsletterSentDate}
                handleConfigure={() => console.log("yay")}
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
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <HistorySkeleton key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default HistoryDashboard;
