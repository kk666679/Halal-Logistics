import { Module } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { IpfsModule } from '../ipfs/ipfs.module';

@Module({
  imports: [BlockchainModule, IpfsModule],
  controllers: [CertificationController],
  providers: [CertificationService, PrismaService],
  exports: [CertificationService],
})
export class CertificationModule {}
