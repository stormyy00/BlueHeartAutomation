"use client";

import React, { useRef, forwardRef } from "react";
import { cn } from "@/utils/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { HeartHandshake, Cpu, Users } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="flex flex-col items-center z-10">
      <div
        ref={ref}
        className={cn(
          "relative flex size-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-8px_rgba(0,0,0,0.5)] z-10",
          className,
        )}
      >
        {children}
      </div>
      {label && (
        <p className="mt-2 text-xs font-semibold text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  );
});
Circle.displayName = "Circle";

const AnimatedBeamComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nonprofitRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const audienceRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-md md:max-w-2xl items-center justify-center overflow-visible p-10"
      ref={containerRef}
    >
      <div className="absolute inset-0 -z-50">
        <AnimatedBeam
          duration={4}
          containerRef={containerRef}
          fromRef={nonprofitRef}
          toRef={aiRef}
          gradientStartColor="#2563EB"
          gradientStopColor="#60A5FA"
          className="from-[#2563EB] via-[#60A5FA] to-transparent"
        />
        <AnimatedBeam
          duration={4}
          containerRef={containerRef}
          fromRef={aiRef}
          toRef={audienceRef}
          gradientStartColor="#2563EB"
          gradientStopColor="#60A5FA"
          className="from-[#2563EB] via-[#60A5FA] to-transparent"
        />
      </div>

      <div className="relative z-50 flex w-full items-center justify-between">
        <Circle
          ref={nonprofitRef}
          label="Organization"
          className="border-primary/40 bg-primary/5"
        >
          <HeartHandshake className="text-primary" size={28} />
        </Circle>

        <Circle
          ref={aiRef}
          label="AI Engine"
          className="border-secondary/40 bg-secondary/5"
        >
          <Cpu className="text-secondary" size={28} />
        </Circle>

        <Circle
          ref={audienceRef}
          label="Donors"
          className="border-blue-400/40 bg-blue-50"
        >
          <Users className="text-blue-500" size={28} />
        </Circle>
      </div>
    </div>
  );
};

export default AnimatedBeamComponent;
