"use client";

import { useState, useEffect } from "react";
import Events from "./events";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Ellipsis, Loader, Save } from "lucide-react";
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

type NewsletterData = {
  body: string;
  status: string;
  subject: string;
  recipientGroup: string;
  scheduledDate: string | undefined;
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
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const pathname = usePathname();
  const id = pathname.split("/")[4];

  const handleSchedule = async () => {
    setScheduleLoading(true);
    const toastId = toast.loading("Scheduling newsletter...");
    await fetch(`/api/newsletter/${id}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: newsletter.scheduledDate,
        subject: newsletter.subject,
        recipientGroup: newsletter.recipientGroup,
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
        let formattedContent;

        if (typeof data.newsletterData.newsletter === "string") {
          try {
            formattedContent = JSON.parse(data.newsletterData.newsletter);
          } catch {
            formattedContent = createBasicJSONContent(
              data.newsletterData.newsletter,
            );
          }
        } else if (Array.isArray(data.newsletterData.newsletter)) {
          formattedContent = createBasicJSONContent(
            data.newsletterData.newsletter.join("\n"),
          );
        } else {
          formattedContent = data.newsletterData.newsletter;
        }

        setNewsletter({
          body: formattedContent,
          status: data.newsletterData.status,
          scheduledDate: data.newsletterData.scheduledDate,
          recipientGroup: data.newsletterData.recipientGroup ?? "",
          subject: data.newsletterData.subject ?? "",
        });
      })
      .catch((error) => {
        console.error("Error fetching newsletter:", error);
        toast.error("Failed to load newsletter content");
      });
  }, [id]);

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
    console.log("Updated", value);
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

  const formatDate = (date: string | number) => {
    const obj = new Date(date);
    obj.setMinutes(obj.getMinutes() - obj.getTimezoneOffset());
    return obj.toISOString().slice(0, 16);
  };

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
              }}
            >
              <Clock />
              Schedule
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
                <Select
                  options={org?.groups?.map((group) => ({
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
                <Label className="font-bold">Date & Time</Label>
                <Input
                  type="datetime-local"
                  defaultValue={formatDate(
                    newsletter.scheduledDate ?? Date.now(),
                  )}
                  onChange={(value) => {
                    const val = value.currentTarget.value;
                    setNewsletter((old) => {
                      return {
                        ...old,
                        scheduledDate: val,
                      };
                    });
                  }}
                />
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
