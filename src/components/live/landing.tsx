import React, { forwardRef } from "react";
// import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { Play, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import AnimatedBeamComponent from "./animated";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_25px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-foreground overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-20">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      </motion.div>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div
          className="my-6 h-1 w-40 rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        />

        {/* <motion.p
          className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-foreground/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          Non-profit for the heart
        </motion.p> */}

        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 max-w-5xl leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
        >
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            The Agentic Platform
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            to transform your social outreach
          </span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-medium  max-w-4xl leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.4 }}
        >
          Create compelling newsletters and social media posts in minutes, not
          hours.
          <span className="text-primary font-semibold">
            {" "}
            Free forever, built for impact.
          </span>
        </motion.p>

        <motion.div
          className="my-4 w-full flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.6 }}
        >
          <AnimatedBeamComponent />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.8 }}
        >
          <Link
            href="/orgs/@mine/newsletter"
            className="group relative flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-base shadow-2xl transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/demo"
            className="group flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-card border border-ttickles-blue text-foreground font-bold text-lg transition-all duration-300 hover:bg-muted hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            <span>Try Demo Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 2 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by leading nonprofits
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="w-24 h-8 bg-muted rounded"></div>
            <div className="w-24 h-8 bg-muted rounded"></div>
            <div className="w-24 h-8 bg-muted rounded"></div>
            <div className="w-24 h-8 bg-muted rounded"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
