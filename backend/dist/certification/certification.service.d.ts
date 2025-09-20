import { Model } from 'mongoose';
import { Certification, CertificationDocument, CertificationStatus, CertificationType } from './certification.schema';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';
export declare class CertificationService {
    private certificationModel;
    constructor(certificationModel: Model<CertificationDocument>);
    create(createCertificationDto: CreateCertificationDto, userId: string): Promise<Certification>;
    findAll(): Promise<Certification[]>;
    findById(id: string): Promise<Certification>;
    findByUser(userId: string): Promise<Certification[]>;
    findByStatus(status: CertificationStatus): Promise<Certification[]>;
    updateStatus(id: string, status: CertificationStatus, reviewComments?: string, assignedTo?: string, certificationNumber?: string, validUntil?: Date): Promise<Certification>;
    assignToReviewer(id: string, reviewerId: string): Promise<Certification>;
    update(id: string, updateCertificationDto: UpdateCertificationDto): Promise<Certification>;
    getCertificationStats(): Promise<{
        total: number;
        byStatus: Record<CertificationStatus, number>;
        byType: Record<CertificationType, number>;
        pendingReview: number;
    }>;
}
