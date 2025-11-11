import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Mail, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { InvitationStatusBadge } from "./invitation-status-badge";

interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: string[] | string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: string;
  createdAt: string;
  inviterId?: string;
  inviter?: {
    name: string;
    email: string;
  };
  organization?: {
    name: string;
    slug: string;
  };
}

interface InvitationCardProps {
  invitation: Invitation;
  loading: boolean;
  onResend: (invitationId: string) => void;
  onCancel: (invitationId: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isExpired = (expiresAt: string) => {
  return new Date(expiresAt) < new Date();
};

export const InvitationCard = ({
  invitation,
  loading,
  onResend,
  onCancel,
}: InvitationCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-lg">{invitation.email}</span>
            <InvitationStatusBadge status={invitation.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Role:</span>{" "}
              {Array.isArray(invitation.role)
                ? invitation.role.join(", ")
                : invitation.role}
            </div>
            <div>
              <span className="font-medium">Sent:</span>{" "}
              {formatDate(invitation.createdAt)}
            </div>
            <div>
              <span className="font-medium">Expires:</span>{" "}
              {formatDate(invitation.expiresAt)}
              {isExpired(invitation.expiresAt) && (
                <AlertCircle className="w-4 h-4 text-red-500 inline ml-1" />
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Invited by {invitation.inviterId}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {invitation.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResend(invitation.id)}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4" />
                Resend
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(invitation.id)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
