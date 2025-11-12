"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Settings } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/utils/auth-client";
import { OrganizationRole } from "@/types/organization";
import { OrgHeader } from "@/components/profile/org-header";
import { OrgStatCard } from "@/components/profile/org-stat-card";
import { OrgDetailsCard } from "@/components/profile/org-details-card";
import { RecentMembersCard } from "@/components/profile/recent-members-card";

interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  calendarId?: string;
}

const OrganizationProfile = () => {
  const { orgId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrg, setEditedOrg] = useState<Partial<Organization>>({});

  // Fetch organization details
  const {
    data: orgData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const response = await fetch(`/api/orgs/${orgId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch organization");
      }
      return response.json();
    },
    enabled: !!orgId,
  });

  // Fetch organization members
  const { data: membersData } = useQuery({
    queryKey: ["organization-members", orgId],
    queryFn: async () => {
      const response = await fetch(`/api/orgs/${orgId}/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    },
    enabled: !!orgId,
  }) as {
    data: { id: string; name: string; email: string; role: OrganizationRole }[];
  };

  useEffect(() => {
    if (orgData?.message) {
      setEditedOrg(orgData.message);
    }
  }, [orgData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedOrg(orgData?.message || {});
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/orgs/${orgId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedOrg),
      });

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }

      toast.success("Organization updated successfully!");
      setIsEditing(false);
      // Refetch data
      router.refresh();
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedOrg((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orgData?.message) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-600">
            The organization you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  const organization = orgData.message;
  const isOwner = session?.user?.id === organization.ownerId;
  const currentUserMember = membersData?.find(
    (member) => member.id === session?.user?.id,
  );
  const isAdmin =
    currentUserMember?.role === "owner" || currentUserMember?.role === "admin";
  const memberCount = membersData?.length || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <OrgHeader
        organization={organization}
        isEditing={isEditing}
        editedOrg={editedOrg}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onInputChange={handleInputChange}
      />

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OrgStatCard
          icon={Users}
          iconColor="text-blue-600"
          label="Members"
          value={memberCount}
        />
        <OrgStatCard
          icon={Calendar}
          iconColor="text-green-600"
          label="Created"
          value={new Date(organization.createdAt).toLocaleDateString()}
        />
        <OrgStatCard
          icon={Settings}
          iconColor="text-purple-600"
          label="Status"
          value=""
          badge={
            <Badge variant="secondary" className="mt-1">
              Active
            </Badge>
          }
        />
      </div>

      {/* Organization Details */}
      <OrgDetailsCard organization={organization} isOwner={isOwner} />

      {/* Recent Members */}
      <RecentMembersCard members={membersData || []} />
    </div>
  );
};

export default OrganizationProfile;
