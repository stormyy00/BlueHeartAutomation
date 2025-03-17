"use client";
import { Label } from "@/components/ui/label";
import NewsletterCard from "./history-card";

import { useState, useEffect } from "react";

type props = {
  newsletter: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newsletterId?: string | any;
  newsletterStatus: string;
  id: string;
  newsletterTimestamp: string;
};

import NewsletterToolbar from "@/components/newsletter/dashboard/newsletter-toolbar";
import { Loader2 } from "lucide-react";

const HistoryDashboard = () => {
  const [newsletters, setNewsletters] = useState<props[]>([]);
  const [newsletterSearch, setSearch] = useState<props[]>([]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setNewsletters(data.newsletters);
        setSearch(data.newsletters);
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-col w-11/12 m-10 mx-10 gap-4">
      <Label className="font-extrabold text-3xl">History</Label>
      <NewsletterToolbar
        data={newsletters}
        setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        setNewsletters={setNewsletters}
      />
      {!loading ? (
        <div className="flex flex-col gap-2">
          {newsletterSearch.map(
            (
              {
                newsletter,
                newsletterId,
                newsletterStatus,
                newsletterTimestamp,
              },
              index,
            ) => (
              <NewsletterCard
                title={newsletter === " " ? "Untitled" : newsletter}
                id={newsletterId}
                status={newsletterStatus || "draft"}
                timestamp={newsletterTimestamp}
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
        <Loader2 size={35} />
      )}
    </div>
  );
};

export default HistoryDashboard;
