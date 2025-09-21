import { apiClient } from "@/lib/api";
import { User, UserRole, ApiResponse } from "@/lib/types";

export class UsersService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/users/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    updateData: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      company: string;
    }>,
  ): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        "/users/profile",
        updateData,
      );

      if (response.success) {
        // Update stored user data
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  }

  /**
   * Get users by role
   */
  async getByRole(role: UserRole): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(`/users/role/${role}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch users by role",
      );
    }
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    totalUsers: number;
    byRole: Record<UserRole, number>;
    recentRegistrations: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        totalUsers: number;
        byRole: Record<UserRole, number>;
        recentRegistrations: number;
      }>>("/users/stats");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user stats",
      );
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>("/users");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  }
}

// Create and export singleton instance
export const usersService = new UsersService();
export default usersService;
