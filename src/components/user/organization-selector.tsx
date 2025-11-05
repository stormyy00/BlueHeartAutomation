"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, Calendar, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import OrganizationForm from "@/components/manage/organization-form";
import {
  storeOrganizationMapping,
  resolveOrganizationFromSlug,
} from "@/utils/organization-utils";
import { setActiveOrganization } from "@/utils/auth-client";

interface Organization {
  id: string;
  name: string;
  description?: string;
  role: string;
  joinedAt: string;
}

const OrganizationSelector = () => {
  const router = useRouter();
  const params = useParams();
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);
  const [currentOrgSlug, setCurrentOrgSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  console.log("OrganizationSelector rendered");

  // Check if we're in an organization context (have an org slug in params)
  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      setCurrentOrgSlug(params.id);
    }
  }, [params.id]);

  // Fetch user's organizations
  const {
    data: organizations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-organizations"],
    queryFn: async (): Promise<Organization[]> => {
      console.log("Fetching organizations...");
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const data = await response.json();
      console.log("Organizations fetched:", data);
      return data;
    },
  });

  // Find current organization if we're in an organization context
  const currentOrg =
    organizations && currentOrgSlug
      ? resolveOrganizationFromSlug(organizations, currentOrgSlug)
      : null;

  // Auto-redirect if user has only one organization
  // Commented out to allow manual selection even with single organization
  // useEffect(() => {
  //   if (organizations && organizations.length === 1) {
  //     const org = organizations[0];
  //     // Store the mapping first
  //     storeOrganizationMapping(org);
  //     // Create user-friendly slug for URL
  //     const orgSlug = org.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  //     // Add a small delay to prevent interference with manual clicks
  //     const timer = setTimeout(() => {
  //       router.push(`/user/${orgSlug}`);
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }
  // }, [organizations, router]);

  const handleOrganizationSelect = async (org: Organization) => {
    console.log("Organization selected:", org);
    // Store the organization mapping for ID-based resolution
    storeOrganizationMapping(org);
    // Create user-friendly slug for URL
    const orgSlug = org.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const { data, error } = await setActiveOrganization({
      organizationId: org.id,
      organizationSlug: orgSlug,
    });
    console.log("setActiveOrganization result:", { data, error });
    console.log("Navigating to:", `/user/${orgSlug}`);

    // Use window.location.href instead of router.push to ensure navigation
    window.location.href = `/user/${orgSlug}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ttickles-white/5 flex items-center justify-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ttickles-blue mx-auto"></div>
          <p className="mt-2 text-ttickles-gray">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ttickles-white/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading organizations</p>
          <Button onClick={() => router.refresh()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (showOrganizationForm) {
    return (
      <div className="min-h-screen bg-ttickles-white/5">
        <div className="p-4">
          <Button
            onClick={() => setShowOrganizationForm(false)}
            variant="outline"
            className="mb-4"
          >
            ← Back to Organizations
          </Button>
          {/* <OrganizationForm /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttickles-white/5 w-full ">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {currentOrg ? (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  onClick={() => router.push("/user")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Organizations
                </Button>
              </div>
              <h1 className="text-4xl font-bold text-ttickles-darkblue">
                Switch Organization
              </h1>
              <p className="text-ttickles-gray mt-2">
                Currently in{" "}
                <span className="font-semibold text-ttickles-blue">
                  {currentOrg.name}
                </span>
                . Choose a different organization or create a new one.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-ttickles-darkblue">
                Select Organization
              </h1>
              <p className="text-ttickles-gray mt-2">
                Choose an organization to continue or create a new one
              </p>
            </div>
          )}
        </div>

        {/* Organizations Grid */}
        {organizations && organizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {organizations.map((org) => {
              const isCurrentOrg = currentOrg && org.id === currentOrg.id;
              return (
                <Card
                  key={org.id}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                    isCurrentOrg
                      ? "border-ttickles-blue bg-ttickles-blue/5 shadow-md"
                      : "border-ttickles-lightblue hover:border-ttickles-blue"
                  }`}
                  onClick={() => handleOrganizationSelect(org)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-ttickles-blue/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-ttickles-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{org.name}</CardTitle>
                          <CardDescription>
                            Joined {formatDate(org.joinedAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentOrg && (
                          <Badge variant="default" className="bg-ttickles-blue">
                            Current
                          </Badge>
                        )}
                        <Badge
                          variant={
                            org.role === "Administrator"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            org.role === "Administrator"
                              ? "bg-ttickles-blue"
                              : ""
                          }
                        >
                          {org.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {org.description && (
                      <p className="text-sm text-ttickles-gray mb-4">
                        {org.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-ttickles-gray">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {org.role.charAt(0).toUpperCase() + org.role.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(org.joinedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-ttickles-gray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ttickles-darkblue mb-2">
              No Organizations Found
            </h3>
            <p className="text-ttickles-gray mb-6">
              You'&apos;re not currently part of any organizations. Create one
              to get started!
            </p>
          </div>
        )}

        {/* Add Organization Button */}
        <div className="text-center">
          <Button
            onClick={() => setOpen(!open)}
            className="bg-ttickles-blue hover:bg-ttickles-darkblue text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            {currentOrg
              ? "Add Another Organization"
              : organizations && organizations.length > 0
                ? "Add Another Organization"
                : "Create Organization"}
          </Button>
        </div>
      </div>
      <OrganizationForm
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default OrganizationSelector;
