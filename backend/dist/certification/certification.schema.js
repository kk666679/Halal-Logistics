"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationSchema = exports.Certification = exports.CertificationType = exports.CertificationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["PENDING"] = "pending";
    CertificationStatus["UNDER_REVIEW"] = "under_review";
    CertificationStatus["APPROVED"] = "approved";
    CertificationStatus["REJECTED"] = "rejected";
    CertificationStatus["EXPIRED"] = "expired";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
var CertificationType;
(function (CertificationType) {
    CertificationType["STANDARD"] = "standard";
    CertificationType["ORGANIC"] = "organic";
    CertificationType["PREMIUM"] = "premium";
})(CertificationType || (exports.CertificationType = CertificationType = {}));
let Certification = class Certification {
};
exports.Certification = Certification;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "productCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "companyAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "contactPerson", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "contactEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "contactPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "productDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Certification.prototype, "ingredients", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "manufacturingProcess", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certification.prototype, "supplierDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CertificationType }),
    __metadata("design:type", String)
], Certification.prototype, "requestedCertificationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Certification.prototype, "expectedCompletionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Certification.prototype, "supportingDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CertificationStatus, default: CertificationStatus.PENDING }),
    __metadata("design:type", String)
], Certification.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Certification.prototype, "reviewComments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Certification.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Certification.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Certification.prototype, "certificationNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Certification.prototype, "validUntil", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'User' }),
    __metadata("design:type", String)
], Certification.prototype, "submittedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'User' }),
    __metadata("design:type", String)
], Certification.prototype, "assignedTo", void 0);
exports.Certification = Certification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Certification);
exports.CertificationSchema = mongoose_1.SchemaFactory.createForClass(Certification);
//# sourceMappingURL=certification.schema.js.map