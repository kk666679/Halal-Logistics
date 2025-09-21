import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument, ProductCategory } from "./product.schema";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = new this.productModel({
      ...createProductDto,
      createdBy: userId,
    });

    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel
      .find({ isActive: true })
      .populate("createdBy", "firstName lastName email");
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate("createdBy", "firstName lastName email");

    if (!product || !product.isActive) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productModel
      .find({ category, isActive: true })
      .populate("createdBy", "firstName lastName email");
  }

  async findLowStock(): Promise<Product[]> {
    return this.productModel
      .find({ currentStock: { $lte: "$minStock" }, isActive: true })
      .populate("createdBy", "firstName lastName email");
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate("createdBy", "firstName lastName email");

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .populate("createdBy", "firstName lastName email");

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { currentStock: newStock }, { new: true })
      .populate("createdBy", "firstName lastName email");

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async getProductStats(): Promise<{
    total: number;
    byCategory: Record<ProductCategory, number>;
    lowStock: number;
    halalCertified: number;
  }> {
    const total = await this.productModel.countDocuments({ isActive: true });

    const byCategory = {} as Record<ProductCategory, number>;
    for (const category of Object.values(ProductCategory)) {
      byCategory[category] = await this.productModel.countDocuments({
        category,
        isActive: true,
      });
    }

    const lowStock = await this.productModel.countDocuments({
      currentStock: { $lte: "$minStock" },
      isActive: true,
    });

    const halalCertified = await this.productModel.countDocuments({
      halalCertified: true,
      isActive: true,
    });

    return { total, byCategory, lowStock, halalCertified };
  }
}
