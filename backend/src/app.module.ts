import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CertificationModule } from "./certification/certification.module";
import { TrackingModule } from "./tracking/tracking.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/halalchain",
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    CertificationModule,
    TrackingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
