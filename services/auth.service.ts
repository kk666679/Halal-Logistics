import { apiClient } from "@/lib/api";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from "@/lib/types";

export class AuthService {
  /**
   * Login user with email, password and role
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials,
      );

      if (response.success && response.data.token) {
        // Store auth token and user data
        apiClient.setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        userData,
      );

      if (response.success && response.data.token) {
        // Store auth token and user data
        apiClient.setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/auth/profile");
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
  async updateProfile(updateData: Partial<RegisterData>): Promise<User> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>("/auth/profile", updateData);

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
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Clear local storage
      apiClient.removeToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return apiClient.getToken();
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
