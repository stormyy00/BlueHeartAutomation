import React from "react";
import Contacts from "@/components/contacts";
import { getUsersbyOrgId } from "@/components/manage/actions";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

type PageProps = {
  params: { orgId: string };
};

const Page = async ({ params }: PageProps) => {
  const { orgId } = params;
  const members = await getUsersbyOrgId(orgId);

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId));
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
