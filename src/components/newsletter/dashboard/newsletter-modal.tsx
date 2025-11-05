import { NewsletterType } from "@/types/newsletter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QUESTIONS } from "@/data/newsletter/newsletter";
import Select from "@/components/global/select";
import { ChangeEvent, useState } from "react";
import CampaignPopover from "@/components/global/popover";

type Campaign = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  newsletters: number;
};

type props = {
  newsletter: NewsletterType;
  handleChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
  campaigns: Campaign[] | undefined;
  newsletterId: string;
  campaignId: string;
};

const NewsletterModal = ({
  newsletter,
  handleChange,
  campaigns,
  newsletterId,
  campaignId,
}: props) => {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  return (
    <>
      {QUESTIONS.map((question, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Label className="font-bold">{question.title}</Label>
          {question.type === "input" && (
            <Input
              type="text"
              value={newsletter[question.title as keyof NewsletterType]}
              onChange={(e) => handleChange(e, question.title)}
            />
          )}
          {question.type === "select" && (
            <Select
              options={[
                { label: "BlueHeart", value: "blue" },
                { label: "Sean.gov", value: "sean" },
                { label: "Jude's Hosiptial", value: "jude" },
              ]}
              onChange={(selected) =>
                console.log("Selected category:", selected)
              }
              placeholder="Select a Recipient"
            />
          )}
          {question.type === "multiselect" && (
            <CampaignPopover
              comboboxOpen={comboboxOpen}
              setComboboxOpen={setComboboxOpen}
              campaign={campaigns || []}
              documentId={newsletterId}
              campaignId={campaignId}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default NewsletterModal;
