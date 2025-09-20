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
exports.ProductSchema = exports.Product = exports.ProductCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["MEAT_POULTRY"] = "Meat & Poultry";
    ProductCategory["DAIRY_PRODUCTS"] = "Dairy Products";
    ProductCategory["PROCESSED_FOODS"] = "Processed Foods";
    ProductCategory["BEVERAGES"] = "Beverages";
    ProductCategory["COSMETICS"] = "Cosmetics";
    ProductCategory["PHARMACEUTICALS"] = "Pharmaceuticals";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProductCategory }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "currentStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "minStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "maxStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0.01 }),
    __metadata("design:type", Number)
], Product.prototype, "costPerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0.01 }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "supplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Product.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "halalCertified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "certificationNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Product.prototype, "certificationExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Product.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100 }),
    __metadata("design:type", Number)
], Product.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'User' }),
    __metadata("design:type", String)
], Product.prototype, "createdBy", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map