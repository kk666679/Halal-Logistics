"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Truck, MapPin, Thermometer, Clock, Route, AlertTriangle, CheckCircle } from "lucide-react"

interface Shipment {
  id: string
  shipmentId: string
  route: string
  status: "in-transit" | "delivered" | "delayed" | "scheduled"
  temperature: string
  humidity: string
  estimatedArrival: string
  currentLocation: string
  halalCompliance: "verified" | "monitoring" | "warning"
}

export function LogisticsAgent() {
  const [shipments] = useState<Shipment[]>([
    {
      id: "ship-001",
      shipmentId: "HL-2024-001",
      route: "Malaysia → Singapore → Dubai → London",
      status: "in-transit",
      temperature: "3°C",
      humidity: "65%",
      estimatedArrival: "2024-01-18 16:00 UTC",
      currentLocation: "Dubai Distribution Center",
      halalCompliance: "verified"
    },
    {
      id: "ship-002",
      shipmentId: "HL-2024-002",
      route: "Indonesia → Malaysia → UAE",
      status: "scheduled",
      temperature: "N/A",
      humidity: "N/A",
      estimatedArrival: "2024-01-20 14:30 UTC",
      currentLocation: "Jakarta Processing Facility",
      halalCompliance: "monitoring"
    },
    {
      id: "ship-003",
      shipmentId: "HL-2024-003",
      route: "Turkey → Germany → Netherlands",
      status: "delayed",
      temperature: "2°C",
      humidity: "58%",
      estimatedArrival: "2024-01-19 10:00 UTC",
      currentLocation: "Istanbul Cold Storage",
      halalCompliance: "warning"
    }
  ])

  const [isActive] = useState(true)
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setOptimizationProgress((prev) => (prev >= 100 ? 0 : prev + 15))
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isActive])

  const getStatusConfig = (status: Shipment["status"]) => {
    switch (status) {
      case "in-transit":
        return {
          label: "In Transit",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Truck className="h-4 w-4" />
        }
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="h-4 w-4" />
        }
      case "delayed":
        return {
          label: "Delayed",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case "scheduled":
        return {
          label: "Scheduled",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="h-4 w-4" />
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Truck className="h-4 w-4" />
        }
    }
  }

  const getComplianceConfig = (compliance: Shipment["halalCompliance"]) => {
    switch (compliance) {
      case "verified":
        return {
          label: "Verified",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="h-4 w-4" />
        }
      case "monitoring":
        return {
          label: "Monitoring",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Clock className="h-4 w-4" />
        }
      case "warning":
        return {
          label: "Warning",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="h-4 w-4" />
        }
    }
  }

  const handleOptimizeRoute = async (shipmentId: string) => {
    // Simulate route optimization
    console.log(`Optimizing route for shipment ${shipmentId}...`)
    // In a real implementation, this would call an optimization API
  }

  return (
    <ScrollReveal>
      <Card className="glassmorphic-card border-glow-blue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Logistics Agent</CardTitle>
                <CardDescription>AI-powered route optimization and supply chain monitoring</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Optimization Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Route Optimization Progress</span>
              <span>{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} className="h-2" />
          </div>

          {/* Active Shipments */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Active Shipments</h4>
            {shipments.map((shipment) => {
              const statusConfig = getStatusConfig(shipment.status)
              const complianceConfig = getComplianceConfig(shipment.halalCompliance)
              return (
                <div key={shipment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/40">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{shipment.shipmentId}</p>
                      <Badge variant="outline" className={statusConfig.color}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </Badge>
                      <Badge variant="outline" className={complianceConfig.color}>
                        {complianceConfig.icon}
                        <span className="ml-1">{complianceConfig.label}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{shipment.route}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{shipment.currentLocation}</span>
                      </div>
                      {shipment.temperature !== "N/A" && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="h-3 w-3 text-blue-400" />
                          <span className="text-xs">{shipment.temperature}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOptimizeRoute(shipment.id)}
                    className="bg-transparent"
                  >
                    <Route className="h-3 w-3 mr-1" />
                    Optimize
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Agent Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted/40">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{shipments.filter(s => s.status === 'in-transit').length}</div>
              <div className="text-xs text-muted-foreground">In Transit</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{shipments.filter(s => s.status === 'delivered').length}</div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{shipments.filter(s => s.status === 'delayed').length}</div>
              <div className="text-xs text-muted-foreground">Delayed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}
