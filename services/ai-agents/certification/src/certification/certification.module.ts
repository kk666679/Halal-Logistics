import { Module } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { MLService } from '../services/ml.service';

@Module({
  controllers: [CertificationController],
  providers: [CertificationService, MLService],
  exports: [CertificationService],
})
export class CertificationModule {}
