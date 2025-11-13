import { OrgProvider } from "@/context/org-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/global/navigation";

const UserOrgLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const slug = params.id;

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

export const dynamic = "force-dynamic";
