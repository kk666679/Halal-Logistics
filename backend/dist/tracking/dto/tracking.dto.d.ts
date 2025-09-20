import { TrackingStatus } from '../tracking.schema';
export declare class CreateTrackingDto {
    productName: string;
    quantity: string;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    currentLocation?: string;
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
}
export declare class UpdateTrackingDto {
    productName?: string;
    quantity?: string;
    origin?: string;
    destination?: string;
    estimatedDelivery?: string;
    currentLocation?: string;
    status?: TrackingStatus;
    progress?: number;
    halalCertified?: boolean;
    temperature?: {
        current: number;
        min: number;
        max: number;
        unit: 'C' | 'F';
    };
    carrier?: string;
    blockchainVerified?: boolean;
}
export declare class AddTrackingEventDto {
    location: string;
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
