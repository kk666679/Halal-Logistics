import { Model } from 'mongoose';
import { Product, ProductDocument, ProductCategory } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    create(createProductDto: CreateProductDto, userId: string): Promise<Product>;
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    findByCategory(category: ProductCategory): Promise<Product[]>;
    findLowStock(): Promise<Product[]>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
    updateStock(id: string, newStock: number): Promise<Product>;
    getProductStats(): Promise<{
        total: number;
        byCategory: Record<ProductCategory, number>;
        lowStock: number;
        halalCertified: number;
    }>;
}
