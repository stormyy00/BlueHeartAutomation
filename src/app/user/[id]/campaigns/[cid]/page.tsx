import Campaign from "@/components/campaigns/campaign";
import React from "react";

const page = ({ params }: { params: { id: string; cid: string } }) => {
  const { id: uid, cid } = params;
  return (
    <div className="w-full">
      <Campaign cid={cid} uid={uid} />
    </div>
  );
};

export default page;
