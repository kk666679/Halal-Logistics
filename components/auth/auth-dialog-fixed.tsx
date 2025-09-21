"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

interface AuthDialogProps {
  children: React.ReactNode;
  defaultMode?: "login" | "signup";
}

export function AuthDialog({
  children,
  defaultMode = "login",
}: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "supplier" | "certifier" | "auditor" | "consumer";
    companyName?: string;
    companyDescription?: string;
    halalCertificationNumber?: string;
  }) => {
    setIsLoading(true);
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Prepare registration data
      const registerData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: data.role,
        company: data.companyName,
        phone: data.companyDescription,
        address: data.halalCertificationNumber,
      };

      // Call auth service
      await authService.register(registerData);

      toast.success("Account created successfully! Please log in.");
      setMode("login");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: {
    email: string;
    password: string;
    role: "supplier" | "certifier" | "auditor" | "consumer";
  }) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      toast.success("Logged in successfully!");
      setIsOpen(false);
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-fit border-none bg-transparent shadow-none p-0">
        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToSignup={() => setMode("signup")}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignup}
            onSwitchToLogin={() => setMode("login")}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
