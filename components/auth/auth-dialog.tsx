"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

interface AuthDialogProps {
  children: React.ReactNode
  defaultMode?: "login" | "signup"
}

export function AuthDialog({ children, defaultMode = "login" }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">(defaultMode)

  const handleLogin = async (data: any) => {
    console.log("Login data:", data)
    // TODO: Implement actual login logic
    setIsOpen(false)
  }

  const handleSignup = async (data: any) => {
    console.log("Signup data:", data)
    // TODO: Implement actual signup logic
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-fit border-none bg-transparent shadow-none p-0">
        {mode === "login" ? (
          <LoginForm onSubmit={handleLogin} onSwitchToSignup={() => setMode("signup")} />
        ) : (
          <SignupForm onSubmit={handleSignup} onSwitchToLogin={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  )
}
