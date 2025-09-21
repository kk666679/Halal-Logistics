// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'supplier' | 'certifier' | 'auditor' | 'consumer';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Product Types
export type ProductCategory =
  | 'Meat & Poultry'
  | 'Dairy Products'
  | 'Processed Foods'
  | 'Beverages'
  | 'Cosmetics'
  | 'Pharmaceuticals';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  expiryDate: Date;
  batchNumber: string;
  halalCertified: boolean;
  certificationNumber?: string;
  certificationExpiry?: Date;
  temperature?: number;
  humidity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateProductData {
  name: string;
  category: ProductCategory;
  sku: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  expiryDate: string;
  batchNumber: string;
  halalCertified: boolean;
  certificationNumber?: string;
  certificationExpiry?: string;
  temperature?: number;
  humidity?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringSoonItems: number;
}

// Certification Types
export type CertificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
export type CertificationType = 'halal' | 'organic' | 'gmo_free' | 'sustainability';

export interface Certification {
  id: string;
  type: CertificationType;
  status: CertificationStatus;
  applicationNumber: string;
  certificationNumber?: string;
  applicantName: string;
  applicantEmail: string;
  companyName: string;
  productName: string;
  productDescription: string;
  ingredients: string[];
  manufacturingProcess: string;
  reviewComments?: string;
  assignedTo?: string;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateCertificationData {
  type: CertificationType;
  companyName: string;
  productName: string;
  productDescription: string;
  ingredients: string[];
  manufacturingProcess: string;
}

export interface UpdateCertificationData extends Partial<CreateCertificationData> {
  id: string;
}

export interface CertificationStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

// Tracking Types
export type TrackingStatus = 'pending' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';

export interface TrackingEvent {
  id: string;
  type: 'pickup' | 'departure' | 'arrival' | 'customs' | 'delivery' | 'delay' | 'issue';
  description: string;
  location: string;
  timestamp: Date;
  notes?: string;
}

export interface Tracking {
  id: string;
  trackingNumber: string;
  status: TrackingStatus;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  productName: string;
  productDescription: string;
  quantity: number;
  unit: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  events: TrackingEvent[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateTrackingData {
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  productName: string;
  productDescription: string;
  quantity: number;
  unit: string;
  estimatedDelivery: string;
}

export interface AddTrackingEventData {
  type: TrackingEvent['type'];
  description: string;
  location: string;
  notes?: string;
}

export interface TrackingStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  delayed: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationError {
  field: string;
  message: string;
}
