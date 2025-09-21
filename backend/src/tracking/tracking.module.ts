import { Module } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";
import { Tracking, TrackingSchema } from "./tracking.schema";

@Module({
  imports: [],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
