"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { TABS } from "@/data/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/temporarylogo.png";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogIn } from "lucide-react";

const Navigation = () => {
  const path = usePathname();
  const router = useRouter();
  const NAVTABS = TABS[path.split("/")[1]].tabs;
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar className="text-white w-[14%]">
      <SidebarHeader className="flex flex-col items-center">
        <Link href="/">
          <Image src={Logo} alt="TTickle Logo" className="hover:scale-105" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col text-lg ml-3 items-center">
        {NAVTABS.map((tab, index) => (
          <SidebarGroup
            key={index}
            className="flex flex-row items-center hover:bg-gradient-to-r hover:cursor-pointer hover:from-transparent hover:to-ttickles-lightblue gap-2"
            onClick={() => router.push(tab.link)}
          >
            {tab.icon}
            <Link href={tab.link}>{tab.name}</Link>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="my-1 flex flex-col p-0 pb-2 pl-1 ">
        <span
          onClick={() => toggleSidebar()}
          className={`${open ? "h-7 pl-3" : "mx-auto h-6"} flex items-center text-lg hover:cursor-pointer`}
        >
          <span className={`${!open && "mx-auto"}`}>
            <SidebarTrigger className="hover:bg-inherit hover:text-current" />
          </span>
          {open && <span className="ml-2 ">Close Sidebar</span>}
        </span>
        <span
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          className={`${open ? "h-7 pl-3" : "mx-auto h-6"} flex items-center text-lg hover:cursor-pointer`}
        >
          <span className={`${!open && "mx-auto"}`}>
            <LogIn className="mr-1 h-7 p-0.5" />
          </span>
          {open && <span className="ml-2">Log Out</span>}
        </span>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
