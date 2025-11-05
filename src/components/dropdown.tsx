import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { ChevronDown } from "lucide-react";

const Dropdown = ({
  items,
  title,
  isSidebar,
}: {
  items: Array<{ label: string; onClick: () => void }>;
  title: string;
  isSidebar: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSidebar ? (
          <SidebarMenuButton>
            {title}
            <ChevronDown className="ml-auto" />
          </SidebarMenuButton>
        ) : (
          <button className="inline-flex items-center px-4 py-2 bg-ttickles-lightblue text-ttickles-blue font-semibold rounded-md hover:bg-ttickles-blue/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ttickles-blue">
            {title}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick}>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
