import React from "react";
import { Pen, FileText, Check, MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type Props = {
  title: string;
  id: string;
  status: string;
  preview?: string;
  handleConfigure: (newsletterId: string, campaignId: string) => void;
  onClick: () => void;
  checked: boolean;
  date?: string;
  campaignId: string;
};

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  draft: {
    bg: "bg-amber-50/80 border-amber-200/50",
    text: "text-amber-700",
    icon: "bg-amber-100",
  },
  published: {
    bg: "bg-emerald-50/80 border-emerald-200/50",
    text: "text-emerald-700",
    icon: "bg-emerald-100",
  },
};

const NewsletterListItem = ({
  title,
  id,
  status,
  preview,
  handleConfigure,
  onClick,
  checked,
  date = "Oct 5, 2025",
  campaignId,
}: Props) => {
  const statusStyle = STATUS_STYLES[status] || {
    bg: "bg-slate-50/80 border-slate-200/50",
    text: "text-slate-700",
    icon: "bg-slate-100",
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 flex items-center gap-4
                     shadow-sm  transition-all duration-200 
                     border border-slate-200/60 hover:border-ttickles-blue/30
                     group ${checked ? "ring-2 ring-ttickles-blue ring-offset-2 bg-ttickles-blue/5" : ""}`}
    >
      <div
        onClick={onClick}
        className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Checkbox
          checked={checked}
          className="h-4 w-4 border-2 border-slate-300 data-[state=checked]:bg-ttickles-blue 
                     data-[state=checked]:border-ttickles-blue transition-all"
        />
      </div>

      <div className="flex-shrink-0">
        <div className="p-2.5 bg-ttickles-blue/10 rounded-lg group-hover:bg-ttickles-blue/15 transition-colors">
          <FileText size={20} className="text-ttickles-blue" />
        </div>
      </div>

      <Link href={`newsletter/${id}`} className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold text-slate-800 
                          group-hover:text-ttickles-blue transition-colors duration-200 
                          truncate mb-1"
            >
              {title}
            </h3>
            {preview && (
              <p className="text-sm text-slate-600 line-clamp-1">{preview}</p>
            )}
          </div>
        </div>
      </Link>

      <div className="flex-shrink-0">
        <div
          className={`${statusStyle.bg} border px-3 py-1.5 rounded-lg 
                        flex items-center gap-1.5 transition-all duration-200`}
        >
          {status === "published" && (
            <div className={`${statusStyle.icon} p-0.5 rounded-full`}>
              <Check size={10} className={statusStyle.text} />
            </div>
          )}
          <span
            className={`${statusStyle.text} text-xs font-semibold tracking-wide whitespace-nowrap`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 hidden md:block">
        <span className="text-sm text-slate-500 whitespace-nowrap">{date}</span>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleConfigure(id, campaignId);
          }}
          className="p-2 rounded-lg hover:bg-ttickles-blue/10 transition-colors duration-200 
                     text-slate-400 hover:text-ttickles-blue"
          aria-label="Edit newsletter"
        >
          <Pen size={16} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 
                     text-slate-400 hover:text-slate-600"
          aria-label="More options"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default NewsletterListItem;
