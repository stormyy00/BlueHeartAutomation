import Recipients from "@/components/newsletter/recipients/recipient-list";
import { getOrg } from "@/utils/repository/orgRepository";

type Params = {
  params: {
    orgId: string;
  };
};

const Page = async ({ params }: Params) => {
  const { orgId } = params;
  const org = await getOrg(orgId);
  return (
    <div className="flex flex-col w-full bg-gray-100">
      <Recipients org={org!} />
    </div>
  );
};

export default Page;
