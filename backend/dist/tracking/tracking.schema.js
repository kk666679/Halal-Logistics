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
exports.TrackingEventSchema = exports.TrackingSchema = exports.Tracking = exports.TrackingEvent = exports.TrackingStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var TrackingStatus;
(function (TrackingStatus) {
    TrackingStatus["PENDING"] = "pending";
    TrackingStatus["IN_TRANSIT"] = "in-transit";
    TrackingStatus["DELIVERED"] = "delivered";
    TrackingStatus["DELAYED"] = "delayed";
})(TrackingStatus || (exports.TrackingStatus = TrackingStatus = {}));
let TrackingEvent = class TrackingEvent {
};
exports.TrackingEvent = TrackingEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TrackingEvent.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TrackingEvent.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TrackingStatus }),
    __metadata("design:type", String)
], TrackingEvent.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TrackingEvent.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100 }),
    __metadata("design:type", Number)
], TrackingEvent.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TrackingEvent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TrackingEvent.prototype, "blockchainHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TrackingEvent.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Object)
], TrackingEvent.prototype, "coordinates", void 0);
exports.TrackingEvent = TrackingEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrackingEvent);
let Tracking = class Tracking {
};
exports.Tracking = Tracking;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tracking.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tracking.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tracking.prototype, "origin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tracking.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Tracking.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tracking.prototype, "currentLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TrackingStatus, default: TrackingStatus.PENDING }),
    __metadata("design:type", String)
], Tracking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Tracking.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Tracking.prototype, "halalCertified", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            current: { type: Number, required: true },
            min: { type: Number, required: true },
            max: { type: Number, required: true },
            unit: { type: String, enum: ['C', 'F'], default: 'C' }
        },
        required: true
    }),
    __metadata("design:type", Object)
], Tracking.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tracking.prototype, "carrier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Tracking.prototype, "blockchainVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TrackingEvent], default: [] }),
    __metadata("design:type", Array)
], Tracking.prototype, "trackingEvents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'User' }),
    __metadata("design:type", String)
], Tracking.prototype, "createdBy", void 0);
exports.Tracking = Tracking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tracking);
exports.TrackingSchema = mongoose_1.SchemaFactory.createForClass(Tracking);
exports.TrackingEventSchema = mongoose_1.SchemaFactory.createForClass(TrackingEvent);
//# sourceMappingURL=tracking.schema.js.map