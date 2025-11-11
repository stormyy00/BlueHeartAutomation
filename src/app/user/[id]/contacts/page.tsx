import React from "react";
import Contacts from "@/components/contacts";
import { getUsersbyOrgId } from "@/components/manage/actions";
import { getActiveOrganization, getFullOrganization } from "@/utils/auth";

const Page = async ({ params }: { params: { id: string } }) => {
  const [members, org] = await Promise.all([
    getUsersbyOrgId((await getActiveOrganization()) as string),
    getFullOrganization((await getActiveOrganization()) as string, params.id),
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

export default Page;
