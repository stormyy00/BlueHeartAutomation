import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const HistorySkeleton = () => {
  return (
    <Card className="flex items-center justify-between px-6 py-5 mb-3 rounded-xl shadow-sm min-h-[68px]">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-6 w-[260px] rounded" />
      </div>

      <div className="flex items-center gap-4 min-w-[350px] justify-end">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </Card>
  );
};

export default HistorySkeleton;
