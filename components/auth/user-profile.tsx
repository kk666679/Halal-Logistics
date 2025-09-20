"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Building, User, LogOut, Settings } from "lucide-react"

interface UserProfileProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: "supplier" | "certifier" | "auditor" | "consumer"
    companyName?: string
    avatar?: string
    halalCertificationNumber?: string
    isVerified: boolean
  }
  onLogout?: () => void
  onSettings?: () => void
}

export function UserProfile({ user, onLogout, onSettings }: UserProfileProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "supplier":
        return {
          label: "Supplier",
          color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          icon: <Building className="h-4 w-4" />,
        }
      case "certifier":
        return {
          label: "Certifier",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <Shield className="h-4 w-4" />,
        }
      case "auditor":
        return {
          label: "Auditor",
          color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
          icon: <Shield className="h-4 w-4" />,
        }
      case "consumer":
        return {
          label: "Consumer",
          color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
          icon: <User className="h-4 w-4" />,
        }
      default:
        return {
          label: "User",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <User className="h-4 w-4" />,
        }
    }
  }

  const roleConfig = getRoleConfig(user.role)
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <Card className="w-full max-w-md glassmorphic-card">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20 glassmorphic-avatar">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <CardTitle className="text-xl tracking-tight">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>

            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline" className={roleConfig.color}>
                {roleConfig.icon}
                <span className="ml-1">{roleConfig.label}</span>
              </Badge>

              {user.isVerified && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {user.companyName && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="font-medium">{user.companyName}</p>
          </div>
        )}

        {user.halalCertificationNumber && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Certification Number</p>
            <p className="font-medium font-mono text-sm">{user.halalCertificationNumber}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Button
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive bg-transparent"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
