import Recipients from "@/components/newsletter/recipients/recipient-list";
import { RecipientGroup } from "@/types/metadata";
import { getOrgGroups } from "@/utils/repository/orgRepository";

type Params = {
  params: {
    orgId: string;
  };
};

const Page = async ({ params }: Params) => {
  const { orgId } = params;
  const groups = await getOrgGroups(orgId);
  return (
    <div className="flex flex-col w-full bg-white">
      <Recipients org={groups as RecipientGroup[]} orgId={orgId} />
    </div>
  );
};

export default Page;
