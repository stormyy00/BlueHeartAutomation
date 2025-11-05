import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Building2, ChevronsUpDownIcon, CheckIcon } from "lucide-react";
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
import { cn } from "@/utils/utils";
import OrganizationForm from "@/components/manage/organization-form";
import { storeOrganizationMapping } from "@/utils/organization-utils";
import { setActiveOrganization } from "@/utils/auth-client";

interface Organization {
  id: string;
  name: string;
  description?: string;
  role: string;
}

interface OrganizationSwitcherProps {
  currentOrgId?: string;
  onOrgChange?: (orgId: string) => void;
  className?: string;
}

const OrganizationSwitcher = ({
  currentOrgId,
  onOrgChange,
  className = "",
}: OrganizationSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    currentOrgId || "",
  );
  const [isOrganizationFormOpen, setIsOrganizationFormOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // Fetch user's organizations
  const {
    data: organizations,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user-organizations"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");
      const organizations = (await response.json()) as Organization[];
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      return organizations;
    },
  });

  // Helper to create slug from org name
  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  // Update selected org when currentOrgId changes, but avoid slug/id ping-pong
  useEffect(() => {
    if (!currentOrgId) return;
    const isRealId = organizations?.some((o) => o.id === currentOrgId);
    if (isRealId) {
      if (currentOrgId !== selectedOrgId) {
        setSelectedOrgId(currentOrgId);
      }
    } else {
      // Prop looks like a slug; only set it if we don't have any selection yet
      if (!selectedOrgId) {
        setSelectedOrgId(currentOrgId);
      }
    }
  }, [currentOrgId, selectedOrgId, organizations]);

  // Detect current organization from URL on mount
  useEffect(() => {
    if (organizations && pathname && !selectedOrgId) {
      const pathSegments = pathname.split("/");
      console.log(
        "Detecting organization from pathname:",
        pathname,
        "segments:",
        pathSegments,
      );

      if (pathSegments[1] === "user" && pathSegments[2]) {
        // We're in a user path with an organization slug
        const orgSlug = pathSegments[2];
        console.log("Looking for organization with slug:", orgSlug);

        // Try to find organization by slug
        const org = organizations.find((o) => {
          const slug = o.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          return slug === orgSlug;
        });

        if (org) {
          console.log("Found organization by slug:", org);
          setSelectedOrgId(org.id);
        }
      } else if (pathSegments[1] === "orgs" && pathSegments[2]) {
        // We're in an orgs path with an organization ID
        const orgId = pathSegments[2];
        console.log("Found organization ID in URL:", orgId);
        setSelectedOrgId(orgId);
      }
    }
  }, [organizations, pathname, selectedOrgId]);

  // Normalize selectedOrgId: if it's a slug, convert to the actual ID once orgs are loaded
  useEffect(() => {
    if (!organizations || !selectedOrgId) return;
    const idMatch = organizations.find((o) => o.id === selectedOrgId);
    if (!idMatch) {
      const slugMatch = organizations.find(
        (o) => slugify(o.name) === selectedOrgId,
      );
      if (slugMatch) setSelectedOrgId(slugMatch.id);
    }
  }, [organizations, selectedOrgId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsOrganizationFormOpen(false);
    };
  }, []);

  const handleOrgChange = async (orgId: string) => {
    setSelectedOrgId(orgId);

    // Find the organization to get its name
    const org = organizations?.find((o) => o.id === orgId);
    if (!org) return;

    // Store the organization mapping for ID-based resolution
    storeOrganizationMapping(org);

    // Convert organization name to slug
    const orgSlug = org.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const { data, error } = await setActiveOrganization({
      organizationId: org.id,
      organizationSlug: orgSlug,
    });
    // Extract current path segments
    const pathSegments = pathname.split("/");
    const isOrgPath = pathSegments[1] === "orgs";
    const isUserPath = pathSegments[1] === "user";

    if (isOrgPath) {
      // Replace orgId in orgs path
      pathSegments[2] = orgId;
      router.push(pathSegments.join("/"));
    } else if (isUserPath) {
      // Replace with organization slug in user path
      pathSegments[2] = orgSlug;
      router.push(pathSegments.join("/"));
    } else {
      // Default to user path with organization slug
      router.push(`/user/${orgSlug}`);
    }

    onOrgChange?.(orgId);
  };

  const handleAddOrganization = () => {
    setIsOrganizationFormOpen(true);
  };

  const currentOrg =
    organizations?.find(({ id }) => id === selectedOrgId) ||
    organizations?.find((o) => slugify(o.name) === selectedOrgId);

  if (isPending) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-x-2 ${className}`}>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="h-10"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={handleAddOrganization}
          className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger
          asChild
          className="border-none hover:border-2 border-white"
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={comboboxOpen}
            className="h-10 bg-transparent border-white hover:text-white/80 hover:bg-transparent justify-between min-w-[200px] max-w-[300px] text-white"
            aria-label="Organization combobox"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">
                {currentOrg?.name || "Select Organization"}
              </span>
            </div>
            <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput
              placeholder="Search organizations..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup>
                {organizations.map(({ id, name, role }) => (
                  <CommandItem
                    key={id}
                    value={id} // ensure uniqueness even for same-name orgs
                    onSelect={() => {
                      handleOrgChange(id);
                      setComboboxOpen(false);
                    }}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Building2 className="h-4 w-4" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">{name}</span>
                      {role && (
                        <span className="text-xs text-gray-500 capitalize">
                          {role}
                        </span>
                      )}
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedOrgId === id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => {
                    handleAddOrganization();
                    setComboboxOpen(false);
                  }}
                  className="flex items-center space-x-2 cursor-pointer text-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Organization</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <OrganizationForm
        key={isOrganizationFormOpen ? "open" : "closed"}
        open={isOrganizationFormOpen}
        onOpenChange={setIsOrganizationFormOpen}
      />
    </div>
  );
};

export default OrganizationSwitcher;
