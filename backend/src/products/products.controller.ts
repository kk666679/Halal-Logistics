import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductCategory } from './product.schema';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('category') category?: ProductCategory) {
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Get('low-stock')
  async findLowStock() {
    return this.productsService.findLowStock();
  }

  @Get('stats')
  async getStats() {
    return this.productsService.getProductStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  async updateStock(@Param('id') id: string, @Body() body: { stock: number }) {
    return this.productsService.updateStock(id, body.stock);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
