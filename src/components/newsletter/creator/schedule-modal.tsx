import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react"; // Replace with the actual icon component

type props = {
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
};
const ScheduleModal = ({ date }: props) => {
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
        <input
          type="datetime"
          // selected={date ? date : new Date()}
          // onSelect={(value) => {
          //   setDate(value as Date);
          // }}
          className="bg-white rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleModal;
