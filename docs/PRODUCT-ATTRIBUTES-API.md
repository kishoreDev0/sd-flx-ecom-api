# Product-Attribute API Integration

This document explains how to use the updated Product API that integrates with the attribute system.

## 🚀 **New API Endpoints**

### **1. Create Product with Attributes**

```http
POST /api/v1/products
user-id: <your-user-id>
access-token: <your-access-token>
Content-Type: application/json

{
  "name": "Nike Air Max 90",
  "description": "Comfortable running shoes with excellent cushioning",
  "price": 129.99,
  "totalNoOfStock": 100,
  "noOfStock": 100,
  "categoryId": 1,
  "brandId": 1,
  "imagesPath": [
    "https://example.com/nike-air-max-90-black.jpg",
    "https://example.com/nike-air-max-90-black-side.jpg"
  ],
  "attributes": [
    {
      "attributeId": 1,    // Color attribute
      "attributeValueId": 2  // Black color value
    },
    {
      "attributeId": 2,    // Size attribute
      "attributeValueId": 4  // Large size value
    },
    {
      "attributeId": 3,    // Material attribute
      "attributeValueId": 1  // Leather material value
    }
  ]
}
```

### **2. Add Attributes to Existing Product**

```http
POST /api/v1/products/{productId}/attributes
user-id: <your-user-id>
access-token: <your-access-token>
Content-Type: application/json

[
  {
    "attributeId": 4,    // Weight attribute
    "attributeValueId": 1,  // 500g weight value
    "customValue": "500g"   // Optional custom value
  },
  {
    "attributeId": 5,    // Waterproof attribute
    "attributeValueId": 1   // True value
  }
]
```

### **3. Get Product with Attributes**

```http
GET /api/v1/products/{productId}/with-attributes
```

**Response:**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "name": "Nike Air Max 90",
    "description": "Comfortable running shoes with excellent cushioning",
    "price": 129.99,
    "category": { "id": 1, "categoryName": "Shoes" },
    "brand": { "id": 1, "brandName": "Nike" },
    "productAttributes": [
      {
        "id": 1,
        "attribute": {
          "id": 1,
          "name": "Color",
          "type": "select"
        },
        "attributeValue": {
          "id": 2,
          "value": "Black",
          "displayName": "Space Black"
        }
      },
      {
        "id": 2,
        "attribute": {
          "id": 2,
          "name": "Size",
          "type": "select"
        },
        "attributeValue": {
          "id": 4,
          "value": "L",
          "displayName": "Large"
        }
      }
    ]
  }
}
```

### **4. Filter Products by Attribute**

```http
GET /api/v1/products/by-attribute/{attributeId}/{valueId}
```

**Example:** Get all black shoes
```http
GET /api/v1/products/by-attribute/1/2
```
Where:
- `1` = Color attribute ID
- `2` = Black color value ID

## 📊 **Complete Product Creation Example**

### **Step 1: Create Attributes First**

Before creating products, you need to create the attributes and their values:

```http
POST /api/attributes
user-id: 1
access-token: your-token

{
  "name": "Color",
  "description": "Product color options",
  "type": "select",
  "isRequired": true,
  "sortOrder": 1
}
```

```http
POST /api/attributes/values
user-id: 1
access-token: your-token

{
  "value": "Black",
  "displayName": "Space Black",
  "description": "Deep space black color",
  "attributeId": 1,
  "sortOrder": 1
}
```

### **Step 2: Create Product with Attributes**

```http
POST /api/v1/products
user-id: 1
access-token: your-token

{
  "name": "Premium Cotton T-Shirt",
  "description": "High-quality cotton t-shirt with perfect fit",
  "price": 29.99,
  "totalNoOfStock": 200,
  "noOfStock": 200,
  "categoryId": 2,
  "brandId": 3,
  "imagesPath": [
    "https://example.com/tshirt-black-front.jpg",
    "https://example.com/tshirt-black-back.jpg"
  ],
  "attributes": [
    {
      "attributeId": 1,    // Color: Black
      "attributeValueId": 2
    },
    {
      "attributeId": 2,    // Size: Large
      "attributeValueId": 4
    },
    {
      "attributeId": 3,    // Material: Cotton
      "attributeValueId": 1
    }
  ]
}
```

## 🔍 **Advanced Filtering Examples**

### **Filter by Multiple Attributes**

To find products with specific attribute combinations, you can chain multiple attribute filters:

```typescript
// Find black shoes in size 10
const blackSize10Shoes = await productService.getProductsByAttribute(1, 2); // Color: Black
const blackSize10Shoes = await productService.getProductsByAttribute(2, 4); // Size: 10

// You can implement more complex filtering in your service
async findProductsByMultipleAttributes(filters: AttributeFilter[]) {
  const query = this.productRepo
    .createQueryBuilder('product')
    .leftJoin('product.productAttributes', 'pa');

  filters.forEach((filter, index) => {
    query.andWhere(
      `(pa.attributeId = :attrId${index} AND pa.attributeValueId = :valueId${index})`,
      { [`attrId${index}`]: filter.attributeId, [`valueId${index}`]: filter.valueId }
    );
  });

  return query.getMany();
}
```

## 🛠️ **Implementation Details**

### **Database Schema**

The system creates these relationships:

```sql
-- Products table
def_product (id, name, price, category_id, ...)

-- Product attributes mapping
def_product_attribute (
  id, 
  product_id, 
  attribute_id, 
  attribute_value_id, 
  custom_value,
  created_by,
  updated_by,
  created_at,
  updated_at
)
```

### **Entity Relationships**

```typescript
// Product entity
@Entity('def_product')
export class Product {
  // ... other fields
  
  @OneToMany(() => ProductAttribute, (productAttr) => productAttr.product)
  productAttributes: ProductAttribute[];
}

// ProductAttribute entity
@Entity('def_product_attribute')
export class ProductAttribute {
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Attribute, { onDelete: 'CASCADE' })
  attribute: Attribute;

  @ManyToOne(() => AttributeValue, { onDelete: 'CASCADE' })
  attributeValue: AttributeValue;
}
```

## 🎯 **Best Practices**

### **1. Attribute Naming**
- Use clear, descriptive names (e.g., "Color" instead of "Col")
- Keep attribute names consistent across your catalog
- Use proper capitalization and spacing

### **2. Attribute Values**
- Provide meaningful display names for technical values
- Use consistent value formats within each attribute
- Include descriptions for complex attributes

### **3. Product Creation**
- Always validate attribute IDs before creating products
- Use the `isRequired` flag for mandatory attributes
- Consider attribute dependencies (e.g., size depends on category)

### **4. Performance**
- Use database indexes on frequently queried attributes
- Implement caching for attribute lookups
- Consider pagination for large attribute-based queries

## 🚨 **Error Handling**

The API includes comprehensive error handling:

```typescript
// Invalid attribute ID
{
  "success": false,
  "message": "Attribute with ID 999 not found",
  "statusCode": 404
}

// Invalid attribute value
{
  "success": false,
  "message": "Value 'InvalidValue' already exists for attribute 'Color'",
  "statusCode": 400
}

// Missing required attributes
{
  "success": false,
  "message": "Required attributes missing",
  "statusCode": 400
}
```

## 🔗 **Next Steps**

1. **Test the API**: Create products with different attribute combinations
2. **Build Frontend**: Create attribute selection interfaces
3. **Add Search**: Implement attribute-based product search
4. **Create Variants**: Build product variant management
5. **Add Analytics**: Track attribute usage and popularity

## 📝 **Example API Calls**

### **Create a Complete Product Catalog**

```bash
# 1. Create Color attribute
curl -X POST http://localhost:3008/api/attributes \
  -H "user-id: 1" \
  -H "access-token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Color",
    "type": "select",
    "isRequired": true
  }'

# 2. Create color values
curl -X POST http://localhost:3008/api/attributes/values \
  -H "user-id: 1" \
  -H "access-token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "Black",
    "displayName": "Space Black",
    "attributeId": 1
  }'

# 3. Create product with attributes
curl -X POST http://localhost:3008/api/v1/products \
  -H "user-id: 1" \
  -H "access-token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Max 90",
    "description": "Premium running shoes",
    "price": 129.99,
    "totalNoOfStock": 100,
    "noOfStock": 100,
    "categoryId": 1,
    "attributes": [
      {"attributeId": 1, "attributeValueId": 1}
    ]
  }'
```

This API integration provides a powerful foundation for building flexible, attribute-driven product catalogs!
