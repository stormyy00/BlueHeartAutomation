import React from "react";
import { OrgProvider } from "@/context/org-context";

const UserOrgLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const slug = params.id;

  return <OrgProvider slug={slug}>{children}</OrgProvider>;
};

export default UserOrgLayout;

export const dynamic = "force-dynamic";
