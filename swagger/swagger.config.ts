import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
const fs = require('fs');

export const setupSwagger = (
  app: INestApplication,
  globalPrefix: string,
): void => {
  const options = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Welcome to Ecommerce')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  sortSwaggerTags(document);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
};

function sortSwaggerTags(document: OpenAPIObject): void {
  const tagOrder = 
  ['Authentication',
    'User Session',
    'Role',
    'User',
    'Features',
    'Product',
    'Carts',
    'categories',
    'subcategories',
    'products',
    'Wishlists',
    'Brands',
    'Brand Categories',
    'Vendors',
    'orders',
    'Order Tracking',
    'contacts',
    'static-pages',
    'Faqs',
    'shipping',
    'payments',
    'inventory',
    'Notifications',
    'Product Ratings',
    'Attributes',
    ];
  const taggedPaths: Record<string, Record<string, any>> = {};

  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const operation in pathItem) {
      if (pathItem.hasOwnProperty(operation)) {
        const operationItem = pathItem[operation];
        const tags = operationItem.tags || [];
        for (const tag of tags) {
          if (!taggedPaths[tag]) {
            taggedPaths[tag] = {};
          }
          taggedPaths[tag][path] = pathItem;
          break;
        }
      }
    }
  }

  const sortedPaths: Record<string, any> = {};
  for (const tag of tagOrder) {
    if (taggedPaths[tag]) {
      const pathsInTag = Object.keys(taggedPaths[tag]).sort();
      for (const path of pathsInTag) {
        sortedPaths[path] = taggedPaths[tag][path];
      }
    }
  }
  document.paths = sortedPaths;
}
