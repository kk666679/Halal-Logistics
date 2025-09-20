import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductCategory {
  MEAT_POULTRY = 'Meat & Poultry',
  DAIRY_PRODUCTS = 'Dairy Products',
  PROCESSED_FOODS = 'Processed Foods',
  BEVERAGES = 'Beverages',
  COSMETICS = 'Cosmetics',
  PHARMACEUTICALS = 'Pharmaceuticals',
}

@Schema({ timestamps: true })
export class Product {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ required: true })
  sku: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  currentStock: number;

  @Prop({ required: true, min: 0 })
  minStock: number;

  @Prop({ required: true, min: 1 })
  maxStock: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true, min: 0.01 })
  costPerUnit: number;

  @Prop({ required: true, min: 0.01 })
  sellingPrice: number;

  @Prop({ required: true })
  supplier: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true })
  batchNumber: string;

  @Prop({ default: true })
  halalCertified: boolean;

  @Prop()
  certificationNumber?: string;

  @Prop()
  certificationExpiry?: Date;

  @Prop()
  temperature?: number;

  @Prop({ min: 0, max: 100 })
  humidity?: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, ref: 'User' })
  createdBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
