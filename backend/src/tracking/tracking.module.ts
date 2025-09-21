import { Module } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";

@Module({
  imports: [],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
