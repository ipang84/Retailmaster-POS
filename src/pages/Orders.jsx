import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { getOrders, deleteOrder, updateOrderStatus } from '../services/orderService';
import OrderActionsModal from '../components/OrderActionsModal';

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
`;

const NewOrderButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #0055cc;
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
  
  .action-buttons {
    display: flex;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : '#ddd'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#0055cc' : '#f9f9f9'};
  }
`;

const OrdersTable = styled.div`
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
    
    .order-id {
      font-weight: 500;
      color: var(--primary-color);
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.completed {
        background-color: #e6f7e6;
        color: #2e7d32;
      }
      
      &.pending {
        background-color: #fff8e1;
        color: #f57c00;
      }
      
      &.cancelled {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      &.refunded {
        background-color: #e8eaf6;
        color: #3f51b5;
      }
    }
    
    .actions {
      display: flex;
      gap: 8px;
      
      button {
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
          color: #d32f2f;
        }
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 24px;
  }
  
  .create-order-button {
    display: inline-flex;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    
    svg {
      margin-right: 8px;
    }
    
    &:hover {
      background-color: #0055cc;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : '#ddd'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0055cc' : '#f9f9f9'};
  }
`;

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch orders from localStorage
  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = getOrders();
      setOrders(savedOrders);
      setLoading(false);
    };
    
    fetchOrders();
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };
  
  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };
  
  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Refresh orders after modal is closed to get any updates
    const savedOrders = getOrders();
    setOrders(savedOrders);
  };
  
  const handleOrderUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };
  
  const handleOrderDelete = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };
  
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <Container>
      <Header>
        <h1>Orders</h1>
        <NewOrderButton to="/orders/new">
          <FiPlus />
          New Order
        </NewOrderButton>
      </Header>
      
      <SearchContainer>
        <div className="search-input">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search orders by ID or customer name..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="action-buttons">
          <ActionButton>
            <FiFilter />
            Filter
          </ActionButton>
          <ActionButton>
            <FiDownload />
            Export
          </ActionButton>
        </div>
      </SearchContainer>
      
      <FilterContainer>
        <FilterButton 
          active={statusFilter === 'all'} 
          onClick={() => handleFilterChange('all')}
        >
          All Orders
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'completed'} 
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'pending'} 
          onClick={() => handleFilterChange('pending')}
        >
          Pending
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'cancelled'} 
          onClick={() => handleFilterChange('cancelled')}
        >
          Cancelled
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'refunded'} 
          onClick={() => handleFilterChange('refunded')}
        >
          Refunded
        </FilterButton>
      </FilterContainer>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
      ) : filteredOrders.length > 0 ? (
        <OrdersTable>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id" onClick={() => handleOpenModal(order)}>
                    {order.id}
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.customer}</td>
                  <td>{order.itemCount || order.items.length}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button title="View Order" onClick={() => handleOpenModal(order)}>
                        <FiEye />
                      </button>
                      <button title="Edit Order">
                        <FiEdit />
                      </button>
                      <button 
                        className="delete" 
                        title="Delete Order"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </OrdersTable>
      ) : (
        <EmptyState>
          <h3>No Orders Found</h3>
          <p>You haven't created any orders yet or no orders match your search criteria.</p>
          <Link to="/orders/new" className="create-order-button">
            <FiPlus />
            Create Your First Order
          </Link>
        </EmptyState>
      )}
      
      <OrderActionsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        onOrderUpdate={handleOrderUpdate}
        onOrderDelete={handleOrderDelete}
      />
    </Container>
  );
}

export default Orders;
