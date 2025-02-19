import { getOrg } from "@/utils/repository/orgRepository";
import { getUser } from "@/utils/repository/userRepository";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    orgId: string;
  };
};

export const GET = async (request: NextRequest, { params }: Params) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { message: "You are not authorized to access the Groups API." },
      { status: 403 },
    );
  }
  const result = await getUser(userId);
  if (!result) {
    return NextResponse.json(
      {
        message:
          "Something went wrong retrieving your user data. Please try again later.",
      },
      { status: 400 },
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

  console.log(org.owner, org.users, result.id);
  if (
    dataRequested &&
    org.owner != result.id &&
    !org.users.includes(result.id) &&
    result.role.toLowerCase() != "administrator"
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
