import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsObject,
  Min,
  Max,
} from "class-validator";
import { TrackingStatus } from "../tracking.schema";

export class CreateTrackingDto {
  @IsString()
  productName: string;

  @IsString()
  quantity: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  estimatedDelivery: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsEnum(TrackingStatus)
  status: TrackingStatus;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsBoolean()
  halalCertified: boolean;

  @IsObject()
  temperature: {
    current: number;
    min: number;
    max: number;
    unit: "C" | "F";
  };

  @IsString()
  carrier: string;

  @IsBoolean()
  blockchainVerified: boolean;
}

export class UpdateTrackingDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsEnum(TrackingStatus)
  status?: TrackingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsBoolean()
  halalCertified?: boolean;

  @IsOptional()
  @IsObject()
  temperature?: {
    current: number;
    min: number;
    max: number;
    unit: "C" | "F";
  };

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsBoolean()
  blockchainVerified?: boolean;
}

export class AddTrackingEventDto {
  @IsString()
  location: string;

  @IsEnum(TrackingStatus)
  status: TrackingStatus;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  blockchainHash?: string;

  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @IsOptional()
  @IsObject()
  coordinates?: {
    lat: number;
    lng: number;
  };
}
