// Mock customer service for RetailMaster POS

// Initial customers data
let customers = [
  {
    id: 'cust-001',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    companyName: 'Smith Enterprises',
    address: '123 Main St',
    city: 'Anytown',
    state: 'NY',
    zipCode: '10001',
    customerType: 'business',
    notes: 'Regular customer',
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    id: 'cust-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '555-987-6543',
    companyName: '',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'CA',
    zipCode: '90210',
    customerType: 'individual',
    notes: 'Prefers email communication',
    createdAt: '2023-02-20T14:15:00Z'
  },
  {
    id: 'cust-003',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    email: 'mchen@example.com',
    phone: '555-555-5555',
    companyName: 'Chen Imports',
    address: '789 Pine St',
    city: 'Elsewhere',
    state: 'TX',
    zipCode: '75001',
    customerType: 'business',
    notes: 'Wholesale customer',
    createdAt: '2023-03-10T09:45:00Z'
  }
];

// Get all customers
export const getCustomers = () => {
  // Get customers from localStorage if available
  const storedCustomers = localStorage.getItem('customers');
  if (storedCustomers) {
    customers = JSON.parse(storedCustomers);
  }
  return [...customers];
};

// Get customer by ID
export const getCustomerById = (id) => {
  // Ensure we have the latest data
  getCustomers();
  return customers.find(customer => customer.id === id);
};

// Add a new customer
export const addCustomer = (customerData) => {
  // Ensure we have the latest data
  getCustomers();
  
  const newCustomer = {
    id: customerData.id || `cust-${Date.now()}`,
    ...customerData,
    createdAt: customerData.createdAt || new Date().toISOString()
  };
  
  customers.push(newCustomer);
  
  // Save to localStorage
  localStorage.setItem('customers', JSON.stringify(customers));
  
  return newCustomer;
};

// Update an existing customer
export const updateCustomer = (id, customerData) => {
  // Ensure we have the latest data
  getCustomers();
  
  const index = customers.findIndex(customer => customer.id === id);
  
  if (index !== -1) {
    customers[index] = {
      ...customers[index],
      ...customerData
    };
    
    // Save to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
    
    return customers[index];
  }
  
  return null;
};

// Delete a customer
export const deleteCustomer = (id) => {
  // Ensure we have the latest data
  getCustomers();
  
  const index = customers.findIndex(customer => customer.id === id);
  
  if (index !== -1) {
    const deletedCustomer = customers[index];
    customers = customers.filter(customer => customer.id !== id);
    
    // Save to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
    
    return deletedCustomer;
  }
  
  return null;
};

// Search customers
export const searchCustomers = (query) => {
  // Ensure we have the latest data
  getCustomers();
  
  const searchTerm = query.toLowerCase();
  
  return customers.filter(customer => 
    customer.fullName.toLowerCase().includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm))
  );
};
