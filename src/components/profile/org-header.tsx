import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Edit, Save, X } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  calendarId?: string;
}

interface OrgHeaderProps {
  organization: Organization;
  isEditing: boolean;
  editedOrg: Partial<Organization>;
  isAdmin: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
}

export const OrgHeader = ({
  organization,
  isEditing,
  editedOrg,
  isAdmin,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
}: OrgHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
          <Building2 className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? (
            <Input
              value={editedOrg.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="text-3xl font-bold border-none p-0 h-auto"
            />
          ) : (
            organization.name
          )}
        </h1>
        <p className="text-gray-600">
          {isEditing ? (
            <Textarea
              value={editedOrg.description || ""}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Organization description"
              className="border-none p-0 resize-none"
              rows={2}
            />
          ) : (
            organization.description || "No description provided"
          )}
        </p>
      </div>
    </div>

    {isAdmin && (
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <Button onClick={onSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
    )}
  </div>
);
