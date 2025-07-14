import { useQuery } from "@tanstack/react-query";

export const useNewsletterQuery = () => {
  return useQuery({
    queryKey: ["newsletters"],
    queryFn: async () => {
      const response = await fetch("/api/newsletter", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch newsletters");
      }
      return response.json();
    },
    select: (data) => data.newsletters,
  });
};

export const useNewsletterByIdQuery = (
  newsletterId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["newsletters", newsletterId],
    queryFn: async () => {
      const response = await fetch(`/api/newsletter/${newsletterId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter");
      }
      const data = await response.json();
      return data;
    },
    enabled: options?.enabled,
  });
};

export const useHistoryQuery = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await fetch("/api/history", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      return response.json();
    },
    select: (data) => data.newsletters,
  });
};
