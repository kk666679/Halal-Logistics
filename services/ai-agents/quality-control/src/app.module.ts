import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { QualityController } from './quality/quality.controller';
import { QualityService } from './quality/quality.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { MessageBrokerService } from './services/message-broker.service';
import { QualityAnalysisService } from './services/quality-analysis.service';
import { InspectionService } from './services/inspection.service';
import { MetricsService } from './services/metrics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [QualityController],
  providers: [
    QualityService,
    AuthService,
    JwtStrategy,
    MessageBrokerService,
    QualityAnalysisService,
    InspectionService,
    MetricsService,
  ],
})
export class AppModule {}
