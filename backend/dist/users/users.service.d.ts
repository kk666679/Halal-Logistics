import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';
import { UpdateProfileDto } from '../auth/dto/auth.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByRole(role: UserRole): Promise<User[]>;
    updateUser(id: string, updateData: UpdateProfileDto): Promise<User>;
    deactivateUser(id: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUserStats(): Promise<{
        total: number;
        byRole: Record<UserRole, number>;
    }>;
}
