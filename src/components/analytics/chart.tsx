import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type TimeSeriesChartProps = {
  data: Array<{ date: string; [key: string]: string | number }>;
  dataKey: string;
  name: string;
  color: string;
  height?: string;
};

const TimeSeriesChart = ({
  data,
  dataKey,
  name,
  color,
  height = "100%",
}: TimeSeriesChartProps) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No trend data available</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          activeDot={{ r: 8 }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default TimeSeriesChart;
