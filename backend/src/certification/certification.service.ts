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

  async findAll(userId?: string): Promise<Certification[]> {
    const whereClause: { submittedBy?: string } = userId ? { submittedBy: userId } : {};

    return this.prisma.certification.findMany({
      where: whereClause,
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

  async findOne(id: string, userId?: string): Promise<Certification> {
    const whereClause: { id: string; submittedBy?: string } = { id };
    if (userId) {
      whereClause.submittedBy = userId;
    }

    const certification = await this.prisma.certification.findFirst({
      where: whereClause,
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

  async findMyApplications(userId: string): Promise<Certification[]> {
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
    const updateData: {
      status: CertificationStatus;
      reviewComments?: string;
      assignedTo?: string;
      certificationNumber?: string;
      validUntil?: Date;
      approvedAt?: Date;
    } = { status };

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
    userId?: string,
  ): Promise<Certification> {
    const whereClause: { id: string; submittedBy?: string } = { id };
    if (userId) {
      whereClause.submittedBy = userId;
    }

    const certification = await this.prisma.certification.update({
      where: whereClause,
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

  async remove(id: string, userId?: string): Promise<Certification> {
    const whereClause: { id: string; submittedBy?: string } = { id };
    if (userId) {
      whereClause.submittedBy = userId;
    }

    const certification = await this.prisma.certification.delete({
      where: whereClause,
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
