import Profile from "@/components/profile";
import { getOrganizationProfile } from "@/lib/actions/organizations";
import { getServerSession } from "@/utils/auth";
import React from "react";

const page = async () => {
  const session = await getServerSession();
  const orgs = await getOrganizationProfile();
  return <Profile session={session} orgs={orgs ?? []} />;
};

export default page;
