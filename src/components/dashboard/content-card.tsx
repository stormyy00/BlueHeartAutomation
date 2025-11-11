import { Eye } from "lucide-react";

interface ContentItem {
  type: string;
  title: string;
  date: string;
  engagement: string;
  status: string;
}

interface ContentCardProps {
  item: ContentItem;
}

export const ContentCard = ({ item }: ContentCardProps) => (
  <div className="bg-white rounded-lg border border-ttickles-lightblue hover:shadow-md transition-all p-3 group">
    <div className="flex items-start gap-3">
      <div className="text-3xl">{item.type === "newsletter" ? "📧" : "🖼️"}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-ttickles-darkblue text-sm truncate group-hover:text-ttickles-blue cursor-pointer">
              {item.title}
            </h3>
            <p className="text-xs text-ttickles-gray mt-0.5">{item.date}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              item.status === "Published"
                ? "bg-emerald-100 text-emerald-700"
                : item.status === "Draft"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-ttickles-lightblue/20 text-ttickles-darkblue"
            }`}
          >
            {item.status}
          </span>
          {item.engagement !== "—" && (
            <span className="flex items-center gap-0.5 text-xs text-gray-600">
              <Eye size={12} /> {item.engagement}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);
