"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  acceptInvitation,
  getInvitation,
  rejectInvitation,
  setActiveOrganization,
} from "@/utils/auth-client";
import { toast } from "sonner";
import { getRoleDisplayName, OrganizationRole } from "@/types/organization";
import { getUser } from "@/app/accept-invite/actions";
import { ErrorContext } from "better-auth/react";

interface InvitationData {
  id: string;
  email: string;
  organizationId: string;
  role: string[];
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: string;
  createdAt: string;
  inviterId: string;
  inviter: {
    name: string;
    email: string;
  };
  organizationName: string;
  organizationSlug: string;
}

const AcceptInvitePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviterName, setInviterName] = useState<string>("Loading...");

  const invitationId = searchParams.get("id");

  useEffect(() => {
    if (invitationId) {
      loadInvitation();
    } else {
      setError("Invalid invitation link");
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    if (invitation?.inviterId) {
      getUser({ id: invitation.inviterId })
        .then((result) => {
          if (result && result.length > 0) {
            setInviterName(result[0].name || "Unknown");
          } else {
            setInviterName("Unknown");
          }
        })
        .catch(() => {
          setInviterName("Unknown");
        });
    }
  }, [invitation?.inviterId]);

  const loadInvitation = async () => {
    return await getInvitation(
      { query: { id: invitationId! } },
      {
        onError: (err) => {
          console.error("Error fetching invitation:", err);
          setError("Failed to load invitation");
          setLoading(false);
        },
        onSuccess: (data) => {
          console.log("Fetched invitation data:", data);
          setLoading(false);
          setInvitation(data.data);
        },
      },
    );
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    setAccepting(true);
    return await acceptInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onSuccess: async () => {
          toast.success("Invitation accepted successfully!");
          await setActiveOrganization({
            organizationId: invitation.organizationId,
          });
          setAccepting(false);
          router.push(`/user/${invitation.organizationSlug}`);
        },
        onError: (error: ErrorContext) => {
          toast.error("Failed to accept invitation");
          console.error(error.error.message);
          setAccepting(false);
        },
      },
    );
  };

  const rejectInvitationAction = async () => {
    if (!invitation) return;
    return await rejectInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: () => {
          toast.success("Invitation rejected successfully!");
          router.push("/");
        },
      },
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      expired: { color: "bg-red-100 text-red-800", icon: XCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Invalid Invitation
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {error || "This invitation link is invalid or has expired."}
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Organization Invitation</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join an organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {invitation.organizationName}
                  </h3>
                  <p className="text-sm text-gray-600">Organization</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Your Role
                </span>
                <Badge variant="secondary" className="font-medium">
                  {invitation.role
                    ? Array.isArray(invitation.role)
                      ? invitation.role
                          .map((role) =>
                            getRoleDisplayName(role as OrganizationRole),
                          )
                          .join(", ")
                      : getRoleDisplayName(invitation.role as OrganizationRole)
                    : "Unknown"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                {getStatusBadge(invitation.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Invited by
                </span>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{inviterName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Expires
                </span>
                <span
                  className={`text-sm ${isExpired(invitation.expiresAt) ? "text-red-600" : "text-gray-600"}`}
                >
                  {formatDate(invitation.expiresAt)}
                  {isExpired(invitation.expiresAt) && (
                    <AlertCircle className="w-4 h-4 text-red-500 inline ml-1" />
                  )}
                </span>
              </div>
            </div>

            {invitation.status === "pending" &&
            !isExpired(invitation.expiresAt) ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleAcceptInvitation}
                  disabled={accepting}
                  className="flex-1"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={rejectInvitationAction}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            ) : invitation.status === "accepted" ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium">
                  Invitation Accepted
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You can now access the organization dashboard.
                </p>
                <Button
                  onClick={() =>
                    router.push(`/orgs/${invitation.organizationId}`)
                  }
                  className="mt-4"
                >
                  Go to Organization
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-medium">
                  {invitation.status === "expired"
                    ? "Invitation Expired"
                    : "Invitation Cancelled"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This invitation is no longer valid.
                </p>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="mt-4"
                >
                  Go Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
