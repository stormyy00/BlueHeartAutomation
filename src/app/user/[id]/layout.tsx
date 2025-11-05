"use client";

import React from "react";
import { OrgProvider } from "@/context/org-context";
import { useParams } from "next/navigation";

export default function UserOrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const slug = (id as string) || "";

  return <OrgProvider slug={slug}>{children}</OrgProvider>;
}
