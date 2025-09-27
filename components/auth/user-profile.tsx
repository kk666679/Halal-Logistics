"use client";

import { Shield, Building, User, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "supplier" | "certifier" | "auditor" | "consumer";
  };
  onLogout: () => void;
  onSettings: () => void;
}

export function UserProfile({ user, onLogout, onSettings }: UserProfileProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "supplier":
        return <Building className="h-4 w-4" />;
      case "certifier":
        return <Shield className="h-4 w-4" />;
      case "auditor":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "supplier":
        return "bg-blue-100 text-blue-800";
      case "certifier":
        return "bg-green-100 text-green-800";
      case "auditor":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getRoleColor(user.role)}>
            {getRoleIcon(user.role)}
            <span className="ml-1 capitalize">{user.role}</span>
          </Badge>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
