"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Send, CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

const MOCK_CAMPAIGNS = [
  {
    id: "cmp-001",
    title: "Winter Food Drive 2025",
    description: "Raising awareness and donations for local food shelters.",
    status: "active",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    newsletters: [
      {
        id: "nl-1",
        title: "Week 1 Update",
        status: "sent",
        date: "2025-10-07",
      },
      {
        id: "nl-2",
        title: "Week 2 Highlights",
        status: "draft",
        date: "2025-10-14",
      },
    ],
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};

type Campaign = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
};

const Campaign = ({ cid, uid }: { cid: string; uid: string }) => {
  const router = useRouter();
  const [selectedNewsletter, setSelectedNewsletter] = useState({
    id: "",
    title: "",
    createdAt: "",
    status: "",
  });
  const [recipientGroup, setRecipientGroup] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);

  const {
    data: campaignData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["campaign", cid],
    queryFn: async () => {
      const resp = await fetch(`/api/campaigns/${cid}`);
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await resp.json();
      return data.items;
    },
    enabled: !!cid,
  }) as { data: Campaign; isPending: boolean; isError: boolean };

  if (isPending) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading campaign...
      </div>
    );
  }

  if (isError || !campaignData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Campaign not found.
      </div>
    );
  }

  const campaign = campaignData;
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">{campaign.title}</h1>
            <Badge className={statusColors[campaign.status]}>
              {campaign.status}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">{campaign.description}</p>
            <p className="text-sm text-muted-foreground">
              <div className="flex gap-6 mb-4">
                <p className="text-sm text-muted-foreground">
                  Created At:
                  <p>{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Updated:
                  <p>{new Date(campaign.updatedAt).toLocaleDateString()}</p>
                </p>
              </div>

              {/* {campaign.startDate} – {campaign.endDate} */}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaign.documents.length > 0 ? (
              campaign.documents.map(
                ({ id, title, createdAt, status }, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedNewsletter({ id, title, createdAt, status })
                    }
                    className={`flex items-center justify-between rounded-md border p-3 transition cursor-pointer ${
                      selectedNewsletter?.id === id
                        ? "bg-muted/40 border-primary"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{status}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/user/${uid}/documents/${id}`);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No newsletters yet for this campaign.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right side: Send options */}
      <div className="space-y-6">
        {selectedNewsletter ? (
          <Card className="border-none  shadow-none">
            <CardHeader>
              <CardTitle className="font-semibold">
                Send Options –{" "}
                <span className="text-ttickles-blue font-semibold text-lg">
                  {selectedNewsletter.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium">Recipient Group</p>
                <Select
                  value={recipientGroup}
                  onValueChange={setRecipientGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donors">Donors</SelectItem>
                    <SelectItem value="volunteers">Volunteers</SelectItem>
                    <SelectItem value="newsletter">
                      Newsletter Subscribers
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScheduleBox setScheduleDate={setScheduleDate} />

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setSelectedNewsletter({
                      id: "",
                      title: "",
                      createdAt: "",
                      status: "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedNewsletter.id === "") {
                      return alert("Please select a newsletter to send.");
                    }
                    alert(
                      `Sending "${selectedNewsletter.title}" to ${recipientGroup || "default group"}`,
                    );
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground border rounded-md">
            Select a newsletter to manage send options →
          </div>
        )}
      </div>
    </div>
  );
};

function ScheduleBox({
  setScheduleDate,
}: {
  setScheduleDate: (date: Date | undefined) => void;
}) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");

  return (
    <div className="space-y-3 w-full">
      <p className="text-sm font-medium">Schedule</p>

      <div className="flex w-full gap-4 items-end">
        <div className="border-none shadow-none  space-y-2 max-w-xs  flex-1">
          <p className="text-sm text-muted-foreground">Select Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="border-none shadcw-none  space-y-2">
          <p className="text-sm text-muted-foreground">Select Time</p>
          <Popover>
            <PopoverTrigger asChild>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 flex"
              align="start"
            ></PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setDate(undefined);
              setTime("");
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              if (!date || !time) {
                return alert("Please select both date and time");
              }
              const [hours, minutes] = time.split(":");
              const scheduled = new Date(date);
              scheduled.setHours(Number(hours), Number(minutes));
              setScheduleDate(scheduled);
              alert(`Newsletter scheduled for ${format(scheduled, "PPPP p")}`);
            }}
          >
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Campaign;
