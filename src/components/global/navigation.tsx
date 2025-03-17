"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import { TABS } from "@/data/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/temporarylogo.png";
import { usePathname, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const Navigation = () => {
  const path = usePathname().split("/");
  const navParent = path[1];

  const router = useRouter();

  const NAVTABS = TABS[navParent].tabs;
  const generalPath = `${path.slice(0, 2).join("/")}/@mine/${path.slice(3).join("/")}`;

  return (
    <Sidebar className="text-white w-[14%]">
      <SidebarHeader className="flex flex-col items-center">
        <Link href="/">
          <Image src={Logo} alt="TTickle Logo" className="hover:scale-105" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col text-lg ml-3 items-start">
        {NAVTABS.map((tab, index) => (
          <SidebarMenu key={index}>
            <Collapsible
              defaultOpen={generalPath.startsWith(tab.link)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarGroup
                    key={index}
                    className={`flex flex-row items-center cursor-pointer ${generalPath === tab.link ? "bg-gradient-to-r from-transparent to-ttickles-lightblue" : "hover:bg-gradient-to-r hover:from-transparent hover:to-ttickles-lightblue"}  gap-2`}
                    onClick={() => router.push(tab.link)}
                  >
                    {tab.icon}
                    <Link href={tab.link}>{tab.name}</Link>
                  </SidebarGroup>
                </CollapsibleTrigger>
                {tab.subtabs && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {tab.subtabs.map((subtab, subindex) => (
                        <Link
                          key={subindex}
                          href={subtab.link}
                          className={`flex flex-row items-center cursor-pointer ${generalPath === subtab.link ? "bg-gradient-to-r from-transparent to-ttickles-lightblue" : "hover:bg-gradient-to-r hover:from-transparent hover:to-ttickles-lightblue"}  gap-2`}
                        >
                          {subtab.icon} {subtab.name}
                        </Link>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <UserButton
          showName
          appearance={{
            elements: {
              userButtonBox: {
                flexDirection: "row-reverse",
                color: "white",
              },
            },
          }}
        /> */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
