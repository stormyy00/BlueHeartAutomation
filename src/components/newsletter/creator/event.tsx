import { X } from "lucide-react";
import { useAI } from "@/context/ai-context";

type props = {
  name: string;
  eventLoading: boolean;
  setEventLoading: (value: boolean) => void;
  date: string;
  location: string;
};
const Event = ({ name, date, location, eventLoading }: props) => {
  const { generateFromEvents } = useAI();
  const handleClick = () => {
    const eventContent = `
    You are a newsletter writer. You are writing a paragraph describing an event.
   Write a paragraph describing the event using the following information below.
   EventName: ${name}
   EventDate: ${date}
   EventLocation: ${location}
   `;
    generateFromEvents(eventContent);
  };
  return (
    <div className="bg-white border border-black/20 p-5 rounded-md group cursor-pointer">
      <div className="flex flex-row justify-between text-3xl font-bold">
        <button
          disabled={eventLoading}
          onClick={handleClick}
          className={`event-card text-left ${eventLoading ? "text-black/25" : "text-black"}`}
        >
          {name}
        </button>
        <X size={16} className="text-black invisible group-hover:visible" />
      </div>
      <div className="text-black/30">{date}</div>
      <div className="text-black/30">{location}</div>
    </div>
  );
};

export default Event;
