import React from "react";
import { motion } from "framer-motion";
import Card from "./card";
import { BarChart3, Book, Mail } from "lucide-react";

const Features = () => {
  return (
    <motion.div
      className="py-20 flex flex-col w-full text-center bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      {/* Section Title */}
      <motion.h2
        className="text-5xl font-semibold tracking-tight text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        Why TTickle?
      </motion.h2>

      <motion.p
        className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        Streamline your non-profit communications with our comprehensive
        newsletter automation tools.
      </motion.p>

      {/* Feature Cards */}
      <div className="mt-16 flex flex-wrap w-full justify-center gap-8">
        {[
          {
            icon: <Mail size={36} className="text-[#FFB81C]" />,
            title: "Easy Automation",
            text: "Set up newsletters with just a few clicks.",
          },
          {
            icon: <Book size={36} className="text-[#FFB81C]" />,
            title: "Custom Templates",
            text: "Craft newsletters that fit your brand effortlessly.",
          },
          {
            icon: <BarChart3 size={36} className="text-[#FFB81C]" />,
            title: "Analytics & Reports",
            text: "Track engagement metrics for better decision-making.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Card
              icon={feature.icon}
              title={feature.title}
              text={feature.text}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;
