"use client";

import { useState, useEffect } from "react";
import Events from "./events";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader, Save, Send } from "lucide-react";
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
import Editor from "@/components/novel/editor";
import { JSONContent } from "novel";
import { createEditor } from "@udecode/plate";
import { AIContext } from "@/context/ai-context";
import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Select from "@/components/global/select";
import { LegacyOrganization as Organization } from "@/types/organization";
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type NewsletterData = {
  body: JSONContent | string;
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
  console.log("Newsletter State:", newsletter);
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
          content,
          status,
          scheduledDate,
          recipientGroup,
          subject,
        },
        template,
      } = newsletterData;

      let formattedContent;

      if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          // If it's already a proper doc structure, use it
          if (
            parsed &&
            typeof parsed === "object" &&
            parsed.type === "doc" &&
            Array.isArray(parsed.content)
          ) {
            formattedContent = parsed;
          } else if (Array.isArray(parsed)) {
            // If it's an array of nodes, wrap in doc
            formattedContent = { type: "doc", content: parsed };
          } else {
            formattedContent = createBasicJSONContent(content);
          }
        } catch {
          formattedContent = createBasicJSONContent(content);
        }
      } else if (Array.isArray(content)) {
        formattedContent = { type: "doc", content };
      } else if (
        content &&
        typeof content === "object" &&
        content.type === "doc"
      ) {
        // Already a proper doc structure
        formattedContent = content;
      } else {
        formattedContent = content;
      }
      setNewsletter({
        body: formattedContent as JSONContent,
        status: status ?? "draft",
        scheduledDate: (scheduledDate as string | undefined) ?? undefined,
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
    const payload = data ?? textContent;
    if (!payload) return;

    setIsLoading(false);

    try {
      const res = await fetch(`/api/newsletter/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: payload,
          title: newsletter.subject || "Untitled",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating Document:", error);
      setError(true);
    } finally {
      setIsLoading(true);
    }
  };
  const handleChange = (value: JSONContent) => {
    // console.log("Updated", value);
    setData(value);
  };

  // Auto-save title changes with debouncing
  const [titleTimeout, setTitleTimeout] = useState<NodeJS.Timeout | null>(null);
  const [titleSaveStatus, setTitleSaveStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");

  const handleTitleChange = (newTitle: string) => {
    setNewsletter((prev) => ({
      ...prev,
      subject: newTitle,
    }));

    setTitleSaveStatus("unsaved");

    // Clear existing timeout
    if (titleTimeout) {
      clearTimeout(titleTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(async () => {
      setTitleSaveStatus("saving");
      try {
        await fetch(`/api/newsletter/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document: data || textContent,
            title: newTitle || "Untitled",
          }),
        });
        setTitleSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save title:", error);
        setTitleSaveStatus("unsaved");
      }
    }, 1000);

    setTitleTimeout(timeout);
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
      <div className="flex flex-col h-screen bg-gray-50 w-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-4">
              <Input
                value={newsletter.subject}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Newsletter title..."
                className={`text-2xl font-semibold text-gray-900 px-3 py-2 rounded-md transition-colors ${
                  titleSaveStatus === "saved"
                    ? "hover:border-green-300 hover:bg-green-50"
                    : titleSaveStatus === "saving"
                      ? "hover:border-yellow-300 hover:bg-yellow-50"
                      : "hover:border-gray-300 hover:bg-white"
                }`}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Add Events
                  </Button>
                </SheetTrigger>
              </Sheet>

              <Button
                disabled={!data}
                onClick={generateDocument}
                size="sm"
                className="bg-ttickles-darkblue hover:bg-ttickles-lightblue text-white disabled:opacity-50"
              >
                {loading ? (
                  <Save className="w-4 h-4 mr-1" />
                ) : (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                onClick={() => {
                  setPopup({ ...popup, visible: true });
                  setSending(false);
                }}
              >
                <Clock className="w-4 h-4 mr-1" />
                Schedule
              </Button>

              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  setPopup({ ...popup, visible: true });
                  setSending(true);
                }}
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-2 w-full">
            <Card className="w-full border-0 h-full shadow-sm border-gray-200">
              <CardContent className="p-0 h-full">
                {newsletter.body ? (
                  <ScrollArea className="h-full">
                    <div className="p-6">
                      <Editor
                        ai={ai}
                        setAI={setAI}
                        chatHelpers={chatHelpers}
                        onChange={handleChange}
                        data={textContent as unknown as JSONContent}
                      />
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col gap-4 p-6 h-full w-full">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full max-w-md">
            <SheetHeader className="pb-4">
              <SheetTitle>Events</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full">
              <Events
                onChange={handleEventsChange}
                eventLoading={eventLoading}
                setEventLoading={setEventLoading}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Dialog
          open={popup.visible}
          onOpenChange={(open) => setPopup({ ...popup, visible: open })}
        >
          <DialogContent className="sm:max-w-md">
            <DialogTitle>
              {sending ? "Send Newsletter" : "Schedule Newsletter"}
            </DialogTitle>

            <DialogDescription asChild>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="font-bold">Newsletter Template</Label>
                  <Input
                    id="subject"
                    type="text"
                    defaultValue={newsletter.subject}
                    onChange={(e) => {
                      setNewsletter((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }));
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
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
                </div>
                <div className="space-y-2">
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
                </div>
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
            <div className="flex flex-row justify-end gap-3">
              <DialogClose asChild>
                <Button
                  className="px-4 py-1 rounded border bg-white border-black/20 text-black hover:text-black hover:bg-white"
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
