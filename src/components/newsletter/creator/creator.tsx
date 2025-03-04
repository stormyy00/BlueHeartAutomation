"use client";

import { useState, useEffect } from "react";
import Events from "./events";
import { PlateEditor } from "@/components/editor/plate-editor";
import { Button } from "@/components/ui/button";
import { Ellipsis, Loader } from "lucide-react";
import { EventType } from "@/types/event";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Popup } from "@/types/popup";
import Select from "@/components/global/select";
import { TIME } from "@/data/time";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduleModal from "./schedule-modal";
const Creator = () => {
  const [data, setData] = useState<string[] | null>(null);
  const [popup, setPopup] = useState<Popup>({
    title: "",
    message: "",
    cancel: true,
    submit: true,
    visible: false,
  });
  const [newsletter, setNewsletter] = useState({
    body: "",
    status: "draft",
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const pathname = usePathname();
  const id = pathname.split("/")[4];

  const handleSchedule = async () => {
    setScheduleLoading(true);
    const toastId = toast.loading("Scheduling newsletter...");
    console.log("CLIENT:", date);
    await fetch(`/api/newsletter/${id}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
      }),
    }).catch((error) => {
      toast.error("Failed to schedule newsletter", { id: toastId });
      console.log(error);
      setScheduleLoading(false);
      return;
    });

    toast.success("Newsletter scheduled successfully!", { id: toastId });

    setScheduleLoading(false);
    setPopup({ ...popup, visible: false });
  };
  const handleEventsChange = (updatedEvents: EventType[]) => {
    console.log("Updated Events List in Parent:", updatedEvents);
    // setEvents(updatedEvents);
    // setEvents(updatedEvents)
  };

  useEffect(() => {
    console.log(date);
    fetch(`/api/newsletter/${id}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const body = data.newsletterData.newsletter.join("\n");
        setNewsletter({
          body: body,
          status: data.newsletterData.status,
        });
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
      })
      .finally(() => console.log("done")); // toaast
  }, [id]);

  const generateDocument = async () => {
    if (!data || !data.length) return;

    setIsLoading(false);

    try {
      const res = await fetch(`/api/newsletter/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: data }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating Document:", error);
      setError(true);
    } finally {
      setIsLoading(true);
      toast.success("Newsletter saved successfully!");
    }
  };
  const handleChange = (value: string) => {
    console.log("Updated", value);
    setData(value.split("\n"));
  };

  if (error) {
    console.log("Failed");
    // replace with a toast
  }

  return (
    <div className="flex flex-col gap-4 h-full w-11/12">
      <div className="flex flex-row justify-between w-full">
        <div className="font-extrabold text-3xl mb-8">Newsletter</div>

        <div className="flex flex-row gap-3">
          {loading ? (
            <Button
              disabled={!data || !data.length}
              onClick={generateDocument}
              className="bg-ttickles-darkblue text-white px-4 py-2 rounded disabled:opacity-50 w-fit"
            >
              Save
            </Button>
          ) : (
            <Loader className="animate-spin" />
          )}
          <Button
            className="bg-ttickles-orange hover:bg-ttickles-orange"
            onClick={() => {
              setPopup({
                ...popup,
                visible: true,
              });
            }}
          >
            Schedule
          </Button>
        </div>
      </div>
      <div className="flex flex-row h-full gap-2 w-3/4">
        <div className="flex flex-col bg-black/5 p-4 rounded-md border border-black/20 w-full gap-4 h-full">
          {newsletter.body.length > 0 ? (
            <PlateEditor onChange={handleChange} value={newsletter.body} />
          ) : (
            <Ellipsis className="motion-preset-pulse-sm motion-duration-1000" />
          )}
        </div>
        <Events onChange={handleEventsChange} />
      </div>

      <Dialog
        open={popup.visible}
        onOpenChange={(open) => setPopup({ ...popup, visible: open })}
      >
        <DialogContent className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-xl">
          <DialogTitle>Schedule Newsletter</DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            <div>
              <Label>Date</Label>
              <ScheduleModal setDate={setDate} date={date} />
            </div>

            <div>
              <Label>Time</Label>
              <Select
                options={TIME}
                placeholder="Select Time"
                onChange={(timeString) => {
                  const newDate = date;
                  const [hours, period] = [
                    timeString.slice(0, -2),
                    timeString.slice(-2),
                  ];

                  // Convert to 24-hour format
                  let hour = parseInt(hours);
                  if (period === "PM" && hour < 12) hour += 12;
                  if (period === "AM" && hour === 12) hour = 0;

                  // Set the hours, keep minutes and seconds unchanged
                  newDate?.setHours(hour);
                  setDate(newDate);
                }}
              />
            </div>
          </DialogDescription>
          <div className="flex flex-row self-end gap-2">
            <DialogClose asChild>
              <Button
                className="px-3 py-1 rounded"
                onClick={() => {
                  setPopup({ ...popup, visible: false });
                  setDate(undefined);
                }}
                disabled={scheduleLoading}
              >
                Exit
              </Button>
            </DialogClose>
            <Button
              className="bg-ttickles-blue text-white px-3 py-1 rounded"
              onClick={handleSchedule}
              disabled={scheduleLoading}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Creator;
