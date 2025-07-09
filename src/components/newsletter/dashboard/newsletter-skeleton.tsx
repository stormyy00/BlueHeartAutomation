import { Skeleton } from "@/components/ui/skeleton";

const NewsletterSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col justify-between shadow-sm border border-gray-100 min-h-[180px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 mt-2 rounded" />
        <Skeleton className="h-7 w-1/2 rounded" />
        <div className="flex items-center mt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default NewsletterSkeleton;
