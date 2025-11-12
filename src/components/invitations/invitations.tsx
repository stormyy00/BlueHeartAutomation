"use client";

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { RefreshCw, XCircle, UserPlus, AlertCircle } from "lucide-react";
import {
  listInvitations,
  cancelInvitation,
  inviteMember,
  getActiveMemberRole,
} from "@/utils/auth-client";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ErrorContext, SuccessContext } from "better-auth/react";
import { InviteFormCard } from "./invite-form-card";
import { InvitationCard } from "./invitation-card";
import { EmptyInvitations } from "./empty-invitations";

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
    return await listInvitations(
      {
        query: {
          organizationId: currentOrganizationId,
        },
      },
      {
        onSuccess: ({ data }: SuccessContext) => {
          console.log("Invitations fetched successfully:", data);
          setInvitations(data || []);
          setLoading(false);
        },
        onError: (error: ErrorContext) => {
          console.error("Error fetching invitations:", error);
          toast.error(String(error));
        },
      },
    );
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

    return await inviteMember(
      {
        email: inviteForm.email,
        role: inviteForm.role as ("admin" | "owner" | "member")[],
        organizationId: currentOrganizationId,
      },
      {
        onSuccess: async ({ data }: SuccessContext) => {
          console.log("Invitation sent successfully:", data);
          setInviteForm({ email: "", role: ["member"] });
          setShowInviteForm(false);
          await loadInvitations();
        },
        onError: (error: ErrorContext) => {
          console.error("Error sending invitation:", error);
          toast.error(String(error));
        },
      },
    );
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
    return await cancelInvitation(
      { invitationId },
      {
        onSuccess: async () => {
          toast.success("Invitation cancelled successfully!");
          await loadInvitations();
          setLoading(false);
        },
        onError: (error: ErrorContext) => {
          console.error("Error cancelling invitation:", error);
          toast.error(String(error));
          setLoading(false);
        },
      },
    );
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
            <InviteFormCard
              inviteForm={inviteForm}
              loading={loading}
              onFormChange={setInviteForm}
              onSendInvitation={handleSendInvitation}
              onCancel={() => setShowInviteForm(false)}
            />
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
              <EmptyInvitations />
            ) : (
              invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  loading={loading}
                  onResend={handleResendInvitation}
                  onCancel={handleCancelInvitation}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitations;
