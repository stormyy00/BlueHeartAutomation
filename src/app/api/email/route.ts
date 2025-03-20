import { sendEmail } from "@/utils/email";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  subject: string;
  recipients: string[];
  body: string;
  scheduled?: number;
  template: string;
};

export const PUT = async (req: NextRequest) => {
  const data = (await req.json().catch(() => undefined)) as Props | undefined;
  if (!data) {
    return NextResponse.json(
      {
        message:
          "Please provide the email's subject, recipients, an optional send date, and the body.",
      },
      { status: 400 },
    );
  }

  console.log("email", data);
  const result = await sendEmail(
    data.subject,
    data.body,
    data.recipients,
    ["modern", "minimalist", "vibrant", "classic"].includes(data.template)
      ? (data.template as "modern" | "minimalist" | "vibrant" | "classic")
      : "modern",
  );
  return NextResponse.json(
    { message: "Email sent!", id: result.messageId },
    { status: 200 },
  );
};
