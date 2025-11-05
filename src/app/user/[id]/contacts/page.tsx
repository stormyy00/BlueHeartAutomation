import React from "react";
import Contacts from "@/components/contacts";
import { getUsersbyOrgId } from "@/components/manage/actions";
import { getActiveOrganization, getFullOrganization } from "@/utils/auth";

const Page = async ({ params }: { params: { id: string } }) => {
  const orgId = await getActiveOrganization();
  const members = await getUsersbyOrgId(orgId as string);
  const org = await getFullOrganization(orgId as string, params.id);
  console.log("Organization in contacts page:", org);
  return (
    <div className="p-4 md:p-6">
      <Contacts
        members={members}
        organizationName={org?.name || ""}
        org={org}
      />
    </div>
  );
};

export default Page;
