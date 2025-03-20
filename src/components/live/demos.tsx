import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Background from "@/public/ucr_background.png";
import { ChevronRight, MessageSquare, Clock, BookTemplate } from "lucide-react";

const Demos = () => {
  const demoFeatures = [
    {
      id: "inline-chat",
      title: "Inline Chat",
      description:
        "Seamlessly communicate with your team while drafting newsletters.",
      icon: <MessageSquare size={24} className="text-[#FFB81C]" />,
      delay: 0.4,
    },
    {
      id: "chatbot",
      title: "AI Assistant Chatbot",
      description:
        "Get content suggestions and answer questions with our intelligent chatbot.",
      icon: <MessageSquare size={24} className="text-[#FFB81C]" />,
      delay: 0.6,
    },
    {
      id: "email-scheduling",
      title: "Email Scheduling",
      description:
        "Plan and automate your newsletter delivery at optimal times.",
      icon: <Clock size={24} className="text-[#FFB81C]" />,
      delay: 0.8,
    },
    {
      id: "custom-templates",
      title: "Custom Templates",
      description:
        "Create and save custom newsletter designs for consistent branding.",
      icon: <BookTemplate size={24} className="text-[#FFB81C]" />,
      delay: 1.0,
    },
  ];

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background with overlay */}
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl font-semibold tracking-tight drop-shadow-md md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            Our Features
          </motion.h1>
          <motion.div
            className="my-4 h-1 w-32 bg-[#FFB81C]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          />
          <motion.p
            className="text-lg font-light text-gray-300 md:text-xl max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
          >
            Explore how TTickle Newsletter Automation can streamline your
            nonprofit{"'"}s communications
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {demoFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-[#FFB81C] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: feature.delay,
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(255, 184, 28, 0.3)",
              }}
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-2xl font-medium ml-3">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <div className="mt-auto">
                <Link
                  href={`/demos/${feature.id}`}
                  className="group flex items-center text-[#FFB81C] hover:text-white transition-colors duration-300"
                >
                  <span>View Demo</span>
                  <ChevronRight
                    size={16}
                    className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
        >
          <motion.button
            className="bg-[#FFB81C] hover:bg-[#FFB81C]/90 text-black font-medium px-8 py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-[#FFB81C]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Request Full Demo
          </motion.button>
          <p className="text-gray-400 mt-4 text-sm">
            See all our features in action with a personalized walkthrough
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Demos;
