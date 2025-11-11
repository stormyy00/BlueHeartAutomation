import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, RefreshCw } from "lucide-react";
import Select from "../global/select";

interface InviteFormData {
  email: string;
  role: string[];
}

interface InviteFormCardProps {
  inviteForm: InviteFormData;
  loading: boolean;
  onFormChange: (form: InviteFormData) => void;
  onSendInvitation: () => void;
  onCancel: () => void;
}

export const InviteFormCard = ({
  inviteForm,
  loading,
  onFormChange,
  onSendInvitation,
  onCancel,
}: InviteFormCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Invite New Member</CardTitle>
      <CardDescription>
        Send an invitation to join your organization
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={inviteForm.email}
          onChange={(e) =>
            onFormChange({ ...inviteForm, email: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          options={[
            { value: "member", label: "Member" },
            { value: "admin", label: "Admin" },
            { value: "owner", label: "Owner" },
          ]}
          onChange={(selectedOption) =>
            onFormChange({ ...inviteForm, role: [selectedOption] })
          }
          placeholder="Select a role"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onSendInvitation}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          Send Invitation
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
);
