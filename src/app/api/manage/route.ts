import { NextRequest, NextResponse } from "next/server";
import { options } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { getOrg, updateOrg } from "@/utils/repository/orgRepository";
import { Organization } from "@/data/types";

const updateOrganization = <K extends keyof Organization>(
  org: Organization,
  key: K,
  value: Organization[K],
) => {
  org[key] = value;
};

export const PUT = async (req: NextRequest) => {
  const res = NextResponse;
  const { orgId, updatedData } = await req.json();
  const session = await getServerSession(options);
  try {
    if (!session) {
      return NextResponse.json(
        { message: "You are not authorized to access the Groups API." },
        { status: 403 },
      );
    }

    const org = await getOrg(orgId);
    if (!org) {
      return res.json(
        {
          message: "This organization does not exist.",
        },
        { status: 400 },
      );
    }

    if (!updatedData) {
      console.log("Updated Data");
      return res.json({ message: "Please add updated data" }, { status: 400 });
    }

    for (const key of Object.keys(updatedData) as (keyof Organization)[]) {
      const val = updatedData[key] as Organization[typeof key];
      // If val is not undefined, update the org.
      if (val !== undefined) {
        updateOrganization(org, key, val);
      }
    }

    const update = await updateOrg(org);

    return NextResponse.json(
      {
        message: update
          ? "Organization updated."
          : "Unable to update organization",
      },
      { status: update ? 200 : 400 },
    );
  } catch (err) {
    console.error(err);
    return res.json({ message: "Server Error" }, { status: 500 });
  }
};
