"use client";

// import Aciton from "@/components/live/aciton";
import Demos from "@/components/live/demos";
import FAQSection from "@/components/live/faq";
import Features from "@/components/live/features";
import Footer from "@/components/live/footer";
import Landing from "@/components/live/landing";
import Navigation from "@/components/live/navigation";

const Page = () => {
  return (
    <div className="flex flex-col justify-center">
      <Navigation />
      <Landing />
      <Features />
      <Demos />
      <FAQSection />
      {/* <Aciton /> */}
      <Footer />
    </div>
  );
};

export default Page;
