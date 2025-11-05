import {
  Table as TableUI,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Copy, Edit, Trash2Icon } from "lucide-react";
import { Badge } from "../ui/badge";

interface TableProps {
  filteredCampaigns: any[];
  router: any;
  id: string | string[];
  statusColors: Record<string, string>;
  setEditingCampaign: (campaign: any) => void;
  setOpenEdit: (open: boolean) => void;
  handleCopy: (id: string) => void;
  setDeletingCampaign: (campaign: any) => void;
  setOpenDelete: (open: boolean) => void;
}

const Table = ({
  filteredCampaigns,
  router,
  id,
  statusColors,
  setEditingCampaign,
  setOpenEdit,
  handleCopy,
  setDeletingCampaign,
  setOpenDelete,
}: TableProps) => {
  return (
    <div className="overflow-x-auto border rounded-md">
      <TableUI>
        <TableCaption>A list of all campaigns.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Newsletters</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCampaigns.map((cmp) => (
            <TableRow
              key={cmp.id}
              onClick={() => router.push(`/user/${id}/campaigns/${cmp.id}`)}
              className="cursor-pointer hover:bg-muted/30 transition"
            >
              <TableCell className="font-medium">{cmp.title}</TableCell>
              <TableCell className="text-muted-foreground line-clamp-1">
                {cmp.description}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[cmp.status]}>{cmp.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(cmp.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">{cmp.newsletters}</TableCell>
              <TableCell
                className="text-right space-x-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCampaign(cmp);
                    setOpenEdit(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(cmp.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeletingCampaign(cmp);
                    setOpenDelete(true);
                  }}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {filteredCampaigns.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                No campaigns found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableUI>
    </div>
  );
};

export default Table;
