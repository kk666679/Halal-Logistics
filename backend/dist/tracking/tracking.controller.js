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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const tracking_service_1 = require("./tracking.service");
const tracking_dto_1 = require("./dto/tracking.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tracking_schema_1 = require("./tracking.schema");
let TrackingController = class TrackingController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async create(createTrackingDto, req) {
        return this.trackingService.create(createTrackingDto, req.user.userId);
    }
    async findAll(status) {
        if (status) {
            return this.trackingService.findByStatus(status);
        }
        return this.trackingService.findAll();
    }
    async findMyShipments(req) {
        return this.trackingService.findByUser(req.user.userId);
    }
    async getStats() {
        return this.trackingService.getTrackingStats();
    }
    async findOne(id) {
        return this.trackingService.findById(id);
    }
    async update(id, updateTrackingDto) {
        return this.trackingService.update(id, updateTrackingDto);
    }
    async updateStatus(id, body) {
        return this.trackingService.updateStatus(id, body.status);
    }
    async addTrackingEvent(id, eventDto) {
        return this.trackingService.addTrackingEvent(id, eventDto);
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tracking_dto_1.CreateTrackingDto, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-shipments'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "findMyShipments", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.UpdateTrackingDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/events'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tracking_dto_1.AddTrackingEventDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "addTrackingEvent", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('tracking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map