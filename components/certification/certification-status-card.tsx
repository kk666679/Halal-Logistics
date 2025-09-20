"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, AlertTriangle, Eye, Download, Calendar, Building, Shield } from "lucide-react"

interface CertificationStatusCardProps {
  certification: {
    id: string
    productName: string
    companyName: string
    status: "pending" | "under-review" | "approved" | "rejected" | "expired"
    submissionDate: string
    expectedCompletionDate: string
    completionDate?: string
    certificationType: "standard" | "organic" | "premium"
    progress: number
    blockchainHash?: string
    certifierName?: string
    rejectionReason?: string
  }
  onViewDetails?: (id: string) => void
  onDownloadCertificate?: (id: string) => void
}

export function CertificationStatusCard({
  certification,
  onViewDetails,
  onDownloadCertificate,
}: CertificationStatusCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Review",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <Clock className="h-4 w-4" />,
        }
      case "under-review":
        return {
          label: "Under Review",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Eye className="h-4 w-4" />,
        }
      case "approved":
        return {
          label: "Approved",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="h-4 w-4" />,
        }
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      case "expired":
        return {
          label: "Expired",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <FileText className="h-4 w-4" />,
        }
    }
  }

  const getCertificationTypeConfig = (type: string) => {
    switch (type) {
      case "standard":
        return { label: "Standard Halal", color: "bg-amber-500/20 text-amber-400" }
      case "organic":
        return { label: "Organic Halal", color: "bg-green-500/20 text-green-400" }
      case "premium":
        return { label: "Premium Halal", color: "bg-purple-500/20 text-purple-400" }
      default:
        return { label: "Standard", color: "bg-gray-500/20 text-gray-400" }
    }
  }

  const statusConfig = getStatusConfig(certification.status)
  const typeConfig = getCertificationTypeConfig(certification.certificationType)

  return (
    <Card className="glassmorphic-card blockchain-glow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg tracking-tight">{certification.productName}</CardTitle>
            <CardDescription className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              {certification.companyName}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={statusConfig.color}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.label}</span>
            </Badge>
            <Badge variant="outline" className={typeConfig.color}>
              {typeConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{certification.progress}%</span>
          </div>
          <Progress value={certification.progress} className="h-2" />
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Submitted</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(certification.submissionDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Expected Completion</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(certification.expectedCompletionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Blockchain Hash */}
        {certification.blockchainHash && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Blockchain Hash</p>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                {certification.blockchainHash.substring(0, 20)}...
              </code>
            </div>
          </div>
        )}

        {/* Certifier Information */}
        {certification.certifierName && (
          <div>
            <p className="text-sm text-muted-foreground">Certified by</p>
            <p className="font-medium">{certification.certifierName}</p>
          </div>
        )}

        {/* Completion Date */}
        {certification.completionDate && (
          <div>
            <p className="text-sm text-muted-foreground">Completed on</p>
            <p className="font-medium text-green-400">{new Date(certification.completionDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {certification.status === "rejected" && certification.rejectionReason && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 font-medium">Rejection Reason:</p>
            <p className="text-sm text-red-300 mt-1">{certification.rejectionReason}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails?.(certification.id)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {certification.status === "approved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadCertificate?.(certification.id)}
              className="flex-1 text-green-400 hover:text-green-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
