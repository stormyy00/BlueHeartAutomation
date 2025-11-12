export type EventType = {
  name: string;
  location: string;
  description: string;
  date: string;
};

/**
 * Google Calendar event type
 */
export interface CalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end?: {
    dateTime: string;
    timeZone?: string;
  };
  id?: string;
  status?: string;
}
