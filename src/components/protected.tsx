import React from "react";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { options } from "@/utils/auth";
import SignIn from "./auth/redirect";
import { Role } from "shared";

const ProtectedPage = async ({
  children,
  role = "User",
}: {
  children: React.ReactNode;
  role?: Role;
}): Promise<JSX.Element> => {
  console.log(role);
  const session = await getServerSession(options);
  const header = await headers();
  const pathName = header.get("x-url") || "";
  if (!session) {
    return <SignIn callback={pathName} />;
  }

  return children;
};

export default ProtectedPage;
