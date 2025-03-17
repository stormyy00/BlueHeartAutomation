import React from "react";
import Link from "next/link";

const Aciton = () => {
  return (
    <div className="py-20 flex flex-col items-center bg-ttickles-darkblue text-center text-white">
      <div className="text-4xl font-bold">Get Started with TTickle</div>
      <p className="mt-4 text-lg">
        Join us in making newsletters effortless and impactful.
      </p>
      <Link
        href={"/login"}
        className="w-fit mt-8 px-8 py-3 bg-[#FFB81C] text-black font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition"
      >
        Sign Up Now
      </Link>
    </div>
  );
};

export default Aciton;
