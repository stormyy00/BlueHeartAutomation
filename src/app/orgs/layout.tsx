import ProtectedPage from "@/components/protected";
import { getServerSession } from "@/utils/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization",
  description: "Organization Dashboard for Ttickle",
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
    <ProtectedPage session={session} requiresOrg={true}>
      {children}
    </ProtectedPage>
  );
};

export default Layout;
