import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CertificationModule } from "./certification/certification.module";
import { TrackingModule } from "./tracking/tracking.module";
import { BookingModule } from './booking/booking.module';
import { ShipmentModule } from './shipment/shipment.module';
import { CustomsModule } from './customs/customs.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { DeliveryModule } from './delivery/delivery.module';
import { BillingModule } from './billing/billing.module';
import { NotificationModule } from './notification/notification.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CertificationModule,
    TrackingModule,
    BookingModule,
    ShipmentModule,
    CustomsModule,
    WarehouseModule,
    DeliveryModule,
    BillingModule,
    NotificationModule,
    AnalyticsModule,
    IntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
