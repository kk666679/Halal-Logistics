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
import { TrackingService } from "./tracking.service";
import { CreateTrackingDto, UpdateTrackingDto } from "./dto/tracking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller("tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTrackingDto: CreateTrackingDto, @Request() req: AuthenticatedRequest) {
    return this.trackingService.create(createTrackingDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.trackingService.findAll(req.user.userId);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  async findMyShipments(@Request() req: AuthenticatedRequest) {
    return this.trackingService.findMyShipments(req.user.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.trackingService.findOne(id, req.user.userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.trackingService.update(id, updateTrackingDto, req.user.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.trackingService.remove(id, req.user.userId);
  }
}
