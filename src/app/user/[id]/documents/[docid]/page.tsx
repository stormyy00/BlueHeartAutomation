import Creator from "@/components/newsletter/creator/creator";
import { getOrg } from "@/utils/repository/orgRepository";
import { getActiveOrganization } from "@/utils/auth";

const Page = async () => {
  const orgId = await getActiveOrganization();
  if (orgId === null) {
    console.error("Organization not found");
    return null;
  }
  const org = await getOrg(orgId);
  return (
    <div className="flex w-full bg-white">{org && <Creator org={org} />}</div>
  );
};

export default Page;
