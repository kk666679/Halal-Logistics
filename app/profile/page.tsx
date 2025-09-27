"use client";

import { useAuth } from '@/contexts/auth-context'
import { UserProfile } from '@/components/auth/user-profile'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold tracking-tight mb-8">User Profile</h1>
      <UserProfile 
        user={user} 
        onLogout={logout}
        onSettings={() => {
          // Placeholder for settings navigation
          console.log('Open settings')
        }}
      />
    </div>
  )
}
