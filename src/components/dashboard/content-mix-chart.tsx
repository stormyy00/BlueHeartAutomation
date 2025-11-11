import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PerformanceDataItem {
  name: string;
  value: number;
  fill: string;
}

interface ContentMixChartProps {
  data: PerformanceDataItem[];
}

export const ContentMixChart = ({ data }: ContentMixChartProps) => (
  <div className="bg-white rounded-xl border border-ttickles-lightblue p-6">
    <h2 className="text-lg font-bold text-ttickles-darkblue mb-4">
      Content Mix
    </h2>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
      </PieChart>
    </ResponsiveContainer>
    <div className="mt-4 space-y-2">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-ttickles-gray">{item.name}</span>
          </div>
          <span className="font-semibold text-ttickles-darkblue">
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  </div>
);
