import { TrackingService } from './tracking.service';
import { CreateTrackingDto, UpdateTrackingDto, AddTrackingEventDto } from './dto/tracking.dto';
import { TrackingStatus } from './tracking.schema';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    create(createTrackingDto: CreateTrackingDto, req: any): Promise<import("./tracking.schema").Tracking>;
    findAll(status?: TrackingStatus): Promise<import("./tracking.schema").Tracking[]>;
    findMyShipments(req: any): Promise<import("./tracking.schema").Tracking[]>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<TrackingStatus, number>;
        inTransit: number;
        delivered: number;
        delayed: number;
    }>;
    findOne(id: string): Promise<import("./tracking.schema").Tracking>;
    update(id: string, updateTrackingDto: UpdateTrackingDto): Promise<import("./tracking.schema").Tracking>;
    updateStatus(id: string, body: {
        status: TrackingStatus;
    }): Promise<import("./tracking.schema").Tracking>;
    addTrackingEvent(id: string, eventDto: AddTrackingEventDto): Promise<import("./tracking.schema").Tracking>;
}
