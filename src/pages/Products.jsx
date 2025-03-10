import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiFilter, FiSearch, FiMoreVertical, FiDownload, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getProducts, filterProducts, deleteProduct } from '../services/productService';
import { getCategoryById } from '../services/categoryService';
import { getVendorById } from '../services/vendorService';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  .left-section {
    display: flex;
    align-items: center;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    
    svg {
      margin-right: 8px;
    }
  }
  
  h1 {
    margin-left: 16px;
    font-size: 24px;
    font-weight: 600;
  }
  
  .right-section {
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
    background-color: white;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      border-color: var(--primary-color);
    }
  }
  
  &.dropdown {
    padding: 8px 12px;
    
    svg {
      margin-right: 0;
      margin-left: 4px;
    }
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 20px;
  
  input {
    width: 100%;
    padding: 10px 40px 10px 16px;
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
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#555'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .filters {
    display: flex;
    gap: 12px;
  }
  
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ProductsTable = styled.div`
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
      
      &:first-child {
        width: 40px;
      }
      
      &:last-child {
        width: 40px;
      }
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .checkbox {
      width: 18px;
      height: 18px;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      
      .product-image {
        width: 40px;
        height: 40px;
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
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      
      &.active {
        background-color: #e6f7e6;
        color: #2e7d32;
        
        svg {
          color: #2e7d32;
          margin-right: 4px;
        }
      }
      
      &.inactive {
        background-color: #f5f5f5;
        color: #757575;
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
      
      &.delete:hover {
        background-color: #fee;
        color: #d32f2f;
      }
    }
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .dialog-content {
    background-color: white;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .dialog-message {
    margin-bottom: 24px;
    color: #555;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .dialog-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &.cancel {
      background-color: white;
      border: 1px solid #ddd;
      color: #333;
    }
    
    &.confirm {
      background-color: #d32f2f;
      color: white;
      border: none;
    }
  }
`;

function Products() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  
  // Load products on component mount
  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
    
    // Get unique categories and vendors for filter dropdowns
    const uniqueCategories = [...new Set(loadedProducts.map(product => product.category))];
    const uniqueVendors = [...new Set(loadedProducts.map(product => product.vendor))];
    
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
  }, []);
  
  // Filter products based on active tab, category, vendor, and search term
  useEffect(() => {
    const filters = {
      status: activeTab !== 'all' ? activeTab : null,
      category: selectedCategory !== 'all' ? selectedCategory : null,
      vendor: selectedVendor !== 'all' ? selectedVendor : null,
      search: searchTerm
    };
    
    const filteredProducts = filterProducts(filters);
    setProducts(filteredProducts);
  }, [activeTab, selectedCategory, selectedVendor, searchTerm]);
  
  const handleDeleteClick = (product) => {
    setConfirmDelete(product);
  };
  
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete.id);
      setProducts(products.filter(p => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
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
  
  return (
    <Container>
      <Header>
        <div className="left-section">
          <Link to="/" className="back-button">
            <FiArrowLeft />
            Back
          </Link>
          <h1>Products</h1>
        </div>
        
        <div className="right-section">
          <ActionButton className="secondary">
            <FiDownload />
            Import
          </ActionButton>
          <ActionButton className="secondary">
            <FiUpload />
            Export
          </ActionButton>
          <ActionButton className="secondary dropdown">
            More options
            <FiFilter />
          </ActionButton>
          <ActionButton className="primary" as={Link} to="/products/add">
            <FiPlus />
            Add Product
          </ActionButton>
        </div>
      </Header>
      
      <SearchBar>
        <input 
          type="text" 
          placeholder="Search products by title, vendor, SKU or IMEI" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch />
      </SearchBar>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Products
        </Tab>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => setActiveTab('active')}
        >
          Active
        </Tab>
        <Tab 
          active={activeTab === 'inactive'} 
          onClick={() => setActiveTab('inactive')}
        >
          Inactive
        </Tab>
      </TabsContainer>
      
      <FiltersContainer>
        <div className="filters">
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="all">All Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>
      </FiltersContainer>
      
      <ProductsTable>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>No.</th>
              <th>Product</th>
              <th>Status</th>
              <th>Inventory</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>
                <td>{index + 1}</td>
                <td>
                  <div className="product-info">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    {product.name}
                  </div>
                </td>
                <td>
                  <div className={`status-badge ${product.status}`}>
                    {product.status === 'active' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                      </svg>
                    )}
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </div>
                </td>
                <td>{product.inventory}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.cost.toFixed(2)}</td>
                <td>{getCategoryName(product.category)}</td>
                <td>{getVendorName(product.vendor)}</td>
                <td>
                  <div className="actions-cell">
                    <Link 
                      to={`/products/edit/${product.id}`} 
                      className="action-button"
                      title="Edit product"
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteClick(product)}
                      title="Delete product"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ProductsTable>
      
      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog>
          <div className="dialog-content">
            <div className="dialog-title">Delete Product</div>
            <div className="dialog-message">
              Are you sure you want to delete "{confirmDelete.name}"? This action cannot be undone.
            </div>
            <div className="dialog-actions">
              <button className="dialog-button cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="dialog-button confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </ConfirmDialog>
      )}
    </Container>
  );
}

export default Products;
