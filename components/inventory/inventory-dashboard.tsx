"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProductCard } from "./product-card";
import { AddProductForm } from "./add-product-form";
import { productsService } from "@/services";
import { Product, ProductStats, CreateProductData } from "@/lib/types";
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
  Loader2,
} from "lucide-react";

export function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and stats on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [productsData, statsData] = await Promise.all([
        productsService.getAll(),
        productsService.getStats(),
      ]);

      setProducts(productsData);
      setStats(statsData);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch inventory data",
      );
      console.error("Error fetching inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInventoryStats = () => {
    if (!stats) {
      return {
        totalProducts: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        expiringSoonItems: 0,
      };
    }

    return stats;
  };

  const inventoryStats = getInventoryStats();

  const filteredInventory = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(products.map((item) => item.category))),
  ];

  const handleAddProduct = async (data: CreateProductData) => {
    try {
      await productsService.create(data);
      setShowAddForm(false);
      await fetchData(); // Refresh data after adding product
    } catch (error: unknown) {
      console.error("Failed to add product:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold tracking-tight">
            Add New Product
          </h2>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Back to Inventory
          </Button>
        </div>
        <AddProductForm onSubmit={handleAddProduct} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          Inventory Management
        </h2>
        <Button onClick={() => setShowAddForm(true)} className="halal-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
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
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {inventoryStats.totalProducts}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">
                    ${inventoryStats.totalValue.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Low Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">
                    {inventoryStats.lowStockItems}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">
                    {inventoryStats.outOfStockItems}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-500">
                    {inventoryStats.expiringSoonItems}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-lg">Stock Alerts</CardTitle>
                <CardDescription>
                  Items requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {products
                  .filter((item) => item.currentStock <= item.minStock)
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/20"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.currentStock} {item.unit}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.currentStock === 0
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {item.currentStock === 0 ? "Out" : "Low"}
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
                {products
                  .filter((item) => {
                    const expiryDate = new Date(item.expiryDate);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil(
                      (expiryDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24),
                    );
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                  })
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/20"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires:{" "}
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                      >
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
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {products.filter((item) => item.halalCertified).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span>
                      {products.length > 0
                        ? Math.round(
                            (products.filter((item) => item.halalCertified)
                              .length /
                              products.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      products.length > 0
                        ? (products.filter((item) => item.halalCertified)
                            .length /
                            products.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {products.filter((item) => item.halalCertified).length} of{" "}
                  {products.length} products maintain valid Halal certification
                </div>
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
                <p className="text-muted-foreground">
                  No products found matching your criteria
                </p>
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
                {products
                  .filter((item) => item.currentStock <= item.minStock)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-muted/20 border border-muted/40"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            item.currentStock === 0
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {item.currentStock === 0
                            ? "Out of Stock"
                            : "Low Stock"}
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reorder
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
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
                {products
                  .filter((item) => {
                    const expiryDate = new Date(item.expiryDate);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil(
                      (expiryDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24),
                    );
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-muted/20 border border-muted/40"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Batch: {item.batchNumber}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                        >
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          <Archive className="h-3 w-3 mr-1" />
                          Mark for Sale
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
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
              <CardDescription>
                Performance metrics and insights for your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
