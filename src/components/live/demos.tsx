"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Timer, Users, Rocket, BarChart3 } from "lucide-react";

const Demos = () => {
  const comparisons = [
    {
      title: "Manual Process",
      description:
        "Teams spend hours manually writing and formatting newsletters across platforms.",
      icon: <Timer className="w-6 h-6 text-[#7e8287]" />,
      color: "from-gray-100 to-gray-200",
      border: "border-gray/30",
      side: "without",
    },
    {
      title: "Fragmented Messaging",
      description:
        "Each department uses its own tools, leading to inconsistent branding and slower turnaround.",
      icon: <Users className="w-6 h-6 text-[#7e8287]" />,
      color: "from-gray-100 to-gray-200",
      border: "border-gray/30",
      side: "without",
    },
    {
      title: "Automated Creativity",
      description:
        "AI generates campaign-ready posts in seconds — your team focuses on strategy, not formatting.",
      icon: <Rocket className="w-6 h-6 text-[#1C6D96]" />,
      color: "from-[#edf6f9] to-[#83c5be]/20",
      border: "border-[#83c5be]/40",
      side: "with",
    },
    {
      title: "Higher Throughput",
      description:
        "2× increase in campaign frequency and engagement rates — all measurable in your dashboard.",
      icon: <BarChart3 className="w-6 h-6 text-[#ff9f1c]" />,
      color: "from-[#fff7ec] to-[#ff9f1c]/10",
      border: "border-[#ff9f1c]/30",
      side: "with",
    },
  ];

  return (
    <motion.section
      className="relative py-28 bg-gradient-to-b from-muted/30 to-background text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.div
        className="max-w-4xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C6D96]/10 text-[#1C6D96] font-medium text-sm mb-6">
          Why This Platform?
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-foreground">
          From chaos to clarity
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {" "}
            see the difference
          </span>
        </h2>
        <p className="text-lg text-[#7e8287] max-w-3xl mx-auto">
          Compare the old way of manual outreach with the new era of automated,
          data-driven communication. Increase your marketing throughput without
          increasing your workload.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-12">
        <motion.div
          className="rounded-2xl border border-gray/20 bg-white/60 shadow-sm p-8 flex flex-col gap-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-[#7e8287] mb-2">
            Without the Platform
          </h3>
          {comparisons
            .filter((item) => item.side === "without")
            .map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r ${item.color} border ${item.border}`}
              >
                <div className="p-2 bg-white/60 rounded-lg shadow-sm">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-[#1C6D96]/80">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#7e8287]/90">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
        </motion.div>

        <motion.div
          className="rounded-2xl border border-[#83c5be]/40 bg-white/80 shadow-lg p-8 flex flex-col gap-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-[#1C6D96] mb-2">
            With Our Platform
          </h3>
          {comparisons
            .filter((item) => item.side === "with")
            .map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r ${item.color} border ${item.border}`}
              >
                <div className="p-2 bg-white/60 rounded-lg shadow-sm">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-[#1C6D96]">{item.title}</h4>
                  <p className="text-sm text-[#7e8287]/90">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

          <div className="mt-8">
            <p className="text-sm font-medium text-[#1C6D96]/70 mb-2">
              Marketing Throughput
            </p>
            <div className="h-3 bg-[#edf6f9] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: "40%" }}
                whileInView={{ width: "90%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#7e8287] mt-1">
              <span>Before</span>
              <span>After</span>
            </div>
          </div>

          <motion.a
            href="/demo"
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-[#1C6D96] text-white rounded-xl font-semibold hover:bg-[#155b74] transition-all duration-300 w-fit"
            whileHover={{ scale: 1.05 }}
          >
            Try Demo
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Demos;
