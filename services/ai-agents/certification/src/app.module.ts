import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CertificationModule } from './certification/certification.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    CertificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
