# Product Attributes API

This document describes the Product Attributes API endpoints for managing product attributes and their values in the e-commerce system.

## Overview

The Product Attributes API allows vendors to:
- Create and manage product attributes (e.g., Color, Size, Material)
- Create and manage attribute values (e.g., Red, Blue, Green for Color)
- Associate attributes with products
- Filter and search products by attributes

## Authentication

All endpoints require authentication using custom headers:
- `user-id`: The ID of the authenticated user
- `access-token`: The access token for the user

**Note**: This is different from standard JWT Bearer token authentication.

## Base URL

```
http://localhost:3008/api/v1
```

## Endpoints

### 1. Create Attribute

**POST** `/attributes`

Creates a new attribute without values.

**Request Body:**
```json
{
  "name": "Color",
  "description": "Product color variations",
  "type": "select",
  "isRequired": true,
  "isSearchable": true,
  "isFilterable": true,
  "sortOrder": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Color",
  "description": "Product color variations",
  "type": "select",
  "isRequired": true,
  "isSearchable": true,
  "isFilterable": true,
  "isActive": true,
  "sortOrder": 1,
  "values": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Create Attribute with Values (Bulk Creation)

**POST** `/attributes/bulk`

Creates a new attribute along with multiple values in a single request. This is the recommended approach for vendors.

**Request Body:**
```json
{
  "name": "Color",
  "description": "Product color variations",
  "type": "select",
  "isRequired": true,
  "isSearchable": true,
  "isFilterable": true,
  "sortOrder": 1,
  "values": [
    {
      "value": "Red",
      "displayName": "Crimson Red"
    },
    {
      "value": "Blue",
      "displayName": "Ocean Blue"
    },
    {
      "value": "Green",
      "displayName": "Forest Green"
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Color",
  "description": "Product color variations",
  "type": "select",
  "isRequired": true,
  "isSearchable": true,
  "isFilterable": true,
  "isActive": true,
  "sortOrder": 1,
  "values": [
    {
      "id": 1,
      "value": "Red",
      "displayName": "Crimson Red",
      "description": null,
      "sortOrder": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "value": "Blue",
      "displayName": "Ocean Blue",
      "description": null,
      "sortOrder": 2,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "value": "Green",
      "displayName": "Forest Green",
      "description": null,
      "sortOrder": 3,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Create Attribute Value

**POST** `/attributes/values`

Creates a new value for an existing attribute.

**Request Body:**
```json
{
  "attributeId": 1,
  "value": "Yellow",
  "displayName": "Sunshine Yellow",
  "description": "Bright yellow color",
  "sortOrder": 4
}
```

**Response:**
```json
{
  "id": 4,
  "attributeId": 1,
  "value": "Yellow",
  "displayName": "Sunshine Yellow",
  "description": "Bright yellow color",
  "sortOrder": 4,
  "isActive": true,
  "createdBy": 1,
  "updatedBy": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get All Attributes

**GET** `/attributes`

Retrieves all attributes with their values.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Color",
    "description": "Product color variations",
    "type": "select",
    "isRequired": true,
    "isSearchable": true,
    "isFilterable": true,
    "isActive": true,
    "sortOrder": 1,
    "values": [
      {
        "id": 1,
        "value": "Red",
        "displayName": "Crimson Red",
        "description": null,
        "sortOrder": 1,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 5. Get Attribute by ID

**GET** `/attributes/:id`

Retrieves a specific attribute by ID.

**Response:** Same as Create Attribute response.

### 6. Get Attribute Values

**GET** `/attributes/:id/values`

Retrieves all values for a specific attribute.

**Response:**
```json
[
  {
    "id": 1,
    "attributeId": 1,
    "value": "Red",
    "displayName": "Crimson Red",
    "description": null,
    "sortOrder": 1,
    "isActive": true,
    "createdBy": 1,
    "updatedBy": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 7. Update Attribute

**PUT** `/attributes/:id`

Updates an existing attribute.

**Request Body:** Same as Create Attribute (all fields optional).

**Response:** Same as Create Attribute response.

### 8. Delete Attribute

**DELETE** `/attributes/:id`

Deletes an attribute and all its associated values.

**Response:** 200 OK with success message.

### 9. Get Attributes by Category

**GET** `/attributes/category/:categoryId`

Retrieves attributes associated with a specific category.

**Response:** Same as Get All Attributes.

## Usage Examples

### Frontend Integration

```javascript
// Create attribute with values (recommended)
const createAttributeWithValues = async (attributeData) => {
  const response = await fetch('/api/v1/attributes/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user-id': '123',
      'access-token': 'your-access-token'
    },
    body: JSON.stringify(attributeData)
  });
  
  return response.json();
};

// Example usage
const attributeData = {
  name: 'Size',
  description: 'Product size variations',
  values: [
    { value: 'S', displayName: 'Small' },
    { value: 'M', displayName: 'Medium' },
    { value: 'L', displayName: 'Large' },
    { value: 'XL', displayName: 'Extra Large' }
  ]
};

const result = await createAttributeWithValues(attributeData);
```

### cURL Examples

```bash
# Create attribute with values
curl -X POST http://localhost:3008/api/v1/attributes/bulk \
  -H "Content-Type: application/json" \
  -H "user-id: 123" \
  -H "access-token: your-access-token" \
  -d '{
    "name": "Material",
    "description": "Product material type",
    "values": [
      {"value": "Cotton", "displayName": "100% Cotton"},
      {"value": "Polyester", "displayName": "Polyester Blend"},
      {"value": "Leather", "displayName": "Genuine Leather"}
    ]
  }'

# Get all attributes
curl -X GET http://localhost:3008/api/v1/attributes \
  -H "user-id: 123" \
  -H "access-token: your-access-token"
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input data, duplicate names, etc.
- **401 Unauthorized**: Missing or invalid authentication headers
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Attribute or value not found
- **500 Internal Server Error**: Server-side errors

**Example Error Response:**
```json
{
  "statusCode": 400,
  "message": "Attribute with name 'Color' already exists",
  "error": "Bad Request"
}
```

## Best Practices

1. **Use Bulk Creation**: Prefer `/attributes/bulk` endpoint for creating attributes with multiple values
2. **Meaningful Names**: Use clear, descriptive attribute names
3. **Consistent Values**: Maintain consistent value formats across similar attributes
4. **Display Names**: Provide user-friendly display names for attribute values
5. **Sort Order**: Use sort order to control the display sequence of attributes and values

## Database Schema

### Attributes Table
- `id`: Primary key
- `name`: Attribute name (unique)
- `description`: Attribute description
- `type`: Attribute type (text, number, select, etc.)
- `isRequired`: Whether attribute is required for products
- `isSearchable`: Whether attribute can be searched
- `isFilterable`: Whether attribute can be filtered
- `isActive`: Whether attribute is active
- `sortOrder`: Display order
- `createdBy`: User who created the attribute
- `updatedBy`: User who last updated the attribute
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Attribute Values Table
- `id`: Primary key
- `attributeId`: Foreign key to attributes table
- `value`: The actual value
- `displayName`: User-friendly display name
- `description`: Value description
- `sortOrder`: Display order within attribute
- `isActive`: Whether value is active
- `createdBy`: User who created the value
- `updatedBy`: User who last updated the value
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Integration with Products

Attributes are linked to products through the `ProductAttribute` entity, which creates a many-to-many relationship between products and attribute values. This allows products to have multiple attributes with specific values.

## Frontend Implementation

The frontend provides a user-friendly interface for:
- Creating attributes with comma-separated values
- Managing existing attributes and values
- Selecting attributes and values for products
- Creating product variants based on attribute combinations

This simplifies the vendor workflow and makes attribute management more intuitive.
