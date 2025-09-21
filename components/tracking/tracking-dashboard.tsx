"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShipmentTracker } from "./shipment-tracker";
import {
  Search,
  Package,
  Truck,
  MapPin,
  Clock,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  BarChart3,
} from "lucide-react";

// Mock shipment data
const mockShipments = [
  {
    id: "HL-2024-001",
    productName: "Premium Halal Beef",
    origin: "Malaysia",
    destination: "London, UK",
    status: "in-transit",
    progress: 75,
    estimatedDelivery: "2024-01-18",
    temperature: 2,
    carrier: "Emirates SkyCargo",
    halalCertified: true,
  },
  {
    id: "HL-2024-002",
    productName: "Organic Halal Chicken",
    origin: "Indonesia",
    destination: "Dubai, UAE",
    status: "delivered",
    progress: 100,
    estimatedDelivery: "2024-01-15",
    temperature: 1,
    carrier: "DHL Express",
    halalCertified: true,
  },
  {
    id: "HL-2024-003",
    productName: "Halal Processed Foods",
    origin: "Turkey",
    destination: "New York, USA",
    status: "delayed",
    progress: 45,
    estimatedDelivery: "2024-01-20",
    temperature: 5,
    carrier: "FedEx International",
    halalCertified: true,
  },
  {
    id: "HL-2024-004",
    productName: "Halal Dairy Products",
    origin: "Pakistan",
    destination: "Toronto, Canada",
    status: "pending",
    progress: 10,
    estimatedDelivery: "2024-01-25",
    temperature: 3,
    carrier: "UPS Worldwide",
    halalCertified: true,
  },
];

export function TrackingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "in-transit":
        return {
          label: "In Transit",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Truck />,
        };
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle />,
        };
      case "delayed":
        return {
          label: "Delayed",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle />,
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <Clock />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Package />,
        };
    }
  };

  const getStatusCounts = () => {
    return {
      total: mockShipments.length,
      inTransit: mockShipments.filter((s) => s.status === "in-transit").length,
      delivered: mockShipments.filter((s) => s.status === "delivered").length,
      delayed: mockShipments.filter((s) => s.status === "delayed").length,
      pending: mockShipments.filter((s) => s.status === "pending").length,
    };
  };

  const statusCounts = getStatusCounts();

  const filteredShipments = mockShipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (selectedShipment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold tracking-tight">
            Shipment Tracking
          </h2>
          <Button variant="outline" onClick={() => setSelectedShipment(null)}>
            Back to Dashboard
          </Button>
        </div>
        <ShipmentTracker shipmentId={selectedShipment} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          Shipment Tracking Dashboard
        </h2>
        <Button className="halal-gradient">
          <Plus className="h-4 w-4 mr-2" />
          New Shipment
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="glassmorphic-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {statusCounts.total}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Transit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">
                    {statusCounts.inTransit}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Delivered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">
                    {statusCounts.delivered}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Delayed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">
                    {statusCounts.delayed}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">
                    {statusCounts.pending}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Shipments */}
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>
                Latest shipment activities and status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShipments.slice(0, 3).map((shipment) => {
                  const statusConfig = getStatusConfig(shipment.status);
                  return (
                    <div
                      key={shipment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-muted/40 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedShipment(shipment.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/20">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {shipment.productName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {shipment.origin} → {shipment.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{shipment.id}</p>
                          <p className="text-xs text-muted-foreground">
                            ETA:{" "}
                            {new Date(
                              shipment.estimatedDelivery,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glassmorphic-inner-card"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Active Shipments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredShipments
              .filter((shipment) => shipment.status !== "delivered")
              .map((shipment) => {
                const statusConfig = getStatusConfig(shipment.status);
                return (
                  <Card
                    key={shipment.id}
                    className="glassmorphic-card blockchain-glow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg tracking-tight">
                            {shipment.productName}
                          </CardTitle>
                          <CardDescription>
                            Shipment ID: {shipment.id}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Origin
                          </p>
                          <p className="font-medium">{shipment.origin}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Destination
                          </p>
                          <p className="font-medium">{shipment.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3 text-blue-400" />
                            <span>{shipment.temperature}°C</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck className="h-3 w-3 text-muted-foreground" />
                            <span>{shipment.carrier}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">ETA</p>
                          <p className="font-medium">
                            {new Date(
                              shipment.estimatedDelivery,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-muted/40 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedShipment(shipment.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Shipment History</CardTitle>
              <CardDescription>
                Complete history of all shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockShipments.map((shipment) => {
                  const statusConfig = getStatusConfig(shipment.status);
                  return (
                    <div
                      key={shipment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/40 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedShipment(shipment.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded bg-primary/20">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{shipment.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.id} • {shipment.origin} →{" "}
                            {shipment.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right text-sm">
                          <p className="font-medium">
                            {new Date(
                              shipment.estimatedDelivery,
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-muted-foreground">
                            {shipment.carrier}
                          </p>
                        </div>
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Tracking Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights for your shipments
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
