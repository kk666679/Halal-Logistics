import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Certification,
  CertificationDocument,
  CertificationStatus,
  CertificationType,
} from "./certification.schema";
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from "./dto/certification.dto";

@Injectable()
export class CertificationService {
  constructor(
    @InjectModel(Certification.name)
    private certificationModel: Model<CertificationDocument>,
  ) {}

  async create(
    createCertificationDto: CreateCertificationDto,
    userId: string,
  ): Promise<Certification> {
    const certification = new this.certificationModel({
      ...createCertificationDto,
      submittedBy: userId,
    });

    return certification.save();
  }

  async findAll(): Promise<Certification[]> {
    return this.certificationModel
      .find()
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<Certification> {
    const certification = await this.certificationModel
      .findById(id)
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async findByUser(userId: string): Promise<Certification[]> {
    return this.certificationModel
      .find({ submittedBy: userId })
      .populate("submittedBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  }

  async findByStatus(status: CertificationStatus): Promise<Certification[]> {
    return this.certificationModel
      .find({ status })
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 });
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
    if (certificationNumber)
      updateData.certificationNumber = certificationNumber;
    if (validUntil) updateData.validUntil = validUntil;

    if (status === CertificationStatus.APPROVED) {
      updateData.approvedAt = new Date();
    }

    const certification = await this.certificationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async assignToReviewer(
    id: string,
    reviewerId: string,
  ): Promise<Certification> {
    const certification = await this.certificationModel
      .findByIdAndUpdate(
        id,
        {
          assignedTo: reviewerId,
          status: CertificationStatus.UNDER_REVIEW,
        },
        { new: true },
      )
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!certification) {
      throw new NotFoundException("Certification application not found");
    }

    return certification;
  }

  async update(
    id: string,
    updateCertificationDto: UpdateCertificationDto,
  ): Promise<Certification> {
    const certification = await this.certificationModel
      .findByIdAndUpdate(id, updateCertificationDto, { new: true })
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

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
    const total = await this.certificationModel.countDocuments();

    const byStatus = {} as Record<CertificationStatus, number>;
    for (const status of Object.values(CertificationStatus)) {
      byStatus[status] = await this.certificationModel.countDocuments({
        status,
      });
    }

    const byType = {} as Record<CertificationType, number>;
    for (const type of Object.values(CertificationType)) {
      byType[type] = await this.certificationModel.countDocuments({
        requestedCertificationType: type,
      });
    }

    const pendingReview = await this.certificationModel.countDocuments({
      status: CertificationStatus.UNDER_REVIEW,
    });

    return { total, byStatus, byType, pendingReview };
  }
}
