import React from "react";
import Contacts from "@/components/contacts";
import { getUsersbyOrgId } from "@/components/manage/actions";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getActiveOrganization, getFullOrganization } from "@/utils/auth";

type PageProps = {
  params: { orgId: string };
};

const Page = async ({ params }: PageProps) => {
  const slug = await db
    .select({ slug: organizations.slug })
    .from(organizations)
    .where(eq(organizations.id, params.orgId));
  const [members, org] = await Promise.all([
    getUsersbyOrgId((await getActiveOrganization()) as string),
    getFullOrganization(
      (await getActiveOrganization()) as string,
      slug[0].slug,
    ),
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
