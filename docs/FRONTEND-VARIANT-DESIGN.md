# Frontend Design for Product Variants

This document provides comprehensive frontend design patterns and implementation examples for handling product variants in your e-commerce application.

## 🎯 **Variant Selection UI Patterns**

### **1. Attribute-Based Variant Selection**

The most common and user-friendly approach is to show attribute combinations as selectable options:

```jsx
// React Component Example
const ProductVariantSelector = ({ product, onVariantSelect }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Group attributes by type (Color, Size, etc.)
  const attributeGroups = product.attributes.reduce((groups, attr) => {
    if (!groups[attr.attribute.name]) {
      groups[attr.attribute.name] = [];
    }
    groups[attr.attribute.name].push(attr);
    return groups;
  }, {});

  const handleAttributeChange = (attributeName, attributeValue) => {
    const newSelection = { ...selectedAttributes, [attributeName]: attributeValue };
    setSelectedAttributes(newSelection);
    
    // Find matching variant
    const matchingVariant = findMatchingVariant(product.variants, newSelection);
    setSelectedVariant(matchingVariant);
    onVariantSelect(matchingVariant);
  };

  return (
    <div className="variant-selector">
      {Object.entries(attributeGroups).map(([attrName, attrValues]) => (
        <div key={attrName} className="attribute-group">
          <label className="attribute-label">{attrName}</label>
          <div className="attribute-options">
            {attrValues.map((attr) => (
              <button
                key={attr.attributeValue.id}
                className={`attribute-option ${
                  selectedAttributes[attrName] === attr.attributeValue.value ? 'selected' : ''
                }`}
                onClick={() => handleAttributeChange(attrName, attr.attributeValue.value)}
              >
                {attr.attributeValue.displayName || attr.attributeValue.value}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {selectedVariant && (
        <div className="variant-info">
          <div className="variant-price">${selectedVariant.price}</div>
          <div className="variant-stock">
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      )}
    </div>
  );
};
```

### **2. Visual Variant Grid**

For products with visual differences (like colors), show a grid of variant images:

```jsx
const VariantImageGrid = ({ variants, onVariantSelect }) => {
  return (
    <div className="variant-image-grid">
      {variants.map((variant) => (
        <div
          key={variant.id}
          className="variant-image-item"
          onClick={() => onVariantSelect(variant)}
        >
          <img
            src={variant.variantImages[0] || variant.product.mainImage}
            alt={`${variant.name} - ${variant.sku}`}
            className="variant-thumbnail"
          />
          <div className="variant-details">
            <span className="variant-name">{variant.name}</span>
            <span className="variant-price">${variant.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### **3. Advanced Variant Matrix**

For complex products with multiple attributes, use a matrix layout:

```jsx
const VariantMatrix = ({ product }) => {
  const { variants, attributes } = product;
  
  // Create attribute combinations matrix
  const createVariantMatrix = () => {
    const attributeTypes = [...new Set(attributes.map(attr => attr.attribute.name))];
    const attributeValues = attributeTypes.map(type => 
      attributes.filter(attr => attr.attribute.name === type)
    );
    
    // Generate all possible combinations
    const combinations = generateCombinations(attributeValues);
    
    return combinations.map(combo => {
      const matchingVariant = variants.find(variant => 
        combo.every((attr, index) => 
          variant.attributes.some(vAttr => 
            vAttr.attribute.name === attributeTypes[index] && 
            vAttr.attributeValue.value === attr.attributeValue.value
          )
        )
      );
      
      return { combination: combo, variant: matchingVariant };
    });
  };

  return (
    <div className="variant-matrix">
      <table>
        <thead>
          <tr>
            {attributes.map(attr => (
              <th key={attr.attribute.id}>{attr.attribute.name}</th>
            ))}
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {createVariantMatrix().map((row, index) => (
            <tr key={index}>
              {row.combination.map((attr, attrIndex) => (
                <td key={attrIndex}>{attr.attributeValue.displayName}</td>
              ))}
              <td>{row.variant ? `$${row.variant.price}` : '-'}</td>
              <td>{row.variant ? row.variant.stock : '-'}</td>
              <td>
                {row.variant ? (
                  <button 
                    className="select-variant-btn"
                    onClick={() => onVariantSelect(row.variant)}
                  >
                    Select
                  </button>
                ) : (
                  <span className="unavailable">Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 🎨 **CSS Styling Examples**

### **1. Basic Variant Selector Styling**

```css
.variant-selector {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.attribute-group {
  margin-bottom: 20px;
}

.attribute-label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attribute-option {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
}

.attribute-option:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.attribute-option.selected {
  border-color: #007bff;
  background: #007bff;
  color: #fff;
}

.attribute-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}
```

### **2. Variant Image Grid Styling**

```css
.variant-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.variant-image-item {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.variant-image-item:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.variant-image-item.selected {
  border-color: #007bff;
  background: #f8f9fa;
}

.variant-thumbnail {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.variant-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.variant-name {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.variant-price {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}
```

### **3. Variant Matrix Styling**

```css
.variant-matrix {
  margin: 20px 0;
  overflow-x: auto;
}

.variant-matrix table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.variant-matrix th {
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.variant-matrix td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.variant-matrix tr:hover {
  background: #f8f9fa;
}

.select-variant-btn {
  padding: 6px 12px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
}

.select-variant-btn:hover {
  background: #0056b3;
}

.unavailable {
  color: #999;
  font-style: italic;
  font-size: 12px;
}
```

## 📱 **Mobile-First Responsive Design**

### **1. Responsive Variant Selector**

```css
/* Mobile First */
.variant-selector {
  padding: 15px;
  margin: 15px 0;
}

.attribute-options {
  flex-direction: column;
  gap: 8px;
}

.attribute-option {
  width: 100%;
  padding: 12px;
  font-size: 16px; /* Better touch target */
}

/* Tablet */
@media (min-width: 768px) {
  .variant-selector {
    padding: 20px;
  }
  
  .attribute-options {
    flex-direction: row;
    gap: 10px;
  }
  
  .attribute-option {
    width: auto;
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .variant-selector {
    padding: 25px;
  }
  
  .attribute-options {
    gap: 15px;
  }
}
```

### **2. Responsive Image Grid**

```css
/* Mobile */
.variant-image-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* Tablet */
@media (min-width: 768px) {
  .variant-image-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .variant-image-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
  }
}
```

## 🔧 **JavaScript Utility Functions**

### **1. Variant Matching Logic**

```javascript
// Find variant based on selected attributes
const findMatchingVariant = (variants, selectedAttributes) => {
  return variants.find(variant => {
    return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
      return variant.attributes.some(vAttr => 
        vAttr.attribute.name === attrName && 
        vAttr.attributeValue.value === attrValue
      );
    });
  });
};

// Check if attribute combination is available
const isAttributeCombinationAvailable = (variants, attributes) => {
  return variants.some(variant => {
    return attributes.every(attr => 
      variant.attributes.some(vAttr => 
        vAttr.attribute.name === attr.attribute.name && 
        vAttr.attributeValue.value === attr.attributeValue.value
      )
    );
  });
};

// Generate all possible attribute combinations
const generateCombinations = (attributeArrays) => {
  if (attributeArrays.length === 0) return [[]];
  
  const [firstArray, ...restArrays] = attributeArrays;
  const restCombinations = generateCombinations(restArrays);
  
  return firstArray.flatMap(item => 
    restCombinations.map(combination => [item, ...combination])
  );
};
```

### **2. Price and Stock Management**

```javascript
// Calculate price range for variants
const getPriceRange = (variants) => {
  if (!variants || variants.length === 0) return { min: 0, max: 0 };
  
  const prices = variants.map(v => v.price).filter(p => p !== null);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Check overall stock availability
const getOverallStock = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((total, variant) => total + (variant.stock || 0), 0);
};

// Get available attribute values
const getAvailableAttributeValues = (variants, attributeName) => {
  const availableValues = new Set();
  
  variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (attr.attribute.name === attributeName && variant.stock > 0) {
        availableValues.add(attr.attributeValue.value);
      }
    });
  });
  
  return Array.from(availableValues);
};
```

## 🎯 **User Experience Best Practices**

### **1. Visual Feedback**

- **Selected State**: Clearly show which variant is currently selected
- **Availability**: Disable or visually indicate unavailable combinations
- **Loading States**: Show loading indicators during variant changes
- **Error Handling**: Display helpful error messages for invalid selections

### **2. Accessibility**

```jsx
// Accessible variant selector
<button
  aria-label={`Select ${attr.attributeValue.displayName} ${attr.attribute.name}`}
  aria-pressed={selectedAttributes[attr.attribute.name] === attr.attributeValue.value}
  className={`attribute-option ${isSelected ? 'selected' : ''}`}
  onClick={() => handleAttributeChange(attr.attribute.name, attr.attributeValue.value)}
>
  {attr.attributeValue.displayName}
</button>
```

### **3. Performance Optimization**

```javascript
// Debounce variant selection to avoid excessive API calls
const debouncedVariantSelect = useCallback(
  debounce((variant) => {
    onVariantSelect(variant);
  }, 300),
  [onVariantSelect]
);

// Memoize expensive calculations
const variantMatrix = useMemo(() => createVariantMatrix(), [product.variants, product.attributes]);
```

## 📱 **Mobile-Specific Considerations**

### **1. Touch-Friendly Interface**

- **Large Touch Targets**: Minimum 44x44px for buttons
- **Swipe Gestures**: Allow swiping through variant images
- **Bottom Sheet**: Use bottom sheets for variant selection on mobile
- **Quick Actions**: Provide quick add-to-cart for selected variants

### **2. Mobile Variant Selector**

```jsx
const MobileVariantSelector = ({ product, onVariantSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        className="mobile-variant-trigger"
        onClick={() => setIsOpen(true)}
      >
        Select Options
      </button>
      
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Variant"
      >
        <VariantSelector
          product={product}
          onVariantSelect={(variant) => {
            onVariantSelect(variant);
            setIsOpen(false);
          }}
        />
      </BottomSheet>
    </>
  );
};
```

## 🔗 **Integration with Shopping Cart**

### **1. Add to Cart with Variants**

```javascript
const addVariantToCart = async (variant, quantity) => {
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: variant.productId,
        variantId: variant.id,
        quantity,
        attributes: variant.attributes
      })
    });
    
    if (response.ok) {
      // Update cart state
      updateCart();
      showSuccessMessage('Added to cart successfully!');
    }
  } catch (error) {
    showErrorMessage('Failed to add to cart');
  }
};
```

### **2. Cart Item Display**

```jsx
const CartItemVariant = ({ item }) => (
  <div className="cart-item-variant">
    <div className="variant-attributes">
      {item.attributes.map(attr => (
        <span key={attr.id} className="variant-attribute">
          {attr.attribute.name}: {attr.attributeValue.displayName}
        </span>
      ))}
    </div>
    <div className="variant-price">${item.variant.price}</div>
  </div>
);
```

This comprehensive frontend design system provides a solid foundation for building intuitive and user-friendly product variant selection interfaces! 🎉
