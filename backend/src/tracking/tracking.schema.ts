
export type TrackingDocument = Tracking & Document;

export enum TrackingStatus {
  PENDING = "pending",
  IN_TRANSIT = "in-transit",
  DELIVERED = "delivered",
  DELAYED = "delayed",
}

@Schema({ timestamps: true })
export class TrackingEvent {
  _id?: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, enum: TrackingStatus })
  status: TrackingStatus;

  @Prop()
  temperature?: number;

  @Prop({ min: 0, max: 100 })
  humidity?: number;

  @Prop({ required: true })
  description: string;

  @Prop()
  blockchainHash?: string;

  @Prop()
  verifiedBy?: string;

  @Prop()
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Schema({ timestamps: true })
export class Tracking {
  _id?: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: string;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  estimatedDelivery: Date;

  @Prop()
  currentLocation: string;

  @Prop({
    required: true,
    enum: TrackingStatus,
    default: TrackingStatus.PENDING,
  })
  status: TrackingStatus;

  @Prop({ required: true, min: 0, max: 100 })
  progress: number;

  @Prop({ default: true })
  halalCertified: boolean;

  @Prop({
    type: {
      current: { type: Number, required: true },
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      unit: { type: String, enum: ["C", "F"], default: "C" },
    },
    required: true,
  })
  temperature: {
    current: number;
    min: number;
    max: number;
    unit: "C" | "F";
  };

  @Prop({ required: true })
  carrier: string;

  @Prop({ default: true })
  blockchainVerified: boolean;

  @Prop({ type: [TrackingEvent], default: [] })
  trackingEvents: TrackingEvent[];

  @Prop({ type: String, ref: "User" })
  createdBy: string;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
export const TrackingEventSchema = SchemaFactory.createForClass(TrackingEvent);
