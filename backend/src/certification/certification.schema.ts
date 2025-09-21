
export type CertificationDocument = Certification & Document;

export enum CertificationStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum CertificationType {
  STANDARD = "standard",
  ORGANIC = "organic",
  PREMIUM = "premium",
}

@Schema({ timestamps: true })
export class Certification {
  _id?: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productCategory: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  companyAddress: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  productDescription: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ required: true })
  manufacturingProcess: string;

  @Prop({ required: true })
  supplierDetails: string;

  @Prop({ required: true, enum: CertificationType })
  requestedCertificationType: CertificationType;

  @Prop({ required: true })
  expectedCompletionDate: Date;

  @Prop({ type: [String], default: [] })
  supportingDocuments: string[];

  @Prop({
    required: true,
    enum: CertificationStatus,
    default: CertificationStatus.PENDING,
  })
  status: CertificationStatus;

  @Prop()
  reviewComments?: string;

  @Prop()
  approvedBy?: string;

  @Prop()
  approvedAt?: Date;

  @Prop()
  certificationNumber?: string;

  @Prop()
  validUntil?: Date;

  @Prop({ type: String, ref: "User" })
  submittedBy: string;

  @Prop({ type: String, ref: "User" })
  assignedTo?: string;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
