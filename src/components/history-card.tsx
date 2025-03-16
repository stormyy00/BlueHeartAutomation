import { Copy, MoreVertical, Pen } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-amber-50", text: "text-amber-600" },
  scheduled: { bg: "bg-blue-50", text: "text-blue-600" },
  sent: { bg: "bg-green-50", text: "text-green-600" },
};

type props = {
  title: string;
  id: string;
  status: string;
  timestamp: string;
  handleConfigure: () => void;
  onClick: () => void;
  checked: boolean;
};
const HistoryCard = ({
  title,
  id,
  status,
  timestamp,
  handleConfigure,
  onClick,
  checked,
}: props) => {
  console.log(timestamp);
  return (
    <div className=" flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center gap-4">
        <span onClick={onClick} className="cursor-pointer">
          <Checkbox checked={checked} />
        </span>
        <Link
          href={`newsletter/${id}`}
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition duration-200"
        >
          {title}
        </Link>
        <span className=" px-3 py-1 rounded-full text-xs font-medium text-slate-400">
          {new Date(timestamp).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center gap-3 text-gray-500">
        <div
          className={`${STATUS_STYLES[status]?.bg || "bg-gray-50"} ${STATUS_STYLES[status]?.text || "text-gray-600"} 
                      px-3 py-1 rounded-full text-xs font-medium`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <Pen
          size={20}
          onClick={handleConfigure}
          className="cursor-pointer hover:text-black transition duration-200"
        />
        <Copy
          size={20}
          className="cursor-pointer hover:text-black transition duration-200"
          onClick={() => toast("Copied to clipboard")}
        />
        <MoreVertical
          size={20}
          className="cursor-pointer text-gray-400 hover:text-black transition duration-200"
          onClick={() => toast("Hello")}
        />
      </div>
    </div>
  );
};

export default HistoryCard;
