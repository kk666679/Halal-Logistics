"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BentoGridProps {
  className?: string;
  children: ReactNode;
}

interface BentoCardProps {
  className?: string;
  children: ReactNode;
  name?: string;
  description?: string;
  href?: string;
  cta?: string;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  children,
  name,
  description,
  href,
  cta,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl bg-muted/50 p-6 transition-all hover:bg-muted/70",
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {(name || description || cta) && (
        <div className="mt-4">
          {name && (
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
          {cta && href && (
            <a
              href={href}
              className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              {cta}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
