"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CertificationStatusCard } from "./certification-status-card"
import { CertificationApplicationForm } from "./certification-application-form"
import { Plus, Search, Filter, FileText, Clock, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react"

// Mock data for demonstration
const mockCertifications = [
  {
    id: "cert-001",
    productName: "Premium Halal Beef Burgers",
    companyName: "Al-Barakah Foods Ltd",
    status: "approved" as const,
    submissionDate: "2024-01-15",
    expectedCompletionDate: "2024-02-15",
    completionDate: "2024-02-10",
    certificationType: "premium" as const,
    progress: 100,
    blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    certifierName: "Islamic Food & Nutrition Council of America",
  },
  {
    id: "cert-002",
    productName: "Organic Halal Chicken Nuggets",
    companyName: "Green Crescent Foods",
    status: "under-review" as const,
    submissionDate: "2024-01-20",
    expectedCompletionDate: "2024-02-20",
    certificationType: "organic" as const,
    progress: 65,
    blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a",
    certifierName: "Halal Certification Authority",
  },
  {
    id: "cert-003",
    productName: "Traditional Halal Sausages",
    companyName: "Heritage Meats Co",
    status: "pending" as const,
    submissionDate: "2024-01-25",
    expectedCompletionDate: "2024-02-25",
    certificationType: "standard" as const,
    progress: 25,
  },
  {
    id: "cert-004",
    productName: "Halal Protein Powder",
    companyName: "FitLife Nutrition",
    status: "rejected" as const,
    submissionDate: "2024-01-10",
    expectedCompletionDate: "2024-02-10",
    certificationType: "standard" as const,
    progress: 0,
    rejectionReason:
      "Insufficient documentation regarding supplier Halal certification status. Please provide complete supplier audit reports.",
  },
]

export function CertificationDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const getStatusCounts = () => {
    return {
      total: mockCertifications.length,
      pending: mockCertifications.filter((c) => c.status === "pending").length,
      underReview: mockCertifications.filter((c) => c.status === "under-review").length,
      approved: mockCertifications.filter((c) => c.status === "approved").length,
      rejected: mockCertifications.filter((c) => c.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  const filteredCertifications = mockCertifications.filter(
    (cert) =>
      cert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (id: string) => {
    console.log("View details for certification:", id)
  }

  const handleDownloadCertificate = (id: string) => {
    console.log("Download certificate:", id)
  }

  const handleSubmitApplication = async (data: {
    companyName: string
    productName: string
    productDescription: string
    ingredients: string[]
    manufacturingProcess: string
  }) => {
    console.log("New certification application:", data)
    setShowApplicationForm(false)
  }

  if (showApplicationForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold tracking-tight">New Certification Application</h2>
          <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
            Back to Dashboard
          </Button>
        </div>
        <CertificationApplicationForm onSubmit={handleSubmitApplication} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold tracking-tight">Certification Dashboard</h2>
        <Button onClick={() => setShowApplicationForm(true)} className="halal-gradient">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glassmorphic-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{statusCounts.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">{statusCounts.pending}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">{statusCounts.underReview}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{statusCounts.approved}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{statusCounts.rejected}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest certification applications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCertifications.slice(0, 4).map((cert) => (
                  <CertificationStatusCard
                    key={cert.id}
                    certification={cert}
                    onViewDetails={handleViewDetails}
                    onDownloadCertificate={handleDownloadCertificate}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
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

          {/* Applications List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertifications.map((cert) => (
              <CertificationStatusCard
                key={cert.id}
                certification={cert}
                onViewDetails={handleViewDetails}
                onDownloadCertificate={handleDownloadCertificate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Approved Certificates</CardTitle>
              <CardDescription>Download and manage your approved Halal certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockCertifications
                  .filter((cert) => cert.status === "approved")
                  .map((cert) => (
                    <CertificationStatusCard
                      key={cert.id}
                      certification={cert}
                      onViewDetails={handleViewDetails}
                      onDownloadCertificate={handleDownloadCertificate}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Certification Analytics</CardTitle>
              <CardDescription>Insights and trends for your certification applications</CardDescription>
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
