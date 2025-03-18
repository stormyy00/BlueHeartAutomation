/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Plus, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Event from "./event";
import { useEffect, useState } from "react";
import { Popup } from "@/types/popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QUESTIONS } from "@/data/newsletter/event";
import { ChangeEvent } from "react";
import { EventType } from "@/types/event";
import { toast } from "sonner";
import Loading from "@/components/global/loading";

type props = {
  setEvent: (value: (prevEvent: EventType) => EventType) => void;
};
type EventsProps = {
  onChange: (updatedEvent: EventType[]) => void;
  eventLoading: boolean;
  setEventLoading: (value: boolean) => void;
};
const EventModal = ({ setEvent }: props) => {
  return (
    <>
      {QUESTIONS.map((question, index) => (
        <div key={index} className="flex flex-col gap-2 mb-2">
          <Label className="font-bold">{question.title}</Label>
          {question.type === "input" && (
            <Input
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEvent((prevEvent: EventType) => ({
                  ...prevEvent,
                  [question.key]: e.target.value as EventType[keyof EventType],
                }));
              }}
            />
          )}
          {question.type === "textarea" && (
            <Textarea
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setEvent((prevEvent: EventType) => ({
                  ...prevEvent,
                  [question.key as keyof EventType]: e.target.value,
                }));
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

const Events = ({ onChange, eventLoading, setEventLoading }: EventsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [event, setEvent] = useState<EventType>(() => ({
    name: "",
    description: "",
    location: "",
    date: "",
  }));

  const [popup, setPopup] = useState<Popup>({
    title: "",
    message: "",
    visible: false,
    cancel: false,
    submit: false,
  });

  const handleSubmit = () => {
    console.log("Current Event State:", event); // Debugging
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, event];
      onChange(updatedEvents);
      return updatedEvents;
    });
    setEvent({ name: "", description: "", location: "", date: "" }); // Reset form
    setPopup({ ...popup, visible: false }); // Close modal
  };

  const handleFetch = async () => {
    setLoading(true);
    const { calendarId } = await fetch("/api/events", {
      method: "GET",
    }).then((response) => {
      if (response.status !== 200) {
        toast("Failed to fetch calendarId");
      }
      return response.json();
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}&singleEvents=true&orderBy=startTime`,
    );
    if (!response.ok) {
      toast("Failed to fetch calendar events");
      setLoading(false);
      return;
    }
    const data = await response.json();
    const newEvents = data.items.map((event: any) => ({
      name: event.summary,
      description: event.description,
      location: event.location,
      date: event.start.dateTime,
    }));
    setEvents(newEvents);
    setLoading(false);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="w-full flex flex-col bg-black/5 p-4 rounded-md border border-black/20 gap-2">
      <div className="flex flex-row items-center text-black/60 text-xs gap-1 self-end">
        What is this?
        <Info
          size={12}
          className="cursor-pointer"
          onClick={() =>
            setPopup({
              title: "About Adding Event",
              message:
                "Add an event describing what your organization have done in the past weeks! TTickle will use these events to summarize in your newsletter!",
              visible: true,
              cancel: true,
              submit: false,
            })
          }
        />
      </div>
      <button
        className="flex flex-col items-center bg-white border border-black/20 text-black font-bold rounded-md p-4 cursor-pointer"
        onClick={() =>
          setPopup({
            title: "Add Event",
            visible: true,
            message: <EventModal setEvent={setEvent} />,
            cancel: true,
            submit: true,
          })
        }
      >
        <Plus size={32} />
        Add Event
      </button>
      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col gap-2">
          {events.map((event, index) => (
            <Event
              eventLoading={eventLoading}
              setEventLoading={setEventLoading}
              name={event.name}
              description={event.description}
              location={event.location}
              date={event.date}
              key={index}
            />
          ))}
        </div>
      )}
      <AlertDialog open={popup.visible}>
        <AlertDialogContent className="flex flex-col gap-3">
          <AlertDialogTitle>{popup.title}</AlertDialogTitle>
          <AlertDialogDescription>{popup.message}</AlertDialogDescription>
          <div className="flex flex-row self-end gap-2">
            {popup.cancel && (
              <AlertDialogCancel
                onClick={() => setPopup({ ...popup, visible: false })}
              >
                Exit
              </AlertDialogCancel>
            )}
            {popup.submit && (
              <AlertDialogAction onClick={handleSubmit}>
                Submit
              </AlertDialogAction>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Events;
