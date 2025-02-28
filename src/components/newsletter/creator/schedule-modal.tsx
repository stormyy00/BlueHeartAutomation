import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react"; // Replace with the actual icon component
import { Calendar } from "@/components/ui/calendar"; // Replace with your actual calendar component
import Select from "@/components/global/select";
import { TIME } from "@/data/time";

type props = {
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
};
const ScheduleModal = ({ date, setDate }: props) => {
  return (
    <Popover>
      <PopoverTrigger className="text-black/20 font-bold rounded-md border-black/20 border p-2 w-full flex flex-row justify-between">
        {date ? date.toLocaleDateString() : "Pick a date"}
        <CalendarIcon className="text-gray-700" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="bg-white rounded-md shadow-lg p-2 z-[50]"
      >
        <Calendar
          mode="single"
          selected={date ? date : new Date()}
          onSelect={(value) => {
            setDate(value as Date);
          }}
          className="bg-white rounded-md"
        />
        adsfasd
        <Select
          options={TIME}
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
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleModal;
