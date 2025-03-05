import React from "react";

const Card = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="w-80 p-6 bg-white shadow-lg rounded-xl">
      <div className="text-2xl font-semibold text-ttickles-darkblue">
        {title}
      </div>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
};

export default Card;
