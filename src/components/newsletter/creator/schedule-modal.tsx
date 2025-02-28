import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react"; // Replace with the actual icon component
import { Calendar } from "@/components/ui/calendar"; // Replace with your actual calendar component

const ScheduleModal = () => {
  return (
    <Popover>
      <PopoverTrigger className="text-black/20 font-bold rounded-md border-black/20 border p-2 w-full flex flex-row justify-between">
        Pick a date
        <CalendarIcon className="text-gray-700" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="bg-white rounded-md shadow-lg p-2 z-[50]"
      >
        <Calendar
          selected={new Date()}
          mode="single"
          className="bg-white rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleModal;
