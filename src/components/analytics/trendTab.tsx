import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TimeSeriesChart from "./chart";
import DataTable from "./table";

interface TrendsTabProps {
  timeSeriesData: Array<{ value: number; timestamp: string }>;
}

const TrendsTab = ({ timeSeriesData }: TrendsTabProps) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Pageview Trends</CardTitle>
        <CardDescription>Pageview activity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <TimeSeriesChart
            data={timeSeriesData.map((item) => ({
              ...item,
              date: item.timestamp,
            }))}
            dataKey="value"
            name="Pageviews"
            color="#0ca02c"
          />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most visited pages on your site</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            headers={["Page", "Views"]}
            data={[
              { page: "/home", views: 143 },
              { page: "/about", views: 87 },
              { page: "/products", views: 42 },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Behavior</CardTitle>
          <CardDescription>Top user actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            headers={["Event", "Count"]}
            data={[
              { event: "Click Button", count: 98 },
              { event: "Form Submit", count: 65 },
              { event: "Search", count: 34 },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  </>
);

export default TrendsTab;
