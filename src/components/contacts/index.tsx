import React from "react";
import Contacts from "./contacts";
import { getActiveOrganization, getFullOrganization } from "@/utils/auth";
import { getUsersbyOrgId } from "../manage/actions";

const Index = async ({ id }: { id: string }) => {
  const [members, org] = await Promise.all([
    getUsersbyOrgId((await getActiveOrganization()) as string),
    getFullOrganization((await getActiveOrganization()) as string, id),
  ]);
  return (
    <div className="p-4 md:p-6">
      <Contacts
        members={members}
        organizationName={org?.name || ""}
        org={org}
        orgId={org?.id || ""}
      />
    </div>
  );
};

export default Index;
