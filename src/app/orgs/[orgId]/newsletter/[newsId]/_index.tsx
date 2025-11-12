import Creator from "@/components/newsletter/creator/creator";
import { getActiveOrganization } from "@/utils/auth";
import { getOrg } from "@/utils/repository/orgRepository";

const Index = async () => {
  const orgId = await getActiveOrganization();
  if (orgId === null) {
    console.error("Organization not found");
    return null;
  }
  const org = await getOrg(orgId);
  return (
    <div className="flex w-full bg-white">
      <Creator org={org!} />
    </div>
  );
};

export default Index;
