"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import TrendsTab from "./trendTab";
import SessionsTab from "./sessionTab";
import { toast } from "sonner";
import type {
  AnalyticsData,
  HeatmapData,
  UserEvent,
  ProcessedEvent,
  TimeSeriesDataPoint,
  RawAnalyticsData,
} from "@/types/analytics";

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageviews: [],
    userEvents: [],
    sessionData: [],
  });
  const [loading, setLoading] = useState(true);
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
          //   console.log(data.result);

          const processedData = processAnalyticsData(data);
          setAnalyticsData(processedData);
          resolve(processedData);
        } catch (err) {
          console.error("Failed to fetch analytics:", err);
          toast.error("Failed to fetch analytics data. Please try again.");
          reject(err);
        } finally {
          setLoading(false);
          toast("Analytics data loaded successfully.");
        }
      });
    };

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getHeatmapData = (events: UserEvent[]): HeatmapData => {
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

  const prepareTimeSeriesData = (
    events: UserEvent[],
  ): TimeSeriesDataPoint[] => {
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

  const processAnalyticsData = (data: RawAnalyticsData): AnalyticsData => {
    const pageviews =
      data.result?.filter((item) => item.label === "$pageview") || [];
    const userEvents =
      data.result?.filter((item) => item.label !== "$pageview") || [];

    const sessionData: AnalyticsData["sessionData"] = [];
    if (data.result && data.result[0] && data.result[0].data) {
      for (let i = 0; i < data.result[0].data.length; i++) {
        sessionData.push({
          date: data.result[0].days?.[i] || "",
          value: data.result[0].data[i],
          label: data.result[0].labels?.[i] || "",
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

  const heatmapData = getHeatmapData(analyticsData.pageviews);
  console.log("Heatmap Data:", heatmapData);
  const timeSeriesData = prepareTimeSeriesData(analyticsData.pageviews);

  const tabConfig = [
    // {
    //   id: "insights",
    //   label: "Insights",
    //   content: (
    //     <InsightsTab analyticsData={analyticsData} heatmapData={heatmapData} />
    //   ),
    // },
    {
      id: "trends",
      label: "Trends",
      content: <TrendsTab timeSeriesData={timeSeriesData} />,
    },
    {
      id: "sessions",
      label: "Sessions",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      content: <SessionsTab timeSeriesData={timeSeriesData} />,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4 w-11/12 m-10 mx-10">
      <div className="pb-4 text-3xl font-bold">Analytics Dashboard</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-11/12">
        <TabsList className="mb-4">
          {tabConfig.map(({ id, label }, index) => (
            <TabsTrigger key={index} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map(({ id, content }, index) => (
          <TabsContent key={index} value={id} className="space-y-4">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
