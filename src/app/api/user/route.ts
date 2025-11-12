import { NextResponse } from "next/server";
import { getServerSession } from "@/utils/auth";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(session.user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
};
