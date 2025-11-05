import Navigation from "@/components/global/navigation";
import ProtectedPage from "@/components/protected";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "@/utils/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User",
  description: "The User Dashboard for Ttickle",
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <ProtectedPage role={{ user: true }}>
        <SidebarProvider>
          <Navigation />
          {children}
        </SidebarProvider>
      </ProtectedPage>
    </div>
  );
};

export default Layout;
