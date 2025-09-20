import { Model } from 'mongoose';
import { Tracking, TrackingDocument, TrackingStatus } from './tracking.schema';
import { CreateTrackingDto, UpdateTrackingDto, AddTrackingEventDto } from './dto/tracking.dto';
export declare class TrackingService {
    private trackingModel;
    constructor(trackingModel: Model<TrackingDocument>);
    create(createTrackingDto: CreateTrackingDto, userId: string): Promise<Tracking>;
    findAll(): Promise<Tracking[]>;
    findById(id: string): Promise<Tracking>;
    findByUser(userId: string): Promise<Tracking[]>;
    findByStatus(status: TrackingStatus): Promise<Tracking[]>;
    update(id: string, updateTrackingDto: UpdateTrackingDto): Promise<Tracking>;
    updateStatus(id: string, status: TrackingStatus): Promise<Tracking>;
    addTrackingEvent(id: string, eventDto: AddTrackingEventDto): Promise<Tracking>;
    getTrackingStats(): Promise<{
        total: number;
        byStatus: Record<TrackingStatus, number>;
        inTransit: number;
        delivered: number;
        delayed: number;
    }>;
}
