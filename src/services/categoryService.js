// Category Service
// Handles category data storage, retrieval, and manipulation

// Initial sample categories data
const initialCategories = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Mobile phones with advanced features'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    description: 'Portable computers'
  },
  {
    id: 'tablets',
    name: 'Tablets',
    description: 'Touchscreen mobile computers'
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Headphones, earbuds, and speakers'
  },
  {
    id: 'tvs',
    name: 'TVs',
    description: 'Television sets and displays'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Computer and mobile accessories'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gaming consoles and accessories'
  }
];

// Initialize categories from localStorage or use initial data
const initializeCategories = () => {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  
  // If no stored categories, save initial data and return it
  localStorage.setItem('categories', JSON.stringify(initialCategories));
  return initialCategories;
};

// Get all categories
export const getCategories = () => {
  return initializeCategories();
};

// Get category by ID
export const getCategoryById = (id) => {
  const categories = getCategories();
  return categories.find(category => category.id === id);
};

// Add new category
export const addCategory = (categoryData) => {
  const categories = getCategories();
  
  // Generate a simple ID from the name
  const newId = categoryData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Create new category object
  const newCategory = {
    id: newId,
    ...categoryData
  };
  
  // Add to categories array
  categories.push(newCategory);
  
  // Save to localStorage
  localStorage.setItem('categories', JSON.stringify(categories));
  
  return newCategory;
};

// Update existing category
export const updateCategory = (id, categoryData) => {
  const categories = getCategories();
  
  // Find category index
  const categoryIndex = categories.findIndex(category => category.id === id);
  
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // Update category
  const updatedCategory = {
    ...categories[categoryIndex],
    ...categoryData
  };
  
  categories[categoryIndex] = updatedCategory;
  
  // Save to localStorage
  localStorage.setItem('categories', JSON.stringify(categories));
  
  return updatedCategory;
};

// Delete category
export const deleteCategory = (id) => {
  const categories = getCategories();
  
  // Filter out the category to delete
  const updatedCategories = categories.filter(category => category.id !== id);
  
  // Save to localStorage
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
  return true;
};

// Get category count
export const getCategoryCount = () => {
  const categories = getCategories();
  return categories.length;
};
