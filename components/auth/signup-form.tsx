"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Shield, Loader2, Building, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["supplier", "certifier", "auditor", "consumer"], {
      required_error: "Please select your role",
    }),
    companyName: z.string().optional(),
    companyDescription: z.string().optional(),
    halalCertificationNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => Promise<void>;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSubmit, onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "supplier",
      companyName: "",
      companyDescription: "",
      halalCertificationNumber: "",
    },
  });

  const selectedRole = form.watch("role");

  const handleSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "supplier",
      label: "Supplier",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Building className="h-4 w-4" />,
      description: "Food producers and manufacturers",
    },
    {
      value: "certifier",
      label: "Certifier",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: <Shield className="h-4 w-4" />,
      description: "Halal certification authorities",
    },
    {
      value: "auditor",
      label: "Auditor",
      color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      icon: <Shield className="h-4 w-4" />,
      description: "Compliance and audit professionals",
    },
    {
      value: "consumer",
      label: "Consumer",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: <User className="h-4 w-4" />,
      description: "End consumers and buyers",
    },
  ];

  return (
    <Card className="w-full max-w-2xl glassmorphic-card blockchain-glow">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-heading tracking-tight">
          Join HalalChain
        </CardTitle>
        <CardDescription>
          Create your account to start tracking Halal compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your first name"
                        className="glassmorphic-inner-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your last name"
                        className="glassmorphic-inner-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="glassmorphic-inner-card"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Create password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className="glassmorphic-inner-card pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
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
            </div>

            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleOptions.map((role) => (
                        <label
                          key={role.value}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                            field.value === role.value
                              ? role.color
                              : "border-muted bg-muted/20 hover:bg-muted/40"
                          }`}
                        >
                          <input
                            type="radio"
                            value={role.value}
                            checked={field.value === role.value}
                            onChange={field.onChange}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            {role.icon}
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional Fields Based on Role */}
            {(selectedRole === "supplier" || selectedRole === "certifier") && (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your company name"
                          className="glassmorphic-inner-card"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of your company and services"
                          className="glassmorphic-inner-card min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {selectedRole === "certifier" && (
              <FormField
                control={form.control}
                name="halalCertificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Halal Certification Authority Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your certification authority number"
                        className="glassmorphic-inner-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full halal-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary hover:underline"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
