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
exports.CertificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const certification_schema_1 = require("./certification.schema");
let CertificationService = class CertificationService {
    constructor(certificationModel) {
        this.certificationModel = certificationModel;
    }
    async create(createCertificationDto, userId) {
        const certification = new this.certificationModel({
            ...createCertificationDto,
            submittedBy: userId,
        });
        return certification.save();
    }
    async findAll() {
        return this.certificationModel
            .find()
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async findById(id) {
        const certification = await this.certificationModel
            .findById(id)
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');
        if (!certification) {
            throw new common_1.NotFoundException('Certification application not found');
        }
        return certification;
    }
    async findByUser(userId) {
        return this.certificationModel
            .find({ submittedBy: userId })
            .populate('submittedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async findByStatus(status) {
        return this.certificationModel
            .find({ status })
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async updateStatus(id, status, reviewComments, assignedTo, certificationNumber, validUntil) {
        const updateData = { status };
        if (reviewComments)
            updateData.reviewComments = reviewComments;
        if (assignedTo)
            updateData.assignedTo = assignedTo;
        if (certificationNumber)
            updateData.certificationNumber = certificationNumber;
        if (validUntil)
            updateData.validUntil = validUntil;
        if (status === certification_schema_1.CertificationStatus.APPROVED) {
            updateData.approvedAt = new Date();
        }
        const certification = await this.certificationModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');
        if (!certification) {
            throw new common_1.NotFoundException('Certification application not found');
        }
        return certification;
    }
    async assignToReviewer(id, reviewerId) {
        const certification = await this.certificationModel
            .findByIdAndUpdate(id, {
            assignedTo: reviewerId,
            status: certification_schema_1.CertificationStatus.UNDER_REVIEW
        }, { new: true })
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');
        if (!certification) {
            throw new common_1.NotFoundException('Certification application not found');
        }
        return certification;
    }
    async update(id, updateCertificationDto) {
        const certification = await this.certificationModel
            .findByIdAndUpdate(id, updateCertificationDto, { new: true })
            .populate('submittedBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email');
        if (!certification) {
            throw new common_1.NotFoundException('Certification application not found');
        }
        return certification;
    }
    async getCertificationStats() {
        const total = await this.certificationModel.countDocuments();
        const byStatus = {};
        for (const status of Object.values(certification_schema_1.CertificationStatus)) {
            byStatus[status] = await this.certificationModel.countDocuments({ status });
        }
        const byType = {};
        for (const type of Object.values(certification_schema_1.CertificationType)) {
            byType[type] = await this.certificationModel.countDocuments({
                requestedCertificationType: type
            });
        }
        const pendingReview = await this.certificationModel.countDocuments({
            status: certification_schema_1.CertificationStatus.UNDER_REVIEW
        });
        return { total, byStatus, byType, pendingReview };
    }
};
exports.CertificationService = CertificationService;
exports.CertificationService = CertificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(certification_schema_1.Certification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CertificationService);
//# sourceMappingURL=certification.service.js.map