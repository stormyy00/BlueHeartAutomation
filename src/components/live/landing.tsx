import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Background from "@/public/ucr_background.png";

const Landing = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <Image
          className="h-full w-full object-cover"
          src={Background}
          alt="UCR Background"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: false }}
      >
        <motion.h1
          className="text-6xl font-semibold tracking-tight drop-shadow-md md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: false }}
        >
          TTickle Newsletter Automation
        </motion.h1>

        <motion.div
          className="my-4 h-1 w-32 bg-[#FFB81C]"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        />

        <motion.p
          className="text-lg font-light text-gray-300 md:text-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          Non-profit for the heart
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Landing;
