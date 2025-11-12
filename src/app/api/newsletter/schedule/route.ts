import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/utils/firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { sendEmail } from "@/utils/email";
// import { contentToHtml } from "@/utils/parser";

export const POST = async (req: NextRequest) => {
  console.log(req);
  const count = 0;
  // const now = Date.now();

  // const q = query(
  //   collection(db, "newsletters"),
  //   where("status", "==", "scheduled"),
  //   where("scheduledDate", "<=", now),
  // );
  // const snapshot = await getDocs(q);

  // if (snapshot.empty) {
  //   return NextResponse.json(
  //     { message: "No newsletters to send." },
  //     { status: 200 },
  //   );
  // }

  // let count = 0;
  // for (const d of snapshot.docs) {
  //   const data = d.data();

  //   let recipients = [];
  //   const orgId = data.orgId;
  //   const recipientGroup = data.recipientGroup;

  //   if (orgId && recipientGroup) {
  //     try {
  //       const orgRef = doc(db, "orgs", orgId);
  //       const orgSnap = await getDoc(orgRef);

  //       if (orgSnap.exists()) {
  //         const orgData = orgSnap.data();
  //         const group = Array.isArray(orgData.groups)
  //           ? orgData.groups.find(
  //               (g) =>
  //                 g.name &&
  //                 g.name.trim().toLowerCase() ===
  //                   recipientGroup.trim().toLowerCase(),
  //             )
  //           : null;
  //         recipients = group && Array.isArray(group.emails) ? group.emails : [];
  //       }
  //     } catch (err) {
  //       console.error(`Failed to fetch org/group for newsletter ${d.id}:`, err);
  //       continue;
  //     }
  //   }

  //   if (!Array.isArray(recipients) || recipients.length === 0) {
  //     console.error(
  //       `Newsletter ${d.id} skipped: no recipients found for group '${recipientGroup}' in org '${orgId}'`,
  //     );
  //     continue;
  //   }

  //   let body = data.body;

  //   if (!body || !body.trim()) {
  //     if (Array.isArray(data.content)) {
  //       body = contentToHtml(data.content);
  //     } else if (data.newsletter && Array.isArray(data.newsletter.content)) {
  //       body = contentToHtml(data.newsletter.content);
  //     }
  //   }

  //   if (!body || !body.trim()) {
  //     console.error(`Newsletter ${d.id} skipped: missing body`);
  //     continue;
  //   }

  //   if (!data.subject) {
  //     console.error(`Newsletter ${d.id} skipped: missing subject`);
  //     continue;
  //   }

  //   try {
  //     await sendEmail(data.subject, body, recipients, data.template);
  //     await updateDoc(doc(db, "newsletters", d.id), {
  //       status: "sent",
  //       sentDate: now,
  //     });
  //     count++;
  //   } catch (error) {
  //     console.error("Failed to send newsletter:", d.id, error);
  //   }
  // }

  return NextResponse.json({ message: `Sent ${count} newsletters.` });
};
