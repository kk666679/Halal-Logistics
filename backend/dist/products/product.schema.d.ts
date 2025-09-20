import { Document } from 'mongoose';
export type ProductDocument = Product & Document;
export declare enum ProductCategory {
    MEAT_POULTRY = "Meat & Poultry",
    DAIRY_PRODUCTS = "Dairy Products",
    PROCESSED_FOODS = "Processed Foods",
    BEVERAGES = "Beverages",
    COSMETICS = "Cosmetics",
    PHARMACEUTICALS = "Pharmaceuticals"
}
export declare class Product {
    _id?: string;
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
    expiryDate: Date;
    batchNumber: string;
    halalCertified: boolean;
    certificationNumber?: string;
    certificationExpiry?: Date;
    temperature?: number;
    humidity?: number;
    isActive: boolean;
    createdBy: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
