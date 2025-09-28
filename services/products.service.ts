import { apiClient } from "@/lib/api";
import { AxiosError } from "axios";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductStats,
  ProductCategory,
} from "@/lib/types";

export class ProductsService {
  /**
   * Get all products with optional category filter
   */
  async getAll(category?: ProductCategory): Promise<Product[]> {
    try {
      const params = category ? { category } : undefined;
      const response = await apiClient.get<Product[]>("/products", { params });
      // Log the response to debug structure
      // console.log("ProductsService.getAll response:", response);
      return response;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error?.message || "Failed to fetch products",
      );
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  }

  /**
   * Create new product
   */
  async create(productData: CreateProductData): Promise<Product> {
    try {
      const response = await apiClient.post<Product>("/products", productData);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create product",
      );
    }
  }

  /**
   * Update existing product
   */
  async update(id: string, updateData: UpdateProductData): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(
        `/products/${id}`,
        updateData,
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update product",
      );
    }
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, stock: number): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(`/products/${id}/stock`, {
        stock,
      });
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update stock",
      );
    }
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  }

  /**
   * Get low stock products
   */
  async getLowStock(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>("/products/low-stock");
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch low stock products",
      );
    }
  }

  /**
   * Get product statistics
   */
  async getStats(): Promise<ProductStats> {
    try {
      const response = await apiClient.get<ProductStats>("/products/stats");
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product stats",
      );
    }
  }

  /**
   * Search products by query
   */
  async search(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>("/products", {
        params: { search: query },
      });
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search products",
      );
    }
  }
}

// Create and export singleton instance
export const productsService = new ProductsService();
export default productsService;
