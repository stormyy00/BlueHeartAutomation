import { getCampaignsbyOrg } from "@/db/queries/campaigns";
import { authenticate } from "@/utils/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { uid, message, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    return NextResponse.json(
      { error: message || "Unauthorized" },
      { status: auth },
    );
  }

  try {
    const data = await getCampaignsbyOrg();
    return NextResponse.json({ items: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
};
