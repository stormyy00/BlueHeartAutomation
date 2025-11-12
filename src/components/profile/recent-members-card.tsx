import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { OrganizationRole } from "@/types/organization";

interface Member {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
}

interface RecentMembersCardProps {
  members: Member[];
}

export const RecentMembersCard = ({ members }: RecentMembersCardProps) => {
  if (!members || members.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Recent Members</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.slice(0, 5).map(({ id, name, email, role }) => (
            <div key={id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {name?.charAt(0) || email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{name || email}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {role}
              </Badge>
            </div>
          ))}
          {members.length > 5 && (
            <p className="text-sm text-gray-500 text-center">
              And {members.length - 5} more members...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
