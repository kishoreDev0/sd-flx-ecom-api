import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './main/modules/user.module';
import { AuthenticationModule } from './main/modules/authentication.module';
import { UserSessionModule } from './main/modules/user-session.module';
import { CategoryModule } from './main/modules/category.module';
import { SubcategoryModule } from './main/modules/subcategory.module';
import { BrandModule } from './main/modules/brand.module';
import { ProductModule } from './main/modules/product.module';
import { FeatureModule } from './main/modules/feature.module';
import { VendorModule } from './main/modules/vendor.module';
import { BrandCategoryModule } from './main/modules/brand-category.module';
import { LoggerModule } from './main/modules/logger.module';
import { AttributeModule } from './main/modules/attribute.module';
import { User } from './main/entities/user.entity';
import { Role } from './main/entities/role.entity';
import { UserSession } from './main/entities/user-session.entity';
import { Category } from './main/entities/category.entity';
import { Subcategory } from './main/entities/subcategory.entity';
import { Brand } from './main/entities/brand.entity';
import { BrandCategory } from './main/entities/brand-category.entity';
import { Product } from './main/entities/product.entity';
import { ProductFeature } from './main/entities/product-feature.entity';
import { Feature } from './main/entities/feature.entity';
import { Vendor } from './main/entities/vendor.entity';
import { ProductRating } from './main/entities/product-rating.entity';
import { Order } from './main/entities/order.entity';
import { OrderTracking } from './main/entities/order-tracking.entity';
import { Review, ReviewResponse, ReviewHelpfulVote, ReviewReport } from './main/entities/review.entity';
import { Inventory } from './main/entities/inventory.entity';
import { Contact } from './main/entities/contact-us.entity';
import { Static } from './main/entities/static.entity';
import { Faq } from './main/entities/faq.entity';
import { ShippingAddress } from './main/entities/shipping.entity';
import { ShippingMethod } from './main/entities/shipping.entity';
import { ShippingZone } from './main/entities/shipping.entity';
import { Shipment } from './main/entities/shipping.entity';
import { ShippingTracking } from './main/entities/shipping.entity';
import { Payment } from './main/entities/payment.entity';
import { Notification } from './main/entities/notification.entity';
import { Attribute } from './main/entities/attribute.entity';
import { AttributeValue } from './main/entities/attribute-value.entity';
import { ProductAttribute } from './main/entities/product-attribute.entity';
import { ProductVariant } from './main/entities/product-variant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Role,
          UserSession,
          Category,
          Subcategory,
          Brand,
          BrandCategory,
          Product,
          ProductFeature,
          Feature,
          Vendor,
          ProductRating,
          Order,
          OrderTracking,
          Review,
          ReviewResponse,
          ReviewHelpfulVote,
          ReviewReport,
          Inventory,
          Contact,
          Static,
          Faq,
          ShippingAddress,
          ShippingMethod,
          ShippingZone,
          Shipment,
          ShippingTracking,
          Payment,
          Notification,
          Attribute,
          AttributeValue,
          ProductAttribute,
          ProductVariant,
        ],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthenticationModule,
    UserSessionModule,
    CategoryModule,
    SubcategoryModule,
    BrandModule,
    ProductModule,
    FeatureModule,
    VendorModule,
    BrandCategoryModule,
    LoggerModule,
    AttributeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
