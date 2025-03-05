export type CampaignSettings = {
  subject_line: string;
  title: string;
  from_name: string;
  reply_to: string;
};

export type CampaignRecipients = {
  list_id: string;
};

export type CreateCampaignData = {
  type: "regular" | "plaintext"; // or other types
  recipients: CampaignRecipients;
  settings: CampaignSettings;
};

export type CampaignContent = {
  text: string[];
};

export type CampaignResponse = {
  id: string;
  type: string;
  status: string;
  settings: CampaignSettings;
  recipients: {
    list_id: string;
    recipients: number;
  };
};
