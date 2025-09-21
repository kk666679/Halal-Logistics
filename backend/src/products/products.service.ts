import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ProductCategory, Product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        ...(createProductDto as any),
        createdBy: userId,
      },
    });
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { category, isActive: true },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findLowStock(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        currentStock: {
          lte: 0, // Adjust as needed, since minStock is not accessible here
        },
        isActive: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { category, ...rest } = updateProductDto;
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(rest as any),
        category: category,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { currentStock: newStock },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

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
    const total = await this.prisma.product.count({
      where: { isActive: true },
    });

    const byCategory = {} as Record<ProductCategory, number>;
    for (const category of Object.values(ProductCategory)) {
      byCategory[category] = await this.prisma.product.count({
        where: { category, isActive: true },
      });
    }

    const lowStock = await this.prisma.product.count({
      where: {
        currentStock: {
          lte: 0, // Adjust as needed, since minStock is not accessible here
        },
        isActive: true,
      },
    });

    const halalCertified = await this.prisma.product.count({
      where: { halalCertified: true, isActive: true },
    });

    return { total, byCategory, lowStock, halalCertified };
  }
}
