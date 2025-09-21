// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 10000,
  },

  // Authentication
  auth: {
    tokenKey: "halalchain_token",
    refreshTokenKey: "halalchain_refresh_token",
  },

  // App Configuration
  app: {
    name: "HalalChain",
    version: "1.0.0",
  },
} as const;

// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    updateProfile: "/auth/profile",
  },
  products: {
    base: "/products",
    stats: "/products/stats",
    lowStock: "/products/low-stock",
  },
  certifications: {
    base: "/certifications",
    stats: "/certifications/stats",
    myApplications: "/certifications/my-applications",
  },
  tracking: {
    base: "/tracking",
    stats: "/tracking/stats",
    myShipments: "/tracking/my-shipments",
  },
  users: {
    base: "/users",
    profile: "/users/profile",
    stats: "/users/stats",
  },
} as const;
