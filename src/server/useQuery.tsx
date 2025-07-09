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

export const useNewsletterByIdQuery = (newsletterId: string) => {
  return useQuery({
    queryKey: ["newsletter", newsletterId],
    queryFn: async () => {
      const response = await fetch(`/api/newsletter/${newsletterId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter");
      }
      return response.json();
    },
  });
};
