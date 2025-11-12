import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { OrganizationRole, getRoleDisplayName } from "@/types/organization";

interface MembershipDetailsCardProps {
  userRole: OrganizationRole;
  joinedAt?: string;
  organizationId: string;
}

export const MembershipDetailsCard = ({
  userRole,
  joinedAt,
  organizationId,
}: MembershipDetailsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <User className="h-5 w-5" />
        <span>Your Membership</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Role</p>
          <p className="text-sm text-gray-600">
            {getRoleDisplayName(userRole)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Joined</p>
          <p className="text-sm text-gray-600">
            {joinedAt ? new Date(joinedAt).toLocaleDateString() : "Unknown"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Organization ID</p>
          <p className="text-sm text-gray-600 font-mono">{organizationId}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Status</p>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);
