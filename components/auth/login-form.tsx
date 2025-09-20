"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["supplier", "certifier", "auditor", "consumer"], {
    required_error: "Please select your role",
  }),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>
  onSwitchToSignup?: () => void
}

export function LoginForm({ onSubmit, onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "supplier",
    },
  })

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await onSubmit?.(data)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    { value: "supplier", label: "Supplier", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    { value: "certifier", label: "Certifier", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { value: "auditor", label: "Auditor", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
    { value: "consumer", label: "Consumer", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  ]

  return (
    <Card className="w-full max-w-md glassmorphic-card blockchain-glow">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-heading tracking-tight">Welcome Back</CardTitle>
        <CardDescription>Sign in to your HalalChain account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email" className="glassmorphic-inner-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="glassmorphic-inner-card pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((role) => (
                        <label
                          key={role.value}
                          className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all hover:scale-105 ${
                            field.value === role.value ? role.color : "border-muted bg-muted/20 hover:bg-muted/40"
                          }`}
                        >
                          <input
                            type="radio"
                            value={role.value}
                            checked={field.value === role.value}
                            onChange={field.onChange}
                            className="sr-only"
                          />
                          <div className="text-sm font-medium">{role.label}</div>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full halal-gradient" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={onSwitchToSignup}>
              Sign up here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
