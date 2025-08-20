import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleModule } from './main/google-sign-in/google.module';
import { GoogleStrategy } from './main/google-sign-in/google.strategy';
import { DatabaseModule } from './main/modules/database.module';
import { RoleModule } from './main/modules/role.module';
import { LoggerModule } from './main/modules/logger.module';
import { UserSessionModule } from './main/modules/user-session.module';
import { UserModule } from './main/modules/user.module';
import { ProductModule } from './main/modules/product.module';
import { CartModule } from './main/modules/cart.module';
import { WishlistModule } from './main/modules/wishlist.module';
import { FeatureModule } from './main/modules/feature.module';
import { CategoryModule } from './main/modules/category.module';
import { OrderModule } from './main/modules/order.module';
import { ContactModule } from './main/modules/contact.module';
import { StaticModule } from './main/modules/static.module';
import { FaqModule } from './main/modules/faq.module';

@Module({
  imports: [
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
    OrderModule,
    ContactModule,
    StaticModule,
    FaqModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
