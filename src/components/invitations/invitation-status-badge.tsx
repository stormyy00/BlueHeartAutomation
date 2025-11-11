import { Badge } from "../ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

interface InvitationStatusBadgeProps {
  status: InvitationStatus;
}

export const InvitationStatusBadge = ({
  status,
}: InvitationStatusBadgeProps) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    expired: { color: "bg-red-100 text-red-800", icon: XCircle },
    cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
