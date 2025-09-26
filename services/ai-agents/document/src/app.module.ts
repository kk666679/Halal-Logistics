import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DocumentController } from './document/document.controller';
import { DocumentService } from './document/document.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { MessageBrokerService } from './services/message-broker.service';
import { DocumentProcessorService } from './services/document-processor.service';
import { StorageService } from './services/storage.service';

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
  controllers: [DocumentController],
  providers: [
    DocumentService,
    AuthService,
    JwtStrategy,
    MessageBrokerService,
    DocumentProcessorService,
    StorageService,
  ],
})
export class AppModule {}
