export type Newsletter = {
  newsletter: string;
  newsletterStatus: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const searchable = (
  data: Newsletter[],
  search: string,
  statusFilter: string,
): Newsletter[] => {
  return data.filter(({ newsletter, newsletterStatus }) => {
    const matchesSearch =
      !search.trim() || newsletter.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || newsletterStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });
};
