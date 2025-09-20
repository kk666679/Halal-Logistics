"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, FileText, Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const certificationSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  productCategory: z.enum(["meat", "dairy", "processed", "beverages", "cosmetics", "pharmaceuticals"], {
    required_error: "Please select a product category",
  }),
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(10, "Please provide a complete address"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  productDescription: z.string().min(50, "Please provide a detailed product description (minimum 50 characters)"),
  ingredients: z.array(z.string()).min(1, "Please list at least one ingredient"),
  manufacturingProcess: z.string().min(100, "Please describe the manufacturing process in detail"),
  supplierDetails: z.string().min(20, "Please provide supplier information"),
  requestedCertificationType: z.enum(["standard", "organic", "premium"], {
    required_error: "Please select certification type",
  }),
  expectedCompletionDate: z.string().min(1, "Please select expected completion date"),
})

type CertificationFormData = z.infer<typeof certificationSchema>

interface CertificationApplicationFormProps {
  onSubmit?: (data: CertificationFormData) => Promise<void>
}

export function CertificationApplicationForm({ onSubmit }: CertificationApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")

  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      productName: "",
      productCategory: "processed",
      companyName: "",
      companyAddress: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      productDescription: "",
      ingredients: [],
      manufacturingProcess: "",
      supplierDetails: "",
      requestedCertificationType: "standard",
      expectedCompletionDate: "",
    },
  })

  const handleSubmit = async (data: CertificationFormData) => {
    setIsLoading(true)
    try {
      await onSubmit?.(data)
    } catch (error) {
      console.error("Certification application failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const currentIngredients = form.getValues("ingredients")
      form.setValue("ingredients", [...currentIngredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues("ingredients")
    form.setValue(
      "ingredients",
      currentIngredients.filter((_, i) => i !== index),
    )
  }

  const productCategories = [
    { value: "meat", label: "Meat & Poultry", color: "bg-red-500/20 text-red-400" },
    { value: "dairy", label: "Dairy Products", color: "bg-blue-500/20 text-blue-400" },
    { value: "processed", label: "Processed Foods", color: "bg-amber-500/20 text-amber-400" },
    { value: "beverages", label: "Beverages", color: "bg-cyan-500/20 text-cyan-400" },
    { value: "cosmetics", label: "Cosmetics", color: "bg-pink-500/20 text-pink-400" },
    { value: "pharmaceuticals", label: "Pharmaceuticals", color: "bg-purple-500/20 text-purple-400" },
  ]

  const certificationTypes = [
    { value: "standard", label: "Standard Halal", description: "Basic Halal certification", price: "$500" },
    { value: "organic", label: "Organic Halal", description: "Organic + Halal certification", price: "$750" },
    { value: "premium", label: "Premium Halal", description: "Premium certification with blockchain", price: "$1000" },
  ]

  return (
    <Card className="w-full max-w-4xl glassmorphic-card">
      <CardHeader>
        <CardTitle className="text-2xl font-heading tracking-tight flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          Halal Certification Application
        </CardTitle>
        <CardDescription>
          Submit your product for Halal certification with blockchain-verified documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Product Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Product Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product name" className="glassmorphic-inner-card" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {productCategories.map((category) => (
                            <label
                              key={category.value}
                              className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all hover:scale-105 ${
                                field.value === category.value
                                  ? `${category.color} border-current`
                                  : "border-muted bg-muted/20 hover:bg-muted/40"
                              }`}
                            >
                              <input
                                type="radio"
                                value={category.value}
                                checked={field.value === category.value}
                                onChange={field.onChange}
                                className="sr-only"
                              />
                              <div className="text-sm font-medium">{category.label}</div>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide a detailed description of your product, including its intended use and key characteristics"
                        className="glassmorphic-inner-card min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredients Section */}
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            placeholder="Add ingredient"
                            className="glassmorphic-inner-card"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                          />
                          <Button type="button" onClick={addIngredient} size="icon" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((ingredient, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{ingredient}</span>
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Company Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" className="glassmorphic-inner-card" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter contact person name" className="glassmorphic-inner-card" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter complete company address"
                        className="glassmorphic-inner-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email address"
                          className="glassmorphic-inner-card"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" className="glassmorphic-inner-card" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Manufacturing Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Manufacturing Details</h3>

              <FormField
                control={form.control}
                name="manufacturingProcess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturing Process</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the complete manufacturing process, including equipment used, quality control measures, and Halal compliance procedures"
                        className="glassmorphic-inner-card min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Information</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide details about your suppliers, including their Halal certification status"
                        className="glassmorphic-inner-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Certification Type */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Certification Details</h3>

              <FormField
                control={form.control}
                name="requestedCertificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Type</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {certificationTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                              field.value === type.value
                                ? "bg-primary/20 text-primary border-primary"
                                : "border-muted bg-muted/20 hover:bg-muted/40"
                            }`}
                          >
                            <input
                              type="radio"
                              value={type.value}
                              checked={field.value === type.value}
                              onChange={field.onChange}
                              className="sr-only"
                            />
                            <div className="text-center space-y-2">
                              <div className="font-semibold">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                              <div className="text-lg font-bold text-primary">{type.price}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedCompletionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Completion Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="glassmorphic-inner-card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Supporting Documents</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center glassmorphic-inner-card">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Upload supporting documents</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Include product specifications, facility certificates, and supplier documentation
                </p>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full halal-gradient" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Certification Application"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
