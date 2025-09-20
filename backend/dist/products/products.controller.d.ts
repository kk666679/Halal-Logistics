import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductCategory } from './product.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any): Promise<import("./product.schema").Product>;
    findAll(category?: ProductCategory): Promise<import("./product.schema").Product[]>;
    findLowStock(): Promise<import("./product.schema").Product[]>;
    getStats(): Promise<{
        total: number;
        byCategory: Record<ProductCategory, number>;
        lowStock: number;
        halalCertified: number;
    }>;
    findOne(id: string): Promise<import("./product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./product.schema").Product>;
    updateStock(id: string, body: {
        stock: number;
    }): Promise<import("./product.schema").Product>;
    remove(id: string): Promise<import("./product.schema").Product>;
}
