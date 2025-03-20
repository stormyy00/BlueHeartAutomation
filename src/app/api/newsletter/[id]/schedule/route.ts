import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// const createCampaign = async (data: CreateCampaignData) => {
//   const response = await fetch(
//     `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     },
//   );

//   const campaign = await response.json();
//   return campaign;
// };

// const addContentToCampaign = async (
//   campaignId: string,
//   content: CampaignContent,
// ) => {
//   const htmlContent = content.text.map((item) => `<div>${item}</div>`).join("");
//   const response = await fetch(
//     `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
//     {
//       method: "PUT",
//       headers: {
//         Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         html: htmlContent,
//       }),
//     },
//   );

//   const result = await response.json();
//   return result;
// };

// const scheduleCampaign = async (campaignId: string, sendTime: Date) => {
//   const response = await fetch(
//     `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         schedule_time: sendTime.toISOString(),
//       }),
//     },
//   );

//   const result = await response.json();
//   return result;
// };

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { date, subject, recipientGroup, template } = await req.json();
  console.log("SERVER:", date);
  console.log("template", template);
  try {
    console.log(params.id);
    const snapshotQuery = query(
      collection(db, "newsletters"),
      where("newsletterId", "==", params.id),
    );
    const snapshot = await getDocs(snapshotQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "No newsletter exist." },
        { status: 404 },
      );
    }

    const newsletter = snapshot.docs[0].data();

    // const campaignData: CreateCampaignData = {
    //   type: "regular",
    //   recipients: {
    //     list_id: "20cdc304be",
    //   },
    //   settings: {
    //     subject_line: newsletter.newsletter[0],
    //     title: newsletter.newsletter[0],
    //     from_name: "Sean Quiambao",
    //     reply_to: "slquiambao03@gmail.com",
    //   },
    // };

    // const campaign = await createCampaign(campaignData).catch((error) => {
    //   return NextResponse.json(
    //     { message: `Error creating campaign: ${error}` },
    //     { status: 500 },
    //   );
    // });

    // const campaignId = campaign.id;

    // if (campaignId === undefined) {
    //   return NextResponse.json(
    //     { message: "Error creating campaign" },
    //     { status: 500 },
    //   );
    // }
    // await addContentToCampaign(campaignId, {
    //   text: newsletter.newsletter.slice(1),
    // }).catch((error) => {
    //   return NextResponse.json(
    //     { message: `Error adding content to campaign: ${error}` },
    //     { status: 500 },
    //   );
    // });

    // await scheduleCampaign(campaignId, date)
    //   .then((response) => {
    //     console.log("HELLO");
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     return NextResponse.json(
    //       { message: `Error scheduling campaign: ${error}` },
    //       { status: 500 },
    //     );
    //   });
    await updateDoc(doc(collection(db, "newsletters"), snapshot.docs[0].id), {
      ...newsletter,
      scheduledDate: date,
      status: "scheduled",
      subject,
      recipientGroup,
      template,
    })
      .then(async () => {
        await fetch(`${process.env.BACKEND_SERVER_URL}/api/scheduler`, {
          method: "PUT",
          body: JSON.stringify({
            id: snapshot.docs[0].id,
            epochSchedule: date,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch(console.error);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
};
