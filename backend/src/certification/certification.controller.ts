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
import { CertificationService } from "./certification.service";
import { CreateCertificationDto, UpdateCertificationDto } from "./dto/certification.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller("certification")
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCertificationDto: CreateCertificationDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.certificationService.create(createCertificationDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.certificationService.findAll(req.user.userId);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  async findMyApplications(@Request() req: AuthenticatedRequest) {
    return this.certificationService.findMyApplications(req.user.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.certificationService.findOne(id, req.user.userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.certificationService.update(id, updateCertificationDto, req.user.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.certificationService.remove(id, req.user.userId);
  }
}
