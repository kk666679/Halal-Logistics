import { Document } from 'mongoose';
export type TrackingDocument = Tracking & Document;
export declare enum TrackingStatus {
    PENDING = "pending",
    IN_TRANSIT = "in-transit",
    DELIVERED = "delivered",
    DELAYED = "delayed"
}
export declare class TrackingEvent {
    _id?: string;
    location: string;
    timestamp: Date;
    status: TrackingStatus;
    temperature?: number;
    humidity?: number;
    description: string;
    blockchainHash?: string;
    verifiedBy?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
export declare class Tracking {
    _id?: string;
    productName: string;
    quantity: string;
    origin: string;
    destination: string;
    estimatedDelivery: Date;
    currentLocation: string;
    status: TrackingStatus;
    progress: number;
    halalCertified: boolean;
    temperature: {
        current: number;
        min: number;
        max: number;
        unit: 'C' | 'F';
    };
    carrier: string;
    blockchainVerified: boolean;
    trackingEvents: TrackingEvent[];
    createdBy: string;
}
export declare const TrackingSchema: import("mongoose").Schema<Tracking, import("mongoose").Model<Tracking, any, any, any, Document<unknown, any, Tracking, any, {}> & Tracking & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tracking, Document<unknown, {}, import("mongoose").FlatRecord<Tracking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Tracking> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export declare const TrackingEventSchema: import("mongoose").Schema<TrackingEvent, import("mongoose").Model<TrackingEvent, any, any, any, Document<unknown, any, TrackingEvent, any, {}> & TrackingEvent & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrackingEvent, Document<unknown, {}, import("mongoose").FlatRecord<TrackingEvent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TrackingEvent> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
