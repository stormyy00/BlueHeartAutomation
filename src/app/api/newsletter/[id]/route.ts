import { db } from "@/utils/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newslettersRef = collection(db, "newsletters");
    const q = query(newslettersRef, where("newsletterId", "==", params.id)); // Query by newsletterId
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

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { document } = await req.json();
  console.log(document);

  try {
    const newsletterRef = doc(collection(db, "newsletters"));
    await addDoc(collection(db, "newsletters"), {
      orgId: "org_123",
      newsletterId: newsletterRef.id,
      newsletter: document,
      timestamp: new Date(),
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
