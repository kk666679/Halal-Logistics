"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.enum(
    ["Meat & Poultry", "Dairy Products", "Processed Foods", "Beverages", "Cosmetics", "Pharmaceuticals"],
    {
      required_error: "Please select a category",
    },
  ),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  description: z.string().optional(),
  currentStock: z.number().min(0, "Stock cannot be negative"),
  minStock: z.number().min(0, "Minimum stock cannot be negative"),
  maxStock: z.number().min(1, "Maximum stock must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  costPerUnit: z.number().min(0.01, "Cost per unit must be greater than 0"),
  sellingPrice: z.number().min(0.01, "Selling price must be greater than 0"),
  supplier: z.string().min(2, "Supplier name is required"),
  location: z.string().min(2, "Storage location is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  halalCertified: z.boolean(),
  certificationNumber: z.string().optional(),
  certificationExpiry: z.string().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface AddProductFormProps {
  onSubmit?: (data: ProductFormData) => Promise<void>
}

export function AddProductForm({ onSubmit }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "Processed Foods",
      sku: "",
      description: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 100,
      unit: "kg",
      costPerUnit: 0,
      sellingPrice: 0,
      supplier: "",
      location: "",
      expiryDate: "",
      batchNumber: "",
      halalCertified: true,
      certificationNumber: "",
      certificationExpiry: "",
      temperature: undefined,
      humidity: undefined,
    },
  })

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      await onSubmit?.(data)
      form.reset()
    } catch (error) {
      console.error("Failed to add product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "Meat & Poultry", label: "Meat & Poultry", color: "bg-red-500/20 text-red-400" },
    { value: "Dairy Products", label: "Dairy Products", color: "bg-blue-500/20 text-blue-400" },
    { value: "Processed Foods", label: "Processed Foods", color: "bg-amber-500/20 text-amber-400" },
    { value: "Beverages", label: "Beverages", color: "bg-cyan-500/20 text-cyan-400" },
    { value: "Cosmetics", label: "Cosmetics", color: "bg-pink-500/20 text-pink-400" },
    { value: "Pharmaceuticals", label: "Pharmaceuticals", color: "bg-purple-500/20 text-purple-400" },
  ]

  const units = ["kg", "g", "lbs", "oz", "pieces", "packs", "boxes", "liters", "ml", "gallons"]

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
          <Package className="h-6 w-6 mr-2 text-primary" />
          Add New Product
        </CardTitle>
        <CardDescription>Add a new product to your inventory management system</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter SKU" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((category) => (
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter product description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Stock Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Stock</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full px-3 py-2 rounded-md border border-input bg-background">
                          {units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Unit ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Supplier and Location */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Supplier & Storage</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter supplier name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter storage location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Batch and Expiry */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Batch & Expiry</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter batch number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Halal Certification */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Halal Certification</h3>

              <FormField
                control={form.control}
                name="halalCertified"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-input"
                      />
                      <FormLabel>This product is Halal certified</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("halalCertified") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter certification number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certificationExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Expiry</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Storage Conditions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Storage Conditions (Optional)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Enter temperature"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="humidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humidity (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Enter humidity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
