// Example script to create product attributes
// This demonstrates how to use the attribute API endpoints

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000'; // Adjust to your API URL
const AUTH_TOKEN = 'your-access-token-here'; // Replace with actual access token

const headers = {
  'user-id': '1', // Replace with actual user ID
  'access-token': AUTH_TOKEN, // Replace with actual access token
  'Content-Type': 'application/json'
};

async function createAttributes() {
  try {
    console.log('🚀 Starting to create product attributes...\n');

    // 1. Create Color Attribute
    console.log('📝 Creating Color attribute...');
    const colorAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Color',
      description: 'Product color options',
      type: 'select',
      isRequired: true,
      sortOrder: 1
    }, { headers });

    console.log(`✅ Color attribute created with ID: ${colorAttribute.data.id}\n`);

    // 2. Create Color Values
    console.log('🎨 Creating color values...');
    const colorValues = [
      { value: 'Red', displayName: 'Space Black', description: 'Deep space black color', sortOrder: 1 },
      { value: 'Blue', displayName: 'Pacific Blue', description: 'Beautiful pacific blue', sortOrder: 2 },
      { value: 'Green', displayName: 'Forest Green', description: 'Natural forest green', sortOrder: 3 },
      { value: 'White', displayName: 'Pearl White', description: 'Elegant pearl white', sortOrder: 4 }
    ];

    for (const colorValue of colorValues) {
      await axios.post(`${API_BASE_URL}/attributes/values`, {
        ...colorValue,
        attributeId: colorAttribute.data.id
      }, { headers });
      console.log(`✅ Created color value: ${colorValue.displayName}`);
    }
    console.log('');

    // 3. Create Size Attribute
    console.log('📏 Creating Size attribute...');
    const sizeAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Size',
      description: 'Product size options',
      type: 'select',
      isRequired: true,
      sortOrder: 2
    }, { headers });

    console.log(`✅ Size attribute created with ID: ${sizeAttribute.data.id}\n`);

    // 4. Create Size Values
    console.log('📐 Creating size values...');
    const sizeValues = [
      { value: 'XS', displayName: 'Extra Small', description: 'Extra small size', sortOrder: 1 },
      { value: 'S', displayName: 'Small', description: 'Small size', sortOrder: 2 },
      { value: 'M', displayName: 'Medium', description: 'Medium size', sortOrder: 3 },
      { value: 'L', displayName: 'Large', description: 'Large size', sortOrder: 4 },
      { value: 'XL', displayName: 'Extra Large', description: 'Extra large size', sortOrder: 5 },
      { value: 'XXL', displayName: '2XL', description: '2XL size', sortOrder: 6 }
    ];

    for (const sizeValue of sizeValues) {
      await axios.post(`${API_BASE_URL}/attributes/values`, {
        ...sizeValue,
        attributeId: sizeAttribute.data.id
      }, { headers });
      console.log(`✅ Created size value: ${sizeValue.displayName}`);
    }
    console.log('');

    // 5. Create Material Attribute
    console.log('🧵 Creating Material attribute...');
    const materialAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Material',
      description: 'Product material options',
      type: 'select',
      isRequired: false,
      sortOrder: 3
    }, { headers });

    console.log(`✅ Material attribute created with ID: ${materialAttribute.data.id}\n`);

    // 6. Create Material Values
    console.log('🔧 Creating material values...');
    const materialValues = [
      { value: 'Cotton', displayName: '100% Cotton', description: 'Pure cotton material', sortOrder: 1 },
      { value: 'Polyester', displayName: 'Polyester Blend', description: 'Durable polyester blend', sortOrder: 2 },
      { value: 'Wool', displayName: 'Natural Wool', description: 'Natural wool material', sortOrder: 3 },
      { value: 'Silk', displayName: 'Pure Silk', description: 'Luxurious silk material', sortOrder: 4 }
    ];

    for (const materialValue of materialValues) {
      await axios.post(`${API_BASE_URL}/attributes/values`, {
        ...materialValue,
        attributeId: materialAttribute.data.id
      }, { headers });
      console.log(`✅ Created material value: ${materialValue.displayName}`);
    }
    console.log('');

    // 7. Create Brand Attribute
    console.log('🏷️ Creating Brand attribute...');
    const brandAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Brand',
      description: 'Product brand information',
      type: 'select',
      isRequired: true,
      sortOrder: 4
    }, { headers });

    console.log(`✅ Brand attribute created with ID: ${brandAttribute.data.id}\n`);

    // 8. Create Brand Values
    console.log('🏭 Creating brand values...');
    const brandValues = [
      { value: 'Nike', displayName: 'Nike', description: 'Just Do It', sortOrder: 1 },
      { value: 'Adidas', displayName: 'Adidas', description: 'Impossible Is Nothing', sortOrder: 2 },
      { value: 'Puma', displayName: 'Puma', description: 'Forever Faster', sortOrder: 3 },
      { value: 'Under Armour', displayName: 'Under Armour', description: 'The Only Way Is Through', sortOrder: 4 }
    ];

    for (const brandValue of brandValues) {
      await axios.post(`${API_BASE_URL}/attributes/values`, {
        ...brandValue,
        attributeId: brandAttribute.data.id
      }, { headers });
      console.log(`✅ Created brand value: ${brandValue.displayName}`);
    }
    console.log('');

    // 9. Create Weight Attribute (Number type)
    console.log('⚖️ Creating Weight attribute...');
    const weightAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Weight',
      description: 'Product weight in grams',
      type: 'number',
      isRequired: false,
      sortOrder: 5
    }, { headers });

    console.log(`✅ Weight attribute created with ID: ${weightAttribute.data.id}\n`);

    // 10. Create Waterproof Attribute (Boolean type)
    console.log('💧 Creating Waterproof attribute...');
    const waterproofAttribute = await axios.post(`${API_BASE_URL}/attributes`, {
      name: 'Waterproof',
      description: 'Whether the product is waterproof',
      type: 'boolean',
      isRequired: false,
      sortOrder: 6
    }, { headers });

    console.log(`✅ Waterproof attribute created with ID: ${waterproofAttribute.data.id}\n`);

    console.log('🎉 All attributes created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Color attribute: ${colorAttribute.data.id} (with ${colorValues.length} values)`);
    console.log(`- Size attribute: ${sizeAttribute.data.id} (with ${sizeValues.length} values)`);
    console.log(`- Material attribute: ${materialAttribute.data.id} (with ${materialValues.length} values)`);
    console.log(`- Brand attribute: ${brandAttribute.data.id} (with ${brandValues.length} values)`);
    console.log(`- Weight attribute: ${weightAttribute.data.id} (number type)`);
    console.log(`- Waterproof attribute: ${waterproofAttribute.data.id} (boolean type)`);

    console.log('\n🔗 You can now:');
    console.log('1. View all attributes: GET /attributes');
    console.log('2. View specific attribute: GET /attributes/{id}');
    console.log('3. View attribute values: GET /attributes/{id}/values');
    console.log('4. Use these attributes when creating products');

  } catch (error) {
    console.error('❌ Error creating attributes:', error.response?.data || error.message);
  }
}

// Run the script
createAttributes();
