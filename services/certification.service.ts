import { apiClient } from '@/lib/api';
import {
  Certification,
  CreateCertificationData,
  UpdateCertificationData,
  CertificationStats,
  CertificationStatus
} from '@/lib/types';

export class CertificationService {
  /**
   * Get all certifications with optional status filter
   */
  async getAll(status?: CertificationStatus): Promise<Certification[]> {
    try {
      const params = status ? { status } : undefined;
      const response = await apiClient.get<Certification[]>('/certifications', params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch certifications');
    }
  }

  /**
   * Get certification by ID
   */
  async getById(id: string): Promise<Certification> {
    try {
      const response = await apiClient.get<Certification>(`/certifications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch certification');
    }
  }

  /**
   * Get user's certification applications
   */
  async getMyApplications(): Promise<Certification[]> {
    try {
      const response = await apiClient.get<Certification[]>('/certifications/my-applications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  }

  /**
   * Create new certification application
   */
  async create(applicationData: CreateCertificationData): Promise<Certification> {
    try {
      const response = await apiClient.post<Certification>('/certifications', applicationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create application');
    }
  }

  /**
   * Update existing certification
   */
  async update(id: string, updateData: UpdateCertificationData): Promise<Certification> {
    try {
      const response = await apiClient.patch<Certification>(`/certifications/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update certification');
    }
  }

  /**
   * Update certification status
   */
  async updateStatus(
    id: string,
    status: CertificationStatus,
    reviewComments?: string,
    certificationNumber?: string,
    validUntil?: Date
  ): Promise<Certification> {
    try {
      const updateData = {
        status,
        reviewComments,
        certificationNumber,
        validUntil: validUntil?.toISOString(),
      };
      const response = await apiClient.patch<Certification>(`/certifications/${id}/status`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  }

  /**
   * Assign certification to reviewer
   */
  async assignToReviewer(id: string, reviewerId: string): Promise<Certification> {
    try {
      const response = await apiClient.patch<Certification>(`/certifications/${id}/assign`, {
        reviewerId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to assign reviewer');
    }
  }

  /**
   * Get certification statistics
   */
  async getStats(): Promise<CertificationStats> {
    try {
      const response = await apiClient.get<CertificationStats>('/certifications/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch certification stats');
    }
  }
}

// Create and export singleton instance
export const certificationService = new CertificationService();
export default certificationService;
