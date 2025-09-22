import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Tracking,
  TrackingStatus,
} from "@prisma/client";
import {
  CreateTrackingDto,
  UpdateTrackingDto,
  AddTrackingEventDto,
} from "./dto/tracking.dto";

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTrackingDto: CreateTrackingDto,
    userId: string,
  ): Promise<Tracking> {
    const tracking = await this.prisma.tracking.create({
      data: {
        ...createTrackingDto,
        createdBy: userId,
        status: TrackingStatus.PENDING,
        progress: 0,
      },
    });
    return tracking;
  }

  async findAll(userId?: string): Promise<Tracking[]> {
    const whereClause: { createdBy?: string } = {};
    if (userId) {
      whereClause.createdBy = userId;
    }

    return this.prisma.tracking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId?: string): Promise<Tracking> {
    const whereClause: { id: string; createdBy?: string } = { id };
    if (userId) {
      whereClause.createdBy = userId;
    }

    const tracking = await this.prisma.tracking.findFirst({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async findById(id: string): Promise<Tracking> {
    const tracking = await this.prisma.tracking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async findMyShipments(userId: string): Promise<Tracking[]> {
    return this.prisma.tracking.findMany({
      where: { createdBy: userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string): Promise<Tracking[]> {
    return this.prisma.tracking.findMany({
      where: { createdBy: userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStatus(status: TrackingStatus): Promise<Tracking[]> {
    return this.prisma.tracking.findMany({
      where: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    updateTrackingDto: UpdateTrackingDto,
    userId?: string,
  ): Promise<Tracking> {
    const whereClause: { id: string; createdBy?: string } = { id };
    if (userId) {
      whereClause.createdBy = userId;
    }

    const tracking = await this.prisma.tracking.update({
      where: whereClause,
      data: updateTrackingDto,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async remove(id: string, userId?: string): Promise<Tracking> {
    const whereClause: { id: string; createdBy?: string } = { id };
    if (userId) {
      whereClause.createdBy = userId;
    }

    const tracking = await this.prisma.tracking.delete({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return tracking;
  }

  async updateStatus(id: string, status: TrackingStatus): Promise<Tracking> {
    const tracking = await this.prisma.tracking.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    return tracking;
  }

  async addTrackingEvent(
    id: string,
    eventDto: AddTrackingEventDto,
  ): Promise<Tracking> {
    const tracking = await this.prisma.tracking.findUnique({
      where: { id },
    });

    if (!tracking) {
      throw new NotFoundException("Tracking record not found");
    }

    // Create new tracking event
    await this.prisma.trackingEvent.create({
      data: {
        ...eventDto,
        trackingId: id,
        timestamp: new Date(),
      },
    });

    // Update tracking record with latest event information
    const latestEvent = await this.prisma.trackingEvent.findFirst({
      where: { trackingId: id },
      orderBy: { timestamp: 'desc' },
    });

    if (latestEvent) {
      // Calculate progress based on events
      const allEvents = await this.prisma.trackingEvent.findMany({
        where: { trackingId: id },
      });

      const completedEvents = allEvents.filter(
        (event) => event.status === TrackingStatus.DELIVERED,
      ).length;

      const progress = Math.min(
        (completedEvents / allEvents.length) * 100,
        100,
      );

      await this.prisma.tracking.update({
        where: { id },
        data: {
          currentLocation: latestEvent.location,
          status: latestEvent.status,
          progress: progress,
        },
      });
    }

    return this.findById(id);
  }

  async getTrackingStats(): Promise<{
    total: number;
    byStatus: Record<TrackingStatus, number>;
    inTransit: number;
    delivered: number;
    delayed: number;
  }> {
    const total = await this.prisma.tracking.count();

    const byStatus = {} as Record<TrackingStatus, number>;
    for (const status of Object.values(TrackingStatus)) {
      byStatus[status] = await this.prisma.tracking.count({
        where: { status },
      });
    }

    const inTransit = await this.prisma.tracking.count({
      where: { status: TrackingStatus.IN_TRANSIT },
    });

    const delivered = await this.prisma.tracking.count({
      where: { status: TrackingStatus.DELIVERED },
    });

    const delayed = await this.prisma.tracking.count({
      where: { status: TrackingStatus.DELAYED },
    });

    return { total, byStatus, inTransit, delivered, delayed };
  }
}
