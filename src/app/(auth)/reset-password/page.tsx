import Reset from "@/components/auth/reset";
import Loading from "@/components/global/loading";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Reset />
    </Suspense>
  );
};

export default page;
