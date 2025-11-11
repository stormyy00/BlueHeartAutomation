import type { SearchableNewsletter } from "@/types/search";

export type Newsletter = SearchableNewsletter;

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
