"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Truck,
  Package,
  Thermometer,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Calendar,
  Building,
  FileText,
} from "lucide-react"

interface TrackingEvent {
  id: string
  location: string
  timestamp: string
  status: "completed" | "in-progress" | "pending" | "delayed"
  temperature?: number
  humidity?: number
  description: string
  blockchainHash?: string
  verifiedBy?: string
  coordinates?: { lat: number; lng: number }
}

interface ShipmentData {
  id: string
  productName: string
  quantity: string
  origin: string
  destination: string
  estimatedDelivery: string
  currentLocation: string
  status: "in-transit" | "delivered" | "delayed" | "pending"
  progress: number
  halalCertified: boolean
  temperature: {
    current: number
    min: number
    max: number
    unit: "C" | "F"
  }
  carrier: string
  trackingEvents: TrackingEvent[]
  blockchainVerified: boolean
}

interface ShipmentTrackerProps {
  shipmentId: string
}

export function ShipmentTracker({ shipmentId }: ShipmentTrackerProps) {
  const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("timeline")

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockShipmentData: ShipmentData = {
      id: shipmentId,
      productName: "Premium Halal Beef - Grade A",
      quantity: "500kg",
      origin: "Al-Barakah Processing Plant, Malaysia",
      destination: "Halal Market Distribution Center, London",
      estimatedDelivery: "2024-01-18T16:00:00Z",
      currentLocation: "Dubai International Airport",
      status: "in-transit",
      progress: 75,
      halalCertified: true,
      temperature: {
        current: 2,
        min: -2,
        max: 4,
        unit: "C",
      },
      carrier: "Emirates SkyCargo",
      blockchainVerified: true,
      trackingEvents: [
        {
          id: "evt-001",
          location: "Al-Barakah Processing Plant, Malaysia",
          timestamp: "2024-01-15T08:30:00Z",
          status: "completed",
          temperature: 4,
          humidity: 65,
          description: "Package prepared and sealed with Halal certification",
          blockchainHash: "0x1a2b3c4d5e6f...",
          verifiedBy: "Quality Control Team",
          coordinates: { lat: 3.139, lng: 101.6869 },
        },
        {
          id: "evt-002",
          location: "Kuala Lumpur International Airport",
          timestamp: "2024-01-15T14:20:00Z",
          status: "completed",
          temperature: 3,
          humidity: 62,
          description: "Cleared customs and loaded onto Emirates flight EK343",
          blockchainHash: "0x2b3c4d5e6f7g...",
          verifiedBy: "Customs Authority",
          coordinates: { lat: 2.7456, lng: 101.7072 },
        },
        {
          id: "evt-003",
          location: "Dubai International Airport",
          timestamp: "2024-01-16T09:15:00Z",
          status: "completed",
          temperature: 2,
          humidity: 58,
          description: "Arrived in Dubai, temperature maintained within range",
          blockchainHash: "0x3c4d5e6f7g8h...",
          verifiedBy: "Emirates Ground Services",
          coordinates: { lat: 25.2532, lng: 55.3657 },
        },
        {
          id: "evt-004",
          location: "Dubai Cold Storage Facility",
          timestamp: "2024-01-16T15:45:00Z",
          status: "completed",
          temperature: 1,
          humidity: 60,
          description: "Transferred to cold storage, awaiting connecting flight",
          blockchainHash: "0x4d5e6f7g8h9i...",
          verifiedBy: "Cold Chain Logistics",
          coordinates: { lat: 25.2285, lng: 55.3273 },
        },
        {
          id: "evt-005",
          location: "In Transit to London",
          timestamp: "2024-01-17T06:30:00Z",
          status: "in-progress",
          temperature: 2,
          humidity: 59,
          description: "Loaded onto Emirates flight EK001 to London Heathrow",
          blockchainHash: "0x5e6f7g8h9i0j...",
          verifiedBy: "Flight Operations",
        },
        {
          id: "evt-006",
          location: "London Heathrow Airport",
          timestamp: "2024-01-17T18:00:00Z",
          status: "pending",
          description: "Expected arrival and customs clearance",
        },
        {
          id: "evt-007",
          location: "Halal Market Distribution Center, London",
          timestamp: "2024-01-18T16:00:00Z",
          status: "pending",
          description: "Final delivery to destination",
        },
      ],
    }

    setTimeout(() => {
      setShipmentData(mockShipmentData)
      setIsLoading(false)
    }, 1000)
  }, [shipmentId])

  if (isLoading) {
    return (
      <Card className="glassmorphic-card">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading shipment data...</span>
        </CardContent>
      </Card>
    )
  }

  if (!shipmentData) {
    return (
      <Card className="glassmorphic-card">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Shipment not found</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "in-transit":
        return { label: "In Transit", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <Truck /> }
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle />,
        }
      case "delayed":
        return { label: "Delayed", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <AlertTriangle /> }
      case "pending":
        return { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock /> }
      default:
        return { label: "Unknown", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: <Package /> }
    }
  }

  const statusConfig = getStatusConfig(shipmentData.status)

  return (
    <div className="space-y-6">
      {/* Shipment Overview */}
      <Card className="glassmorphic-card blockchain-glow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl tracking-tight flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                {shipmentData.productName}
              </CardTitle>
              <CardDescription>Shipment ID: {shipmentData.id}</CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.icon}
                <span className="ml-1">{statusConfig.label}</span>
              </Badge>
              {shipmentData.halalCertified && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Halal Certified
                </Badge>
              )}
              {shipmentData.blockchainVerified && (
                <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Blockchain Verified
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Delivery Progress</span>
              <span>{shipmentData.progress}%</span>
            </div>
            <Progress value={shipmentData.progress} className="h-3" />
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Origin
              </p>
              <p className="font-medium text-sm">{shipmentData.origin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <Navigation className="h-4 w-4 mr-1" />
                Destination
              </p>
              <p className="font-medium text-sm">{shipmentData.destination}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Est. Delivery
              </p>
              <p className="font-medium text-sm">
                {new Date(shipmentData.estimatedDelivery).toLocaleDateString()} at{" "}
                {new Date(shipmentData.estimatedDelivery).toLocaleTimeString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <Building className="h-4 w-4 mr-1" />
                Carrier
              </p>
              <p className="font-medium text-sm">{shipmentData.carrier}</p>
            </div>
          </div>

          {/* Temperature Monitoring */}
          <div className="p-4 rounded-lg bg-muted/20 border border-muted/40">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-blue-400" />
                Temperature Monitoring
              </h4>
              <Badge
                variant="outline"
                className={
                  shipmentData.temperature.current >= shipmentData.temperature.min &&
                  shipmentData.temperature.current <= shipmentData.temperature.max
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {shipmentData.temperature.current >= shipmentData.temperature.min &&
                shipmentData.temperature.current <= shipmentData.temperature.max
                  ? "Within Range"
                  : "Out of Range"}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current</p>
                <p className="text-lg font-bold text-blue-400">
                  {shipmentData.temperature.current}°{shipmentData.temperature.unit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Min Range</p>
                <p className="font-medium">
                  {shipmentData.temperature.min}°{shipmentData.temperature.unit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Range</p>
                <p className="font-medium">
                  {shipmentData.temperature.max}°{shipmentData.temperature.unit}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tracking */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="glassmorphic-tabs">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Complete journey of your shipment with blockchain verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipmentData.trackingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full ${
                          event.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : event.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : event.status === "delayed"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {event.status === "completed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : event.status === "in-progress" ? (
                          <Truck className="h-4 w-4" />
                        ) : event.status === "delayed" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      {index < shipmentData.trackingEvents.length - 1 && (
                        <div className="w-px h-12 bg-muted/40 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{event.location}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString()}
                          <br />
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        {event.temperature && (
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3 text-blue-400" />
                            <span>{event.temperature}°C</span>
                          </div>
                        )}
                        {event.verifiedBy && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-green-400" />
                            <span>Verified by {event.verifiedBy}</span>
                          </div>
                        )}
                        {event.blockchainHash && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-amber-400" />
                            <code className="text-xs bg-muted/50 px-1 py-0.5 rounded">
                              {event.blockchainHash.substring(0, 12)}...
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
              <CardDescription>Visual representation of shipment journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center border border-muted/40">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map integration coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">Current Location: {shipmentData.currentLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Shipping Documents</CardTitle>
              <CardDescription>All documents related to this shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Halal Certificate", type: "PDF", size: "2.3 MB", verified: true },
                  { name: "Bill of Lading", type: "PDF", size: "1.8 MB", verified: true },
                  { name: "Temperature Log", type: "CSV", size: "0.5 MB", verified: true },
                  { name: "Customs Declaration", type: "PDF", size: "1.2 MB", verified: true },
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/40"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-primary/20">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.verified && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Immutable records of shipment events on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipmentData.trackingEvents
                  .filter((event) => event.blockchainHash)
                  .map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-muted/20 border border-muted/40">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{event.location}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Blockchain Hash</p>
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                            {event.blockchainHash}
                          </code>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Timestamp: {new Date(event.timestamp).toISOString()}</span>
                          <span>Verified by: {event.verifiedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
