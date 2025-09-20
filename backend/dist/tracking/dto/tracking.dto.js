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
exports.AddTrackingEventDto = exports.UpdateTrackingDto = exports.CreateTrackingDto = void 0;
const class_validator_1 = require("class-validator");
const tracking_schema_1 = require("../tracking.schema");
class CreateTrackingDto {
}
exports.CreateTrackingDto = CreateTrackingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "currentLocation", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tracking_schema_1.TrackingStatus),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateTrackingDto.prototype, "progress", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTrackingDto.prototype, "halalCertified", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTrackingDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTrackingDto.prototype, "carrier", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTrackingDto.prototype, "blockchainVerified", void 0);
class UpdateTrackingDto {
}
exports.UpdateTrackingDto = UpdateTrackingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "currentLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tracking_schema_1.TrackingStatus),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateTrackingDto.prototype, "progress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTrackingDto.prototype, "halalCertified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTrackingDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTrackingDto.prototype, "carrier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTrackingDto.prototype, "blockchainVerified", void 0);
class AddTrackingEventDto {
}
exports.AddTrackingEventDto = AddTrackingEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTrackingEventDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(tracking_schema_1.TrackingStatus),
    __metadata("design:type", String)
], AddTrackingEventDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddTrackingEventDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AddTrackingEventDto.prototype, "humidity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTrackingEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTrackingEventDto.prototype, "blockchainHash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTrackingEventDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AddTrackingEventDto.prototype, "coordinates", void 0);
//# sourceMappingURL=tracking.dto.js.map