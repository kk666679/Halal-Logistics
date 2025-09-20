"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProductCard } from "./product-card"
import { AddProductForm } from "./add-product-form"
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Shield,
  BarChart3,
  Archive,
  RefreshCw,
} from "lucide-react"

// Mock inventory data
const mockInventory = [
  {
    id: "INV-001",
    name: "Premium Halal Beef - Grade A",
    category: "Meat & Poultry",
    sku: "HB-001-A",
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: "kg",
    costPerUnit: 25.5,
    sellingPrice: 35.0,
    supplier: "Al-Barakah Farms",
    location: "Warehouse A - Cold Storage",
    expiryDate: "2024-02-15",
    batchNumber: "BT-2024-001",
    halalCertified: true,
    certificationExpiry: "2024-12-31",
    lastUpdated: "2024-01-16T10:30:00Z",
    status: "in-stock",
    temperature: 2,
    humidity: 65,
  },
  {
    id: "INV-002",
    name: "Organic Halal Chicken Breast",
    category: "Meat & Poultry",
    sku: "HC-002-O",
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unit: "kg",
    costPerUnit: 18.75,
    sellingPrice: 28.0,
    supplier: "Green Crescent Poultry",
    location: "Warehouse A - Cold Storage",
    expiryDate: "2024-01-25",
    batchNumber: "BT-2024-002",
    halalCertified: true,
    certificationExpiry: "2024-11-30",
    lastUpdated: "2024-01-16T09:15:00Z",
    status: "low-stock",
    temperature: 1,
    humidity: 62,
  },
  {
    id: "INV-003",
    name: "Halal Lamb Shoulder",
    category: "Meat & Poultry",
    sku: "HL-003-P",
    currentStock: 0,
    minStock: 20,
    maxStock: 150,
    unit: "kg",
    costPerUnit: 32.0,
    sellingPrice: 45.0,
    supplier: "Heritage Halal Meats",
    location: "Warehouse B - Cold Storage",
    expiryDate: "2024-01-20",
    batchNumber: "BT-2024-003",
    halalCertified: true,
    certificationExpiry: "2024-10-15",
    lastUpdated: "2024-01-15T16:45:00Z",
    status: "out-of-stock",
    temperature: 0,
    humidity: 58,
  },
  {
    id: "INV-004",
    name: "Halal Processed Sausages",
    category: "Processed Foods",
    sku: "HP-004-S",
    currentStock: 200,
    minStock: 100,
    maxStock: 800,
    unit: "packs",
    costPerUnit: 8.5,
    sellingPrice: 12.99,
    supplier: "Crescent Foods Ltd",
    location: "Warehouse C - Dry Storage",
    expiryDate: "2024-03-10",
    batchNumber: "BT-2024-004",
    halalCertified: true,
    certificationExpiry: "2024-09-30",
    lastUpdated: "2024-01-16T14:20:00Z",
    status: "in-stock",
    temperature: 18,
    humidity: 45,
  },
  {
    id: "INV-005",
    name: "Halal Dairy Cheese",
    category: "Dairy Products",
    sku: "HD-005-C",
    currentStock: 75,
    minStock: 40,
    maxStock: 300,
    unit: "wheels",
    costPerUnit: 15.25,
    sellingPrice: 22.5,
    supplier: "Pure Dairy Co",
    location: "Warehouse A - Refrigerated",
    expiryDate: "2024-01-22",
    batchNumber: "BT-2024-005",
    halalCertified: true,
    certificationExpiry: "2024-08-15",
    lastUpdated: "2024-01-16T11:10:00Z",
    status: "expiring-soon",
    temperature: 4,
    humidity: 70,
  },
]

export function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getInventoryStats = () => {
    const totalProducts = mockInventory.length
    const totalValue = mockInventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)
    const lowStockItems = mockInventory.filter((item) => item.currentStock <= item.minStock).length
    const outOfStockItems = mockInventory.filter((item) => item.currentStock === 0).length
    const expiringSoonItems = mockInventory.filter((item) => {
      const expiryDate = new Date(item.expiryDate)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    }).length

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiringSoonItems,
    }
  }

  const stats = getInventoryStats()

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(mockInventory.map((item) => item.category)))]

  const handleAddProduct = async (data: any) => {
    console.log("Adding new product:", data)
    setShowAddForm(false)
  }

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Add New Product</h2>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Back to Inventory
          </Button>
        </div>
        <AddProductForm onSubmit={handleAddProduct} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold tracking-tight">Inventory Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="halal-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glassmorphic-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats.totalProducts}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">${stats.totalValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">{stats.lowStockItems}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{stats.outOfStockItems}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-500">{stats.expiringSoonItems}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Stock Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockInventory
                  .filter((item) => item.status === "out-of-stock" || item.status === "low-stock")
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.currentStock} {item.unit}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "out-of-stock"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {item.status === "out-of-stock" ? "Out" : "Low"}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Expiring Products</CardTitle>
                <CardDescription>Items expiring within 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockInventory
                  .filter((item) => item.status === "expiring-soon")
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        <Calendar className="h-3 w-3 mr-1" />
                        Soon
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Halal Compliance</CardTitle>
                <CardDescription>Certification status overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certified Products</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    {mockInventory.filter((item) => item.halalCertified).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="text-xs text-muted-foreground">All products maintain valid Halal certification</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glassmorphic-inner-card"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm glassmorphic-inner-card"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <Card className="glassmorphic-card">
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Alerts */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Stock Alerts
                </CardTitle>
                <CardDescription>Products with low or no stock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInventory
                  .filter((item) => item.status === "out-of-stock" || item.status === "low-stock")
                  .map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-muted/20 border border-muted/40">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "out-of-stock"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {item.status === "out-of-stock" ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">
                            {item.currentStock} {item.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min Stock</p>
                          <p className="font-medium">
                            {item.minStock} {item.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Supplier</p>
                          <p className="font-medium">{item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reorder
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Contact Supplier
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Expiry Alerts */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  Expiry Alerts
                </CardTitle>
                <CardDescription>Products expiring soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInventory
                  .filter((item) => item.status === "expiring-soon")
                  .map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-muted/20 border border-muted/40">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Batch: {item.batchNumber}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Expiring Soon
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expiry Date</p>
                          <p className="font-medium text-orange-400">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p className="font-medium">
                            {item.currentStock} {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Archive className="h-3 w-3 mr-1" />
                          Mark for Sale
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Dispose
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>Performance metrics and insights for your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
