import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/user.schema").User;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("../users/user.schema").User;
        token: string;
    }>;
    getProfile(req: any): Promise<import("../users/user.schema").User>;
    updateProfile(req: any, updateData: UpdateProfileDto): Promise<import("../users/user.schema").User>;
}
