import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Settings, Shield } from "lucide-react";
import { OrganizationRole, getRoleDisplayName } from "@/types/organization";

interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface UserOrgHeaderProps {
  organization: Organization;
  userRole: OrganizationRole;
  isAdmin: boolean;
  hasUserMembership: boolean;
  onManageClick: () => void;
}

export const UserOrgHeader = ({
  organization,
  userRole,
  isAdmin,
  hasUserMembership,
  onManageClick,
}: UserOrgHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
          <Building2 className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {organization.name}
        </h1>
        <p className="text-gray-600">
          {organization.description || "No description provided"}
        </p>
        {hasUserMembership && (
          <Badge variant="secondary" className="mt-2">
            <Shield className="h-3 w-3 mr-1" />
            {getRoleDisplayName(userRole)}
          </Badge>
        )}
      </div>
    </div>

    {isAdmin && (
      <Button onClick={onManageClick} variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Manage Organization
      </Button>
    )}
  </div>
);
