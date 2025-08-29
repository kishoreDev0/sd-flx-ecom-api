import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './main/modules/database.module';
import { RoleModule } from './main/modules/role.module';
import { LoggerModule } from './main/modules/logger.module';
import { UserSessionModule } from './main/modules/user-session.module';
import { GoogleModule } from './main/google-sign-in/google.module';
import { UserModule } from './main/modules/user.module';
import { ProductModule } from './main/modules/product.module';
import { CartModule } from './main/modules/cart.module';
import { WishlistModule } from './main/modules/wishlist.module';
import { FeatureModule } from './main/modules/feature.module';
import { CategoryModule } from './main/modules/category.module';
import { BrandModule } from './main/modules/brand.module';
import { BrandCategoryModule } from './main/modules/brand-category.module';
import { VendorModule } from './main/modules/vendor.module';
import { OrderModule } from './main/modules/order.module';
import { ContactModule } from './main/modules/contact.module';
import { StaticModule } from './main/modules/static.module';
import { FaqModule } from './main/modules/faq.module';
import { OrderTrackingModule } from './main/modules/order-tracking.module';
import { NotificationModule } from './main/modules/notification.module';
import { InventoryModule } from './main/modules/inventory.module';
import { PaymentModule } from './main/modules/payment.module';
import { ShippingModule } from './main/modules/shipping.module';
// import { MiddlewareConfigModule } from './main/middleware/middleware.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './main/google-sign-in/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RoleModule,
    LoggerModule,
    UserSessionModule,
    GoogleModule,
    UserModule,
    ProductModule,
    CartModule,
    WishlistModule,
    FeatureModule,
    CategoryModule,
    BrandModule,
    BrandCategoryModule,
    VendorModule,
    OrderModule,
    ContactModule,
    StaticModule,
    FaqModule,
    OrderTrackingModule,
    NotificationModule,
    InventoryModule,
    PaymentModule,
    ShippingModule,
    // MiddlewareConfigModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
