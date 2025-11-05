import { getCampaignById } from "@/db/queries/campaigns";
import { authenticate } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { cid: string } },
) => {
  const { uid, message, auth } = await authenticate();
  if (auth !== 200 || !uid) {
    return NextResponse.json(
      { error: message || "Unauthorized" },
      { status: auth },
    );
  }

  console.log("CID:", params.cid);
  try {
    const data = await getCampaignById(params.cid);
    return NextResponse.json({ items: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaign by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
};
