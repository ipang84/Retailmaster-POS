// Product Service
// Handles product data storage, retrieval, and manipulation

// Initial sample products data
const initialProducts = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    description: 'Apple iPhone 13 Pro 128GB',
    price: 999.99,
    cost: 750.00,
    inventory: 15,
    status: 'active',
    category: 'smartphones',
    vendor: 'apple',
    sku: 'IP13P-128',
    barcode: '123456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['apple', 'smartphone', 'ios'],
    minStock: 5
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22',
    description: 'Samsung Galaxy S22 256GB',
    price: 899.99,
    cost: 650.00,
    inventory: 20,
    status: 'active',
    category: 'smartphones',
    vendor: 'samsung',
    sku: 'SGS22-256',
    barcode: '223456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['samsung', 'smartphone', 'android'],
    minStock: 8
  },
  {
    id: '3',
    name: 'MacBook Pro 14"',
    description: 'Apple MacBook Pro 14" M1 Pro',
    price: 1999.99,
    cost: 1600.00,
    inventory: 8,
    status: 'active',
    category: 'laptops',
    vendor: 'apple',
    sku: 'MBP14-M1P',
    barcode: '323456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['apple', 'laptop', 'macbook'],
    minStock: 3
  },
  {
    id: '4',
    name: 'AirPods Pro',
    description: 'Apple AirPods Pro with Noise Cancellation',
    price: 249.99,
    cost: 180.00,
    inventory: 30,
    status: 'active',
    category: 'audio',
    vendor: 'apple',
    sku: 'APP-2',
    barcode: '423456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['apple', 'audio', 'wireless'],
    minStock: 10
  },
  {
    id: '5',
    name: 'Dell XPS 15',
    description: 'Dell XPS 15 Laptop with 4K Display',
    price: 1799.99,
    cost: 1400.00,
    inventory: 5,
    status: 'active',
    category: 'laptops',
    vendor: 'dell',
    sku: 'DXPS15-4K',
    barcode: '523456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['dell', 'laptop', 'windows'],
    minStock: 2
  },
  {
    id: '6',
    name: 'iPad Air',
    description: 'Apple iPad Air 64GB',
    price: 599.99,
    cost: 450.00,
    inventory: 12,
    status: 'active',
    category: 'tablets',
    vendor: 'apple',
    sku: 'IPA-64',
    barcode: '623456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['apple', 'tablet', 'ios'],
    minStock: 5
  },
  {
    id: '7',
    name: 'Sony WH-1000XM4',
    description: 'Sony Noise Cancelling Headphones',
    price: 349.99,
    cost: 250.00,
    inventory: 18,
    status: 'active',
    category: 'audio',
    vendor: 'sony',
    sku: 'SWH-1000XM4',
    barcode: '723456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['sony', 'audio', 'headphones'],
    minStock: 6
  },
  {
    id: '8',
    name: 'Samsung 55" QLED TV',
    description: 'Samsung 55" QLED 4K Smart TV',
    price: 1299.99,
    cost: 950.00,
    inventory: 7,
    status: 'active',
    category: 'tvs',
    vendor: 'samsung',
    sku: 'STV-55QLED',
    barcode: '823456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['samsung', 'tv', 'qled'],
    minStock: 2
  },
  {
    id: '9',
    name: 'Logitech MX Master 3',
    description: 'Logitech MX Master 3 Wireless Mouse',
    price: 99.99,
    cost: 65.00,
    inventory: 25,
    status: 'active',
    category: 'accessories',
    vendor: 'logitech',
    sku: 'LMX-M3',
    barcode: '923456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['logitech', 'mouse', 'wireless'],
    minStock: 8
  },
  {
    id: '10',
    name: 'Nintendo Switch',
    description: 'Nintendo Switch Gaming Console',
    price: 299.99,
    cost: 220.00,
    inventory: 10,
    status: 'inactive',
    category: 'gaming',
    vendor: 'nintendo',
    sku: 'NS-OLED',
    barcode: '023456789012',
    image: 'https://via.placeholder.com/40',
    tags: ['nintendo', 'gaming', 'console'],
    minStock: 5
  }
];

// Initialize products from localStorage or use initial data
const initializeProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  
  // If no stored products, save initial data and return it
  localStorage.setItem('products', JSON.stringify(initialProducts));
  return initialProducts;
};

// Get all products
export const getProducts = () => {
  return initializeProducts();
};

// Get product by ID
export const getProductById = (id) => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

// Add new product
export const addProduct = (productData) => {
  const products = getProducts();
  
  // Generate a new ID (simple implementation)
  const newId = Date.now().toString();
  
  // Create new product object with default minStock if not provided
  const newProduct = {
    id: newId,
    minStock: 5, // Default minimum stock level
    ...productData
  };
  
  // Add to products array
  products.push(newProduct);
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  return newProduct;
};

// Update existing product
export const updateProduct = (id, productData) => {
  const products = getProducts();
  
  // Find product index
  const productIndex = products.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    console.error(`Product with ID ${id} not found`);
    return null;
  }
  
  // Update product
  const updatedProduct = {
    ...products[productIndex],
    ...productData
  };
  
  products[productIndex] = updatedProduct;
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  return updatedProduct;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts();
  
  // Filter out the product to delete
  const updatedProducts = products.filter(product => product.id !== id);
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return true;
};

// Filter products based on criteria
export const filterProducts = (filters = {}) => {
  let products = getProducts();
  
  // Filter by status
  if (filters.status) {
    products = products.filter(product => product.status === filters.status);
  }
  
  // Filter by category
  if (filters.category) {
    products = products.filter(product => product.category === filters.category);
  }
  
  // Filter by vendor
  if (filters.vendor) {
    products = products.filter(product => product.vendor === filters.vendor);
  }
  
  // Search by name, vendor, SKU, or barcode
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase().trim();
    products = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.vendor.toLowerCase().includes(searchTerm) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchTerm))
    );
  }
  
  return products;
};

// Get product count by status
export const getProductCountByStatus = () => {
  const products = getProducts();
  
  return {
    total: products.length,
    active: products.filter(product => product.status === 'active').length,
    inactive: products.filter(product => product.status === 'inactive').length,
    draft: products.filter(product => product.status === 'draft').length
  };
};

// Get low stock products (inventory below threshold)
export const getLowStockProducts = () => {
  const products = getProducts();
  
  return products.filter(product => 
    product.inventory !== null && 
    product.inventory <= product.minStock &&
    product.status === 'active'
  );
};

// Calculate total inventory value
export const calculateInventoryValue = () => {
  const products = getProducts();
  
  return products.reduce((total, product) => {
    if (product.inventory && product.cost) {
      return total + (product.inventory * product.cost);
    }
    return total;
  }, 0);
};

// Update inventory stock - FIXED VERSION
export const updateInventoryStock = (id, change) => {
  console.log(`Updating inventory for product ${id} by ${change} units`);
  
  // Get fresh products data
  const products = getProducts();
  
  // Find product by ID
  const productIndex = products.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    console.error(`Product with ID ${id} not found`);
    return false;
  }
  
  const product = products[productIndex];
  
  if (product.inventory === null || product.inventory === undefined) {
    console.error(`Product ${id} (${product.name}) has no inventory tracking`);
    return false;
  }
  
  console.log(`Current inventory for ${product.name}: ${product.inventory}`);
  const newStock = product.inventory + change;
  
  // Don't allow negative stock
  if (newStock < 0) {
    console.error(`Cannot update inventory: would result in negative stock (${newStock})`);
    return false;
  }
  
  console.log(`Updating ${product.name} inventory to ${newStock}`);
  
  // Update the product directly in the products array
  products[productIndex] = {
    ...product,
    inventory: newStock
  };
  
  // Save the entire products array back to localStorage
  try {
    localStorage.setItem('products', JSON.stringify(products));
    console.log(`Successfully updated inventory for ${product.name} to ${newStock}`);
    return true;
  } catch (error) {
    console.error(`Error saving products to localStorage:`, error);
    return false;
  }
};

// Bulk update inventory stock
export const bulkUpdateInventory = (updates) => {
  let success = true;
  
  // Get all products once to avoid multiple localStorage reads
  const products = getProducts();
  const updatedProducts = [...products];
  let hasChanges = false;
  
  for (const update of updates) {
    const productIndex = updatedProducts.findIndex(product => product.id === update.id);
    
    if (productIndex === -1) {
      console.error(`Product with ID ${update.id} not found`);
      success = false;
      continue;
    }
    
    const product = updatedProducts[productIndex];
    
    if (product.inventory === null || product.inventory === undefined) {
      console.error(`Product ${update.id} (${product.name}) has no inventory tracking`);
      success = false;
      continue;
    }
    
    const newStock = product.inventory + update.change;
    
    // Don't allow negative stock
    if (newStock < 0) {
      console.error(`Cannot update inventory for ${product.name}: would result in negative stock (${newStock})`);
      success = false;
      continue;
    }
    
    // Update the product in our local copy
    updatedProducts[productIndex] = {
      ...product,
      inventory: newStock
    };
    
    hasChanges = true;
    console.log(`Updated inventory for ${product.name} to ${newStock}`);
  }
  
  // Save all changes at once if any were made
  if (hasChanges) {
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      console.log('Bulk inventory update completed successfully');
    } catch (error) {
      console.error('Error saving bulk inventory updates:', error);
      success = false;
    }
  }
  
  return success;
};
