import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Certification,
  CertificationStatus,
  CertificationType,
} from "@prisma/client";
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from "./dto/certification.dto";

@Injectable()
export class CertificationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCertificationDto: CreateCertificationDto,
    userId: string,
  ): Promise<Certification> {
    const certification = await this.prisma.certification.create({
      data: {
        ...createCertificationDto,
        submittedBy: userId,
        status: CertificationStatus.PENDING,
      },
    });
    return certification;
  }

  async findAll(): Promise<Certification[]> {
    return this.prisma.certification.findMany({
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
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

  async findById(id: string): Promise<Certification> {
    const certification = await this.prisma.certification.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async findByUser(userId: string): Promise<Certification[]> {
    return this.prisma.certification.findMany({
      where: { submittedBy: userId },
      include: {
        submitter: {
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

  async findByStatus(status: CertificationStatus): Promise<Certification[]> {
    return this.prisma.certification.findMany({
      where: { status },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
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

  async updateStatus(
    id: string,
    status: CertificationStatus,
    reviewComments?: string,
    assignedTo?: string,
    certificationNumber?: string,
    validUntil?: Date,
  ): Promise<Certification> {
    const updateData: any = { status };

    if (reviewComments) updateData.reviewComments = reviewComments;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (certificationNumber) updateData.certificationNumber = certificationNumber;
    if (validUntil) updateData.validUntil = validUntil;

    if (status === CertificationStatus.APPROVED) {
      updateData.approvedAt = new Date();
    }

    const certification = await this.prisma.certification.update({
      where: { id },
      data: updateData,
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async assignToReviewer(
    id: string,
    reviewerId: string,
  ): Promise<Certification> {
    const certification = await this.prisma.certification.update({
      where: { id },
      data: {
        assignedTo: reviewerId,
        status: CertificationStatus.UNDER_REVIEW,
      },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async update(
    id: string,
    updateCertificationDto: UpdateCertificationDto,
  ): Promise<Certification> {
    const certification = await this.prisma.certification.update({
      where: { id },
      data: updateCertificationDto,
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async getCertificationStats(): Promise<{
    total: number;
    byStatus: Record<CertificationStatus, number>;
    byType: Record<CertificationType, number>;
    pendingReview: number;
  }> {
    const total = await this.prisma.certification.count();

    const byStatus = {} as Record<CertificationStatus, number>;
    for (const status of Object.values(CertificationStatus)) {
      byStatus[status] = await this.prisma.certification.count({
        where: { status },
      });
    }

    const byType = {} as Record<CertificationType, number>;
    for (const type of Object.values(CertificationType)) {
      byType[type] = await this.prisma.certification.count({
        where: { requestedCertificationType: type },
      });
    }

    const pendingReview = await this.prisma.certification.count({
      where: { status: CertificationStatus.UNDER_REVIEW },
    });

    return { total, byStatus, byType, pendingReview };
  }
}
