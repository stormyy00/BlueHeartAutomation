import { X } from "lucide-react";
import { useAI } from "@/context/ai-context";

type props = {
  name: string;
  eventLoading: boolean;
  setEventLoading: (value: boolean) => void;
  date: string;
  description: string;
  location: string;
};
const Event = ({ name, date, location, description, eventLoading }: props) => {
  const { generateFromEvents } = useAI();
  const handleClick = () => {
    const eventContent = [
      "You are an AI writing assistant for newsletter writing. ",
      "Write a newsletter to users and donors about the event using the following information as context to the newsletter.",
      `Event Name: ${name}`,
      `Event Date: ${date}`,
      `Event Description: ${description}`,
      `Event Location: ${location}`,
      "CRITICAL: Begin your response with the first word of the actual content.",
    ];
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
      <div className="text-black/30 mt-2">{description}</div>
    </div>
  );
};

export default Event;
