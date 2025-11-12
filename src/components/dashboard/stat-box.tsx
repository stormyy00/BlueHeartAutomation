import { LucideIcon } from "lucide-react";

interface SmallStatBoxProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

export const SmallStatBox = ({
  icon: Icon,
  label,
  value,
  color,
}: SmallStatBoxProps) => (
  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-ttickles-gray bg-ttickles-white border border-ttickles-lightblue shadow-sm hover:shadow transition-all">
    <div className={`p-1 rounded-full ${color}`}>
      <Icon size={12} className="text-white" />
    </div>
    <span className="text-ttickles-gray">{label}</span>
    <span className="font-semibold text-ttickles-darkblue">{value}</span>
  </div>
);
