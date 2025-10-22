import { Module } from "@nestjs/common";
import { TrackingService } from "./tracking.service";
import { TrackingController } from "./tracking.controller";
import { PrismaService } from "../prisma/prisma.service";
import { BlockchainModule } from "../blockchain/blockchain.module";
import { IpfsModule } from "../ipfs/ipfs.module";

@Module({
  imports: [BlockchainModule, IpfsModule],
  controllers: [TrackingController],
  providers: [TrackingService, PrismaService],
  exports: [TrackingService],
})
export class TrackingModule {}
