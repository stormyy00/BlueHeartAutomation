/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import InsightsTab from "./insightsTab";
import TrendsTab from "./trendTab";
import SessionsTab from "./sessionTab";

const AnalyticsDashboard = () => {
  type AnalyticsData = {
    pageviews: any[];
    userEvents: any[];
    sessionData: { date: any; value: any; label: any }[];
  };

  type HeatmapData = {
    grid: number[][];
    xLabels: string[];
    yLabels: string[];
  };

  type Event = {
    action?: {
      days?: string[];
    };
    data?: number[];
  };

  type ProcessedEvent = {
    timestamp: string;
    count: number;
  };

  type TimeSeriesDataPoint = {
    timestamp: string;
    value: number;
  };

  type RawData = {
    result: Array<{
      label: string;
      data: number[];
      days?: string[];
      labels?: string[];
    }>;
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageviews: [],
    userEvents: [],
    sessionData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("insights");

  useEffect(() => {
    const fetchAnalytics = () => {
      return new Promise(async (resolve, reject) => {
        try {
          setLoading(true);
          const response = await fetch("/api/analytics");

          if (!response.ok) {
            throw new Error(`Error fetching analytics: ${response.status}`);
          }

          const data = await response.json();
          console.log(data.result);

          const processedData = processAnalyticsData(data);
          setAnalyticsData(processedData);
          resolve(processedData);
        } catch (err) {
          console.error("Failed to fetch analytics:", err);
          setError(err.message || "An unknown error occurred.");
          reject(err);
        } finally {
          setLoading(false);
        }
      });
    };

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getHeatmapData = (events: Event[]): HeatmapData => {
    if (!events || !events.length)
      return { grid: [], xLabels: [], yLabels: [] };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const heatmapGrid = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    const allEvents: ProcessedEvent[] = events.flatMap((event) => {
      const action = event.action || {};
      const timestamps = action.days || [];
      return timestamps.map((timestamp, index) => ({
        timestamp,
        count: event.data?.[index] || 0,
      }));
    });

    allEvents.forEach((event) => {
      if (event.timestamp) {
        const date = new Date(event.timestamp);
        const day = date.getDay();
        const hour = date.getHours();
        if (day >= 0 && day <= 6 && hour >= 0 && hour <= 23) {
          heatmapGrid[day][hour] += event.count;
        }
      }
    });

    return { grid: heatmapGrid, xLabels: hours, yLabels: daysOfWeek };
  };

  const prepareTimeSeriesData = (events: Event[]): TimeSeriesDataPoint[] => {
    if (!events.length || !events[0]?.action?.days) return [];

    const timeSeriesData: TimeSeriesDataPoint[] = [];
    const days = events[0].action?.days || [];
    const data = events[0].data || [];

    for (let i = 0; i < days.length; i++) {
      timeSeriesData.push({
        timestamp: new Date(days[i]).toLocaleDateString(),
        value: data[i] || 0,
      });
    }

    return timeSeriesData;
  };

  const processAnalyticsData = (data: RawData): AnalyticsData => {
    const pageviews =
      data.result?.filter((item) => item.label === "$pageview") || [];
    const userEvents =
      data.result?.filter((item) => item.label !== "$pageview") || [];

    const sessionData: { date: any; value: any; label: any }[] = [];
    if (data.result && data.result[0] && data.result[0].data) {
      for (let i = 0; i < data.result[0].data.length; i++) {
        sessionData.push({
          date: data.result[0].days?.[i],
          value: data.result[0].data[i],
          label: data.result[0].labels?.[i],
        });
      }
    }

    return { pageviews, userEvents, sessionData };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <div className="text-lg font-medium text-ttickles-blue">
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">
          Error loading analytics
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const heatmapData = getHeatmapData(analyticsData.pageviews);
  const timeSeriesData = prepareTimeSeriesData(analyticsData.pageviews);

  const tabConfig = [
    {
      id: "insights",
      label: "Insights",
      content: (
        <InsightsTab analyticsData={analyticsData} heatmapData={heatmapData} />
      ),
    },
    {
      id: "trends",
      label: "Trends",
      content: <TrendsTab timeSeriesData={timeSeriesData} />,
    },
    {
      id: "sessions",
      label: "Sessions",
      content: <SessionsTab timeSeriesData={timeSeriesData} />,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="pb-4 text-4xl font-bold">Analytics Dashboard</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-11/12">
        <TabsList className="mb-4">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
