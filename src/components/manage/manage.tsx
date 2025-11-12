"use client";
import { useParams, useRouter } from "next/navigation";
import Information from "./information";
import OrgHeader from "./org-header";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { getUsersbyOrgId } from "./actions";
import ManageSkeleton from "./manage-skeleton";

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

  const { data: userData, isPending } = useQuery({
    queryKey: ["user", orgId],
    queryFn: async () => getUsersbyOrgId(orgId ?? ""),
    enabled: !!orgQuery.data && orgQuery.data.status === 200,
  });
  console.log(userData);

  if (!orgQuery.data) return;
  if (orgQuery.data.status == 400) {
    router.push("/user");
    return;
  }
  return (
    <>
      {isPending ? (
        <div className="flex flex-col items-start justify-center h-screen w-11/12 m-8 gap-5 ">
          <Label className="font-extrabold text-3xl self-start">Manage</Label>
          <ManageSkeleton />
        </div>
      ) : (
        <div className="flex flex-col w-11/12 m-8 gap-5">
          <Label className="font-extrabold text-3xl self-start">Manage</Label>
          <OrgHeader editable org={orgQuery.data.data} />
          <Information
            orgId={orgId}
            orgData={orgQuery.data.data}
            users={(userData || []).map((u) => ({ ...u, name: u.name ?? "" }))}
          />
        </div>
      )}
    </>
  );
};

export default Manage;
