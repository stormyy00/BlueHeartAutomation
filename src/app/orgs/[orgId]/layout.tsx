"use client";

import React from "react";
import { OrgProvider } from "@/context/org-context";
import { useParams } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/global/navigation";

const UserOrgLayout = async ({ children }: { children: React.ReactNode }) => {
  const { orgId } = useParams();
  const slug = (orgId as string) || "";

  console.log("Org Layout Slug:", slug);
  return (
    <OrgProvider slug={slug}>
      <SidebarProvider>
        <Navigation />
        {children}
      </SidebarProvider>
    </OrgProvider>
  );
};

export default UserOrgLayout;
