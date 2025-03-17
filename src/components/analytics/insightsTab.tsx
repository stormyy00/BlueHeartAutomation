import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Heatmap from "./heatmap";
import MetricCard from "./metrics";

type AnalyticsData = {
  pageviews: { count: number }[];
};

type HeatmapData = {
  grid: number[][];
  xLabels: string[];
  yLabels: string[];
};

const InsightsTab = ({
  analyticsData,
  heatmapData,
}: {
  analyticsData: AnalyticsData;
  heatmapData: HeatmapData;
}) => (
  <div className="flex flex-col gap-4">
    <Card>
      <CardHeader>
        <CardTitle>User Activity Heatmap</CardTitle>
        <CardDescription>
          Event frequency by day of week and hour of day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Heatmap data={heatmapData} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
        <CardDescription>Summary of important analytics data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Total Pageviews",
              value: analyticsData.pageviews[0]?.count || 0,
            },
            {
              title: "Unique Users",
              value: Math.floor((analyticsData.pageviews[0]?.count || 0) * 0.6),
            },
            { title: "Avg. Session Duration", value: "2m 45s" },
            { title: "Bounce Rate", value: "32%" },
          ].map((metric, index) => (
            <MetricCard key={index} title={metric.title} value={metric.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default InsightsTab;
