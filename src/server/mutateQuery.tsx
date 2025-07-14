import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddNewsletterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/newsletter", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to add newsletter");
      }
      return response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
};

export const useDeleteNewsletterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newsletterId: string | string[]) => {
      const response = await fetch(`/api/newsletter`, {
        method: "DELETE",
        body: JSON.stringify({ newsletterId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete newsletter");
      }
      return response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
};
