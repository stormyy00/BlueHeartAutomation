import { options } from "@/utils/auth";
import { getOrg } from "@/utils/repository/orgRepository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    orgId: string;
  };
};

export const GET = async (request: NextRequest, { params }: Params) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to access the Groups API." },
      { status: 403 },
    );
  }

  let dataRequested = true;
  if (
    request.nextUrl.searchParams.has("data") &&
    !JSON.parse(request.nextUrl.searchParams.get("data") as string)
  ) {
    dataRequested = false;
  }

  const org = await getOrg(params.orgId);
  if (!org) {
    return NextResponse.json(
      {
        message: "This organization does not exist.",
      },
      { status: 400 },
    );
  }

  if (
    dataRequested &&
    org.owner != session.user.uuid &&
    !org.users.includes(session.user.uuid) &&
    session.user.role.toLowerCase() != "administrator"
  ) {
    return NextResponse.json(
      { message: "You are not authorized to access another Group's data." },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { message: dataRequested ? org : org != undefined },
    { status: org != undefined ? 200 : 400 },
  );
};
