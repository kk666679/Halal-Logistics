import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Package, Truck, Shield, Bot, User, BarChart3, Settings, LogOut, Bell } from 'lucide-react'

export default async function DashboardPage() {
  await auth.protect();

  const user = await currentUser();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              {user?.lastName?.charAt(0)?.toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Badge variant="secondary">Premium User</Badge>
        <Badge variant="outline">Halal Certified</Badge>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm text-muted-foreground">
          Last login: {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Inventory
            </CardTitle>
            <CardDescription>Manage your products and stock</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button className="w-full halal-gradient">View Inventory</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Tracking
            </CardTitle>
            <CardDescription>Monitor shipments and logistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tracking">
              <Button className="w-full halal-gradient">Track Shipments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Certification
            </CardTitle>
            <CardDescription>Halal certification management</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/certification">
              <Button className="w-full halal-gradient">Manage Certifications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              AI Agents
            </CardTitle>
            <CardDescription>AI-powered logistics assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai-agent">
              <Button className="w-full halal-gradient">Access AI Agents</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button className="w-full halal-gradient">View Profile</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>View reports and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your logistics operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Shipment #1234 delivered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New product added to inventory</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Certification renewal due</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-sm text-muted-foreground">Active Shipments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">AI Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
