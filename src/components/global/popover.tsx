import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { CheckIcon, ChevronsUpDownIcon, MailCheckIcon } from "lucide-react";
import { cn } from "@/utils/utils";
import { updateDocumentCampaignId } from "@/app/user/[id]/campaigns/actions";

type Campaign = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  newsletters: number;
};

type props = {
  comboboxOpen: boolean;
  setComboboxOpen: (open: boolean) => void;
  campaign: Campaign[];
  campaignId: string;
  documentId: string;
};
const CampaignPopover = ({
  comboboxOpen,
  setComboboxOpen,
  campaign,
  campaignId,
  documentId,
}: props) => {
  // const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
  //   null,
  // );

  const handleCampaignChange = async (campaignId: string) => {
    await updateDocumentCampaignId(documentId, campaignId);
  };

  return (
    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
      <PopoverTrigger
        asChild
        className="border hover:border-2 w-full hover:border-ttickles-blue/80 rounded-md"
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={comboboxOpen}
          className="h-10 bg-transparent border w-full hover:text-ttickles-blue/80 hover:bg-transparent justify-between min-w-[200px] max-w-[300px] text-ttickles-blue"
          aria-label="Organization combobox"
        >
          <div className="flex items-center space-x-2">
            <MailCheckIcon className="h-4 w-4" />
            <span className="truncate">
              {campaign.find((c) => c.id === campaignId)?.title ||
                "Select Campaign"}
            </span>
          </div>
          <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Campaigns..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Campaigns found.</CommandEmpty>
            <CommandGroup>
              {campaign.map(({ id, title, status }) => (
                <CommandItem
                  key={id}
                  value={id} // ensure uniqueness even for same-name orgs
                  onSelect={() => {
                    handleCampaignChange(id);
                    setComboboxOpen(false);
                  }}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <MailCheckIcon className="h-4 w-4" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate">{title}</span>
                    {status && (
                      <span className="text-xs text-gray-500 capitalize">
                        {status}
                      </span>
                    )}
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      campaignId === id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
              {/* <CommandItem
                  onSelect={() => {
                    handleAddCampaign();
                    setComboboxOpen(false);
                  }}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Organization</span>
                </CommandItem> */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CampaignPopover;
