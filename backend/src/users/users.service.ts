import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { User, UserDocument, UserRole } from "./user.schema";
import { UpdateProfileDto } from "../auth/dto/auth.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select("-password");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select("-password");
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userModel.find({ role, isActive: true }).select("-password");
  }

  async updateUser(id: string, updateData: UpdateProfileDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-password");

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select("-password");

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).select("-password");
  }

  async getUserStats(): Promise<{
    total: number;
    byRole: Record<UserRole, number>;
  }> {
    const total = await this.userModel.countDocuments({ isActive: true });

    const byRole = {} as Record<UserRole, number>;
    for (const role of Object.values(UserRole)) {
      byRole[role] = await this.userModel.countDocuments({
        role,
        isActive: true,
      });
    }

    return { total, byRole };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select("-password");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
