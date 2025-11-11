"use client";

import { useOrg } from "@/context/org-context";
import { useQuery } from "@tanstack/react-query";
import {
  OrganizationRole,
  getRoleDisplayName,
  isAdminRole,
} from "@/types/organization";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Settings } from "lucide-react";
import { useSession } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { UserOrgHeader } from "@/components/myorg/user-org-header";
import { OrgStatCard } from "@/components/profile/org-stat-card";
import { MembershipDetailsCard } from "@/components/myorg/membership-details-card";
import { TeamMembersCard } from "@/components/myorg/team-members-card";
import { QuickActionsCard } from "@/components/myorg/quick-actions-card";

const UserOrganizationProfile = () => {
  const { orgId } = useOrg();
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: orgData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-organization", orgId],
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
    data:
      | {
          id: string;
          name: string;
          email: string;
          role: OrganizationRole;
          joinedAt: string;
        }[]
      | undefined;
    isLoading: boolean;
    error: true | Error | null;
  };
  console.log("Organization Data:", membersData);
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
  const currentUserMember = membersData?.find(
    ({ id }: { id: string }) => id === session?.user?.id,
  );

  // Updated role checking with new role system
  const userRole = currentUserMember?.role as OrganizationRole;
  const isAdmin = isAdminRole(userRole);
  // const isOwner = isOwnerRole(userRole);
  const memberCount = membersData?.length || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <UserOrgHeader
        organization={organization}
        userRole={userRole}
        isAdmin={isAdmin}
        hasUserMembership={!!currentUserMember}
        onManageClick={() => router.push(`/orgs/${orgId}/manage`)}
      />

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
          label="Your Role"
          value=""
          badge={
            <Badge variant="secondary" className="mt-1">
              {getRoleDisplayName(userRole)}
            </Badge>
          }
        />
      </div>

      <MembershipDetailsCard
        userRole={userRole}
        joinedAt={currentUserMember?.joinedAt}
        organizationId={organization.id}
      />

      <TeamMembersCard members={membersData || []} maxDisplay={8} />

      <QuickActionsCard
        isAdmin={isAdmin}
        onNewsletterClick={() => router.push(`/orgs/${orgId}/newsletter`)}
        onContactsClick={() => router.push(`/orgs/${orgId}/contacts`)}
        onMembersClick={() => router.push(`/orgs/${orgId}/members`)}
        onSettingsClick={() => router.push(`/orgs/${orgId}/manage`)}
      />
    </div>
  );
};

export default UserOrganizationProfile;
