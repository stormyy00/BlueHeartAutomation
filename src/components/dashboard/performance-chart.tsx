import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsDataPoint {
  month: string;
  engagement: number;
  reach: number;
}

interface PerformanceChartProps {
  data: AnalyticsDataPoint[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => (
  <div className="lg:col-span-2 bg-white rounded-xl border border-ttickles-lightblue p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-ttickles-darkblue">Performance</h2>
      <select className="px-3 py-1.5 text-sm border border-ttickles-lightblue rounded-lg focus:outline-none focus:ring-2 focus:ring-ttickles-blue bg-white text-ttickles-gray">
        <option>Last 6 months</option>
        <option>Last year</option>
      </select>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1C6D96" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1C6D96" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#83c5be" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#83c5be" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#edf6f9" />
        <XAxis dataKey="month" stroke="#7e8287" style={{ fontSize: "12px" }} />
        <YAxis stroke="#7e8287" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #83c5be",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke="#1C6D96"
          fillOpacity={1}
          fill="url(#colorEngagement)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="reach"
          stroke="#83c5be"
          fillOpacity={1}
          fill="url(#colorReach)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
