import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface OrgStatCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  badge?: React.ReactNode;
}

export const OrgStatCard = ({
  icon: Icon,
  iconColor,
  label,
  value,
  badge,
}: OrgStatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          {badge ? badge : <p className="text-2xl font-bold">{value}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
