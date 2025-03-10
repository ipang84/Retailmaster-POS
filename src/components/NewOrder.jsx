import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiSearch, FiPlus, FiTrash2, FiEdit, FiX, FiTag, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import CustomItemModal from '../components/CustomItemModal';
import CustomerModal from '../components/CustomerModal';
import DiscountModal from '../components/DiscountModal';
import ItemDiscountModal from '../components/ItemDiscountModal';
import CheckoutModal from '../components/CheckoutModal';
import { getProducts } from '../services/productService';
import { getCustomers, addCustomer } from '../services/customerService';
import { saveOrder } from '../services/orderService';

// ... [rest of the styled components remain unchanged]

function NewOrder() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [applyTax, setApplyTax] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isItemDiscountModalOpen, setIsItemDiscountModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderDiscount, setOrderDiscount] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderTags, setOrderTags] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const taxRate = 8.875;
  
  const navigate = useNavigate();
  const searchBarRef = useRef(null);
  
  // Fetch products from the product service
  useEffect(() => {
    const products = getProducts();
    setAllProducts(products);
    
    // For demonstration, we'll simulate popular products
    // In a real app, this would be based on actual sales data
    const popular = products
      .slice(0, 6) // Limit to 6 items
      .map(product => ({
        ...product,
        salesCount: Math.floor(Math.random() * 20) + 5 // Random sales count for demo
      }))
      .filter(product => product.salesCount > 5); // Only products sold more than 5 times
    
    setPopularProducts(popular);
  }, []);
  
  // Fetch customers
  useEffect(() => {
    loadCustomers();
    
    // Listen for storage events to update customer list when changes occur in other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === 'customers') {
        loadCustomers();
      }
    };
    
    // Listen for custom event for customer data changes
    const handleCustomerDataChange = () => {
      loadCustomers();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customerDataChanged', handleCustomerDataChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customerDataChanged', handleCustomerDataChange);
    };
  }, []);
  
  // Load customers from service
  const loadCustomers = () => {
    const customerList = getCustomers();
    setCustomers(customerList);
  };
  
  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = allProducts.filter(product => 
      product.name.toLowerCase().startsWith(query) ||
      (product.sku && product.sku.toLowerCase().includes(query)) ||
      (product.barcode && product.barcode.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery, allProducts]);
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  // Define general retail categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'popular', name: 'Popular Items' },
    { id: <boltAction type="file" filePath="src/pages/NewOrder.jsx">import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiSearch, FiPlus, FiTrash2, FiEdit, FiX, FiTag, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import CustomItemModal from '../components/CustomItemModal';
import CustomerModal from '../components/CustomerModal';
import DiscountModal from '../components/DiscountModal';
import ItemDiscountModal from '../components/ItemDiscountModal';
import CheckoutModal from '../components/CheckoutModal';
import { getProducts } from '../services/productService';
import { getCustomers, addCustomer } from '../services/customerService';
import { saveOrder } from '../services/orderService';

const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    
    svg {
      margin-right: 8px;
    }
    
    &:hover {
      color: #333;
    }
  }
  
  h1 {
    margin-left: 8px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
`;

const OrderLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
`;

const ProductsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SearchHeader = styled.div`
  margin-bottom: 16px;
`;

const SearchLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
`;

const SearchResultItem = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f5f7fa;
  }
  
  .product-image {
    width: 36px;
    height: 36px;
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
  
  .product-details {
    flex: 1;
    
    .name {
      font-weight: 500;
      margin-bottom: 2px;
      color: #333;
    }
    
    .sku {
      font-size: 12px;
      color: #666;
    }
  }
  
  .product-price {
    font-weight: 600;
    color: #4a89dc;
    margin-left: 12px;
  }
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const AddCustomItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a89dc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #3b7dd8;
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 12px 8px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }
  
  td {
    padding: 12px 8px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    
    &.price, &.total {
      font-weight: 500;
    }
    
    .edit-price {
      color: #4a89dc;
      margin-left: 8px;
      cursor: pointer;
    }
    
    .quantity-input {
      width: 60px;
      padding: 6px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
    }
    
    .remove-button {
      color: #d32f2f;
      background: none;
      border: none;
      cursor: pointer;
      
      &:hover {
        color: #b71c1c;
      }
    }
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
    
    .product-details {
      .name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .sku {
        font-size: 12px;
        color: #666;
      }
      
      .discount-link {
        font-size: 12px;
        color: #4a89dc;
        text-decoration: none;
        margin-top: 4px;
        display: inline-block;
        cursor: pointer;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const DiscountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #e3f2fd;
  color: #1976d2;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  
  svg {
    margin-right: 4px;
    font-size: 10px;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 14px;
`;

const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const CustomerSection = styled.div`
  .customer-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
  }
  
  .customer-actions {
    display: flex;
    gap: 10px;
    
    button {
      flex: 1;
      padding: 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .create-customer {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: 1px solid #ddd;
      color: #333;
      
      svg {
        margin-right: 6px;
      }
      
      &:hover {
        border-color: #4a89dc;
      }
    }
    
    .walk-in {
      background: none;
      border: 1px solid #ddd;
      color: #333;
      
      &:hover {
        border-color: #4a89dc;
      }
    }
  }
`;

const OrderNotes = styled.div`
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 80px;
    resize: vertical;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
`;

const TagsSection = styled.div`
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
`;

const PaymentSummary = styled.div`
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    
    .label {
      color: #555;
      display: flex;
      align-items: center;
    }
    
    .value {
      font-weight: 500;
      text-align: right;
    }
    
    .discount-link {
      color: #4a89dc;
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .discount-badge {
      display: flex;
      align-items: center;
      margin-left: 8px;
      background-color: #e3f2fd;
      color: #1976d2;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      
      svg {
        margin-right: 4px;
        font-size: 10px;
      }
      
      .remove {
        margin-left: 4px;
        cursor: pointer;
        color: #d32f2f;
        
        &:hover {
          color: #b71c1c;
        }
      }
    }
    
    .tax-control {
      display: flex;
      align-items: center;
      
      .tax-rate {
        margin-right: 8px;
      }
      
      .tax-toggle {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        
        input {
          opacity: 0;
          width: 0;
          height: 0;
          
          &:checked + .slider {
            background-color: #4a89dc;
          }
          
          &:checked + .slider:before {
            transform: translateX(16px);
          }
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
          
          &:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
        }
      }
    }
    
    .tax-id {
      display: flex;
      align-items: center;
      
      .value {
        margin-right: 8px;
      }
      
      .edit-button {
        color: #666;
        background: none;
        border: none;
        cursor: pointer;
        
        &:hover {
          color: #4a89dc;
        }
      }
    }
    
    &.total-row {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      font-weight: 600;
      
      .label, .value {
        font-size: 16px;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  button {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
  }
  
  .clear-cart {
    background: none;
    border: 1px solid #ddd;
    color: #333;
    
    &:hover {
      border-color: #d32f2f;
      color: #d32f2f;
    }
  }
  
  .add-repair {
    background: none;
    border: 1px solid #ddd;
    color: #333;
    
    &:hover {
      border-color: #4a89dc;
    }
  }
  
  .checkout {
    background-color: #4a89dc;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      margin-right: 8px;
    }
    
    &:hover {
      background-color: #3b7dd8;
    }
    
    &:disabled {
      background-color: #a5c0e5;
      cursor: not-allowed;
    }
  }
`;

const PopularItemsSection = styled.div`
  margin-top: 20px;
`;

const PopularItemsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: 1px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &.selected {
    border-color: #4a89dc;
    box-shadow: 0 0 0 2px rgba(74, 137, 220, 0.2);
  }
  
  .product-image {
    width: 60px;
    height: 60px;
    background-color: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    
    img {
      max-width: 80%;
      max-height: 80%;
    }
  }
  
  .product-name {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
  }
  
  .product-sku {
    font-size: 11px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .product-price {
    font-size: 14px;
    font-weight: 600;
    color: #4a89dc;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4a89dc' : 'transparent'};
  color: ${props => props.active ? '#4a89dc' : '#555'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: #4a89dc;
  }
`;

const OrderSuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
  
  svg {
    margin-right: 12px;
  }
  
  .message {
    font-weight: 500;
  }
`;

function NewOrder() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [applyTax, setApplyTax] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isItemDiscountModalOpen, setIsItemDiscountModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderDiscount, setOrderDiscount] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderTags, setOrderTags] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const taxRate = 8.875;
  
  const navigate = useNavigate();
  const searchBarRef = useRef(null);
  
  // Fetch products from the product service
  useEffect(() => {
    const products = getProducts();
    setAllProducts(products);
    
    // For demonstration, we'll simulate popular products
    // In a real app, this would be based on actual sales data
    const popular = products
      .slice(0, 6) // Limit to 6 items
      .map(product => ({
        ...product,
        salesCount: Math.floor(Math.random() * 20) + 5 // Random sales count for demo
      }))
      .filter(product => product.salesCount > 5); // Only products sold more than 5 times
    
    setPopularProducts(popular);
  }, []);
  
  // Fetch customers
  useEffect(() => {
    loadCustomers();
    
    // Listen for storage events to update customer list when changes occur in other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === 'customers') {
        loadCustomers();
      }
    };
    
    // Listen for custom event for customer data changes
    const handleCustomerDataChange = () => {
      loadCustomers();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customerDataChanged', handleCustomerDataChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customerDataChanged', handleCustomerDataChange);
    };
  }, []);
  
  // Load customers from service
  const loadCustomers = () => {
    const customerList = getCustomers();
    setCustomers(customerList);
  };
  
  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = allProducts.filter(product => 
      product.name.toLowerCase().startsWith(query) ||
      (product.sku && product.sku.toLowerCase().includes(query)) ||
      (product.barcode && product.barcode.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery, allProducts]);
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  // Define general retail categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'popular', name: 'Popular Items' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'beauty', name: 'Beauty & Health' },
    { id: 'food', name: 'Food & Grocery' },
    { id: 'toys', name: 'Toys & Games' }
  ];
  
  const filteredProducts = allProducts.filter(product => {
    if (activeCategory !== 'all' && activeCategory !== 'popular' && product.category !== activeCategory) {
      return false;
    }
    
    return true;
  });
  
  const calculateItemTotal = (item) => {
    const baseTotal = item.price * item.quantity;
    
    // Apply item-specific discount if it exists
    if (item.discount) {
      return baseTotal - item.discount.amount;
    }
    
    return baseTotal;
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };
  
  const calculateOrderDiscountAmount = () => {
    if (!orderDiscount) return 0;
    
    const subtotal = calculateSubtotal();
    
    if (orderDiscount.type === 'percentage') {
      return (subtotal * orderDiscount.value) / 100;
    } else {
      return orderDiscount.amount;
    }
  };
  
  const calculateTax = () => {
    if (!applyTax) return 0;
    const subtotalAfterDiscount = calculateSubtotal() - calculateOrderDiscountAmount();
    return (subtotalAfterDiscount * taxRate) / 100;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() - calculateOrderDiscountAmount() + calculateTax();
  };
  
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleClearCart = () => {
    setCartItems([]);
    setOrderDiscount(null);
  };
  
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      handleQuantityChange(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    // Clear search after adding
    setSearchQuery('');
    setShowSearchResults(false);
  };
  
  const handleAddCustomItem = (customItem) => {
    // Generate a unique ID for the custom item
    const customId = `custom-${Date.now()}`;
    setCartItems([...cartItems, { ...customItem, id: customId, quantity: 1 }]);
    setIsCustomItemModalOpen(false);
  };
  
  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '') {
      setShowSearchResults(true);
    }
  };
  
  const handleSearchResultClick = (product) => {
    handleAddToCart(product);
  };
  
  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };
  
  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true);
  };
  
  const handleSaveCustomer = (customer) => {
    // Add customer to the list using the service
    const newCustomer = addCustomer(customer);
    
    // Update customers list
    setCustomers([...customers, newCustomer]);
    
    // Select the new customer
    setSelectedCustomer(newCustomer.id);
    
    // Close the modal
    setIsCustomerModalOpen(false);
    
    // Trigger a custom event to notify other components about the change
    window.dispatchEvent(new Event('customerDataChanged'));
  };
  
  const handleSetWalkInCustomer = () => {
    setSelectedCustomer('walk-in');
  };
  
  const handleOpenDiscountModal = () => {
    setIsDiscountModalOpen(true);
  };
  
  const handleApplyOrderDiscount = (discount) => {
    setOrderDiscount(discount);
  };
  
  const handleRemoveOrderDiscount = () => {
    setOrderDiscount(null);
  };
  
  const handleOpenItemDiscountModal = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      setSelectedItemForDiscount(item);
      setIsItemDiscountModalOpen(true);
    }
  };
  
  const handleApplyItemDiscount = (itemId, discount) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, discount } : item
    ));
  };
  
  const handleRemoveItemDiscount = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, discount: null } : item
    ));
  };
  
  const formatDiscountText = (discount) => {
    if (!discount) return '';
    
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    } else {
      return `$${discount.amount.toFixed(2)}`;
    }
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };
  
  const handleCompleteOrder = (paymentDetails) => {
    // Create the order object
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      customer: selectedCustomer === 'walk-in' ? 'Walk-in Customer' : 
               customers.find(c => c.id === selectedCustomer)?.fullName || 'Unknown Customer',
      customerId: selectedCustomer !== 'walk-in' ? selectedCustomer : null,
      items: cartItems,
      itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      subtotal: calculateSubtotal(),
      discount: calculateOrderDiscountAmount(),
      tax: calculateTax(),
      total: calculateTotal(),
      payment: paymentDetails,
      notes: orderNotes,
      tags: orderTags ? orderTags.split(',').map(tag => tag.trim()) : [],
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    
    // Save the order to localStorage
    saveOrder(order);
    
    // Update customer order count and amount spent if not a walk-in customer
    if (selectedCustomer !== 'walk-in' && selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          orders: (customer.orders || 0) + 1,
          amountSpent: (parseFloat(customer.amountSpent) || 0) + calculateTotal()
        };
        
        // Update customer in localStorage
        const updatedCustomers = customers.map(c => 
          c.id === selectedCustomer ? updatedCustomer : c
        );
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        
        // Trigger a custom event to notify other components about the change
        window.dispatchEvent(new Event('customerDataChanged'));
      }
    }
    
    // Close checkout modal
    setIsCheckoutModalOpen(false);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Reset the form
    setCartItems([]);
    setOrderDiscount(null);
    setOrderNotes('');
    setOrderTags('');
    setSelectedCustomer('');
    
    // Redirect to orders page after a short delay
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };
  
  return (
    <Container>
      <Header>
        <Link to="/orders" className="back-button">
          <FiArrowLeft />
          Back
        </Link>
        <h1>Create Order</h1>
      </Header>
      
      <OrderLayout>
        <div>
          <ProductsSection>
            <SearchHeader>
              <SearchLabel>Search products by title, SKU or barcode</SearchLabel>
              <SearchBarContainer>
                <SearchBar ref={searchBarRef}>
                  <FiSearch />
                  <input 
                    type="text" 
                    placeholder="Search using title, SKU or barcode" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                  />
                  
                  {showSearchResults && (
                    <SearchResults>
                      {searchResults.length > 0 ? (
                        searchResults.map(product => (
                          <SearchResultItem 
                            key={product.id}
                            onClick={() => handleSearchResultClick(product)}
                          >
                            <div className="product-image">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <FiPlus color="#999" />
                              )}
                            </div>
                            <div className="product-details">
                              <div className="name">{product.name}</div>
                              <div className="sku">SKU: {product.sku} {product.barcode && `| Barcode: ${product.barcode}`}</div>
                            </div>
                            <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                          </SearchResultItem>
                        ))
                      ) : (
                        <NoResults>No products found. Try a different search term.</NoResults>
                      )}
                    </SearchResults>
                  )}
                </SearchBar>
                <AddCustomItemButton onClick={() => setIsCustomItemModalOpen(true)}>
                  <FiPlus size={16} />
                  Add custom item
                </AddCustomItemButton>
              </SearchBarContainer>
            </SearchHeader>
            
            {cartItems.length > 0 ? (
              <ProductsTable>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="product-info">
                          <div className="product-image">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <FiPlus color="#999" />
                            )}
                          </div>
                          <div className="product-details">
                            <div className="name">{item.name}</div>
                            <div className="sku">SKU: {item.sku || 'Custom Item'}</div>
                            
                            {item.discount ? (
                              <DiscountBadge>
                                <FiTag size={10} />
                                Discount: {formatDiscountText(item.discount)}
                              </DiscountBadge>
                            ) : (
                              <span 
                                className="discount-link"
                                onClick={() => handleOpenItemDiscountModal(item.id)}
                              >
                                Apply discount
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="price">
                        ${parseFloat(item.price).toFixed(2)}
                        <span className="edit-price">
                          <FiEdit size={14} />
                        </span>
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="quantity-input" 
                          value={item.quantity} 
                          min="1"
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td className="total">
                        ${calculateItemTotal(item).toFixed(2)}
                        {item.discount && (
                          <div style={{ fontSize: '11px', color: '#d32f2f' }}>
                            Save: ${item.discount.amount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td>
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductsTable>
            ) : (
              <EmptyCart>
                No items added to the order yet. Search for products or add a custom item.
              </EmptyCart>
            )}
          </ProductsSection>
          
          <PopularItemsSection>
            <PopularItemsTitle>Popular Items</PopularItemsTitle>
            <ProductGrid>
              {popularProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className={cartItems.some(item => item.id === product.id) ? 'selected' : ''}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-sku">{product.sku}</div>
                  <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                </ProductCard>
              ))}
            </ProductGrid>
            
            <CategoryTabs>
              {categories.map(category => (
                <CategoryTab 
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </CategoryTab>
              ))}
            </CategoryTabs>
            
            <ProductGrid>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className={cartItems.some(item => item.id === product.id) ? 'selected' : ''}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-sku">{product.sku}</div>
                  <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                </ProductCard>
              ))}
            </ProductGrid>
          </PopularItemsSection>
        </div>
        
        <OrderSummary>
          <SummaryCard>
            <SectionTitle>Add Customer</SectionTitle>
            <CustomerSection>
              <select 
                className="customer-select"
                value={selectedCustomer}
                onChange={handleCustomerChange}
              >
                <option value="">Select Customer</option>
                <option value="walk-in">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullName} {customer.companyName && `(${customer.companyName})`}
                  </option>
                ))}
              </select>
              
              <div className="customer-actions">
                <button className="create-customer" onClick={handleCreateCustomer}>
                  <FiPlus size={14} />
                  Create Customer
                </button>
                <button className="walk-in" onClick={handleSetWalkInCustomer}>
                  Walk-in customer
                </button>
              </div>
            </CustomerSection>
          </SummaryCard>
          
          <SummaryCard>
            <SectionTitle>Order notes</SectionTitle>
            <OrderNotes>
              <textarea 
                placeholder="Add a note"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              ></textarea>
            </OrderNotes>
          </SummaryCard>
          
          <SummaryCard>
            <SectionTitle>Tags</SectionTitle>
            <TagsSection>
              <input 
                type="text" 
                placeholder="Add tags (comma separated)"
                value={orderTags}
                onChange={(e) => setOrderTags(e.target.value)}
              />
            </TagsSection>
          </SummaryCard>
          
          <SummaryCard>
            <SectionTitle>Payment</SectionTitle>
            <PaymentSummary>
              <div className="summary-row">
                <div className="label">Subtotal</div>
                <div className="value">${calculateSubtotal().toFixed(2)}</div>
              </div>
              
              <div className="summary-row">
                <div className="label">
                  {orderDiscount ? (
                    <div className="discount-badge">
                      <FiTag size={10} />
                      {orderDiscount.type === 'percentage' 
                        ? `${orderDiscount.value}% off` 
                        : `$${orderDiscount.amount.toFixed(2)} off`}
                      <FiX 
                        className="remove" 
                        size={12} 
                        onClick={handleRemoveOrderDiscount}
                      />
                    </div>
                  ) : (
                    <a href="#" className="discount-link" onClick={handleOpenDiscountModal}>
                      Add discount
                    </a>
                  )}
                </div>
                <div className="value">
                  {orderDiscount ? `-$${calculateOrderDiscountAmount().toFixed(2)}` : "$0.00"}
                </div>
              </div>
              
              <div className="summary-row">
                <div className="label tax-control">
                  <span className="tax-rate">{taxRate}%</span>
                  <label className="tax-toggle">
                    <input 
                      type="checkbox" 
                      checked={applyTax}
                      onChange={() => setApplyTax(!applyTax)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="value">${calculateTax().toFixed(2)}</div>
              </div>
              
              <div className="summary-row">
                <div className="label tax-id">
                  <span className="value">Tax ID</span>
                  <button className="edit-button">
                    <FiEdit size={14} />
                  </button>
                </div>
                <div className="value">--</div>
              </div>
              
              <div className="summary-row total-row">
                <div className="label">Total</div>
                <div className="value">${calculateTotal().toFixed(2)}</div>
              </div>
            </PaymentSummary>
          </SummaryCard>
          
          <ActionButtons>
            <button className="clear-cart" onClick={handleClearCart}>
              Clear cart
            </button>
            <button 
              className="checkout" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              <FiShoppingCart size={16} />
              Checkout
            </button>
          </ActionButtons>
        </OrderSummary>
      </OrderLayout>
      
      <CustomItemModal 
        isOpen={isCustomItemModalOpen}
        onClose={() => setIsCustomItemModalOpen(false)}
        onAddItem={handleAddCustomItem}
      />
      
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />
      
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApplyDiscount={handleApplyOrderDiscount}
        subtotal={calculateSubtotal()}
      />
      
      <ItemDiscountModal
        isOpen={isItemDiscountModalOpen}
        onClose={() => setIsItemDiscountModalOpen(false)}
        onApplyDiscount={handleApplyItemDiscount}
        item={selectedItemForDiscount}
      />
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        orderTotal={calculateTotal()}
        subtotal={calculateSubtotal()}
        discount={calculateOrderDiscountAmount()}
        tax={calculateTax()}
        onCompleteOrder={handleCompleteOrder}
      />
      
      {showSuccessMessage && (
        <OrderSuccessMessage>
          <FiCheck size={20} />
          <div className="message">Order completed successfully!</div>
        </OrderSuccessMessage>
      )}
    </Container>
  );
}

export default NewOrder;
