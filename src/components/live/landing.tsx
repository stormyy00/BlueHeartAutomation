import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Background from "@/public/ucr_background.png";
import { Play, ShipWheel } from "lucide-react";
import Link from "next/link";
import LOGO from "@/public/temporarylogo.png";

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
        <div className="absolute inset-0 bg-ttickles-blue/80 blur-5xl" />
        <Image
          className="h-full w-full object-cover"
          src={Background}
          alt="UCR Background"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      >
        <motion.h1
          className="flex items-center text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-0 drop-shadow-lg"
          style={{ color: "#edf6f9" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          <Image
            src={LOGO}
            alt="TTickle Logo"
            className="h-24 w-24"
            priority
            quality={100}
          />
          <span className="-ml-3">ickle</span>
        </motion.h1>

        <motion.div
          className="my-3 h-1 w-32 rounded-full"
          style={{ backgroundColor: "#ff9c1c" }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        />

        <motion.p
          className="text-xl md:text-2xl lg:text-3xl font-medium mb-5 drop-shadow-md"
          style={{ color: "#edf6f9" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          Non-profit for the heart
        </motion.p>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-semibold mb-12 max-w-xl leading-relaxed drop-shadow-md"
          style={{ color: "#edf6f9" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
        >
          Amplify your social outreach in a few clicks. Create compelling
          newsletters and social media posts with AI-powered automation. <br />
          <span className="text-ttickles-orange font-medium">
            Free forever, built for impact.
          </span>
        </motion.p>
        <motion.div
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        >
          <Link
            href="/orgs/@mine/newsletter"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-tr from-ttickles-darkblue to-ttickles-lightblue text-white shadow-2xl transition  hover:shadow-ttickles-lightblue/40"
          >
            <Play />
            <span className="font-bold text-lg tracking-wider">
              Get Started
            </span>
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-tr from-ttickles-orange/90 to-ttickles-orange text-white shadow-2xl transition hover:shadow-yellow-300/40"
          >
            <ShipWheel />
            <span className="font-bold text-lg tracking-wider">Try Demo</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
