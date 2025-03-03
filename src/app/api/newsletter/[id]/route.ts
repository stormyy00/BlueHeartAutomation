import { options } from "@/utils/auth";
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "newsletters"),
      where("newsletterId", "==", params.id),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: "No such document!" },
        { status: 404 },
      );
    }

    const newsletter = querySnapshot.docs[0].data().newsletter;

    return NextResponse.json({ newsletter });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { document } = await req.json();

  try {
    const snapshotQuery = query(
      collection(db, "newsletters"),
      where("newsletterId", "==", params.id),
    );
    const snapshot = await getDocs(snapshotQuery);

    if (!snapshot.empty) {
      const newsletterRef = doc(db, "newsletters", snapshot.docs[0].id);
      await setDoc(
        newsletterRef,
        {
          orgId: session.user.orgId,
          newsletter: document,
          timestamp: new Date(),
        },
        { merge: true },
      );
    } else {
      await addDoc(collection(db, "newsletters"), {
        orgId: session.user.orgId,
        newsletterId: params.id,
        newsletter: document,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
