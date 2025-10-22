import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Package,
  Truck,
  Shield,
  Bot,
  User,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Zap
} from 'lucide-react'

export default async function DashboardPage() {
  await auth.protect();

  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              {user?.lastName?.charAt(0)?.toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground text-lg">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Premium User
              </Badge>
              <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Halal Certified
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-3">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last login: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            System Status: Operational
          </span>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Blockchain: Connected
          </span>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">156</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">98%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2%</span> from last month
                </p>
                <Progress value={98} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">+3</span> new insights
                </p>
                <Progress value={60} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Inventory Management
                </CardTitle>
                <CardDescription>Manage your products and stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/products">
                  <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300">
                    View Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Shipment Tracking
                </CardTitle>
                <CardDescription>Monitor shipments and logistics in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tracking">
                  <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300">
                    Track Shipments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Certification Hub
                </CardTitle>
                <CardDescription>Halal certification management and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/certification">
                  <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300">
                    Manage Certifications
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  AI Agents
                </CardTitle>
                <CardDescription>AI-powered logistics assistance and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/ai-agent">
                  <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300">
                    Access AI Agents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  User Profile
                </CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>View comprehensive reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full halal-gradient hover:shadow-lg transition-all duration-300" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates in your logistics operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">Shipment #HL-2024-001 delivered successfully</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • Dubai, UAE</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex items-start space-x-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">New product added to inventory</p>
                      <p className="text-xs text-muted-foreground">1 day ago • Organic Halal Chicken</p>
                    </div>
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>

                  <div className="flex items-start space-x-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Certification renewal due</p>
                      <p className="text-xs text-muted-foreground">3 days ago • Expires: Dec 31, 2024</p>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>

                  <div className="flex items-start space-x-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">AI Agent generated compliance report</p>
                      <p className="text-xs text-muted-foreground">5 hours ago • 98% compliance score</p>
                    </div>
                    <Bot className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Quality Score</span>
                      <span className="text-sm text-muted-foreground">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm text-muted-foreground">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Blockchain Transactions</span>
                      <span className="text-sm text-muted-foreground">1,247</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">+12%</p>
                      <p className="text-xs text-muted-foreground">Growth Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">$2.4M</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive insights and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  We&apos;re building comprehensive analytics with real-time data visualization,
                  custom reports, and predictive insights powered by AI.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Detailed activity log and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity items would go here */}
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Activity feed will show detailed logs here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-shipments" defaultChecked />
                        <label htmlFor="email-shipments" className="text-sm">Shipment updates</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-certifications" defaultChecked />
                        <label htmlFor="email-certifications" className="text-sm">Certification alerts</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme Preferences</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="theme-light" name="theme" />
                        <label htmlFor="theme-light" className="text-sm">Light mode</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="theme-dark" name="theme" defaultChecked />
                        <label htmlFor="theme-dark" className="text-sm">Dark mode</label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
