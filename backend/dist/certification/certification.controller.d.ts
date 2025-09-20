import { CertificationService } from './certification.service';
import { CreateCertificationDto, UpdateCertificationDto, UpdateCertificationStatusDto } from './dto/certification.dto';
import { CertificationStatus, CertificationType } from './certification.schema';
export declare class CertificationController {
    private readonly certificationService;
    constructor(certificationService: CertificationService);
    create(createCertificationDto: CreateCertificationDto, req: any): Promise<import("./certification.schema").Certification>;
    findAll(status?: CertificationStatus): Promise<import("./certification.schema").Certification[]>;
    findMyApplications(req: any): Promise<import("./certification.schema").Certification[]>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<CertificationStatus, number>;
        byType: Record<CertificationType, number>;
        pendingReview: number;
    }>;
    findOne(id: string): Promise<import("./certification.schema").Certification>;
    update(id: string, updateCertificationDto: UpdateCertificationDto): Promise<import("./certification.schema").Certification>;
    updateStatus(id: string, updateStatusDto: UpdateCertificationStatusDto): Promise<import("./certification.schema").Certification>;
    assignToReviewer(id: string, body: {
        reviewerId: string;
    }): Promise<import("./certification.schema").Certification>;
}
