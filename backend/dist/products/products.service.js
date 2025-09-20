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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto, userId) {
        const product = new this.productModel({
            ...createProductDto,
            createdBy: userId,
        });
        return product.save();
    }
    async findAll() {
        return this.productModel.find({ isActive: true }).populate('createdBy', 'firstName lastName email');
    }
    async findById(id) {
        const product = await this.productModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email');
        if (!product || !product.isActive) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findByCategory(category) {
        return this.productModel
            .find({ category, isActive: true })
            .populate('createdBy', 'firstName lastName email');
    }
    async findLowStock() {
        return this.productModel
            .find({ currentStock: { $lte: '$minStock' }, isActive: true })
            .populate('createdBy', 'firstName lastName email');
    }
    async update(id, updateProductDto) {
        const product = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .populate('createdBy', 'firstName lastName email');
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async remove(id) {
        const product = await this.productModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .populate('createdBy', 'firstName lastName email');
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateStock(id, newStock) {
        const product = await this.productModel
            .findByIdAndUpdate(id, { currentStock: newStock }, { new: true })
            .populate('createdBy', 'firstName lastName email');
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getProductStats() {
        const total = await this.productModel.countDocuments({ isActive: true });
        const byCategory = {};
        for (const category of Object.values(product_schema_1.ProductCategory)) {
            byCategory[category] = await this.productModel.countDocuments({
                category,
                isActive: true
            });
        }
        const lowStock = await this.productModel.countDocuments({
            currentStock: { $lte: '$minStock' },
            isActive: true
        });
        const halalCertified = await this.productModel.countDocuments({
            halalCertified: true,
            isActive: true
        });
        return { total, byCategory, lowStock, halalCertified };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map