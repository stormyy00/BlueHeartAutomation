"use client";

import { useState, useEffect } from "react";
import Events from "./events";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Ellipsis, Loader, Save, Send } from "lucide-react";
import { EventType } from "@/types/event";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Popup } from "@/types/popup";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Editor from "@/components/novel/editror";
import { JSONContent } from "novel";
import { createEditor } from "@udecode/plate";
import { AIContext } from "@/context/ai-context";
import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Select from "@/components/global/select";
import { Organization } from "@/data/types";
import { TEMPLATES } from "@/data/newsletter/newsletter";
import { useNewsletterByIdQuery } from "@/server/useQuery";
import { ChevronDownIcon } from "lucide-react";
import { Calendar as Cal } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { defaultEditorContent } from "@/utils/content";

type NewsletterData = {
  body: string;
  status: string;
  subject: string;
  recipientGroup: string;
  scheduledDate: string | undefined;
  template: string;
};

const Creator = ({ org }: { org: Organization }) => {
  const [ai, setAI] = useState(false);
  const [data, setData] = useState<string[] | JSONContent | null>(null);
  const [popup, setPopup] = useState<Popup>({
    title: "",
    message: "",
    cancel: true,
    submit: true,
    visible: false,
  });
  const [newsletter, setNewsletter] = useState<NewsletterData>({
    body: "",
    status: "draft",
    subject: "",
    recipientGroup: "",
    scheduledDate: undefined,
    template: "modern",
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const pathname = usePathname();
  const id = pathname.split("/")[4];

  const handleSchedule = async () => {
    setScheduleLoading(true);
    const toastId = toast.loading(
      sending ? "Sending newsletter..." : "Scheduling newsletter...",
    );

    const millis = sending
      ? 0
      : typeof newsletter.scheduledDate === "string"
        ? new Date(newsletter.scheduledDate).getTime()
        : newsletter.scheduledDate;
    await fetch(`/api/newsletter/${id}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: millis,
        subject: newsletter.subject,
        recipientGroup: newsletter.recipientGroup,
        template: newsletter.template,
      }),
    }).catch((error) => {
      toast.error(
        sending ? "Failed to send newsletter" : "Failed to schedule newsletter",
        { id: toastId },
      );
      console.log(error);
      setScheduleLoading(false);
      return;
    });

    toast.success(
      sending
        ? "Newsletter sent successfully!"
        : "Newsletter scheduled successfully!",
      { id: toastId },
    );

    setScheduleLoading(false);
    setSending(false);
    setPopup({ ...popup, visible: false });
  };
  const handleEventsChange = (updatedEvents: EventType[]) => {
    console.log("Updated Events List in Parent:", updatedEvents);
    // setEvents(updatedEvents);
    // setEvents(updatedEvents)
  };

  const { data: newsletterData, isPending } = useNewsletterByIdQuery(id, {
    enabled: org?.name?.toLowerCase() !== "demo",
  });

  useEffect(() => {
    if (newsletterData) {
      const {
        newsletterData: {
          newsletter,
          status,
          scheduledDate,
          recipientGroup,
          subject,
        },
        template,
      } = newsletterData;

      let formattedContent;

      if (typeof newsletter === "string") {
        try {
          formattedContent = JSON.parse(newsletter);
        } catch {
          formattedContent = createBasicJSONContent(newsletter);
        }
      } else if (Array.isArray(newsletter)) {
        formattedContent = createBasicJSONContent(newsletter.join("\n"));
      } else {
        formattedContent = newsletter;
      }
      setNewsletter({
        body: formattedContent,
        status: status ?? "draft",
        scheduledDate: scheduledDate ?? null,
        recipientGroup: recipientGroup ?? "",
        subject: subject ?? "",
        template: template ?? "",
      });
      setIsLoading(!isPending);
    }
  }, [newsletterData, isPending]);

  const createBasicJSONContent = (text: string): JSONContent => {
    if (/\*\*|\*|__|~~/.test(text)) {
      const tempEditor = createEditor({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: [{ type: "paragraph", children: [{ text }] }],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (tempEditor as any).getJSON() as JSONContent;
    }

    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: text,
            },
          ],
        },
      ],
    };
  };

  const generateDocument = async () => {
    if (!data) return;

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
  const handleChange = (value: JSONContent) => {
    // console.log("Updated", value);
    setData(value);
  };

  if (error) {
    console.log("Failed");
    // replace with a toast
  }
  const textContent = newsletter?.body || "";

  const chatHelpers = useChat({
    id: "novel",
    api: "/api/ai/command",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const generateFromEvents = async (content: string[]) => {
    setAI(true);
    setEventLoading(true);
    const { append } = chatHelpers;
    await append({
      role: "user",
      content: content.join("\n"),
      data: {
        option: "general",
      },
    });
    setEventLoading(false);
  };

  if (org?.name?.toLowerCase() === "demo") {
    toast.info(
      "You are currently editing in Demo Mode. Your work will not be saved locally.",
    );
    return (
      <div className="flex flex-col gap-4 h-full w-11/12 m-10">
        <div className="font-extrabold text-3xl mb-8">
          Newsletter Editor (Demo)
        </div>
        <div className="flex h-full w-full">
          <div className="flex flex-col bg-white p-4 rounded-md border border-gray-100 shadow-sm w-full gap-4 h-full">
            <ScrollArea>
              <Editor
                ai={ai}
                setAI={setAI}
                chatHelpers={chatHelpers}
                onChange={handleChange}
                data={defaultEditorContent}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AIContext.Provider value={{ generateFromEvents }}>
      <div className="flex flex-col gap-4 h-full w-11/12 m-10">
        <div className="flex flex-row justify-between w-full">
          <div className="font-extrabold text-3xl mb-8">Newsletter</div>

          <div className="flex flex-row gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-teal-400 hover:bg-teal-400 hover:brightness-110 hover:text-white text-white transition duration-100"
                >
                  <Calendar />
                  Add Events
                </Button>
              </SheetTrigger>
            </Sheet>

            <Button
              disabled={!data}
              onClick={generateDocument}
              className="bg-ttickles-darkblue hover:bg-ttickles-darkblue hover:brightness-110 transition duration-100 text-white px-4 py-2 rounded disabled:opacity-50 w-fit"
            >
              {loading ? <Save /> : <Loader className="animate-spin" />}
              Save
            </Button>

            <Button
              className="bg-ttickles-orange hover:bg-ttickles-orange hover:brightness-110 transition duration-100"
              onClick={() => {
                setPopup({
                  ...popup,
                  visible: true,
                });
                setSending(false);
              }}
            >
              <Clock />
              Schedule
            </Button>
            <Button
              className="bg-ttickles-orange hover:bg-ttickles-orange hover:brightness-110 transition duration-100"
              onClick={() => {
                setPopup({
                  ...popup,
                  visible: true,
                });
                setSending(true);
              }}
            >
              <Send />
              Send
            </Button>
          </div>
        </div>

        <div className="flex  h-full w-full">
          <div className="flex flex-col bg-white p-4 rounded-md border border-gray-100 shadow-sm w-full gap-4 h-full">
            {newsletter.body ? (
              <ScrollArea>
                <Editor
                  ai={ai}
                  setAI={setAI}
                  chatHelpers={chatHelpers}
                  onChange={handleChange}
                  data={textContent as unknown as JSONContent}
                />
              </ScrollArea>
            ) : (
              <Ellipsis className="motion-preset-pulse-sm motion-duration-1000" />
            )}
          </div>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full max-w-md overflow-auto">
            <SheetHeader>
              <SheetTitle>Events</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Events
                onChange={handleEventsChange}
                eventLoading={eventLoading}
                setEventLoading={setEventLoading}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Dialog
          open={popup.visible}
          onOpenChange={(open) => setPopup({ ...popup, visible: open })}
        >
          <DialogContent className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow-xl">
            <DialogTitle>Schedule Newsletter</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <div className="flex flex-col gap-y-2">
                <Label className="font-bold">Subject</Label>
                <Input
                  type="text"
                  defaultValue={newsletter.subject}
                  onChange={(value) => {
                    const val = value.currentTarget.value;
                    setNewsletter((prev) => {
                      return { ...prev, subject: val };
                    });
                  }}
                />
                <Label className="font-bold">Recipient Group</Label>
                {org?.groups && (
                  <Select
                    options={org?.groups.map((group) => ({
                      label: group.name,
                      value: group.name,
                    }))}
                    onChange={(selected) =>
                      setNewsletter((prev) => {
                        return { ...prev, recipientGroup: selected };
                      })
                    }
                    placeholder="Select a Recipient"
                  />
                )}
                <Label className="font-bold">Newsletter Template</Label>
                <Select
                  options={TEMPLATES.map(({ title }) => ({
                    label: title,
                    value: title,
                  }))}
                  onChange={(selected) =>
                    setNewsletter((prev) => {
                      return { ...prev, template: selected };
                    })
                  }
                  placeholder="Select a Template"
                />
                {!sending && (
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="date-picker" className="px-1">
                        Date
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                          >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0 z-50 pointer-events-auto"
                          side="bottom"
                          align="start"
                        >
                          <Cal
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(selectedDate) => {
                              if (!selectedDate) return;

                              const updatedDate = new Date(selectedDate);
                              if (date) {
                                updatedDate.setHours(date.getHours());
                                updatedDate.setMinutes(date.getMinutes());
                                updatedDate.setSeconds(date.getSeconds());
                              }

                              setDate(updatedDate);
                              setOpen(false);

                              setNewsletter((old) => ({
                                ...old,
                                scheduledDate: updatedDate.toISOString(),
                              }));
                            }}
                            className="z-50"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="time-picker" className="px-1">
                        Time
                      </Label>
                      <Input
                        type="time"
                        id="time-picker"
                        step={300}
                        onChange={(e) => {
                          const timeVal = e.currentTarget.value;
                          if (!date) return;

                          const [hoursStr, minutesStr] = timeVal.split(":");
                          let hours = Number(hoursStr);
                          let minutes = Number(minutesStr);

                          minutes = Math.round(minutes / 5) * 5;
                          if (minutes === 60) {
                            minutes = 0;
                            hours = (hours + 1) % 24;
                          }

                          const updatedDate = new Date(date);
                          updatedDate.setHours(hours);
                          updatedDate.setMinutes(minutes);
                          updatedDate.setSeconds(0);
                          updatedDate.setMilliseconds(0);

                          setDate(updatedDate);

                          setNewsletter((old) => ({
                            ...old,
                            scheduledDate: updatedDate.toISOString(),
                          }));
                        }}
                        defaultValue={new Date().toTimeString().slice(0, 5)}
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
            <div className="flex flex-row self-end gap-2">
              <DialogClose asChild>
                <Button
                  className="px-4 py-1 rounded bg-white text-black hover:text-black hover:bg-white"
                  onClick={() => {
                    setPopup({ ...popup, visible: false });
                  }}
                  disabled={scheduleLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="bg-ttickles-blue hover:bg-ttickles-blue hover:text-white text-white px-3 py-1 rounded"
                onClick={handleSchedule}
                disabled={scheduleLoading}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AIContext.Provider>
  );
};

export default Creator;
