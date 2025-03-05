import { NewsletterType } from "@/types/newsletter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QUESTIONS } from "@/data/newsletter/newsletter";
import Select from "@/components/global/select";
import { ChangeEvent } from "react";

type props = {
  newsletter: NewsletterType;
  handleChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;
};

const NewsletterModal = ({ newsletter, handleChange }: props) => {
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
        </div>
      ))}
    </>
  );
};

export default NewsletterModal;
