import { OrgProvider } from "@/context/org-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/global/navigation";

const UserOrgLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) => {
  const slug = params.orgId;

  return (
    <OrgProvider slug={slug}>
      <SidebarProvider>
        <Navigation />
        {children}
      </SidebarProvider>
    </OrgProvider>
  );
};

export default UserOrgLayout;
