import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UpdateProfileDto } from "../auth/dto/auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole, User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role, isActive: true },
    });
  }

  async updateUser(id: string, updateData: UpdateProfileDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isActive: true },
    });
  }

  async getUserStats(): Promise<{
    total: number;
    byRole: Record<UserRole, number>;
  }> {
    const total = await this.prisma.user.count({
      where: { isActive: true },
    });

    const byRole = {} as Record<UserRole, number>;
    for (const role of Object.values(UserRole)) {
      byRole[role] = await this.prisma.user.count({
        where: { role, isActive: true },
      });
    }

    return { total, byRole };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
