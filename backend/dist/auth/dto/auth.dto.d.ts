import { UserRole } from '../../users/user.schema';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyName?: string;
    phoneNumber?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phoneNumber?: string;
    address?: string;
}
