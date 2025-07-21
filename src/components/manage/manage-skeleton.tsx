import { Skeleton } from "../ui/skeleton";

const ManageSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-6 mb-8 border rounded-2xl p-6">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="w-2/3 h-8 rounded-md" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-12 h-8 rounded-md" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border p-6">
        <Skeleton className="w-44 h-6 mb-4 rounded-md" />
        <Skeleton className="w-2/3 h-4 mb-6 rounded" />

        <div className="flex gap-4 mb-6">
          <Skeleton className="w-24 h-8 rounded-md" />
          <Skeleton className="w-24 h-8 rounded-md" />
        </div>

        <div className="mb-3">
          <Skeleton className="w-48 h-5 mb-2 rounded-md" />
          <Skeleton className="w-1/2 h-4 mb-2 rounded" />
        </div>
        <div className="mb-6">
          <Skeleton className="w-20 h-4 mb-1 rounded" />
          <Skeleton className="w-full h-14 rounded-md mb-4" />
        </div>
        <div className="mb-6">
          <Skeleton className="w-20 h-4 mb-1 rounded" />
          <Skeleton className="w-1/4 h-5 rounded-md" />
        </div>
        <div>
          <Skeleton className="w-32 h-4 mb-1 rounded" />
          <Skeleton className="w-full h-5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ManageSkeleton;
