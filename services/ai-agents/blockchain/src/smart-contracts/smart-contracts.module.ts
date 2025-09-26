import { Module } from "@nestjs/common";
import { SmartContractsService } from "./smart-contracts.service";
import { SmartContractsController } from "./smart-contracts.controller";

@Module({
  controllers: [SmartContractsController],
  providers: [SmartContractsService],
  exports: [SmartContractsService],
})
export class SmartContractsModule {}
