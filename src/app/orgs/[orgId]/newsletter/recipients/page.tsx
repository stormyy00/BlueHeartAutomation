import Recipients from "@/components/newsletter/recipients/recipient-list";
import RecipientToolbar from "@/components/newsletter/recipients/recipient-toolbar";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-col w-10/12 m-10">
      <Label className="font-extrabold text-3xl flex flex-col gap-y-2">
        Recipients <RecipientToolbar />
      </Label>
      <Recipients org={org!} />
    </div>
  );
};

export default Page;
