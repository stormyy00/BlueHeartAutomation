"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, MailQuestionIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
} from "@/app/user/[id]/campaigns/actions";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toolbar from "./toolbar";
import Table from "./table";
import {
  Campaign,
  CampaignWithCount,
  CAMPAIGN_STATUS_COLORS,
} from "@/types/campaign";

const statusColors = CAMPAIGN_STATUS_COLORS;

const Campaigns = ({}) => {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null,
  );
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const {
    data: campaignsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      return data.items;
    },
    enabled: !!id,
  });

  console.log("Campaigns Data:", campaignsData);

  // ------------------- Derived Campaigns -------------------
  const filteredCampaigns = useMemo(() => {
    return campaignsData?.filter(({ title, status }: CampaignWithCount) => {
      const matchesFilter = filter === "all" || status === filter;
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [campaignsData, filter, search]);

  const handleCopy = (cmpId: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/user/${id}/campaigns/${cmpId}`,
    );
    toast.success("Campaign link copied!");
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return toast.error("Title is required");
    await createCampaignAction(newTitle, newDescription);
    queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
    setNewTitle("");
    setNewDescription("");
    setOpenCreate(false);
    toast.success("Campaign created!");
  };

  const handleEditSave = async () => {
    if (!editingCampaign) return;
    await updateCampaignAction(
      editingCampaign.id,
      editingCampaign.title,
      editingCampaign.description,
    );
    queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
    setOpenEdit(false);
    toast.success("Campaign updated!");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCampaign) return;
    await deleteCampaignAction(deletingCampaign.id);
    queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
    queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    setOpenDelete(false);
    toast.success("Campaign deleted!");
  };

  // ------------------- UI -------------------
  if (isPending)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading campaigns...
      </div>
    );

  if (isError) {
    <div className="p-10 text-center text-red-500">
      Error loading campaigns.
    </div>;
  }

  return (
    <div className="p-8 space-y-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold capitalize">
          <span className="text-ttickles-blue mr-2 font-bold">
            {id?.toString().replace(/-/g, " ")}
          </span>
          Campaigns
        </h1>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Toolbar
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {campaignsData?.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MailQuestionIcon />
            </EmptyMedia>
            <EmptyTitle>No Campaigns Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any campaigns yet. Get started by
              creating your first campaign.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setOpenCreate(true)}>Create Campaign</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Table
          filteredCampaigns={filteredCampaigns}
          router={router}
          id={id}
          statusColors={statusColors}
          setEditingCampaign={setEditingCampaign}
          setOpenEdit={setOpenEdit}
          handleCopy={handleCopy}
          setDeletingCampaign={setDeletingCampaign}
          setOpenDelete={setOpenDelete}
        />
      )}

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Input
              placeholder="Campaign title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenCreate(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Edit Dialog --- */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <div className="space-y-3 py-3">
              <Input
                value={editingCampaign.title}
                onChange={(e) =>
                  setEditingCampaign({
                    ...editingCampaign,
                    title: e.target.value,
                  })
                }
              />
              <Input
                value={editingCampaign.description}
                onChange={(e) =>
                  setEditingCampaign({
                    ...editingCampaign,
                    description: e.target.value,
                  })
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenEdit(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirmation --- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deletingCampaign?.title}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button onClick={() => setOpenDelete(false)} variant="outline">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
