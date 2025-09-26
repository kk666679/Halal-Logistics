import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { SmartContractsModule } from "./smart-contracts/smart-contracts.module";
import { IpfsModule } from "./ipfs/ipfs.module";
import { OraclesModule } from "./oracles/oracles.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    BlockchainModule,
    SmartContractsModule,
    IpfsModule,
    OraclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
