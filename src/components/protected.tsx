import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/utils/auth";
import { getRole, getActiveMemberRole } from "@/lib/actions/organizations";
import Error from "./error";
import { headers } from "next/headers";

const ProtectedPage = async ({
  children,
  role,
  requiresOrg = false,
  requiresAdmin = false,
}: {
  children: React.ReactNode;
  role?: { admin?: boolean; user?: boolean };
  requiresOrg?: boolean;
  requiresAdmin?: boolean;
}) => {
  const session = await getServerSession();
  const header = headers();
  const pathName = header.get("x-url") || "";
  console.log("ProtectedPage pathName:", pathName);

  if (!session?.user) {
    redirect("/signin?callbackUrl=" + pathName);
  }

  // Check organization membership if required
  if (requiresOrg || requiresAdmin) {
    try {
      const memberRole = await getActiveMemberRole();

      if (!memberRole) {
        return (
          <Error
            code={403}
            name="Access Denied"
            message="You must be a member of an organization to access this page."
            dev={`User ${session.user.email} attempted to access organization-restricted area without membership`}
          />
        );
      }

      // Check admin role if required
      if (requiresAdmin && !memberRole.role?.includes("admin")) {
        return (
          <Error
            code={403}
            name="Access Denied"
            message="You must be an administrator to access this page."
            dev={`User ${session.user.email} with role '${memberRole.role}' attempted to access admin-restricted area`}
          />
        );
      }
    } catch (error) {
      console.error("Error checking organization membership:", error);
      return (
        <Error
          code={500}
          name="Server Error"
          message="Unable to verify organization membership. Please try again."
          dev={`Error checking organization membership for user ${session.user.email}`}
        />
      );
    }
  }

  // Legacy role checking for backward compatibility
  if (role) {
    const result = await getRole(session?.user?.id || "");
    const userRole = result[0]?.role;

    if (!userRole) {
      return (
        <Error
          code={403}
          name="Access Denied"
          message="You don't have permission to access this page. Please contact an administrator if you believe this is an error."
          dev={`User with no role attempted to access restricted area`}
        />
      );
    }

    if (role.user && userRole && role.user == userRole) {
      return (
        <Error
          code={403}
          name="Access Denied"
          message="You don't have permission to access this page. Please contact an administrator if you believe this is an error."
          dev={`User with role '${String(userRole)}' attempted to access restricted area`}
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedPage;
