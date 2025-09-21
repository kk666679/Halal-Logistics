"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  MapPin,
  Calendar,
  Thermometer,
  Shield,
  AlertTriangle,
  TrendingDown,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  expiryDate: string;
  batchNumber: string;
  halalCertified: boolean;
  certificationExpiry: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
  temperature?: number;
  humidity?: number;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onView }: ProductCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "in-stock":
        return {
          label: "In Stock",
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <Package className="h-3 w-3" />,
        };
      case "low-stock":
        return {
          label: "Low Stock",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <TrendingDown className="h-3 w-3" />,
        };
      case "out-of-stock":
        return {
          label: "Out of Stock",
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <AlertTriangle className="h-3 w-3" />,
        };
      case "expiring-soon":
        return {
          label: "Expiring Soon",
          color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
          icon: <Calendar className="h-3 w-3" />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Package className="h-3 w-3" />,
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);
  const stockPercentage = (product.currentStock / product.maxStock) * 100;
  const daysUntilExpiry = Math.ceil(
    (new Date(product.expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card className="glassmorphic-card blockchain-glow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg tracking-tight">
              {product.name}
            </CardTitle>
            <CardDescription>SKU: {product.sku}</CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={statusConfig.color}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.label}</span>
            </Badge>
            {product.halalCertified && (
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                <Shield className="h-3 w-3 mr-1" />
                Halal
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stock Information */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Stock Level</span>
            <span className="font-medium">
              {product.currentStock} / {product.maxStock} {product.unit}
            </span>
          </div>
          <Progress value={stockPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Min: {product.minStock} {product.unit}
            </span>
            <span>{stockPercentage.toFixed(1)}% capacity</span>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Location
            </p>
            <p className="font-medium text-xs">{product.location}</p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Expires
            </p>
            <p
              className={`font-medium text-xs ${daysUntilExpiry <= 7 ? "text-orange-400" : ""}`}
            >
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"}
            </p>
          </div>
        </div>

        {/* Environmental Conditions */}
        {(product.temperature !== undefined ||
          product.humidity !== undefined) && (
          <div className="p-3 rounded-lg bg-muted/20 border border-muted/40">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Environmental</span>
              <div className="flex items-center space-x-3">
                {product.temperature !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Thermometer className="h-3 w-3 text-blue-400" />
                    <span>{product.temperature}°C</span>
                  </div>
                )}
                {product.humidity !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">💧</span>
                    <span>{product.humidity}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Cost Price</p>
            <p className="font-medium">${product.costPerUnit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Selling Price</p>
            <p className="font-medium text-green-400">
              ${product.sellingPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Supplier and Batch */}
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Supplier</p>
            <p className="font-medium">{product.supplier}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Batch Number</p>
            <p className="font-medium font-mono text-xs">
              {product.batchNumber}
            </p>
          </div>
        </div>

        {/* Certification Expiry */}
        {product.halalCertified && (
          <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400">Halal Cert. Expires:</span>
              <span className="font-medium">
                {new Date(product.certificationExpiry).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(product.id)}
            className="flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(product.id)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-muted/40">
          Updated: {new Date(product.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
