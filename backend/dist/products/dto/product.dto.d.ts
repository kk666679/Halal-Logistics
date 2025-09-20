import { ProductCategory } from '../product.schema';
export declare class CreateProductDto {
    name: string;
    category: ProductCategory;
    sku: string;
    description?: string;
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
    certificationNumber?: string;
    certificationExpiry?: string;
    temperature?: number;
    humidity?: number;
}
export declare class UpdateProductDto {
    name?: string;
    category?: ProductCategory;
    sku?: string;
    description?: string;
    currentStock?: number;
    minStock?: number;
    maxStock?: number;
    unit?: string;
    costPerUnit?: number;
    sellingPrice?: number;
    supplier?: string;
    location?: string;
    expiryDate?: string;
    batchNumber?: string;
    halalCertified?: boolean;
    certificationNumber?: string;
    certificationExpiry?: string;
    temperature?: number;
    humidity?: number;
}
