import React from "react";
import { Pen, FileText, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type Props = {
  title: string;
  id: string;
  status: string;
  preview?: string;
  campaignId: string;
  handleConfigure: (newsletterId: string, campaignId: string) => void;
  onClick: () => void;
  checked: boolean;
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

const NewsletterCard = ({
  title,
  id,
  status,
  preview,
  handleConfigure,
  onClick,
  checked,
  campaignId,
}: Props) => {
  const statusStyle = STATUS_STYLES[status] || {
    bg: "bg-slate-50/80 border-slate-200/50",
    text: "text-slate-700",
    icon: "bg-slate-100",
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 flex flex-col justify-between 
                     shadow-sm transition-all duration-300 
                     border border-slate-200/60 hover:border-ttickles-blue/30
                     group relative overflow-hidden ${checked ? "ring-2 ring-ttickles-blue ring-offset-2" : ""}`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-ttickles-blue/0 via-transparent to-ttickles-lightblue/0 
                      group-hover:from-ttickles-blue/5 group-hover:to-ttickles-lightblue/5 
                      transition-all duration-300 pointer-events-none"
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onClick()}
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <Checkbox
              checked={checked}
              className="h-4 w-4 border-2 border-slate-300 data-[state=checked]:bg-ttickles-blue 
                         data-[state=checked]:border-ttickles-blue transition-all"
            />
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Newsletter
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleConfigure(id, campaignId);
            }}
            className="p-2 rounded-lg hover:bg-ttickles-blue/10 transition-colors duration-200 
                       text-slate-400 hover:text-ttickles-blue"
          >
            <Pen size={16} />
          </button>
        </div>

        <Link href={`newsletter/${id}`} className="flex flex-col gap-3">
          <div>
            <h2
              className="text-xl font-semibold text-slate-800 
                          group-hover:text-ttickles-blue transition-colors duration-200 
                          line-clamp-2 leading-tight mb-1"
            >
              {title}
            </h2>
            {preview && (
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mt-2">
                {preview}
              </p>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div
            className={`${statusStyle.bg} border px-3 py-1.5 rounded-lg 
                          flex items-center gap-2 transition-all duration-200`}
          >
            {status === "published" && (
              <div className={`${statusStyle.icon} p-0.5 rounded-full`}>
                <Check size={10} className={statusStyle.text} />
              </div>
            )}
            <span
              className={`${statusStyle.text} text-xs font-semibold tracking-wide`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r 
                      from-ttickles-blue/0 via-ttickles-blue/50 to-ttickles-blue/0 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
};

export default NewsletterCard;
