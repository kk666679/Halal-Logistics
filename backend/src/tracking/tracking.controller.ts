import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import {
  CreateTrackingDto,
  UpdateTrackingDto,
  AddTrackingEventDto,
} from "./dto/tracking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TrackingStatus } from "./tracking.schema";

@Controller("tracking")
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  async create(@Body() createTrackingDto: CreateTrackingDto, @Request() req) {
    return this.trackingService.create(createTrackingDto, req.user.userId);
  }

  @Get()
  async findAll(@Query("status") status?: TrackingStatus) {
    if (status) {
      return this.trackingService.findByStatus(status);
    }
    return this.trackingService.findAll();
  }

  @Get("my-shipments")
  async findMyShipments(@Request() req) {
    return this.trackingService.findByUser(req.user.userId);
  }

  @Get("stats")
  async getStats() {
    return this.trackingService.getTrackingStats();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.trackingService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.trackingService.update(id, updateTrackingDto);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: TrackingStatus },
  ) {
    return this.trackingService.updateStatus(id, body.status);
  }

  @Post(":id/events")
  async addTrackingEvent(
    @Param("id") id: string,
    @Body() eventDto: AddTrackingEventDto,
  ) {
    return this.trackingService.addTrackingEvent(id, eventDto);
  }
}
