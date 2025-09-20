import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './user.schema';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    return this.usersService.updateUser(req.user.userId, updateData);
  }

  @Get('role/:role')
  async getUsersByRole(@Param('role') role: UserRole) {
    return this.usersService.findByRole(role);
  }

  @Get('stats')
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
