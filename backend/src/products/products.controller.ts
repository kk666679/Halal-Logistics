import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto, @Request() req: AuthenticatedRequest) {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.productsService.findAll(req.user.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.productsService.findOne(id, req.user.userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.productsService.remove(id, req.user.userId);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: AuthenticatedRequest) {
    return this.productsService.getProductStats();
  }

  @Get("low-stock")
  @UseGuards(JwtAuthGuard)
  async getLowStock(@Request() req: AuthenticatedRequest) {
    return this.productsService.findLowStock();
  }
}
