import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonVariantProps extends ButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonVariantProps>(
  ({ leftIcon, rightIcon, isLoading, loadingText, children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="default"
      disabled={isLoading}
      className={cn("bg-primary text-primary-foreground hover:bg-primary/90", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {loadingText || "Loading..."}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </Button>
  )
);
PrimaryButton.displayName = "PrimaryButton";

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonVariantProps>(
  ({ leftIcon, rightIcon, isLoading, loadingText, children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      disabled={isLoading}
      className={cn("bg-secondary text-secondary-foreground hover:bg-secondary/80", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {loadingText || "Loading..."}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </Button>
  )
);
SecondaryButton.displayName = "SecondaryButton";

const OutlineButton = React.forwardRef<HTMLButtonElement, ButtonVariantProps>(
  ({ leftIcon, rightIcon, isLoading, loadingText, children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      disabled={isLoading}
      className={cn("border border-input bg-background hover:bg-accent hover:text-accent-foreground", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {loadingText || "Loading..."}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </Button>
  )
);
OutlineButton.displayName = "OutlineButton";

export { PrimaryButton, SecondaryButton, OutlineButton };
