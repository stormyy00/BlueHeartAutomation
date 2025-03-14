import { options } from "@/utils/auth";
import { db } from "@/utils/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "newsletters"),
      where("orgId", "==", "org_123"),
    );
    const querySnapshot = await getDocs(q);

    const newsletters = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const newsletterContent =
        data?.newsletter?.content?.[0]?.content
          ?.map(({ text }: { text: string }) => text)
          .join("") || "";
      return {
        newsletter: newsletterContent || data.newsletter[0],
        newsletterId: data.newsletterId,
        newsletterStatus: data.newsletterStatus,
        newsletterTimestamp: new Date(
          data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000,
        ), // Convert seconds and nanoseconds to milliseconds
      };
    });

    return NextResponse.json({ newsletters }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
