import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheck, FiPrinter, FiMail, FiDownload, FiEdit, FiTrash2, FiRefreshCcw } from 'react-icons/fi';
import { updateOrderStatus, deleteOrder, getOrderById } from '../services/orderService';
import RefundModal from './RefundModal';

const ModalOverlay = styled.div`
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
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    
    .order-id {
      color: var(--primary-color);
      margin-left: 8px;
    }
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const OrderDetails = styled.div`
  margin-bottom: 24px;
  
  .detail-row {
    display: flex;
    margin-bottom: 12px;
    
    .label {
      width: 120px;
      font-weight: 500;
      color: #555;
    }
    
    .value {
      flex: 1;
      color: #333;
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
  }
`;

const OrderItems = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    
    th {
      font-weight: 600;
      color: #555;
    }
    
    .quantity {
      text-align: center;
    }
    
    .price, .total {
      text-align: right;
    }
  }
`;

const OrderSummary = styled.div`
  margin-bottom: 24px;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 16px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .label {
      color: #555;
    }
    
    .value {
      font-weight: 500;
      color: #333;
    }
    
    &.total-row {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      font-weight: 600;
      
      .label, .value {
        font-size: 16px;
      }
    }
  }
`;

const PaymentDetails = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .payment-row {
    display: flex;
    margin-bottom: 8px;
    
    .label {
      width: 120px;
      font-weight: 500;
      color: #555;
    }
    
    .value {
      flex: 1;
      color: #333;
    }
  }
`;

const OrderNotes = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .notes-content {
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 4px;
    color: #555;
    font-size: 14px;
    min-height: 60px;
    white-space: pre-line;
  }
`;

const RefundHistory = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .refund-item {
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 12px;
    
    .refund-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .refund-id {
        font-weight: 500;
        color: #3f51b5;
      }
      
      .refund-date {
        color: #666;
        font-size: 12px;
      }
    }
    
    .refund-amount {
      font-weight: 600;
      color: #d32f2f;
      margin-bottom: 8px;
    }
    
    .refund-method {
      font-size: 12px;
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: #e8eaf6;
      color: #3f51b5;
      margin-bottom: 8px;
    }
    
    .refund-items {
      margin-top: 8px;
      font-size: 13px;
      
      .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        
        .item-name {
          color: #555;
        }
        
        .item-details {
          color: #777;
        }
      }
    }
    
    .refund-note {
      margin-top: 8px;
      font-size: 13px;
      color: #666;
      font-style: italic;
    }
  }
`;

const StatusUpdateSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .status-options {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    
    button {
      flex: 1;
      padding: 10px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid;
      background-color: white;
      transition: all 0.2s;
      
      &.completed {
        border-color: #a5d6a7;
        color: #2e7d32;
        
        &:hover, &.active {
          background-color: #e8f5e9;
        }
      }
      
      &.pending {
        border-color: #ffe082;
        color: #f57c00;
        
        &:hover, &.active {
          background-color: #fff8e1;
        }
      }
      
      &.cancelled {
        border-color: #ef9a9a;
        color: #d32f2f;
        
        &:hover, &.active {
          background-color: #ffebee;
        }
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  button {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    svg {
      margin-right: 8px;
    }
    
    &.print {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      color: #333;
      
      &:hover {
        background-color: #e9e9e9;
      }
    }
    
    &.email {
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      color: #1976d2;
      
      &:hover {
        background-color: #bbdefb;
      }
    }
    
    &.download {
      background-color: #e8f5e9;
      border: 1px solid #c8e6c9;
      color: #2e7d32;
      
      &:hover {
        background-color: #c8e6c9;
      }
    }
    
    &.edit {
      background-color: #fff8e1;
      border: 1px solid #ffe082;
      color: #f57c00;
      
      &:hover {
        background-color: #ffe082;
      }
    }
    
    &.delete {
      background-color: #ffebee;
      border: 1px solid #ef9a9a;
      color: #d32f2f;
      
      &:hover {
        background-color: #ef9a9a;
        color: white;
      }
    }
    
    &.refund {
      background-color: #e8eaf6;
      border: 1px solid #c5cae9;
      color: #3f51b5;
      
      &:hover {
        background-color: #c5cae9;
      }
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  gap: 12px;
  
  button {
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &.close {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        border-color: #999;
        color: #333;
      }
    }
    
    &.save {
      background-color: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 8px;
      }
      
      &:hover {
        background-color: #0055cc;
      }
      
      &:disabled {
        background-color: #a5c0e5;
        cursor: not-allowed;
      }
    }
  }
`;

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function OrderActionsModal({ isOpen, onClose, order, onOrderUpdate, onOrderDelete }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [hasUnsavedRefund, setHasUnsavedRefund] = useState(false);
  
  // Update local state when order prop changes
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
      setSelectedStatus(order.status);
      setIsStatusChanged(false);
      setHasUnsavedRefund(false);
    }
  }, [order]);
  
  if (!isOpen || !currentOrder) return null;
  
  const handleStatusChange = (status) => {
    if (status !== currentOrder.status) {
      setSelectedStatus(status);
      setIsStatusChanged(true);
    } else {
      setSelectedStatus(status);
      setIsStatusChanged(false);
    }
  };
  
  const handleSaveChanges = () => {
    // Update order status in database
    updateOrderStatus(currentOrder.id, selectedStatus);
    
    // Notify parent component about the update
    onOrderUpdate(currentOrder.id, selectedStatus);
    
    // Reset the unsaved refund flag
    setHasUnsavedRefund(false);
    
    // Close the modal
    onClose();
  };
  
  const handleDeleteOrder = () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrder(currentOrder.id);
      onOrderDelete(currentOrder.id);
      onClose();
    }
  };
  
  const handlePrintOrder = () => {
    window.print();
  };
  
  const handleEmailOrder = () => {
    alert('Email functionality would be implemented here.');
  };
  
  const handleDownloadOrder = () => {
    alert('Download functionality would be implemented here.');
  };
  
  const handleEditOrder = () => {
    alert('Edit order functionality would be implemented here.');
  };
  
  const handleOpenRefundModal = () => {
    setIsRefundModalOpen(true);
  };
  
  const handleCloseRefundModal = () => {
    setIsRefundModalOpen(false);
  };
  
  const handleRefundComplete = (refundData) => {
    // Get the updated order from localStorage
    const updatedOrder = getOrderById(currentOrder.id);
    
    if (updatedOrder) {
      // Update the local state with the refreshed order data
      setCurrentOrder(updatedOrder);
      
      // Set status to 'refunded' but require user to save changes
      setSelectedStatus('refunded');
      setIsStatusChanged(true);
      
      // Set flag to show alert about unsaved refund
      setHasUnsavedRefund(true);
    }
  };
  
  // Check if order can be refunded (only completed orders can be refunded)
  const canBeRefunded = currentOrder.status === 'completed';
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            Order <span className="order-id">{currentOrder.id}</span>
          </h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          {hasUnsavedRefund && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '12px', 
              borderRadius: '4px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #ef9a9a',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ marginRight: '12px', color: '#d32f2f' }}>⚠️</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#d32f2f', fontWeight: '500' }}>
                Refund has been processed. Please click "Save Changes" to update the order status.
              </p>
            </div>
          )}
          
          <OrderDetails>
            <div className="detail-row">
              <div className="label">Date:</div>
              <div className="value">{formatDate(currentOrder.date)}</div>
            </div>
            <div className="detail-row">
              <div className="label">Customer:</div>
              <div className="value">{currentOrder.customer}</div>
            </div>
            <div className="detail-row">
              <div className="label">Status:</div>
              <div className="value">
                <span className={`status ${currentOrder.status}`}>
                  {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                </span>
                {isStatusChanged && (
                  <span style={{ marginLeft: '8px', color: '#d32f2f', fontSize: '12px' }}>
                    (Will be updated to: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)})
                  </span>
                )}
              </div>
            </div>
            {currentOrder.tags && currentOrder.tags.length > 0 && (
              <div className="detail-row">
                <div className="label">Tags:</div>
                <div className="value">
                  {currentOrder.tags.map((tag, index) => (
                    <span key={index} style={{ 
                      display: 'inline-block', 
                      background: '#f0f0f0', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      marginRight: '6px',
                      fontSize: '12px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </OrderDetails>
          
          <OrderItems>
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="quantity">Qty</th>
                  <th className="price">Price</th>
                  <th className="total">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className="quantity">{item.quantity}</td>
                    <td className="price">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="total">
                      ${(item.quantity * item.price - (item.discount ? item.discount.amount : 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OrderItems>
          
          <OrderSummary>
            <div className="summary-row">
              <div className="label">Subtotal:</div>
              <div className="value">${currentOrder.subtotal.toFixed(2)}</div>
            </div>
            {currentOrder.discount > 0 && (
              <div className="summary-row">
                <div className="label">Discount:</div>
                <div className="value">-${currentOrder.discount.toFixed(2)}</div>
              </div>
            )}
            {currentOrder.tax > 0 && (
              <div className="summary-row">
                <div className="label">Tax:</div>
                <div className="value">${currentOrder.tax.toFixed(2)}</div>
              </div>
            )}
            <div className="summary-row total-row">
              <div className="label">Total:</div>
              <div className="value">${currentOrder.total.toFixed(2)}</div>
            </div>
          </OrderSummary>
          
          {currentOrder.payment && (
            <PaymentDetails>
              <h3>Payment Details</h3>
              <div className="payment-row">
                <div className="label">Method:</div>
                <div className="value">
                  {currentOrder.payment.method === 'cash' ? 'Cash' : 
                   currentOrder.payment.method === 'card' ? `Card (${currentOrder.payment.cardType})` : 
                   `Digital Payment (${currentOrder.payment.provider})`}
                </div>
              </div>
              {currentOrder.payment.method === 'cash' && (
                <>
                  <div className="payment-row">
                    <div className="label">Amount Received:</div>
                    <div className="value">${currentOrder.payment.cashReceived.toFixed(2)}</div>
                  </div>
                  <div className="payment-row">
                    <div className="label">Change:</div>
                    <div className="value">${currentOrder.payment.change.toFixed(2)}</div>
                  </div>
                </>
              )}
            </PaymentDetails>
          )}
          
          {/* Display refund history if any */}
          {currentOrder.refunds && currentOrder.refunds.length > 0 && (
            <RefundHistory>
              <h3>Refund History</h3>
              {currentOrder.refunds.map((refund, index) => (
                <div key={index} className="refund-item">
                  <div className="refund-header">
                    <span className="refund-id">{refund.id}</span>
                    <span className="refund-date">{formatDate(refund.timestamp)}</span>
                  </div>
                  <div className="refund-amount">Amount: ${refund.amount.toFixed(2)}</div>
                  <div className="refund-method">
                    {refund.method === 'cash' ? 'Cash Refund' : 
                     refund.method === 'card' ? 'Card Refund' : 
                     'Store Credit'}
                  </div>
                  <div className="refund-items">
                    <strong>Refunded Items:</strong>
                    {refund.items.map((item, idx) => (
                      <div key={idx} className="item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          {item.quantity} x ${item.price.toFixed(2)} 
                          ({item.condition})
                        </span>
                      </div>
                    ))}
                  </div>
                  {refund.note && (
                    <div className="refund-note">Note: {refund.note}</div>
                  )}
                </div>
              ))}
            </RefundHistory>
          )}
          
          {currentOrder.notes && (
            <OrderNotes>
              <h3>Order Notes</h3>
              <div className="notes-content">
                {currentOrder.notes || 'No notes for this order.'}
              </div>
            </OrderNotes>
          )}
          
          {/* Only show status update for non-refunded orders or if there's an unsaved refund */}
          {(currentOrder.status !== 'refunded' || hasUnsavedRefund) && (
            <StatusUpdateSection>
              <h3>Update Order Status</h3>
              <div className="status-options">
                <button 
                  className={`completed ${selectedStatus === 'completed' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`pending ${selectedStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`cancelled ${selectedStatus === 'cancelled' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('cancelled')}
                >
                  Cancelled
                </button>
                {hasUnsavedRefund && (
                  <button 
                    className={`refunded ${selectedStatus === 'refunded' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('refunded')}
                  >
                    Refunded
                  </button>
                )}
              </div>
            </StatusUpdateSection>
          )}
          
          <ActionButtons>
            <button className="print" onClick={handlePrintOrder}>
              <FiPrinter size={16} />
              Print
            </button>
            <button className="email" onClick={handleEmailOrder}>
              <FiMail size={16} />
              Email
            </button>
            <button className="download" onClick={handleDownloadOrder}>
              <FiDownload size={16} />
              Download
            </button>
            <button className="edit" onClick={handleEditOrder}>
              <FiEdit size={16} />
              Edit
            </button>
            {canBeRefunded && (
              <button className="refund" onClick={handleOpenRefundModal}>
                <FiRefreshCcw size={16} />
                Process Refund
              </button>
            )}
            <button className="delete" onClick={handleDeleteOrder}>
              <FiTrash2 size={16} />
              Delete
            </button>
          </ActionButtons>
        </ModalBody>
        
        <ModalFooter>
          <button className="close" onClick={onClose}>
            Close
          </button>
          <button 
            className="save" 
            onClick={handleSaveChanges}
            disabled={!isStatusChanged && !hasUnsavedRefund}
          >
            <FiCheck size={16} />
            Save Changes
          </button>
        </ModalFooter>
      </ModalContent>
      
      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={handleCloseRefundModal}
        order={currentOrder}
        onRefundComplete={handleRefundComplete}
      />
    </ModalOverlay>
  );
}

export default OrderActionsModal;
