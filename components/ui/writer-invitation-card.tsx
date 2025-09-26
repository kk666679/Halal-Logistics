"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WriterInvitation } from "@/lib/types";
import { PenTool, Users, TrendingUp, Network } from "lucide-react";
import Link from "next/link";

interface WriterInvitationCardProps {
  invitation: WriterInvitation;
  variant?: "default" | "compact";
}

const benefitIcons = {
  0: Users,
  1: TrendingUp,
  2: Network,
  3: PenTool,
};

export function WriterInvitationCard({ invitation, variant = "default" }: WriterInvitationCardProps) {
  if (variant === "compact") {
    return (
      <ScrollReveal>
        <Card className="glassmorphic-card border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{invitation.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">{invitation.description}</p>
            <Button asChild size="sm" className="w-full">
              <Link href={invitation.ctaLink}>{invitation.ctaText}</Link>
            </Button>
          </CardContent>
        </Card>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <Card className="glassmorphic-card border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <PenTool className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{invitation.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {invitation.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Why Write With Us?
            </h4>
            <ul className="space-y-2">
              {invitation.benefits.map((benefit, index) => {
                const IconComponent = benefitIcons[index as keyof typeof benefitIcons] || Users;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <IconComponent className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Button asChild size="lg" className="w-full">
              <Link href={invitation.ctaLink}>
                {invitation.ctaText}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Join 50+ industry experts already contributing
            </p>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}
