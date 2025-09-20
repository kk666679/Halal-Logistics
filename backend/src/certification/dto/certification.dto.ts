import { IsString, IsEnum, IsOptional, IsArray, IsDateString, MinLength } from 'class-validator';
import { CertificationStatus, CertificationType } from '../certification.schema';

export class CreateCertificationDto {
  @IsString()
  @MinLength(2)
  productName: string;

  @IsString()
  productCategory: string;

  @IsString()
  @MinLength(2)
  companyName: string;

  @IsString()
  @MinLength(10)
  companyAddress: string;

  @IsString()
  @MinLength(2)
  contactPerson: string;

  @IsString()
  contactEmail: string;

  @IsString()
  @MinLength(10)
  contactPhone: string;

  @IsString()
  @MinLength(50)
  productDescription: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsString()
  @MinLength(100)
  manufacturingProcess: string;

  @IsString()
  @MinLength(20)
  supplierDetails: string;

  @IsEnum(CertificationType)
  requestedCertificationType: CertificationType;

  @IsDateString()
  expectedCompletionDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingDocuments?: string[];
}

export class UpdateCertificationDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  productName?: string;

  @IsOptional()
  @IsString()
  productCategory?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  companyAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MinLength(50)
  productDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsString()
  @MinLength(100)
  manufacturingProcess?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  supplierDetails?: string;

  @IsOptional()
  @IsEnum(CertificationType)
  requestedCertificationType?: CertificationType;

  @IsOptional()
  @IsDateString()
  expectedCompletionDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingDocuments?: string[];
}

export class UpdateCertificationStatusDto {
  @IsEnum(CertificationStatus)
  status: CertificationStatus;

  @IsOptional()
  @IsString()
  reviewComments?: string;

  @IsOptional()
  @IsString()
  certificationNumber?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
