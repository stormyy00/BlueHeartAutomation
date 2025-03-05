import React from "react";
import Card from "./card";

const Features = () => {
  return (
    <div className="py-5 flex flex-col w-full text-center">
      <h2 className="text-5xl font-bold text-gray-800">Why TTickle?</h2>
      <p className="mt-4 text-xl text-gray-600">
        Automate newsletters with ease and reach your audience effortlessly.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-8">
        <Card
          title={"Easy Automation"}
          text={"Set up newsletters with just a few clicks."}
        />
        <Card
          title={"Custom Templates"}
          text={"Set up newsletters with just a few clicks."}
        />
        <Card
          title={"Analytics & Reports"}
          text={"Track engagement and optimize outreach."}
        />
      </div>
    </div>
  );
};

export default Features;
