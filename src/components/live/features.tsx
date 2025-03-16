import React from "react";
import Card from "./card";
import { BarChart3, Book, Mail } from "lucide-react";

const Features = () => {
  return (
    <div className="py-5 flex flex-col w-full text-center">
      <h2 className="text-5xl font-bold text-ttickles-darkblue">
        Why TTickle?
      </h2>
      <p className="mt-4 text-xl text-gray-600">
        Streamline your non-profit communications with our comprehensive
        newsletter automation tools
      </p>
      <div className="mt-12 flex flex-wrap w-full justify-center gap-8">
        <Card
          icon={<Mail size={24} />}
          title={"Easy Automation"}
          text={"Set up newsletters with just a few clicks."}
        />
        <Card
          icon={<Book size={24} />}
          title={"Custom Templates"}
          text={"Set up newsletters with just a few clicks."}
        />
        <Card
          icon={<BarChart3 size={28} />}
          title={"Analytics & Reports"}
          text={
            "Track the effectiveness of your communications with detailed engagement metrics."
          }
        />
      </div>
    </div>
  );
};

export default Features;
