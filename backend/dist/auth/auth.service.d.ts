import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: User;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        token: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    generateJwtToken(user: User): string;
    refreshToken(user: User): Promise<string>;
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<User>;
}
