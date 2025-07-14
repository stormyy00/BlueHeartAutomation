import Creator from "@/components/newsletter/creator/creator";
import { getOrg } from "@/utils/repository/orgRepository";
import React from "react";

const page = async () => {
  const org = await getOrg("demo");
  return <Creator org={org!} />;
};

export default page;
