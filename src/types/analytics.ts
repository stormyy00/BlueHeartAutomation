/**
 * Analytics data types
 */

export interface PageView {
  label: string;
  data: number[];
  days?: string[];
  labels?: string[];
}

export interface UserEvent {
  label: string;
  data: number[];
  days?: string[];
  labels?: string[];
  action?: {
    days?: string[];
  };
}

export interface SessionDataPoint {
  date: string;
  value: number;
  label: string;
}

export interface AnalyticsData {
  pageviews: PageView[];
  userEvents: UserEvent[];
  sessionData: SessionDataPoint[];
}

export interface HeatmapData {
  grid: number[][];
  xLabels: string[];
  yLabels: string[];
}

export interface ProcessedEvent {
  timestamp: string;
  count: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export interface RawAnalyticsData {
  result: Array<{
    label: string;
    data: number[];
    days?: string[];
    labels?: string[];
  }>;
}

/**
 * Chart-specific types
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}
