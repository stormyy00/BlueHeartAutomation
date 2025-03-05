"use client";

import Aciton from "@/components/live/aciton";
import Features from "@/components/live/features";
import Landing from "@/components/live/landing";
import Navigation from "@/components/live/navigation";

const Page = () => {
  return (
    <div className="flex flex-col justify-center">
      <Navigation />
      <Landing />
      <Features />
      <Aciton />
    </div>
  );
};

export default Page;
