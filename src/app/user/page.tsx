import OrganizationSelector from "@/components/user/organization-selector";
import { listUserOrganizations } from "@/utils/auth";

const page = async () => {
  const organizations = await listUserOrganizations();
  console.log("Organizations:", organizations);
  return <OrganizationSelector />;
};

export default page;
