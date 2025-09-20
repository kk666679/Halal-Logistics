import { CertificationStatus, CertificationType } from '../certification.schema';
export declare class CreateCertificationDto {
    productName: string;
    productCategory: string;
    companyName: string;
    companyAddress: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    productDescription: string;
    ingredients: string[];
    manufacturingProcess: string;
    supplierDetails: string;
    requestedCertificationType: CertificationType;
    expectedCompletionDate: string;
    supportingDocuments?: string[];
}
export declare class UpdateCertificationDto {
    productName?: string;
    productCategory?: string;
    companyName?: string;
    companyAddress?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    productDescription?: string;
    ingredients?: string[];
    manufacturingProcess?: string;
    supplierDetails?: string;
    requestedCertificationType?: CertificationType;
    expectedCompletionDate?: string;
    supportingDocuments?: string[];
}
export declare class UpdateCertificationStatusDto {
    status: CertificationStatus;
    reviewComments?: string;
    certificationNumber?: string;
    validUntil?: string;
}
