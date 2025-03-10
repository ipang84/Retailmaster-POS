import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiDownload, FiUpload, FiSearch, FiFilter, FiPlus, FiMinus, FiEdit2, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getProducts, updateProduct, getProductById } from '../services/productService';
import { getCategoryById } from '../services/categoryService';
import { getVendorById } from '../services/vendorService';
import { addInventoryLog } from '../services/inventoryLogService';
import InventoryUpdateModal from '../components/InventoryUpdateModal';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: #0055cc;
    }
  }
  
  &.secondary {
    background-color: #f0f9ff;
    color: var(--primary-color);
    border: none;
    
    &:hover {
      background-color: #e0f0ff;
    }
  }
  
  &.success {
    background-color: #e6f7e6;
    color: #2e7d32;
    border: none;
    
    &:hover {
      background-color: #d6efd6;
    }
  }
  
  &.warning {
    background-color: #fff0e6;
    color: #ff6600;
    border: none;
    
    &:hover {
      background-color: #ffe0cc;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .search-input {
    position: relative;
    flex: 1;
    margin-right: 16px;
    
    input {
      width: 100%;
      padding: 10px 16px 10px 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
    
    svg {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
    color: #666;
  }
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const LowStockBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff0e6;
  border: 1px solid #ffcc99;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  
  .content {
    display: flex;
    align-items: center;
    
    svg {
      color: #ff6600;
      margin-right: 12px;
      font-size: 20px;
    }
    
    .message {
      font-weight: 500;
      color: #333;
      
      span {
        color: #ff6600;
        font-weight: 600;
      }
    }
  }
`;

const InventoryTable = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #f9f9f9;
      font-weight: 600;
      color: #333;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr.low-stock {
      background-color: #fff8f5;
      
      td {
        border-bottom: 1px solid #ffe0cc;
      }
    }
    
    .product-info {
      display: flex;
      align-items: center;
      
      .product-image {
        width: 32px;
        height: 32px;
        background-color: #f5f5f5;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        overflow: hidden;
        
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      
      .low-stock-indicator {
        display: flex;
        align-items: center;
        margin-left: 8px;
        color: #ff6600;
        font-size: 14px;
        
        svg {
          margin-right: 4px;
        }
      }
    }
    
    .stock-value {
      font-weight: 500;
      
      &.low-stock {
        color: #ff6600;
      }
    }
    
    .stock-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      
      input {
        width: 60px;
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
      }
      
      .add-button {
        padding: 4px 8px;
        background-color: #e6f7e6;
        color: #2e7d32;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          background-color: #d6efd6;
        }
      }
      
      .sub-button {
        padding: 4px 8px;
        background-color: #ffebee;
        color: #d32f2f;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:hover {
          background-color: #ffcdd2;
        }
      }
      
      .result {
        font-weight: 500;
        
        &.increase {
          color: #2e7d32;
        }
        
        &.decrease {
          color: #d32f2f;
        }
        
        &.unchanged {
          color: #333;
        }
      }
    }
    
    .actions-cell {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .action-button {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      
      &:hover {
        background-color: #f5f5f5;
        color: var(--primary-color);
      }
    }
  }
`;

const SuccessMessage = styled.div`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
`;

function Inventory() {
  const [editMode, setEditMode] = useState(false);
  const [stockValues, setStockValues] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  
  // State for inventory update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState({});
  
  // Load products on component mount
  useEffect(() => {
    loadInventoryData();
  }, []);
  
  const loadInventoryData = () => {
    // Get products from service
    const products = getProducts();
    
    // Map products to inventory items
    const items = products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      sku: product.sku || '-',
      category: product.category,
      cost: product.cost || 0,
      price: product.price || 0,
      currentStock: product.inventory !== null ? product.inventory : '-',
      minStock: product.minStock || 0,
      supplier: product.vendor,
      isLowStock: product.inventory !== null && product.inventory <= product.minStock
    }));
    
    setInventoryItems(items);
    setFilteredItems(items);
    
    // Count low stock items
    const lowStockItems = items.filter(item => item.isLowStock);
    setLowStockCount(lowStockItems.length);
    
    // Extract unique categories and vendors for filters
    const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];
    const uniqueVendors = [...new Set(products.map(product => product.vendor).filter(Boolean))];
    
    // Convert category IDs to category objects with name and id
    const categoryObjects = uniqueCategories.map(categoryId => {
      const category = getCategoryById(categoryId);
      return category ? { id: categoryId, name: category.name } : { id: categoryId, name: categoryId };
    });
    
    // Convert vendor IDs to vendor objects with name and id
    const vendorObjects = uniqueVendors.map(vendorId => {
      const vendor = getVendorById(vendorId);
      return vendor ? { id: vendorId, name: vendor.name } : { id: vendorId, name: vendorId };
    });
    
    setCategories(categoryObjects);
    setVendors(vendorObjects);
  };
  
  // Filter inventory items based on search term and filters
  useEffect(() => {
    let filtered = [...inventoryItems];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.sku && item.sku.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply vendor filter
    if (selectedVendor !== 'all') {
      filtered = filtered.filter(item => item.supplier === selectedVendor);
    }
    
    // Apply low stock filter
    if (lowStockFilter) {
      filtered = filtered.filter(item => item.isLowStock);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, selectedVendor, lowStockFilter, inventoryItems]);
  
  const handleStockChange = (id, value) => {
    setStockValues({
      ...stockValues,
      [id]: value
    });
  };
  
  const handleAddStock = (id) => {
    const currentValue = stockValues[id] || 0;
    setStockValues({
      ...stockValues,
      [id]: currentValue + 1
    });
  };
  
  const handleSubtractStock = (id) => {
    const currentValue = stockValues[id] || 0;
    setStockValues({
      ...stockValues,
      [id]: currentValue - 1
    });
  };
  
  const getStockChangeClass = (change) => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'unchanged';
  };
  
  const toggleEditMode = () => {
    if (!editMode) {
      // Initialize stock values when entering edit mode
      const initialValues = {};
      filteredItems.forEach(item => {
        initialValues[item.id] = 0;
      });
      setStockValues(initialValues);
    } else {
      // Reset pending updates when exiting edit mode without saving
      setPendingUpdates({});
    }
    setEditMode(!editMode);
  };
  
  const handleSaveChanges = () => {
    // Check if there are any changes to save
    const hasChanges = Object.values(stockValues).some(value => value !== 0);
    
    if (!hasChanges) {
      setSuccessMessage('No changes to save.');
      setSuccess(true);
      setEditMode(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    }
    
    // Collect all products with changes
    const productsToUpdate = {};
    
    Object.keys(stockValues).forEach(id => {
      const change = stockValues[id];
      if (change !== 0) {
        const item = inventoryItems.find(item => item.id === id);
        if (item && item.currentStock !== '-') {
          productsToUpdate[id] = {
            ...item,
            quantityChange: change
          };
        }
      }
    });
    
    // Store pending updates
    setPendingUpdates(productsToUpdate);
    
    // Get the first product to update and show modal
    const productIds = Object.keys(productsToUpdate);
    if (productIds.length > 0) {
      setSelectedProduct(productsToUpdate[productIds[0]]);
      setShowUpdateModal(true);
    }
  };
  
  const handleUpdateConfirm = (reasonData) => {
    if (!selectedProduct) return;
    
    const productId = selectedProduct.id;
    const change = selectedProduct.quantityChange;
    const newStock = selectedProduct.currentStock + change;
    
    // Update product in the database
    updateProduct(productId, { inventory: newStock });
    
    // Create log entry
    const fullProduct = getProductById(productId);
    addInventoryLog({
      productId,
      productName: fullProduct.name,
      productSku: fullProduct.sku,
      previousQuantity: selectedProduct.currentStock,
      newQuantity: newStock,
      quantityChange: change,
      reasonType: reasonData.reasonType,
      notes: reasonData.notes,
      referenceNumber: reasonData.referenceNumber,
      userId: 'current-user', // In a real app, this would be the current user's ID
      userName: 'Current User' // In a real app, this would be the current user's name
    });
    
    // Update local state for the updated product
    const updatedItems = inventoryItems.map(item => {
      if (item.id === productId) {
        // Check if the new stock level is below or equal to min stock
        const isLowStock = newStock <= fullProduct.minStock;
        return {
          ...item,
          currentStock: newStock,
          isLowStock
        };
      }
      return item;
    });
    
    setInventoryItems(updatedItems);
    
    // Remove the processed product from pending updates
    const newPendingUpdates = { ...pendingUpdates };
    delete newPendingUpdates[productId];
    setPendingUpdates(newPendingUpdates);
    
    // Close the modal
    setShowUpdateModal(false);
    
    // If there are more products to update, show the modal for the next one
    const remainingProductIds = Object.keys(newPendingUpdates);
    if (remainingProductIds.length > 0) {
      setSelectedProduct(newPendingUpdates[remainingProductIds[0]]);
      setShowUpdateModal(true);
    } else {
      // All updates are done
      setSuccessMessage('Inventory updated successfully!');
      setSuccess(true);
      
      // Reset edit mode and stock values
      setEditMode(false);
      setStockValues({});
      
      // Reload inventory data
      loadInventoryData();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  // Helper function to get category name from ID
  const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : categoryId;
  };
  
  // Helper function to get vendor name from ID
  const getVendorName = (vendorId) => {
    const vendor = getVendorById(vendorId);
    return vendor ? vendor.name : vendorId;
  };
  
  // Toggle low stock filter
  const toggleLowStockFilter = () => {
    setLowStockFilter(!lowStockFilter);
  };
  
  return (
    <Container>
      <Header>
        <h1>Inventory Management</h1>
        
        <div className="action-buttons">
          <ActionButton className="success">
            <FiDownload />
            Export
          </ActionButton>
          <ActionButton className="secondary">
            <FiUpload />
            Import
          </ActionButton>
          <ActionButton className="secondary" as={Link} to="/products/add">
            <FiPlus />
            Add Product
          </ActionButton>
          {editMode ? (
            <>
              <ActionButton onClick={toggleEditMode}>
                Cancel
              </ActionButton>
              <ActionButton className="success" onClick={handleSaveChanges}>
                Save Changes
              </ActionButton>
            </>
          ) : (
            <ActionButton className="primary" onClick={toggleEditMode}>
              Update Stock
            </ActionButton>
          )}
        </div>
      </Header>
      
      {success && (
        <SuccessMessage>
          {successMessage}
        </SuccessMessage>
      )}
      
      {lowStockCount > 0 && !lowStockFilter && (
        <LowStockBanner>
          <div className="content">
            <FiAlertTriangle />
            <div className="message">
              <span>{lowStockCount}</span> {lowStockCount === 1 ? 'product' : 'products'} below minimum stock level
            </div>
          </div>
          <ActionButton className="warning" onClick={toggleLowStockFilter}>
            View Low Stock Items
          </ActionButton>
        </LowStockBanner>
      )}
      
      <SearchContainer>
        <div className="search-input">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <FilterButton>
          <FiFilter />
          Filters
        </FilterButton>
      </SearchContainer>
      
      <FilterContainer>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        
        <select 
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="all">All Suppliers</option>
          {vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
          ))}
        </select>
        
        <ActionButton 
          className={lowStockFilter ? "warning" : "secondary"}
          onClick={toggleLowStockFilter}
        >
          {lowStockFilter ? "Show All Items" : "Low Stock Only"}
        </ActionButton>
      </FilterContainer>
      
      <InventoryTable>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Supplier</th>
              {!editMode && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.id} className={item.isLowStock ? 'low-stock' : ''}>
                  <td>
                    <div className="product-info">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      {item.name}
                      {item.isLowStock && (
                        <div className="low-stock-indicator">
                          <FiAlertTriangle size={14} />
                          Low Stock
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{item.sku}</td>
                  <td>{getCategoryName(item.category)}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    {editMode ? (
                      <div className="stock-controls">
                        <div>Current: {item.currentStock}</div>
                        <input 
                          type="number" 
                          value={stockValues[item.id]} 
                          onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                        />
                        <button className="add-button" onClick={() => handleAddStock(item.id)}>
                          <FiPlus size={14} />
                        </button>
                        <button className="sub-button" onClick={() => handleSubtractStock(item.id)}>
                          <FiMinus size={14} />
                        </button>
                        <span className={`result ${getStockChangeClass(stockValues[item.id])}`}>
                          → {item.currentStock !== '-' ? item.currentStock + (stockValues[item.id] || 0) : '-'}
                        </span>
                      </div>
                    ) : (
                      <span className={`stock-value ${item.isLowStock ? 'low-stock' : ''}`}>
                        {item.currentStock}
                      </span>
                    )}
                  </td>
                  <td>{item.minStock}</td>
                  <td>{getVendorName(item.supplier)}</td>
                  {!editMode && (
                    <td>
                      <div className="actions-cell">
                        <Link 
                          to={`/products/edit/${item.id}`} 
                          className="action-button"
                          title="Edit product"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={editMode ? 8 : 9} style={{ textAlign: 'center', padding: '24px' }}>
                  No products found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </InventoryTable>
      
      {/* Inventory Update Modal */}
      {selectedProduct && (
        <InventoryUpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          product={selectedProduct}
          quantityChange={selectedProduct.quantityChange}
          onConfirm={handleUpdateConfirm}
        />
      )}
    </Container>
  );
}

export default Inventory;
