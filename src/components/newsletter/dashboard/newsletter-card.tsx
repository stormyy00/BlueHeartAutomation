import React from "react";
import { Pen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type Props = {
  title: string;
  id: string;
  status: string;
  handleConfigure: () => void;
  onClick: () => void;
  checked: boolean;
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  revise: { bg: "bg-amber-50", text: "bg-ttickles-orange" },
  publish: { bg: "bg-blue-50", text: "text-blue-600" },
};

const NewsletterCard = ({
  title,
  id,
  status,
  handleConfigure,
  onClick,
  checked,
}: Props) => {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div onClick={onClick} className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              className="h-5 w-5 text-gray-900 rounded-full border-gray-300 focus:ring-gray-900"
            />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Newsletter
            </span>
          </div>
          <button
            onClick={handleConfigure}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Pen size={16} className="text-gray-500" />
          </button>
        </div>

        <Link href={`newsletter/${id}`} className="group">
          <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-ttickles-blue transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
        </Link>

        <div className="flex items-center mt-2">
          <div
            className={`${STATUS_STYLES[status]?.bg || "bg-gray-50"} ${STATUS_STYLES[status]?.text || "text-gray-600"} 
                      px-3 py-1 rounded-full text-xs font-medium`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;
