"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  UserPlus,
  Mail,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  listMembers,
  getActiveMemberRole,
  listInvitations,
} from "@/utils/auth-client";
import { getRoleDisplayName, OrganizationRole } from "@/types/organization";
import { useParams } from "next/navigation";
import Invitations from "./invitations/invitations";

interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string[] | string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

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
}

const OrganizationDashboard = () => {
  const { orgId } = useParams();
  const currentOrganizationId = orgId as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [memberRole, setMemberRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (currentOrganizationId) {
      loadDashboardData();
    }
  }, [currentOrganizationId]);

  const loadDashboardData = async () => {
    if (!currentOrganizationId) return;

    setLoading(true);
    try {
      const [membersResult, invitationsResult, roleResult] = await Promise.all([
        listMembers({ query: { organizationId: currentOrganizationId } }),
        listInvitations({ query: { organizationId: currentOrganizationId } }),
        getActiveMemberRole(),
      ]);

      if (membersResult.data?.members) {
        setMembers(membersResult.data?.members as Member[]);
      }
      if (invitationsResult.data) {
        setInvitations(invitationsResult.data as Invitation[]);
      }
      if (roleResult.data?.role) {
        // Ensure memberRole is always an array for consistent handling
        const role = roleResult.data.role;
        setMemberRole(Array.isArray(role) ? role : [role]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
    });
  };

  const pendingInvitations = (invitations || []).filter(
    (inv) => inv.status === "pending",
  );
  const totalMembers = (members || []).length;
  const totalInvitations = (invitations || []).length;

  if (!currentOrganizationId) {
    return (
      <div className="flex items-center justify-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            No Organization Selected
          </h3>
          <p className="text-gray-500">
            Please select an organization to view the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full m-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <p className="text-gray-600">
            Manage your organization members and invitations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active organization members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invitations
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingInvitations.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invitations
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitations}</div>
            <p className="text-xs text-muted-foreground">
              All time invitations sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Members */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>
                  Latest members who joined your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(members || []).slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Array.isArray(member.role)
                          ? member.role.join(", ")
                          : member.role}
                      </Badge>
                    </div>
                  ))}
                  {(members || []).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No members yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Invitations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invitations</CardTitle>
                <CardDescription>Latest invitations sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(invitations || []).slice(0, 5).map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {invitation.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sent {formatDate(invitation.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(invitation.status)}
                    </div>
                  ))}
                  {(invitations || []).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No invitations yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                Manage your organization members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.user.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(member.joinedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {Array.isArray(member.role)
                          ? member.role
                              .map((role) =>
                                getRoleDisplayName(role as OrganizationRole),
                              )
                              .join(", ")
                          : getRoleDisplayName(member.role as OrganizationRole)}
                      </Badge>
                      {memberRole?.some(
                        (role: string) => role === "admin" || role === "owner",
                      ) && (
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {(members || []).length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No members found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Invitations />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Your Role</p>
                    <p className="text-sm text-gray-500">
                      Your current role in this organization
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {memberRole
                      ?.map((role) =>
                        getRoleDisplayName(role as OrganizationRole),
                      )
                      .join(", ") || "Unknown"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Organization ID</p>
                    <p className="text-sm text-gray-500">
                      Unique identifier for this organization
                    </p>
                  </div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {currentOrganizationId}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
