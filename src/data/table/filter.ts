export const ROLE: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  owner: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  admin: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  member: {
    text: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
  },
};

export const STATUS = {
  Approved: {
    text: "text-approved-text",
    bg: "bg-approved-bg",
    border: "border-approved-border",
  },
  Pending: {
    text: "text-pending-text",
    bg: "bg-pending-bg",
    border: "border-pending-border",
  },
  Rejected: {
    text: "text-rejected-text",
    bg: "bg-rejected-bg",
    border: "border-rejected-border",
  },
};

export const NewStatus: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  active: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  draft: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  completed: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
};
