"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollReveal } from "@/components/scroll-reveal"
import { FileText, CheckCircle, AlertTriangle, Clock, Shield, Activity } from "lucide-react"

interface Certification {
  id: string
  productName: string
  supplier: string
  status: "valid" | "expiring" | "expired" | "pending"
  expiryDate: string
  lastVerified: string
  blockchainHash: string
}

export function CertificationAgent() {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "cert-001",
      productName: "Premium Halal Beef",
      supplier: "Al-Barakah Farms",
      status: "valid",
      expiryDate: "2024-12-31",
      lastVerified: "2024-01-15T10:30:00Z",
      blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z"
    },
    {
      id: "cert-002",
      productName: "Organic Chicken",
      supplier: "Green Crescent Poultry",
      status: "expiring",
      expiryDate: "2024-02-15",
      lastVerified: "2024-01-10T14:20:00Z",
      blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a"
    },
    {
      id: "cert-003",
      productName: "Halal Sausages",
      supplier: "Heritage Meats Co",
      status: "pending",
      expiryDate: "2024-03-20",
      lastVerified: "2024-01-16T09:15:00Z",
      blockchainHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z2b"
    }
  ])

  const [isActive, setIsActive] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 10))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  const getStatusConfig = (status: Certification["status"]) => {
    switch (status) {
      case "valid":
        return {
          label: "Valid",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="h-4 w-4" />
        }
      case "expiring":
        return {
          label: "Expiring Soon",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case "expired":
        return {
          label: "Expired",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case "pending":
        return {
          label: "Pending Review",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Clock className="h-4 w-4" />
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <FileText className="h-4 w-4" />
        }
    }
  }

  const handleVerifyCertificate = async (certId: string) => {
    // Simulate blockchain verification
    console.log(`Verifying certificate ${certId} on blockchain...`)
    // In a real implementation, this would call a smart contract
  }

  return (
    <ScrollReveal>
      <Card className="glassmorphic-card border-glow-red">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Certification Agent</CardTitle>
                <CardDescription>Real-time Halal certificate validation and monitoring</CardDescription>
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
          {/* Scan Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Blockchain Scan Progress</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>

          {/* Recent Certifications */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Recent Verifications</h4>
            {certifications.map((cert) => {
              const statusConfig = getStatusConfig(cert.status)
              return (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/40">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{cert.productName}</p>
                      <Badge variant="outline" className={statusConfig.color}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{cert.supplier}</p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyCertificate(cert.id)}
                    className="bg-transparent"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verify
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Agent Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted/40">
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{certifications.filter(c => c.status === 'valid').length}</div>
              <div className="text-xs text-muted-foreground">Valid</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">{certifications.filter(c => c.status === 'expiring').length}</div>
              <div className="text-xs text-muted-foreground">Expiring</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{certifications.filter(c => c.status === 'pending').length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}
