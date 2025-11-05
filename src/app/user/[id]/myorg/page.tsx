"use client";

import { useOrg } from "@/context/org-context";
import { useQuery } from "@tanstack/react-query";
import {
  OrganizationRole,
  getRoleDisplayName,
  isAdminRole,
  isOwnerRole,
} from "@/types/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Calendar,
  Mail,
  Settings,
  User,
  Shield,
} from "lucide-react";
import { getActiveMember, useSession } from "@/utils/auth-client";
import { useRouter } from "next/navigation";

const UserOrganizationProfile = () => {
  const { orgId } = useOrg();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch organization details
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
  });
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
            The organization you're looking for doesn'&apos;t exist or you don't
            have access to it.
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
              <Building2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {organization.name}
            </h1>
            <p className="text-gray-600">
              {organization.description || "No description provided"}
            </p>
            {currentUserMember && (
              <Badge variant="secondary" className="mt-2">
                <Shield className="h-3 w-3 mr-1" />
                {getRoleDisplayName(userRole)}
              </Badge>
            )}
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => router.push(`/orgs/${orgId}/manage`)}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Organization
          </Button>
        )}
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Members</p>
                <p className="text-2xl font-bold">{memberCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm font-medium">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <Badge variant="secondary" className="mt-1">
                  {getRoleDisplayName(userRole)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Membership Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Your Membership</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Role</p>
              <p className="text-sm text-gray-600">
                {getRoleDisplayName(userRole)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Joined</p>
              <p className="text-sm text-gray-600">
                {currentUserMember?.joinedAt
                  ? new Date(currentUserMember.joinedAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Organization ID
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {organization.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      {membersData && membersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Members ({memberCount})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {membersData.slice(0, 8).map((member: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {member.name?.charAt(0) || member.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {member.name || member.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRoleDisplayName(member.role as OrganizationRole)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getRoleDisplayName(member.role as OrganizationRole)}
                  </Badge>
                </div>
              ))}
              {membersData.length > 8 && (
                <p className="text-sm text-gray-500 text-center">
                  And {membersData.length - 8} more members...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push(`/orgs/${orgId}/newsletter`)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Mail className="h-6 w-6" />
              <span>Newsletter</span>
            </Button>
            <Button
              onClick={() => router.push(`/orgs/${orgId}/contacts`)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Contacts</span>
            </Button>
            {isAdmin && (
              <>
                <Button
                  onClick={() => router.push(`/orgs/${orgId}/members`)}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Settings className="h-6 w-6" />
                  <span>Manage Members</span>
                </Button>
                <Button
                  onClick={() => router.push(`/orgs/${orgId}/manage`)}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Settings className="h-6 w-6" />
                  <span>Organization Settings</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrganizationProfile;
