import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // In a real implementation, this would check against a database
    // For now, we'll use a simple mock validation
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        roles: ['admin', 'user'],
      },
      {
        id: '2',
        username: 'user',
        password: await bcrypt.hash('user123', 10),
        roles: ['user'],
      },
    ];

    const user = mockUsers.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async register(userData: any) {
    // In a real implementation, this would save to a database
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      roles: ['user'],
      createdAt: new Date(),
    };

    return {
      success: true,
      message: 'User registered successfully',
      user: newUser,
    };
  }

  async refreshToken(user: any) {
    const payload = { username: user.username, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // In a real implementation, this would check the old password and update
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  async getUserProfile(userId: string) {
    // Mock user profile
    return {
      id: userId,
      username: 'sample_user',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['user'],
      preferences: {
        notifications: true,
        language: 'en',
        timezone: 'UTC',
      },
      stats: {
        documentsUploaded: 25,
        documentsProcessed: 23,
        lastLogin: new Date(),
      },
    };
  }

  async updateUserProfile(userId: string, profileData: any) {
    // Mock profile update
    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userId,
        ...profileData,
      },
    };
  }

  async getUserPermissions(userId: string) {
    // Mock permissions
    return {
      userId,
      permissions: [
        'document:upload',
        'document:read',
        'document:process',
        'document:download',
        'document:delete',
        'template:read',
        'template:create',
        'analytics:read',
      ],
      roles: ['user'],
    };
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.permissions.includes(permission);
  }

  async generateApiKey(userId: string, name: string, expiresIn: string = '1y') {
    // Generate a secure API key
    const apiKey = `doc_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      apiKey,
      name,
      expiresIn,
      createdAt: new Date(),
      permissions: ['document:read', 'document:upload'],
    };
  }

  async revokeApiKey(userId: string, apiKey: string) {
    return {
      success: true,
      message: 'API key revoked successfully',
    };
  }

  async getUserSessions(userId: string) {
    // Mock user sessions
    return {
      userId,
      sessions: [
        {
          id: 'session_1',
          device: 'Chrome on Windows',
          location: 'Unknown',
          lastActivity: new Date(),
          isCurrent: true,
        },
        {
          id: 'session_2',
          device: 'Safari on iPhone',
          location: 'Unknown',
          lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
          isCurrent: false,
        },
      ],
    };
  }

  async revokeSession(userId: string, sessionId: string) {
    return {
      success: true,
      message: 'Session revoked successfully',
    };
  }

  async getUserActivity(userId: string, limit: number = 10) {
    // Mock user activity
    return {
      userId,
      activities: [
        {
          id: 'activity_1',
          type: 'document_upload',
          description: 'Uploaded halal_certificate.pdf',
          timestamp: new Date(),
          metadata: {
            documentId: 'DOC-001',
            fileSize: 245760,
          },
        },
        {
          id: 'activity_2',
          type: 'document_process',
          description: 'Processed supply_agreement.docx',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          metadata: {
            documentId: 'DOC-002',
            processingTime: 1200,
          },
        },
      ].slice(0, limit),
    };
  }

  async logUserActivity(userId: string, activityType: string, description: string, metadata: any = {}) {
    // In a real implementation, this would log to a database
    console.log(`User ${userId} performed ${activityType}: ${description}`, metadata);

    return {
      success: true,
      activityId: `activity_${Date.now()}`,
    };
  }
}
