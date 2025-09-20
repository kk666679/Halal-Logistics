import { UsersService } from './users.service';
import { UpdateProfileDto } from '../auth/dto/auth.dto';
import { UserRole } from './user.schema';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.schema").User>;
    updateProfile(req: any, updateData: UpdateProfileDto): Promise<import("./user.schema").User>;
    getUsersByRole(role: UserRole): Promise<import("./user.schema").User[]>;
    getUserStats(): Promise<{
        total: number;
        byRole: Record<UserRole, number>;
    }>;
    getAllUsers(): Promise<import("./user.schema").User[]>;
}
