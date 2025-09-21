import { apiClient } from '@/lib/api';
import {
  Tracking,
  CreateTrackingData,
  AddTrackingEventData,
  TrackingStats,
  TrackingStatus
} from '@/lib/types';

export class TrackingService {
  /**
   * Get all tracking records with optional status filter
   */
  async getAll(status?: TrackingStatus): Promise<Tracking[]> {
    try {
      const config = status ? { params: { status } } : undefined;
      const data = await apiClient.get<Tracking[]>('/tracking', config);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tracking records');
    }
  }

  /**
   * Get tracking record by ID
   */
  async getById(id: string): Promise<Tracking> {
    try {
      const data = await apiClient.get<Tracking>(`/tracking/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tracking record');
    }
  }

  /**
   * Get user's shipments
   */
  async getMyShipments(): Promise<Tracking[]> {
    try {
      const data = await apiClient.get<Tracking[]>('/tracking/my-shipments');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch shipments');
    }
  }

  /**
   * Create new tracking record
   */
  async create(trackingData: CreateTrackingData): Promise<Tracking> {
    try {
      const data = await apiClient.post<Tracking>('/tracking', trackingData);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create tracking record');
    }
  }

  /**
   * Update existing tracking record
   */
  async update(id: string, updateData: Partial<CreateTrackingData>): Promise<Tracking> {
    try {
      const data = await apiClient.patch<Tracking>(`/tracking/${id}`, updateData);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update tracking record');
    }
  }

  /**
   * Update tracking status
   */
  async updateStatus(id: string, status: TrackingStatus): Promise<Tracking> {
    try {
      const data = await apiClient.patch<Tracking>(`/tracking/${id}/status`, { status });
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update status');
    }
  }

  /**
   * Add tracking event
   */
  async addEvent(id: string, eventData: AddTrackingEventData): Promise<Tracking> {
    try {
      const data = await apiClient.post<Tracking>(`/tracking/${id}/events`, eventData);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add tracking event');
    }
  }

  /**
   * Get tracking statistics
   */
  async getStats(): Promise<TrackingStats> {
    try {
      const data = await apiClient.get<TrackingStats>('/tracking/stats');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tracking stats');
    }
  }

  /**
   * Search tracking records by tracking number
   */
  async search(trackingNumber: string): Promise<Tracking[]> {
    try {
      const config = { params: { trackingNumber } };
      const data = await apiClient.get<Tracking[]>('/tracking', config);
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search tracking records');
    }
  }
}

// Create and export singleton instance
export const trackingService = new TrackingService();
export default trackingService;
