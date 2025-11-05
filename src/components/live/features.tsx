import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { DottedMap } from "../ui/dotted-map";
const markers = [
  {
    lat: 40.7128,
    lng: -74.006,
    size: 0.3,
  }, // New York
  {
    lat: 34.0522,
    lng: -118.2437,
    size: 0.3,
  }, // Los Angeles
  {
    lat: 51.5074,
    lng: -0.1278,
    size: 0.3,
  }, // London
  {
    lat: -33.8688,
    lng: 151.2093,
    size: 0.3,
  }, // Sydney
  {
    lat: 48.8566,
    lng: 2.3522,
    size: 0.3,
  }, // Paris
  {
    lat: 35.6762,
    lng: 139.6503,
    size: 0.3,
  }, // Tokyo
  {
    lat: 55.7558,
    lng: 37.6176,
    size: 0.3,
  }, // Moscow
  {
    lat: 39.9042,
    lng: 116.4074,
    size: 0.3,
  }, // Beijing
  {
    lat: 28.6139,
    lng: 77.209,
    size: 0.3,
  }, // New Delhi
  {
    lat: -23.5505,
    lng: -46.6333,
    size: 0.3,
  }, // São Paulo
  {
    lat: 1.3521,
    lng: 103.8198,
    size: 0.3,
  }, // Singapore
  {
    lat: 25.2048,
    lng: 55.2708,
    size: 0.3,
  }, // Dubai
  {
    lat: 52.52,
    lng: 13.405,
    size: 0.3,
  }, // Berlin
  {
    lat: 19.4326,
    lng: -99.1332,
    size: 0.3,
  }, // Mexico City
  {
    lat: -26.2041,
    lng: 28.0473,
    size: 0.3,
  }, // Johannesburg
];
const Features = () => {
  return (
    <motion.div
      className="py-24 flex flex-col w-full text-center bg-gradient-to-b from-background to-muted/30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="flex justify-between max-w-6xl mx-auto px-6 mb-20 w-full">
        <div>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Target className="w-4 h-4" />
            What we offer
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Everything you need to
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              amplify your impact
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Streamline your non-profit communications with our comprehensive
            suite of newsletter automation tools designed specifically for
            impact-driven organizations.
          </motion.p>
        </div>
        <DottedMap
          width={700}
          height={500}
          mapSamples={5000}
          markers={markers}
          markerColor="#1C6D96"
          dotRadius={2}
          stagger={true}
          // className="mx-auto mb-10 mt-4"
        />
      </div>
    </motion.div>
  );
};

export default Features;
