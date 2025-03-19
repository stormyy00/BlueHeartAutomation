import { sendEmail } from "@/utils/email";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  subject: string;
  recipients: string[];
  body: string;
  scheduled?: number;
  templateType: string;
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
  const result = await sendEmail(
    data.subject,
    data.body,
    data.recipients,
    data.templateType,
  );
  return NextResponse.json(
    { message: "Email sent!", id: result.messageId },
    { status: 200 },
  );
};
