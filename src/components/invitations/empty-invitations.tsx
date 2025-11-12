import { Card, CardContent } from "../ui/card";
import { Users } from "lucide-react";

export const EmptyInvitations = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-8">
      <Users className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600">
        No invitations yet
      </h3>
      <p className="text-gray-500 text-center">
        Send your first invitation to get started
      </p>
    </CardContent>
  </Card>
);
