export type Region = "US" | "Canada";
export type Role = "Administrator" | "User";
export const RoleValues = ["Administrator", "User"];
export type User = {
  clerkId: string;
  id: string;
  email: string;
  name: string;
  icon: string;
  role: Role;
  orgId: string;
};

export type Link = {
  name: string;
  url: string;
};

export type Organization = {
  id: string;
  name: string;
  description: string;
  owner: string;
  icon: string;
  media: string[];
  newsletters: string[];
  themes: string[];
  notes: string[];
  users: string[];
  donors: string[];
  links: Link[];
  region: Region;
};

export type Newsletter = {
  id: string;
  header: string;
  html: string;
  scheduled: number; // epoch date
  media: string[];
  recipients: string[];
};
