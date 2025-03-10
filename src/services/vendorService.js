// Vendor Service
// Handles vendor data storage, retrieval, and manipulation

// Initial sample vendors data
const initialVendors = [
  {
    id: 'apple',
    name: 'Apple',
    contact: 'support@apple.com',
    phone: '1-800-275-2273'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    contact: 'support@samsung.com',
    phone: '1-800-726-7864'
  },
  {
    id: 'dell',
    name: 'Dell',
    contact: 'support@dell.com',
    phone: '1-800-624-9896'
  },
  {
    id: 'sony',
    name: 'Sony',
    contact: 'support@sony.com',
    phone: '1-800-222-7669'
  },
  {
    id: 'logitech',
    name: 'Logitech',
    contact: 'support@logitech.com',
    phone: '1-646-454-3200'
  },
  {
    id: 'nintendo',
    name: 'Nintendo',
    contact: 'support@nintendo.com',
    phone: '1-800-255-3700'
  }
];

// Initialize vendors from localStorage or use initial data
const initializeVendors = () => {
  const storedVendors = localStorage.getItem('vendors');
  if (storedVendors) {
    return JSON.parse(storedVendors);
  }
  
  // If no stored vendors, save initial data and return it
  localStorage.setItem('vendors', JSON.stringify(initialVendors));
  return initialVendors;
};

// Get all vendors
export const getVendors = () => {
  return initializeVendors();
};

// Get vendor by ID
export const getVendorById = (id) => {
  const vendors = getVendors();
  return vendors.find(vendor => vendor.id === id);
};

// Add new vendor
export const addVendor = (vendorData) => {
  const vendors = getVendors();
  
  // Generate a simple ID from the name
  const newId = vendorData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Create new vendor object
  const newVendor = {
    id: newId,
    ...vendorData
  };
  
  // Add to vendors array
  vendors.push(newVendor);
  
  // Save to localStorage
  localStorage.setItem('vendors', JSON.stringify(vendors));
  
  return newVendor;
};

// Update existing vendor
export const updateVendor = (id, vendorData) => {
  const vendors = getVendors();
  
  // Find vendor index
  const vendorIndex = vendors.findIndex(vendor => vendor.id === id);
  
  if (vendorIndex === -1) {
    throw new Error(`Vendor with ID ${id} not found`);
  }
  
  // Update vendor
  const updatedVendor = {
    ...vendors[vendorIndex],
    ...vendorData
  };
  
  vendors[vendorIndex] = updatedVendor;
  
  // Save to localStorage
  localStorage.setItem('vendors', JSON.stringify(vendors));
  
  return updatedVendor;
};

// Delete vendor
export const deleteVendor = (id) => {
  const vendors = getVendors();
  
  // Filter out the vendor to delete
  const updatedVendors = vendors.filter(vendor => vendor.id !== id);
  
  // Save to localStorage
  localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  
  return true;
};

// Get vendor count
export const getVendorCount = () => {
  const vendors = getVendors();
  return vendors.length;
};
