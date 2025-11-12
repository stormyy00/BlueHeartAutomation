import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users, Settings } from "lucide-react";

interface QuickActionsCardProps {
  isAdmin: boolean;
  onNewsletterClick: () => void;
  onContactsClick: () => void;
  onMembersClick: () => void;
  onSettingsClick: () => void;
}

export const QuickActionsCard = ({
  isAdmin,
  onNewsletterClick,
  onContactsClick,
  onMembersClick,
  onSettingsClick,
}: QuickActionsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={onNewsletterClick}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Mail className="h-6 w-6" />
          <span>Newsletter</span>
        </Button>
        <Button
          onClick={onContactsClick}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Users className="h-6 w-6" />
          <span>Contacts</span>
        </Button>
        {isAdmin && (
          <>
            <Button
              onClick={onMembersClick}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Settings className="h-6 w-6" />
              <span>Manage Members</span>
            </Button>
            <Button
              onClick={onSettingsClick}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Settings className="h-6 w-6" />
              <span>Organization Settings</span>
            </Button>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);
