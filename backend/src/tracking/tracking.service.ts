import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Tracking, TrackingDocument, TrackingStatus } from "./tracking.schema";
import {
  CreateTrackingDto,
  UpdateTrackingDto,
  AddTrackingEventDto,
} from "./dto/tracking.dto";

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<TrackingDocument>,
  ) {}

  async create(
    createTrackingDto: CreateTrackingDto,
    userId: string,
  ): Promise<Tracking> {
    const tracking = new this.trackingModel({
      ...createTrackingDto,
      createdBy: userId,
    });

    return tracking.save();
  }

  async findAll(): Promise<Tracking[]> {
    return this.trackingModel
      .find()
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<Tracking> {
    const tracking = await this.trackingModel
      .findById(id)
      .populate("createdBy", "firstName lastName email");

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async findByUser(userId: string): Promise<Tracking[]> {
    return this.trackingModel
      .find({ createdBy: userId })
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async findByStatus(status: TrackingStatus): Promise<Tracking[]> {
    return this.trackingModel
      .find({ status })
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async update(
    id: string,
    updateTrackingDto: UpdateTrackingDto,
  ): Promise<Tracking> {
    const tracking = await this.trackingModel
      .findByIdAndUpdate(id, updateTrackingDto, { new: true })
      .populate("createdBy", "firstName lastName email");

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async updateStatus(id: string, status: TrackingStatus): Promise<Tracking> {
    const tracking = await this.trackingModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate("createdBy", "firstName lastName email");

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async addTrackingEvent(
    id: string,
    eventDto: AddTrackingEventDto,
  ): Promise<Tracking> {
    const tracking = await this.trackingModel.findById(id);

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    tracking.trackingEvents.push({
      ...eventDto,
      timestamp: new Date(),
    });

    // Update current location and status based on the latest event
    const latestEvent =
      tracking.trackingEvents[tracking.trackingEvents.length - 1];
    tracking.currentLocation = latestEvent.location;
    tracking.status = latestEvent.status;

    // Calculate progress based on events
    const completedEvents = tracking.trackingEvents.filter(
      (event) => event.status === TrackingStatus.DELIVERED,
    ).length;
    tracking.progress = Math.min(
      (completedEvents / tracking.trackingEvents.length) * 100,
      100,
    );

    await tracking.save();
    return this.findById(id);
  }

  async getTrackingStats(): Promise<{
    total: number;
    byStatus: Record<TrackingStatus, number>;
    inTransit: number;
    delivered: number;
    delayed: number;
  }> {
    const total = await this.trackingModel.countDocuments();

    const byStatus = {} as Record<TrackingStatus, number>;
    for (const status of Object.values(TrackingStatus)) {
      byStatus[status] = await this.trackingModel.countDocuments({ status });
    }

    const inTransit = await this.trackingModel.countDocuments({
      status: TrackingStatus.IN_TRANSIT,
    });

    const delivered = await this.trackingModel.countDocuments({
      status: TrackingStatus.DELIVERED,
    });

    const delayed = await this.trackingModel.countDocuments({
      status: TrackingStatus.DELAYED,
    });

    return { total, byStatus, inTransit, delivered, delayed };
  }
}
