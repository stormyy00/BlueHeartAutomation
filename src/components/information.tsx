"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Pen } from "lucide-react";
import { useState } from "react";
import { ChangeEvent } from "react";
import { HTMLInputs } from "@/types/inputs";
import { toast } from "sonner";
import { Organization } from "@/data/types";
type props = {
  orgId: string | string[];
  orgData: Organization;
};
const Information = ({ orgId, orgData }: props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [info, setInfo] = useState([
    {
      name: "Description",
      key: "description",
      value: orgData.description,
      type: "textarea",
    },
    {
      name: "Location",
      key: "location",
      value: "Los Angeles",
      type: "input",
    },
    {
      name: "Google Calendar ID",
      key: "calendarId",
      value: "",
      type: "input",
    },
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputs>, index: number) => {
    const updated = [...info];
    updated[index].value = e.target.value;
    setInfo(updated);
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating Organization Information");
    const updatedData = info.reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {} as { [key: string]: string },
    );
    const response = await fetch("/api/manage", {
      method: "PUT",
      body: JSON.stringify({
        orgId: orgId,
        updatedData: updatedData,
      }),
    });
    if (response.status !== 200) {
      toast.error("Error updating event.", { id: toastId });
      return;
    }
    toast.success("Successfully updated organization!", { id: toastId });
    setEdit(!edit);
  };

  return (
    <div className="flex flex-col w-full p-6 bg-white shadow-md rounded-2xl text-lg gap-y-2 border-gray-100 border">
      <div className="flex flex-row text-gray-900 font-semibold w-full justify-between mb-4">
        <div>
          Information
          <div className="text-gray-500 text-sm font-medium">
            Edit your organization&apos;s information
          </div>
        </div>
        {!edit && (
          <Pen
            size={20}
            className="cursor-pointer text-gray-500"
            onClick={() => setEdit(!edit)}
          />
        )}
      </div>
      <div className="flex flex-col gap-y-8">
        {!edit &&
          info.map((value, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {value.name}
              </span>
              <span className="text-gray-900 text-sm">{value.value}</span>
            </div>
          ))}
        {edit &&
          info.map((question, index) => (
            <div key={index}>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {question.name}
              </span>
              {question.type === "textarea" && (
                <Textarea
                  value={question.value}
                  className="resize-none"
                  onChange={(e) => handleChange(e, index)}
                />
              )}
              {question.type === "input" && (
                <Input
                  value={question.value}
                  onChange={(e) => handleChange(e, index)}
                />
              )}
            </div>
          ))}
      </div>
      <div className="self-end">
        {edit && (
          <Button
            onClick={() => handleUpdate()}
            className="bg-ttickles-blue text-white shadow-none hover:bg-ttickles-blue hover:brightness-110 duration-100"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default Information;
