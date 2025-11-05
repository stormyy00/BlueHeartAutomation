import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Users, Star, Zap } from "lucide-react";

const Aciton = () => {
  const benefits = [
    "Free forever for nonprofits",
    "No credit card required",
    "Setup in under 5 minutes",
    "24/7 customer support",
  ];

  return (
    <div className="relative py-24 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          {/* Header */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-sm mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Zap className="w-4 h-4" />
            Ready to Get Started?
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            Transform Your Communications
            <br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Today
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            Join hundreds of nonprofits already using TTickle to amplify their
            impact.
            <span className="text-white font-semibold">
              {" "}
              Start your journey today
            </span>{" "}
            and see the difference in your first week.
          </motion.p>

          {/* Benefits */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-white/90"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.9 + index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
              >
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Link
              href="/orgs/@mine/newsletter"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-white/40 hover:scale-105"
            >
              <Users className="w-6 h-6" />
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/demo"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <Star className="w-6 h-6" />
              <span>Try Demo First</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">500+ Organizations</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">100% Free</span>
            </div>
          </motion.div>

          {/* Trust message */}
          <motion.p
            className="text-sm text-white/60 mt-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            "TTickle helped us increase our newsletter engagement by 300% in
            just two months. The AI suggestions are incredibly helpful and save
            us hours every week."
            <br />
            <span className="font-medium">
              - Sarah Johnson, Marketing Director at Hope Foundation
            </span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Aciton;
