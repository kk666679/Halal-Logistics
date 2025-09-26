import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RiskController } from './risk/risk.controller';
import { RiskService } from './risk/risk.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { MessageBrokerService } from './services/message-broker.service';
import { RiskAnalysisService } from './services/risk-analysis.service';
import { RiskModelService } from './services/risk-model.service';
import { RiskReportingService } from './services/risk-reporting.service';
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
  controllers: [RiskController],
  providers: [
    RiskService,
    AuthService,
    JwtStrategy,
    MessageBrokerService,
    RiskAnalysisService,
    RiskModelService,
    RiskReportingService,
    MetricsService,
  ],
})
export class AppModule {}
