"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeatMap from "react-heatmap-grid";

export default function PostHogHeatmap() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics");

        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.status}`);
        }

        const data = await response.json();
        setEventData(data.results || []);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getHeatmapData = () => {
    if (!eventData.length) return { grid: [], xLabels: [], yLabels: [] };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Initialize a 7x24 array with zeros
    const heatmapGrid = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    eventData.forEach((event) => {
      const date = new Date(
        event.created_at || event.timestamp || event.last_seen_at,
      );
      const day = date.getDay();
      const hour = date.getHours();
      heatmapGrid[day][hour] += 1;
    });

    return { grid: heatmapGrid, xLabels: hours, yLabels: daysOfWeek };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-500">
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

  const { grid, xLabels, yLabels } = getHeatmapData();

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 text-4xl font0">Analytics</div>
      <Card className="w-">
        <CardHeader>
          <CardTitle>User Activity Heatmap</CardTitle>
          <CardDescription>
            Event frequency by day of week and hour of day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <HeatMap
              xLabels={xLabels}
              yLabels={yLabels}
              data={grid}
              xLabelWidth={50}
              yLabelWidth={60}
              cellRender={(value) => (value > 0 ? value : null)}
              cellStyle={(background, value, min, max) => ({
                background: `rgb(0, 123, 255, ${value / max || 0.1})`,
                color: value > max / 2 ? "white" : "black",
                fontSize: "12px",
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
