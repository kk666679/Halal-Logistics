import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // In a real application, you would validate against a database
    // For now, we'll use a simple mock validation
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        roles: ['admin', 'risk_manager'],
        permissions: ['read', 'write', 'admin'],
      },
      {
        id: '2',
        username: 'analyst',
        password: await bcrypt.hash('analyst123', 10),
        roles: ['analyst'],
        permissions: ['read', 'write'],
      },
      {
        id: '3',
        username: 'viewer',
        password: await bcrypt.hash('viewer123', 10),
        roles: ['viewer'],
        permissions: ['read'],
      },
    ];

    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from user object
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateTokenPayload(payload: any): Promise<any> {
    // Validate the token payload and return user information
    // In a real application, you would validate against the database
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles || ['viewer'],
      permissions: payload.permissions || ['read'],
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
    // In a real application, you would update the password in the database
    // For now, we'll simulate the operation

    const isOldPasswordValid = await this.validateCurrentPassword(userId, oldPassword);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Simulate password update
    console.log(`Password changed for user ${userId}`);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  async resetPassword(userId: string, newPassword: string): Promise<any> {
    // In a real application, you would update the password in the database
    // For now, we'll simulate the operation

    console.log(`Password reset for user ${userId}`);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    // In a real application, you would fetch permissions from the database
    // For now, we'll return mock permissions

    const mockPermissions = {
      '1': ['read', 'write', 'admin', 'risk:assess', 'risk:manage'],
      '2': ['read', 'write', 'risk:assess'],
      '3': ['read'],
    };

    return mockPermissions[userId] || ['read'];
  }

  async getUserRoles(userId: string): Promise<string[]> {
    // In a real application, you would fetch roles from the database
    // For now, we'll return mock roles

    const mockRoles = {
      '1': ['admin', 'risk_manager'],
      '2': ['analyst'],
      '3': ['viewer'],
    };

    return mockRoles[userId] || ['viewer'];
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  async hasRole(userId: string, role: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(role);
  }

  async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.some(permission => userPermissions.includes(permission));
  }

  async hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return roles.some(role => userRoles.includes(role));
  }

  async createUser(userData: any): Promise<any> {
    // In a real application, you would create the user in the database
    // For now, we'll simulate the operation

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: userId,
      ...userData,
      createdAt: new Date().toISOString(),
    };
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    // In a real application, you would update the user in the database
    // For now, we'll simulate the operation

    return {
      id: userId,
      ...userData,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteUser(userId: string): Promise<any> {
    // In a real application, you would delete the user from the database
    // For now, we'll simulate the operation

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  async getUserProfile(userId: string): Promise<any> {
    // In a real application, you would fetch the user profile from the database
    // For now, we'll return mock profile data

    return {
      id: userId,
      username: 'sample_user',
      email: 'user@company.com',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Risk Management',
      position: 'Risk Analyst',
      phone: '+1234567890',
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
    };
  }

  async updateUserProfile(userId: string, profileData: any): Promise<any> {
    // In a real application, you would update the user profile in the database
    // For now, we'll simulate the operation

    return {
      id: userId,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };
  }

  async getUserActivity(userId: string, limit: number = 10): Promise<any[]> {
    // In a real application, you would fetch user activity from the database
    // For now, we'll return mock activity data

    return [
      {
        id: 'activity_1',
        userId,
        action: 'login',
        timestamp: new Date().toISOString(),
        details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' },
      },
      {
        id: 'activity_2',
        userId,
        action: 'risk_assessment',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        details: { assessmentId: 'assessment_1', type: 'compliance' },
      },
      {
        id: 'activity_3',
        userId,
        action: 'report_generated',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        details: { reportId: 'report_1', format: 'PDF' },
      },
    ].slice(0, limit);
  }

  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    // Log user activity
    console.log(`User ${userId} performed action: ${action}`, details);
  }

  async getActiveSessions(userId: string): Promise<any[]> {
    // In a real application, you would track active sessions
    // For now, we'll return mock session data

    return [
      {
        id: 'session_1',
        userId,
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      },
    ];
  }

  async revokeSession(sessionId: string): Promise<any> {
    // Revoke user session
    return {
      success: true,
      sessionId,
      revokedAt: new Date().toISOString(),
    };
  }

  async revokeAllSessions(userId: string): Promise<any> {
    // Revoke all user sessions
    return {
      success: true,
      userId,
      revokedAt: new Date().toISOString(),
    };
  }

  private async validateCurrentPassword(userId: string, password: string): Promise<boolean> {
    // In a real application, you would validate the current password
    // For now, we'll simulate validation
    return true;
  }
}
