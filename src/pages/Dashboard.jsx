import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiAlertTriangle, 
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiClock as FiClockCircle,
  FiMonitor,
  FiShoppingCart
} from 'react-icons/fi';
import RegisterSessionModal from '../components/RegisterSessionModal';
import { getLowStockProducts, getProducts } from '../services/productService';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
  }
  
  &.secondary {
    background-color: white;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
  
  &.icon-only {
    padding: 10px;
    
    svg {
      margin-right: 0;
    }
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const NewOrderButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
    font-size: 18px;
    flex-shrink: 0;
  }
  
  &:hover {
    background-color: #0055cc;
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const SummaryCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .content {
    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: ${props => props.iconBg || '#e6f7ff'};
    color: ${props => props.iconColor || '#0066ff'};
    font-size: 24px;
  }
  
  &.alert {
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      font-size: 20px;
      margin-right: 12px;
      color: #555;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
`;

const InventoryValueList = styled.div`
  .item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .label {
      color: #666;
    }
    
    .value {
      font-weight: 600;
      color: #333;
    }
    
    .value.profit {
      color: #00cc66;
    }
    
    .arrow {
      margin-left: 8px;
      
      &.up {
        color: #00cc66;
      }
      
      &.down {
        color: #ff4d4f;
      }
    }
  }
`;

const TopSellingItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  
  .product-info {
    .name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .qty {
      font-size: 14px;
      color: #666;
    }
  }
  
  .price {
    font-weight: 600;
    color: #333;
  }
  
  .details-link {
    font-size: 14px;
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
`;

const TransactionsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      font-size: 20px;
      margin-right: 12px;
      color: #555;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 500;
    color: #666;
    border-bottom: 1px solid var(--border-color);
  }
  
  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    
    &.product {
      color: var(--primary-color);
    }
    
    &.type {
      .tag {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        
        &.sale {
          background-color: #e6f7ff;
          color: #0066ff;
        }
        
        &.adjustment {
          background-color: #e6ffe6;
          color: #00cc66;
        }
      }
    }
    
    &.quantity {
      font-weight: 500;
      
      &.negative {
        color: #ff4d4f;
      }
      
      &.positive {
        color: #00cc66;
      }
    }
  }
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const LowStockList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      font-size: 20px;
      margin-right: 12px;
      color: #ff6600;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .low-stock-items {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
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
        
        .product-name {
          font-weight: 500;
        }
      }
      
      .stock-info {
        display: flex;
        align-items: center;
        
        .current {
          color: #ff6600;
          font-weight: 600;
          margin-right: 8px;
        }
        
        .min {
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
  
  .view-all {
    display: block;
    text-align: center;
    margin-top: 16px;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Dashboard() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Get low stock products
    const lowStock = getLowStockProducts();
    setLowStockItems(lowStock);
    
    // Get total product count
    const products = getProducts();
    setTotalProducts(products.length);
  }, []);

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Dashboard</Title>
        <ActionButtons>
          <Button className="primary" onClick={openRegisterModal}>
            <FiMonitor />
            Start Register Session
          </Button>
          <Button className="secondary" as={Link} to="/inventory">
            <FiPackage />
            Manage Inventory
          </Button>
          <NewOrderButton to="/orders/new">
            <FiShoppingCart />
            New Order
          </NewOrderButton>
        </ActionButtons>
      </PageHeader>
      
      <SummaryCardsGrid>
        <SummaryCard iconBg="#e6f7ff" iconColor="#0066ff">
          <div className="content">
            <div className="label">Today's Sales</div>
            <div className="value">$0.00</div>
          </div>
          <div className="icon">
            <FiDollarSign />
          </div>
        </SummaryCard>
        
        <SummaryCard iconBg="#e6ffe6" iconColor="#00cc66">
          <div className="content">
            <div className="label">Total Products</div>
            <div className="value">{totalProducts}</div>
          </div>
          <div className="icon">
            <FiPackage />
          </div>
        </SummaryCard>
        
        <SummaryCard 
          iconBg="#fff0e6" 
          iconColor="#ff6600" 
          className={lowStockItems.length > 0 ? "alert" : ""}
          as={lowStockItems.length > 0 ? Link : "div"}
          to={lowStockItems.length > 0 ? "/inventory" : undefined}
        >
          <div className="content">
            <div className="label">Low Stock Items</div>
            <div className="value">{lowStockItems.length}</div>
          </div>
          <div className="icon">
            <FiAlertTriangle />
          </div>
        </SummaryCard>
        
        <SummaryCard iconBg="#e6e6ff" iconColor="#6666ff">
          <div className="content">
            <div className="label">Pending Orders</div>
            <div className="value">0</div>
          </div>
          <div className="icon">
            <FiClock />
          </div>
        </SummaryCard>
      </SummaryCardsGrid>
      
      {lowStockItems.length > 0 && (
        <LowStockList>
          <div className="header">
            <div className="icon">
              <FiAlertTriangle />
            </div>
            <div className="title">Low Stock Items</div>
          </div>
          <div className="low-stock-items">
            {lowStockItems.slice(0, 5).map(item => (
              <div key={item.id} className="item">
                <div className="product-info">
                  <div className="product-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-name">{item.name}</div>
                </div>
                <div className="stock-info">
                  <div className="current">{item.inventory}</div>
                  <div className="min">(min: {item.minStock})</div>
                </div>
              </div>
            ))}
          </div>
          
          {lowStockItems.length > 5 && (
            <Link to="/inventory" className="view-all">
              View all {lowStockItems.length} low stock items
            </Link>
          )}
        </LowStockList>
      )}
      
      <StatsGrid>
        <StatsCard>
          <div className="header">
            <div className="icon">
              <FiTrendingUp />
            </div>
            <div className="title">Inventory Value</div>
          </div>
          
          <InventoryValueList>
            <div className="item">
              <div className="label">Retail Value</div>
              <div className="value">$218.00 <FiArrowUp className="arrow up" /></div>
            </div>
            <div className="item">
              <div className="label">Cost Value</div>
              <div className="value">$54.50 <FiArrowDown className="arrow down" /></div>
            </div>
            <div className="item">
              <div className="label">Potential Profit</div>
              <div className="value profit">$163.50</div>
            </div>
          </InventoryValueList>
        </StatsCard>
        
        <StatsCard>
          <div className="header">
            <div className="icon">
              <FiShoppingBag />
            </div>
            <div className="title">Top Selling Items (30 Days)</div>
          </div>
          
          <TopSellingItem>
            <div className="product-info">
              <div className="name">Test-Fresh Bunker</div>
              <div className="qty">Qty: 1</div>
            </div>
            <div>
              <div className="price">$2.00</div>
              <div className="details-link">Click to view details</div>
            </div>
          </TopSellingItem>
        </StatsCard>
      </StatsGrid>
      
      <TransactionsCard>
        <div className="header">
          <div className="icon">
            <FiClockCircle />
          </div>
          <div className="title">Recent Inventory Transactions</div>
        </div>
        
        <TransactionsTable>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3/4/2025</td>
              <td className="product">Test-Fresh Bunker</td>
              <td className="type">
                <span className="tag sale">sale</span>
              </td>
              <td className="quantity negative">-1</td>
            </tr>
            <tr>
              <td>3/1/2025</td>
              <td className="product">Test-Fresh Bunker</td>
              <td className="type">
                <span className="tag adjustment">adjustment increase</span>
              </td>
              <td className="quantity positive">+10</td>
            </tr>
          </tbody>
        </TransactionsTable>
      </TransactionsCard>

      {/* Register Session Modal */}
      <RegisterSessionModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeRegisterModal} 
      />
    </PageContainer>
  );
}

export default Dashboard;
