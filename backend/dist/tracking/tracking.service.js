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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tracking_schema_1 = require("./tracking.schema");
let TrackingService = class TrackingService {
    constructor(trackingModel) {
        this.trackingModel = trackingModel;
    }
    async create(createTrackingDto, userId) {
        const tracking = new this.trackingModel({
            ...createTrackingDto,
            createdBy: userId,
        });
        return tracking.save();
    }
    async findAll() {
        return this.trackingModel
            .find()
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async findById(id) {
        const tracking = await this.trackingModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email');
        if (!tracking) {
            throw new common_1.NotFoundException('Tracking record not found');
        }
        return tracking;
    }
    async findByUser(userId) {
        return this.trackingModel
            .find({ createdBy: userId })
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async findByStatus(status) {
        return this.trackingModel
            .find({ status })
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async update(id, updateTrackingDto) {
        const tracking = await this.trackingModel
            .findByIdAndUpdate(id, updateTrackingDto, { new: true })
            .populate('createdBy', 'firstName lastName email');
        if (!tracking) {
            throw new common_1.NotFoundException('Tracking record not found');
        }
        return tracking;
    }
    async updateStatus(id, status) {
        const tracking = await this.trackingModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('createdBy', 'firstName lastName email');
        if (!tracking) {
            throw new common_1.NotFoundException('Tracking record not found');
        }
        return tracking;
    }
    async addTrackingEvent(id, eventDto) {
        const tracking = await this.trackingModel.findById(id);
        if (!tracking) {
            throw new common_1.NotFoundException('Tracking record not found');
        }
        tracking.trackingEvents.push({
            ...eventDto,
            timestamp: new Date(),
        });
        const latestEvent = tracking.trackingEvents[tracking.trackingEvents.length - 1];
        tracking.currentLocation = latestEvent.location;
        tracking.status = latestEvent.status;
        const completedEvents = tracking.trackingEvents.filter(event => event.status === tracking_schema_1.TrackingStatus.DELIVERED).length;
        tracking.progress = Math.min((completedEvents / tracking.trackingEvents.length) * 100, 100);
        await tracking.save();
        return this.findById(id);
    }
    async getTrackingStats() {
        const total = await this.trackingModel.countDocuments();
        const byStatus = {};
        for (const status of Object.values(tracking_schema_1.TrackingStatus)) {
            byStatus[status] = await this.trackingModel.countDocuments({ status });
        }
        const inTransit = await this.trackingModel.countDocuments({
            status: tracking_schema_1.TrackingStatus.IN_TRANSIT
        });
        const delivered = await this.trackingModel.countDocuments({
            status: tracking_schema_1.TrackingStatus.DELIVERED
        });
        const delayed = await this.trackingModel.countDocuments({
            status: tracking_schema_1.TrackingStatus.DELAYED
        });
        return { total, byStatus, inTransit, delivered, delayed };
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tracking_schema_1.Tracking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map