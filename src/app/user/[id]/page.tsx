"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Mail,
  Calendar,
  Zap,
  Plus,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { resolveOrganizationFromSlug } from "@/utils/organization-utils";
import { SmallStatBox } from "@/components/dashboard/stat-box";
import { ContentCard } from "@/components/dashboard/content-card";
import { ContentMixChart } from "@/components/dashboard/content-mix-chart";

interface Organization {
  id: string;
  name: string;
  description?: string;
  role: string;
  joinedAt: string;
}

const OrganizationDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params.id as string;

  // Fetch user's organizations
  const {
    data: organizations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-organizations"],
    queryFn: async (): Promise<Organization[]> => {
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      return response.json();
    },
  });

  // Resolve organization ID from slug
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (organizations && orgSlug) {
      console.log("Resolving organization for slug:", orgSlug);
      console.log("Available organizations:", organizations);

      const org = resolveOrganizationFromSlug(organizations, orgSlug);
      console.log("Resolved organization:", org);

      if (org) {
        // Ensure we have the full organization object with all properties
        const fullOrg = organizations.find((o) => o.id === org.id);
        if (fullOrg) {
          console.log("Setting current organization:", fullOrg);
          setCurrentOrg(fullOrg);
        } else {
          console.log("Full organization not found, redirecting to /user");
          router.push("/user");
        }
      } else {
        console.log("Organization not found, redirecting to /user");
        // If not found, redirect to organization selection
        router.push("/user");
      }
    }
  }, [organizations, orgSlug, router]);

  const analyticsData = [
    { month: "Jan", engagement: 2400, reach: 9400 },
    { month: "Feb", engagement: 3200, reach: 9600 },
    { month: "Mar", engagement: 2800, reach: 9200 },
    { month: "Apr", engagement: 4200, reach: 10800 },
    { month: "May", engagement: 3800, reach: 10200 },
    { month: "Jun", engagement: 4500, reach: 11800 },
  ];

  const performanceData = [
    { name: "Newsletters", value: 45, fill: "#1C6D96" }, // ttickles.blue
    { name: "Images", value: 35, fill: "#83c5be" }, // ttickles.lightblue
    { name: "Other", value: 20, fill: "#ff9f1c" }, // ttickles.orange
  ];

  const recentContent = [
    {
      id: 1,
      type: "newsletter",
      title: "June Product Updates",
      status: "Published",
      date: "2 days ago",
      engagement: "2,445",
    },
    {
      id: 2,
      type: "image",
      title: "Summer Campaign",
      status: "Draft",
      date: "5 hours ago",
      engagement: "1,245",
    },
    {
      id: 3,
      type: "newsletter",
      title: "Weekly Digest",
      status: "Scheduled",
      date: "Jun 30",
      engagement: "—",
    },
    {
      id: 4,
      type: "image",
      title: "Social Graphics",
      status: "Published",
      date: "3 days ago",
      engagement: "5,892",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ttickles-white/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ttickles-blue mx-auto"></div>
          <p className="mt-2 text-ttickles-gray">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error || !currentOrg) {
    return (
      <div className="min-h-screen bg-ttickles-white/5 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-ttickles-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-ttickles-darkblue mb-2">
            Organization Not Found
          </h3>
          <p className="text-ttickles-gray mb-6">
            The organization you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push("/user")}>
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttickles-white/5 w-full">
      <div className="p-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <span>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-ttickles-blue/10 rounded-lg">
                <Building2 className="h-6 w-6 text-ttickles-blue" />
              </div>
              <h1 className="text-4xl font-bold text-ttickles-darkblue">
                {currentOrg.name}
              </h1>
            </div>
            <p className="text-ttickles-gray mt-1">
              Manage your newsletters and images in one place
            </p>
          </span>
          <div className="flex gap-4 items-center">
            <div className="space-x-2">
              <SmallStatBox
                icon={Mail}
                label="Draft"
                value="5"
                color="bg-ttickles-blue"
              />
              <SmallStatBox
                icon={Calendar}
                label="Scheduled"
                value="3"
                color="bg-ttickles-orange"
              />
              <SmallStatBox
                icon={Zap}
                label="This Week"
                value="12"
                color="bg-ttickles-lightblue"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-ttickles-blue hover:bg-ttickles-darkblue text-white flex items-center gap-2">
                  Go to...
                  <Plus size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/user/${orgSlug}/documents`}>
                    Create Document
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/user/${orgSlug}/images`}>Create Image</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/user/${orgSlug}/profile`}>Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Recent Content */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ttickles-darkblue">
                Recent Content
              </h3>
              <button className="text-ttickles-blue text-xs font-semibold hover:text-ttickles-darkblue flex items-center gap-1">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {recentContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Middle Column - Pie Chart */}
          <ContentMixChart data={performanceData} />
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ttickles-lightblue p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-ttickles-darkblue">
                Performance
              </h2>
              <select className="px-3 py-1.5 text-sm border border-ttickles-lightblue rounded-lg focus:outline-none focus:ring-2 focus:ring-ttickles-blue bg-white text-ttickles-gray">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient
                    id="colorEngagement"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1C6D96" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1C6D96" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#83c5be" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#83c5be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf6f9" />
                <XAxis
                  dataKey="month"
                  stroke="#7e8287"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#7e8287" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #83c5be",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#1C6D96"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#83c5be"
                  fillOpacity={1}
                  fill="url(#colorReach)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-ttickles-blue to-ttickles-lightblue rounded-xl p-8 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Ready to grow?</h2>
              <p className="text-ttickles-white/80 mt-1">
                Create and schedule your next newsletter today
              </p>
            </div>
            <Button className="bg-white text-ttickles-blue px-6 py-3 rounded-lg font-semibold hover:bg-ttickles-white transition-all flex items-center gap-2">
              Get Started <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
