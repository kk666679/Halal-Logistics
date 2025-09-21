"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: Array<"supplier" | "certifier" | "auditor" | "consumer" | "admin">
  userRole?: string
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, userRole, fallback }: RoleGuardProps) {
  // Mock user role for demo - in real app this would come from auth context
  const currentUserRole = userRole || "supplier"

  const hasAccess = allowedRoles.includes(currentUserRole as "supplier" | "certifier" | "auditor" | "consumer" | "admin")

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Card className="w-full max-w-md mx-auto glassmorphic-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl tracking-tight">Access Restricted</CardTitle>
          <CardDescription>You don&apos;t have permission to access this feature.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This feature is only available to: {allowedRoles.join(", ")}
          </p>
          <p className="text-sm text-muted-foreground">
            Your current role: <span className="font-medium">{currentUserRole}</span>
          </p>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
