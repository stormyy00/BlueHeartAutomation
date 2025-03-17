type MetricCardProps = {
  title: string;
  value: number | string;
};

const MetricCard = ({ title, value }: MetricCardProps) => (
  <div className="bg-slate-100 p-4 rounded-md">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default MetricCard;
