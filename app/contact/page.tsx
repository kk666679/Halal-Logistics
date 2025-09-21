"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { GradientButton } from "@/components/ui-library/buttons/gradient-button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["hello@halalchain.com", "support@halalchain.com"],
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      details: ["123 Business Ave", "Dubai, UAE 12345"],
      description: "Visit our headquarters",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Monday - Friday", "8:00 AM - 6:00 PM GST"],
      description: "24/7 support available",
    },
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days.",
    },
    {
      question: "Do you offer custom implementations?",
      answer:
        "Yes, we provide custom solutions tailored to your specific business needs.",
    },
    {
      question: "What regions do you serve?",
      answer:
        "We serve clients globally with local support in major markets including Middle East, Asia Pacific, Europe, and North America.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <AnimatedBackground
            variant="waves"
            color="rgba(99, 102, 241, 0.05)"
          />

          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-4">
                  <AnimatedText
                    text="Contact Us"
                    variant="heading"
                    className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                    animation="slide"
                  />
                  <AnimatedText
                    text="Get in touch with our team to learn how HalalChain can transform your supply chain operations"
                    variant="paragraph"
                    className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                    animation="fade"
                    delay={0.3}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container px-6 md:px-8 pb-12 md:pb-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <Card className="glassmorphic-card">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-tight">
                      Send us a Message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we&apos;ll get back to you as
                      soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              placeholder="your.email@company.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="How can we help you?"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            placeholder="Tell us more about your inquiry..."
                          />
                        </div>

                        <GradientButton
                          type="submit"
                          disabled={isSubmitting}
                          glowAmount={5}
                          className="w-full"
                          gradientFrom="from-amber-600"
                          gradientTo="to-indigo-600"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </GradientButton>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-muted-foreground opacity-70">
                          Thank you for contacting us. We&apos;ll get back to
                          you within 24 hours.
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <ScrollReveal>
                <Card className="glassmorphic-card">
                  <CardHeader>
                    <CardTitle className="text-xl tracking-tight">
                      Get in Touch
                    </CardTitle>
                    <CardDescription>
                      Multiple ways to reach our team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{info.title}</h4>
                          {info.details.map((detail, i) => (
                            <p
                              key={i}
                              className="text-sm text-muted-foreground opacity-70"
                            >
                              {detail}
                            </p>
                          ))}
                          <p className="text-xs text-muted-foreground opacity-50 mt-1">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Quick FAQ */}
              <ScrollReveal>
                <Card className="glassmorphic-card">
                  <CardHeader>
                    <CardTitle className="text-xl tracking-tight">
                      Quick Questions
                    </CardTitle>
                    <CardDescription>Common inquiries answered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                        <p className="text-xs text-muted-foreground opacity-70">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl mb-4">
                  Visit Our Office
                </h2>
                <p className="text-muted-foreground opacity-70 max-w-2xl mx-auto">
                  Located in the heart of Dubai&apos;s business district, our
                  headquarters serves as the global hub for HalalChain
                  operations and innovation.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <Card className="glassmorphic-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="font-medium">Dubai Headquarters</h3>
                        <p className="text-sm text-muted-foreground">
                          123 Business Avenue, Dubai, UAE
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
