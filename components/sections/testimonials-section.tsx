"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ahmed Al-Mansoori",
      role: "Halal Industry Consultant",
      content: "HalalChain has revolutionized how we track and verify halal products. The blockchain transparency gives consumers unprecedented confidence in their purchases.",
      avatar: "AM",
    },
    {
      name: "Fatima Khan",
      role: "Food Safety Manager",
      content: "Implementing HalalChain across our supply chain has streamlined our certification process and reduced compliance costs by 40%. The platform is incredibly intuitive.",
      avatar: "FK",
    },
    {
      name: "Dr. Omar Hassan",
      role: "Islamic Finance Expert",
      content: "The integration of blockchain technology with halal certification is groundbreaking. HalalChain sets new standards for trust and transparency in the halal industry.",
      avatar: "OH",
    },
    {
      name: "Yasmin Abdullah",
      role: "Retail Chain Owner",
      content: "Our customers appreciate the QR code verification feature. They can instantly confirm the halal status of any product, which has significantly boosted sales.",
      avatar: "YA",
    },
    {
      name: "Mohammed Ibrahim",
      role: "Supply Chain Director",
      content: "The real-time tracking capabilities have transformed our operations. We can now monitor halal compliance at every stage with complete audit trails.",
      avatar: "MI",
    },
    {
      name: "Aisha Rahman",
      role: "Consumer Advocate",
      content: "As a Muslim consumer, HalalChain gives me peace of mind. I can trust that the products I buy are genuinely halal, thanks to the immutable blockchain records.",
      avatar: "AR",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-emerald-50/30 overflow-hidden"
    >
      <AnimatedBackground variant="grid" color="rgba(16, 185, 129, 0.03)" />

      <div className="container px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <AnimatedText
                text="Trusted by Halal Industry Leaders"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent"
                animation="slide"
              />
              <AnimatedText
                text="Discover how HalalChain is transforming halal certification and supply chain transparency for businesses and consumers worldwide."
                variant="paragraph"
                className="max-w-[900px] text-green-800/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full bg-white/70 backdrop-blur-sm border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className="border-2 border-transparent group-hover:border-green-500 transition-colors duration-300 bg-green-100">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`}
                            alt={testimonial.name}
                          />
                          <AvatarFallback className="bg-green-500 text-white">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-medium tracking-tight group-hover:text-green-600 transition-colors duration-300">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-green-700/70">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-900/80 leading-relaxed group-hover:text-green-900 transition-colors duration-300">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust indicators */}
        <ScrollReveal delay={0.6}>
          <div className="text-center mt-8">
            <p className="text-sm text-green-600/70 font-medium">
              Trusted by 500+ halal businesses across 30 countries
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
