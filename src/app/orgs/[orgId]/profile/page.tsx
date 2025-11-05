"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  Settings,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/utils/auth-client";

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
  });

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
      window.location.reload();
    } catch (error) {
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
            The organization you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  const organization = orgData.message;
  const isOwner = session?.user?.id === organization.ownerId;
  const currentUserMember = membersData?.find(
    (member: any) => member.id === session?.user?.id,
  );
  const isAdmin =
    currentUserMember?.role === "owner" || currentUserMember?.role === "admin";
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
              {isEditing ? (
                <Input
                  value={editedOrg.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-3xl font-bold border-none p-0 h-auto"
                />
              ) : (
                organization.name
              )}
            </h1>
            <p className="text-gray-600">
              {isEditing ? (
                <Textarea
                  value={editedOrg.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Organization description"
                  className="border-none p-0 resize-none"
                  rows={2}
                />
              ) : (
                organization.description || "No description provided"
              )}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
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
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="secondary" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Organization Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Organization ID
              </Label>
              <p className="text-sm text-gray-600 font-mono">
                {organization.id}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Owner</Label>
              <p className="text-sm text-gray-600">
                {isOwner ? "You" : "Organization Owner"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Created
              </Label>
              <p className="text-sm text-gray-600">
                {new Date(organization.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Last Updated
              </Label>
              <p className="text-sm text-gray-600">
                {new Date(organization.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Members */}
      {membersData && membersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Members</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {membersData.slice(0, 5).map((member: any, index: number) => (
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
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
              ))}
              {membersData.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  And {membersData.length - 5} more members...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationProfile;
