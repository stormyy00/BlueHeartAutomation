import { CampaignContent, CreateCampaignData } from "@/types/mailchimp";

/* eslint-disable @typescript-eslint/no-require-imports*/
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

export const createCampaign = async (data: CreateCampaignData) => {
  const response = await fetch(
    `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const campaign = await response.json();
  return campaign;
};

export const addContentToCampaign = async (
  campaignId: string,
  content: CampaignContent,
) => {
  const response = await fetch(
    `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
    {
      method: "PUT",
      headers: {
        Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: content,
      }),
    },
  );

  const result = await response.json();
  return result;
};

export const scheduleCampaign = async (campaignId: string, sendTime: Date) => {
  const response = await fetch(
    `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedule_time: sendTime,
      }),
    },
  );

  const result = await response.json();
  return result;
};
