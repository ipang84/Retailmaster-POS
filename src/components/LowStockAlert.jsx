import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { getLowStockProducts } from '../services/productService';
import { Link } from 'react-router-dom';

const AlertContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-width: 90vw;
  z-index: 1000;
  overflow: hidden;
  border-left: 4px solid #ff6600;
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff0e6;
  
  .title {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #ff6600;
    
    svg {
      margin-right: 8px;
    }
  }
  
  .close-button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
`;

const AlertContent = styled.div`
  padding: 12px 16px;
  
  .message {
    margin-bottom: 12px;
    color: #333;
  }
  
  .product-list {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
    
    .product-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .product-name {
        font-weight: 500;
      }
      
      .stock-info {
        display: flex;
        align-items: center;
        
        .current {
          color: #ff6600;
          font-weight: 600;
          margin-right: 4px;
        }
        
        .min {
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
`;

const AlertActions = styled.div`
  padding: 0 16px 16px;
  display: flex;
  justify-content: flex-end;
  
  .action-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    
    &.primary {
      background-color: #ff6600;
      color: white;
      border: none;
      
      &:hover {
        background-color: #e65c00;
      }
    }
    
    &.secondary {
      background-color: white;
      color: #666;
      border: 1px solid #ddd;
      margin-right: 8px;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

function LowStockAlert() {
  const [visible, setVisible] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  useEffect(() => {
    // Check for low stock items when component mounts
    checkLowStockItems();
    
    // Set up interval to check periodically (every 5 minutes)
    const intervalId = setInterval(checkLowStockItems, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const checkLowStockItems = () => {
    const items = getLowStockProducts();
    setLowStockItems(items);
    
    // Show alert if there are low stock items
    if (items.length > 0) {
      setVisible(true);
    }
  };
  
  const handleClose = () => {
    setVisible(false);
  };
  
  if (!visible || lowStockItems.length === 0) {
    return null;
  }
  
  return (
    <AlertContainer>
      <AlertHeader>
        <div className="title">
          <FiAlertTriangle />
          Low Stock Alert
        </div>
        <button className="close-button" onClick={handleClose}>
          <FiX />
        </button>
      </AlertHeader>
      
      <AlertContent>
        <div className="message">
          {lowStockItems.length} {lowStockItems.length === 1 ? 'product' : 'products'} below minimum stock level:
        </div>
        
        <div className="product-list">
          {lowStockItems.map(product => (
            <div key={product.id} className="product-item">
              <div className="product-name">{product.name}</div>
              <div className="stock-info">
                <span className="current">{product.inventory}</span>
                <span className="min">(min: {product.minStock})</span>
              </div>
            </div>
          ))}
        </div>
      </AlertContent>
      
      <AlertActions>
        <button className="action-button secondary" onClick={handleClose}>
          Dismiss
        </button>
        <Link to="/inventory" className="action-button primary">
          View Inventory
        </Link>
      </AlertActions>
    </AlertContainer>
  );
}

export default LowStockAlert;
