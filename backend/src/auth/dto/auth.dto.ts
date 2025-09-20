import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../../users/user.schema';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
