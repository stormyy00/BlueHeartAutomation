"use client";
import { useParams, useRouter } from "next/navigation";
import Information from "./information";
import OrgHeader from "./org-header";
import { useQuery } from "@tanstack/react-query";
import { Label } from "./ui/label";

const Manage = () => {
  const router = useRouter();
  const { orgId } = useParams();
  const orgQuery = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => {
      const resp = await fetch(`/api/orgs/${orgId}`);
      return {
        status: resp.status,
        data: (await resp.json())["message"],
      };
    },
  });
  if (!orgQuery.data) return;
  if (orgQuery.data.status == 400) {
    router.push("/user");
    return;
  }
  return (
    <div className="flex flex-col w-11/12 m-10 gap-8">
      <Label className="font-extrabold text-3xl self-start">Manage</Label>
      <OrgHeader editable org={orgQuery.data.data} />
      <Information />
    </div>
  );
};

export default Manage;
