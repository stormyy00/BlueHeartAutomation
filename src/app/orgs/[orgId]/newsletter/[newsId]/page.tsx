import Creator from "@/components/newsletter/creator/creator";
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
    <div className="flex flex-col w-full bg-white">
      <Creator org={org!} />
    </div>
  );
};

export default Page;
