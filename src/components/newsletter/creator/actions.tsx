import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCalendarIdQuery = () => {
  return useQuery({
    queryKey: ["calendarId"],
    queryFn: async () => {
      const response = await fetch("/api/events", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch calendar ID");
      const result = await response.json();
      console.log("Calendar ID result:", result);
      return result.calendarId;
    },
    throwOnError: true,
  });
};

export const useCalendarEventsQuery = (calendarId: string | undefined) => {
  return useQuery({
    queryKey: ["calendarEvents", calendarId],
    enabled: !!calendarId,
    queryFn: async () => {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}&singleEvents=true&orderBy=startTime`,
      );

      if (!response.ok) {
        const error = `Failed to fetch calendar events (Status: ${response.status})`;
        toast.error(error);
        throw new Error(error);
      }

      const result = await response.json();
      return result.items;
    },
  });
};
