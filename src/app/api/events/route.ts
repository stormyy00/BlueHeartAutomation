import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/utils/auth";
import { getUser } from "@/utils/repository/userRepository";
import { getOrg } from "@/utils/repository/orgRepository";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

export const GET = async () => {
  const res = NextResponse;
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to access the Groups API." },
      { status: 403 },
    );
  }
  const result = await getUser(session.user.id);
  if (!result) {
    return NextResponse.json(
      {
        message:
          "Something went wrong retrieving your user data. Please try again later.",
      },
      { status: 400 },
    );
  }
  const org = await getOrg(result.orgId);
  if (!org) {
    return res.json(
      { message: "You are not a part of an organization." },
      { status: 400 },
    );
  }
  try {
    const q = query(collection(db, "orgs"), where("id", "==", org.id));
    const querySnapshot = await getDocs(q);
    const queryDocs = querySnapshot.docs;

    if (queryDocs.length != 1) {
      return res.json({ message: "Server Error" }, { status: 500 });
    }
    const calendarId = queryDocs[0].data().calendarId;
    if (!calendarId) {
      return res.json(
        { message: "Google Calendar CalendarId not setup." },
        { status: 404 },
      );
    }

    return res.json({ message: "OK", calendarId: calendarId }, { status: 200 });
  } catch (err) {
    return res.json({ message: `Server Error: ${err}` }, { status: 500 });
  }
};
