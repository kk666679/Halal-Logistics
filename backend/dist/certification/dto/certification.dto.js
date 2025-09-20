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
exports.UpdateCertificationStatusDto = exports.UpdateCertificationDto = exports.CreateCertificationDto = void 0;
const class_validator_1 = require("class-validator");
const certification_schema_1 = require("../certification.schema");
class CreateCertificationDto {
}
exports.CreateCertificationDto = CreateCertificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "productCategory", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "companyAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(50),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "productDescription", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCertificationDto.prototype, "ingredients", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(100),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "manufacturingProcess", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "supplierDetails", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(certification_schema_1.CertificationType),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "requestedCertificationType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "expectedCompletionDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCertificationDto.prototype, "supportingDocuments", void 0);
class UpdateCertificationDto {
}
exports.UpdateCertificationDto = UpdateCertificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "productCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "companyAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(50),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "productDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateCertificationDto.prototype, "ingredients", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(100),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "manufacturingProcess", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "supplierDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(certification_schema_1.CertificationType),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "requestedCertificationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCertificationDto.prototype, "expectedCompletionDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateCertificationDto.prototype, "supportingDocuments", void 0);
class UpdateCertificationStatusDto {
}
exports.UpdateCertificationStatusDto = UpdateCertificationStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(certification_schema_1.CertificationStatus),
    __metadata("design:type", String)
], UpdateCertificationStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCertificationStatusDto.prototype, "reviewComments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCertificationStatusDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCertificationStatusDto.prototype, "validUntil", void 0);
//# sourceMappingURL=certification.dto.js.map