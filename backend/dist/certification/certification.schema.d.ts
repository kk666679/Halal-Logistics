import { Document } from 'mongoose';
export type CertificationDocument = Certification & Document;
export declare enum CertificationStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare enum CertificationType {
    STANDARD = "standard",
    ORGANIC = "organic",
    PREMIUM = "premium"
}
export declare class Certification {
    _id?: string;
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
    expectedCompletionDate: Date;
    supportingDocuments: string[];
    status: CertificationStatus;
    reviewComments?: string;
    approvedBy?: string;
    approvedAt?: Date;
    certificationNumber?: string;
    validUntil?: Date;
    submittedBy: string;
    assignedTo?: string;
}
export declare const CertificationSchema: import("mongoose").Schema<Certification, import("mongoose").Model<Certification, any, any, any, Document<unknown, any, Certification, any, {}> & Certification & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Certification, Document<unknown, {}, import("mongoose").FlatRecord<Certification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Certification> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
