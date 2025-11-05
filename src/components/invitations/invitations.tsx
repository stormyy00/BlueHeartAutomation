"use client";

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Users,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import {
  listInvitations,
  cancelInvitation,
  inviteMember,
  getActiveMemberRole,
} from "@/utils/auth-client";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Select from "../global/select";

interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  role: string[] | string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: string;
  createdAt: string;
  inviter?: {
    name: string;
    email: string;
  };
  organization?: {
    name: string;
    slug: string;
  };
}

interface InviteFormData {
  email: string;
  role: string[];
}

const Invitations = () => {
  const { orgId } = useParams();
  const currentOrganizationId = orgId as string;
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(true);
  const [inviteForm, setInviteForm] = useState<InviteFormData>({
    email: "",
    role: ["member"],
  });

  console.log(inviteForm);

  useEffect(() => {
    if (currentOrganizationId) {
      loadInvitations();
      checkUserRole();
    }
  }, [currentOrganizationId]);

  const checkUserRole = async () => {
    try {
      const result = await getActiveMemberRole();
      console.log("Current user role:", result);
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const { data, error } = await listInvitations({
        query: {
          organizationId: currentOrganizationId,
        },
      });
      if (data) {
        console.log("Invitations loaded:", data);
        setInvitations(data);
      } else if (error) {
        toast.error(String(error));
      }
    } catch (error) {
      console.error("Error loading invitations:", error);
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };
  const handleSendInvitation = async () => {
    if (!inviteForm.email || !inviteForm.role.length) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!currentOrganizationId) {
      toast.error("No organization selected");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending invitation with:", {
        email: inviteForm.email,
        role: inviteForm.role,
        organizationId: currentOrganizationId,
      });

      const { data, error } = await inviteMember({
        email: inviteForm.email,
        role: inviteForm.role as ("admin" | "owner" | "member")[],
        organizationId: currentOrganizationId,
      });

      console.log("Invitation result:", { data, error });

      if (data) {
        toast.success("Invitation sent successfully!");
        setInviteForm({ email: "", role: ["member"] });
        setShowInviteForm(false);
        await loadInvitations();
      } else if (error) {
        console.error("Invitation error:", error);
        toast.error(String(error));
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    setLoading(true);
    try {
      console.log("Resend invitation ID:", invitationId);
      //   const result = await resendInvitation({ invitationId });
      //   if (result.data) {
      //     toast.success('Invitation resent successfully!');
      //     await loadInvitations();
      //   } else if (result.error) {
      //     toast.error(String(result.error));
      //   }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) return;

    setLoading(true);
    try {
      const result = await cancelInvitation({ invitationId });

      if (result.data) {
        toast.success("Invitation cancelled successfully!");
        await loadInvitations();
      } else if (result.error) {
        toast.error(String(result.error));
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast.error("Failed to cancel invitation");
    } finally {
      setLoading(false);
    }
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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

  if (!currentOrganizationId) {
    return (
      <div className="flex flex-col w-11/12 m-10 gap-6">
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600">
              No Organization Selected
            </h3>
            <p className="text-gray-500">
              Please select an organization to manage invitations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 m-10">
      <div className="mb-6">
        <Label className="font-extrabold text-3xl">Invitations</Label>
        <p className="text-gray-600 mt-1">Manage organization invitations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left Column - Invite Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Send Invitation</h3>
            {showInviteForm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteForm(false)}
                className="text-gray-500"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
            {!showInviteForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteForm(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                New Invitation
              </Button>
            )}
          </div>

          {showInviteForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invite New Member</CardTitle>
                <CardDescription>
                  Send an invitation to join your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    options={[
                      { value: "member", label: "Member" },
                      { value: "admin", label: "Admin" },
                      { value: "owner", label: "Owner" },
                    ]}
                    onChange={(selectedOption) =>
                      setInviteForm((prev) => ({
                        ...prev,
                        role: [selectedOption],
                      }))
                    }
                    placeholder="Select a role"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendInvitation}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Send Invitation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Invitations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Invitations</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadInvitations}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <div className="space-y-4">
            {loading && invitations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading invitations...</span>
              </div>
            ) : invitations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">
                    No invitations yet
                  </h3>
                  <p className="text-gray-500 text-center">
                    Send your first invitation to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              invitations.map((invitation) => (
                <Card
                  key={invitation.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-gray-500" />
                          <span className="font-semibold text-lg">
                            {invitation.email}
                          </span>
                          {getStatusBadge(invitation.status)}
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
                              onClick={() =>
                                handleResendInvitation(invitation.id)
                              }
                              disabled={loading}
                            >
                              <RefreshCw className="w-4 h-4" />
                              Resend
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleCancelInvitation(invitation.id)
                              }
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitations;
