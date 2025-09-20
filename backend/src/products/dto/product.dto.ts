import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { ProductCategory } from '../product.schema';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsNumber()
  @Min(0)
  minStock: number;

  @IsNumber()
  @Min(1)
  maxStock: number;

  @IsString()
  unit: string;

  @IsNumber()
  @Min(0.01)
  costPerUnit: number;

  @IsNumber()
  @Min(0.01)
  sellingPrice: number;

  @IsString()
  supplier: string;

  @IsString()
  location: string;

  @IsDateString()
  expiryDate: string;

  @IsString()
  batchNumber: string;

  @IsBoolean()
  halalCertified: boolean;

  @IsOptional()
  @IsString()
  certificationNumber?: string;

  @IsOptional()
  @IsDateString()
  certificationExpiry?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxStock?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  costPerUnit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsBoolean()
  halalCertified?: boolean;

  @IsOptional()
  @IsString()
  certificationNumber?: string;

  @IsOptional()
  @IsDateString()
  certificationExpiry?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;
}
