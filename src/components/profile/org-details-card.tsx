import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  calendarId?: string;
}

interface OrgDetailsCardProps {
  organization: Organization;
  isOwner: boolean;
}

export const OrgDetailsCard = ({
  organization,
  isOwner,
}: OrgDetailsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Building2 className="h-5 w-5" />
        <span>Organization Details</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Organization ID
          </Label>
          <p className="text-sm text-gray-600 font-mono">{organization.id}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Owner</Label>
          <p className="text-sm text-gray-600">
            {isOwner ? "You" : "Organization Owner"}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Created</Label>
          <p className="text-sm text-gray-600">
            {new Date(organization.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Last Updated
          </Label>
          <p className="text-sm text-gray-600">
            {new Date(organization.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
