"use client";

import { motion } from "framer-motion";
import { Truck, MapPin, Thermometer, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function TrackingSection() {
  const trackingData = [
    {
      location: "Processing Facility - Malaysia",
      status: "Completed",
      timestamp: "2024-01-15 08:30 UTC",
      temperature: "4°C",
      compliance: "Halal Verified",
      progress: 100,
    },
    {
      location: "Cold Storage - Singapore",
      status: "Completed",
      timestamp: "2024-01-16 14:20 UTC",
      temperature: "2°C",
      compliance: "Chain Maintained",
      progress: 100,
    },
    {
      location: "Distribution Center - Dubai",
      status: "In Transit",
      timestamp: "2024-01-17 09:15 UTC",
      temperature: "3°C",
      compliance: "Monitoring Active",
      progress: 75,
    },
    {
      location: "Final Destination - London",
      status: "Pending",
      timestamp: "Expected: 2024-01-18 16:00 UTC",
      temperature: "N/A",
      compliance: "Awaiting Delivery",
      progress: 25,
    },
  ];

  return (
    <section
      id="tracking"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden"
    >
      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Real-Time Shipment Tracking"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                animation="slide"
              />
              <AnimatedText
                text="Monitor your Halal products throughout the entire supply chain with blockchain-verified tracking data"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <Card className="glassmorphic-card mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl tracking-tight">
                      Shipment #HL-2024-001
                    </CardTitle>
                    <CardDescription>
                      Premium Halal Beef - 500kg
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Halal Certified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Overall Progress
                  </span>
                </div>
                <Progress value={75} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  75% Complete - In Transit to Dubai
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <div className="space-y-4">
            {trackingData.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`glassmorphic-card ${item.status === "Completed" ? "border-green-500/30" : item.status === "In Transit" ? "border-indigo-500/30" : "border-gray-500/30"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-2 rounded-full ${
                              item.status === "Completed"
                                ? "bg-green-500/20"
                                : item.status === "In Transit"
                                  ? "bg-indigo-500/20"
                                  : "bg-gray-500/20"
                            }`}
                          >
                            {item.status === "Completed" ? (
                              <MapPin className="h-5 w-5 text-green-400" />
                            ) : item.status === "In Transit" ? (
                              <Truck className="h-5 w-5 text-indigo-400" />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium tracking-tight">
                              {item.location}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.timestamp}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              {item.temperature !== "N/A" && (
                                <div className="flex items-center space-x-1">
                                  <Thermometer className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm">
                                    {item.temperature}
                                  </span>
                                </div>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  item.compliance.includes("Verified")
                                    ? "border-green-500 text-green-400"
                                    : item.compliance.includes("Active")
                                      ? "border-indigo-500 text-indigo-400"
                                      : "border-gray-500 text-gray-400"
                                }`}
                              >
                                {item.compliance}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.status === "Completed"
                              ? "default"
                              : item.status === "In Transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
