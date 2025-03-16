import React from "react";

const Card = ({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: JSX.Element;
}) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white w-80 p-6 shadow-lg">
      <div className="mb-4 rounded-full bg-blue-100 p-4 text-ttickles-darkblue">
        {icon}
      </div>
      <div className="text-2xl font-semibold text-ttickles-darkblue">
        {title}
      </div>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
};

export default Card;
