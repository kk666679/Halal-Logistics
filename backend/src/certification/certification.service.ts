import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BlockchainService } from "../blockchain/blockchain.service";
import { IpfsService } from "../ipfs/ipfs.service";
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
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private ipfsService: IpfsService,
  ) {}

  async create(
    createCertificationDto: CreateCertificationDto,
    userId: string,
  ): Promise<Certification> {
    // Store certification documents on IPFS if provided
    let ipfsHash: string | undefined;
    if (createCertificationDto.documents) {
      try {
        ipfsHash = await this.ipfsService.uploadFile(createCertificationDto.documents);
      } catch (error) {
        console.error('Failed to upload documents to IPFS:', error);
        // Continue without IPFS hash - don't fail the certification creation
      }
    }

    const certification = await this.prisma.certification.create({
      data: {
        ...createCertificationDto,
        submittedBy: userId,
        status: CertificationStatus.PENDING,
        ipfsDocumentHash: ipfsHash,
      },
    });

    // Record certification creation on blockchain
    try {
      await this.blockchainService.recordCertificationCreation(certification.id, userId);
    } catch (error) {
      console.error('Failed to record certification on blockchain:', error);
      // Continue - blockchain recording failure shouldn't prevent certification creation
    }

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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    // Record status change on blockchain
    try {
      await this.blockchainService.recordCertificationStatusChange(id, status, assignedTo);
    } catch (error) {
      console.error('Failed to record status change on blockchain:', error);
      // Continue - blockchain recording failure shouldn't prevent status update
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    // Record assignment on blockchain
    try {
      await this.blockchainService.recordCertificationAssignment(id, reviewerId);
    } catch (error) {
      console.error('Failed to record assignment on blockchain:', error);
      // Continue - blockchain recording failure shouldn't prevent assignment
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

    // Handle IPFS upload for updated documents
    let ipfsHash: string | undefined;
    if (updateCertificationDto.documents) {
      try {
        ipfsHash = await this.ipfsService.uploadFile(updateCertificationDto.documents);
        // Update the DTO to include the IPFS hash
        updateCertificationDto.ipfsDocumentHash = ipfsHash;
      } catch (error) {
        console.error('Failed to upload updated documents to IPFS:', error);
      }
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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
        blockchainTransactions: {
          select: {
            transactionHash: true,
            createdAt: true,
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

  // Enhanced blockchain and IPFS integration methods
  async getCertificationBlockchainHistory(certificationId: string): Promise<any[]> {
    return this.blockchainService.getCertificationHistory(certificationId);
  }

  async getCertificationDocumentFromIPFS(ipfsHash: string): Promise<Buffer> {
    return this.ipfsService.getFile(ipfsHash);
  }

  async verifyCertificationOnBlockchain(certificationId: string): Promise<boolean> {
    return this.blockchainService.verifyCertification(certificationId);
  }

  // Subscribe to blockchain events for real-time updates
  onBlockchainEvent(event: string, listener: (...args: any[]) => void) {
    this.blockchainService.on(event, listener);
  }

  // Unsubscribe from blockchain events
  offBlockchainEvent(event: string, listener: (...args: any[]) => void) {
    this.blockchainService.off(event, listener);
  }
}
