import { Module } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [],
  controllers: [TrackingController],
  providers: [TrackingService, PrismaService],
  exports: [TrackingService],
})
export class TrackingModule {}
