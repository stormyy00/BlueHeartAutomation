import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TimeSeriesChart from "./chart";
import MetricCard from "./metrics";

type SessionsTabProps = {
  timeSeriesData: { date: string; value: number }[];
};

const SessionsTab = ({ timeSeriesData }: SessionsTabProps) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>User Sessions</CardTitle>
        <CardDescription>
          Detailed information about user sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Avg. Session Duration", value: "2m 45s" },
              { title: "Pages per Session", value: "3.2" },
              { title: "Bounce Rate", value: "32%" },
            ].map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
              />
            ))}
          </div>

          <div className="h-80">
            <TimeSeriesChart
              data={timeSeriesData.slice(-30)}
              dataKey="value"
              name="Session Count"
              color="#8884d8"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          title: "Session Duration Distribution",
          description: "How long users stay on your site",
          chartData: [
            { date: "0-10s", value: 35 },
            { date: "10-30s", value: 25 },
            { date: "30-60s", value: 20 },
            { date: "1-3m", value: 15 },
            { date: "3-10m", value: 10 },
            { date: ">10m", value: 5 },
          ],
          color: "#82ca9d",
        },
        {
          title: "Device Breakdown",
          description: "Sessions by device type",
          chartData: [
            { date: "Desktop", value: 55 },
            { date: "Mobile", value: 40 },
            { date: "Tablet", value: 5 },
          ],
          color: "#ff7300",
        },
      ].map((chart, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{chart.title}</CardTitle>
            <CardDescription>{chart.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <TimeSeriesChart
                data={chart.chartData}
                dataKey="value"
                name={index === 0 ? "Sessions" : "Percentage"}
                color={chart.color}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export default SessionsTab;
