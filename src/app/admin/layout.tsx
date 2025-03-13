import Navigation from "@/components/global/navigation";
import ProtectedPage from "@/components/protected";
import { SidebarProvider } from "@/components/ui/sidebar";

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {
  return (
    <div>
      <ProtectedPage role="Administrator">
        <SidebarProvider>
          <Navigation />
          {children}
        </SidebarProvider>
      </ProtectedPage>
    </div>
  );
};

export default Layout;
