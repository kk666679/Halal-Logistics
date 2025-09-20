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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationController = void 0;
const common_1 = require("@nestjs/common");
const certification_service_1 = require("./certification.service");
const certification_dto_1 = require("./dto/certification.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const certification_schema_1 = require("./certification.schema");
let CertificationController = class CertificationController {
    constructor(certificationService) {
        this.certificationService = certificationService;
    }
    async create(createCertificationDto, req) {
        return this.certificationService.create(createCertificationDto, req.user.userId);
    }
    async findAll(status) {
        if (status) {
            return this.certificationService.findByStatus(status);
        }
        return this.certificationService.findAll();
    }
    async findMyApplications(req) {
        return this.certificationService.findByUser(req.user.userId);
    }
    async getStats() {
        return this.certificationService.getCertificationStats();
    }
    async findOne(id) {
        return this.certificationService.findById(id);
    }
    async update(id, updateCertificationDto) {
        return this.certificationService.update(id, updateCertificationDto);
    }
    async updateStatus(id, updateStatusDto) {
        return this.certificationService.updateStatus(id, updateStatusDto.status, updateStatusDto.reviewComments, undefined, updateStatusDto.certificationNumber, updateStatusDto.validUntil ? new Date(updateStatusDto.validUntil) : undefined);
    }
    async assignToReviewer(id, body) {
        return this.certificationService.assignToReviewer(id, body.reviewerId);
    }
};
exports.CertificationController = CertificationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [certification_dto_1.CreateCertificationDto, Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-applications'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "findMyApplications", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, certification_dto_1.UpdateCertificationDto]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, certification_dto_1.UpdateCertificationStatusDto]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "assignToReviewer", null);
exports.CertificationController = CertificationController = __decorate([
    (0, common_1.Controller)('certifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [certification_service_1.CertificationService])
], CertificationController);
//# sourceMappingURL=certification.controller.js.map