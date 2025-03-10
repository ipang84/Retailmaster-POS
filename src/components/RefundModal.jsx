import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaWallet } from 'react-icons/fa';
import { processRefund } from '../services/orderService';

const RefundModal = ({ isOpen, onClose, order }) => {
  const [refundItems, setRefundItems] = useState([]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMethod, setRefundMethod] = useState('cash');
  const [refundNote, setRefundNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (order && order.items) {
      // Initialize refund items from order items
      const initialRefundItems = order.items.map(item => ({
        ...item,
        refundQuantity: 0,
        condition: 'new', // Default condition
        maxQuantity: item.quantity
      }));
      setRefundItems(initialRefundItems);
    }
  }, [order]);

  // Calculate the total refund amount based on selected items
  useEffect(() => {
    const total = refundItems.reduce((sum, item) => {
      return sum + (item.refundQuantity * item.price);
    }, 0);
    setRefundAmount(total);
  }, [refundItems]);

  const handleQuantityChange = (index, value) => {
    const newValue = parseInt(value, 10) || 0;
    const updatedItems = [...refundItems];
    
    // Ensure quantity doesn't exceed the maximum
    updatedItems[index].refundQuantity = Math.min(
      Math.max(0, newValue), // Ensure it's not negative
      updatedItems[index].maxQuantity // Ensure it doesn't exceed max
    );
    
    setRefundItems(updatedItems);
  };

  const handleConditionChange = (index, condition) => {
    const updatedItems = [...refundItems];
    updatedItems[index].condition = condition;
    setRefundItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccess('');

    // Validate that at least one item is being refunded
    const hasRefundItems = refundItems.some(item => item.refundQuantity > 0);
    if (!hasRefundItems) {
      setError('Please select at least one item to refund');
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare refund data
      const refundData = {
        orderId: order.id,
        timestamp: Date.now(),
        amount: refundAmount,
        items: refundItems
          .filter(item => item.refundQuantity > 0)
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.refundQuantity,
            condition: item.condition
          })),
        method: refundMethod,
        note: refundNote
      };

      // Process the refund
      const result = await processRefund(refundData);
      
      setSuccess(`Refund processed successfully. ${
        result.inventoryUpdated ? 'Inventory has been updated for new condition items.' : ''
      } ${
        result.inventoryErrors ? 'Some inventory updates failed.' : ''
      }`);
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose(true); // Pass true to indicate a successful refund
      }, 2000);
      
    } catch (err) {
      setError(`Failed to process refund: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Process Refund</h2>
          <CloseButton onClick={() => onClose(false)}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <OrderInfo>
            <p><strong>Order #:</strong> {order?.id}</p>
            <p><strong>Date:</strong> {new Date(order?.timestamp).toLocaleString()}</p>
            <p><strong>Customer:</strong> {order?.customer?.name || 'Guest'}</p>
            <p><strong>Original Total:</strong> ${order?.total.toFixed(2)}</p>
          </OrderInfo>

          <form onSubmit={handleSubmit}>
            <ItemsSection>
              <h3>Select Items to Refund</h3>
              <ItemsTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Refund Qty</th>
                    <th>Condition</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {refundItems.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.maxQuantity}</td>
                      <td>
                        <QuantityInput
                          type="number"
                          min="0"
                          max={item.maxQuantity}
                          value={item.refundQuantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={item.condition}
                          onChange={(e) => handleConditionChange(index, e.target.value)}
                          disabled={item.refundQuantity <= 0}
                        >
                          <option value="new">New (Return to Inventory)</option>
                          <option value="damaged">Damaged (Do Not Return)</option>
                          <option value="opened">Opened (Do Not Return)</option>
                        </select>
                      </td>
                      <td>${(item.refundQuantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </ItemsTable>
            </ItemsSection>

            <RefundDetails>
              <h3>Refund Details</h3>
              
              <RefundMethodSection>
                <h4>Refund Method</h4>
                <RefundMethods>
                  <RefundMethodOption 
                    selected={refundMethod === 'cash'}
                    onClick={() => setRefundMethod('cash')}
                  >
                    <FaMoneyBillWave />
                    <span>Cash</span>
                  </RefundMethodOption>
                  
                  <RefundMethodOption 
                    selected={refundMethod === 'card'}
                    onClick={() => setRefundMethod('card')}
                  >
                    <FaCreditCard />
                    <span>Card</span>
                  </RefundMethodOption>
                  
                  <RefundMethodOption 
                    selected={refundMethod === 'store_credit'}
                    onClick={() => setRefundMethod('store_credit')}
                  >
                    <FaWallet />
                    <span>Store Credit</span>
                  </RefundMethodOption>
                </RefundMethods>
              </RefundMethodSection>
              
              <div>
                <label htmlFor="refundNote">Note:</label>
                <NoteTextarea
                  id="refundNote"
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                  placeholder="Enter reason for refund or additional notes"
                />
              </div>
              
              <TotalSection>
                <h3>Total Refund Amount</h3>
                <TotalAmount>${refundAmount.toFixed(2)}</TotalAmount>
              </TotalSection>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <ButtonGroup>
                <CancelButton type="button" onClick={() => onClose(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton 
                  type="submit" 
                  disabled={isProcessing || refundAmount <= 0}
                >
                  {isProcessing ? 'Processing...' : 'Process Refund'}
                </SubmitButton>
              </ButtonGroup>
            </RefundDetails>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  
  p {
    margin: 5px 0;
  }
`;

const ItemsSection = styled.div`
  margin-bottom: 25px;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RefundDetails = styled.div`
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
`;

const RefundMethodSection = styled.div`
  margin-bottom: 20px;
  
  h4 {
    margin-bottom: 10px;
    color: #555;
  }
`;

const RefundMethods = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const RefundMethodOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  background-color: ${props => props.selected ? '#f0f9f0' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4CAF50;
  }
  
  svg {
    font-size: 24px;
    margin-bottom: 8px;
    color: ${props => props.selected ? '#4CAF50' : '#666'};
  }
  
  span {
    font-weight: ${props => props.selected ? '600' : 'normal'};
  }
`;

const NoteTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 80px;
  margin-bottom: 20px;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  
  h3 {
    margin: 0;
  }
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #4CAF50;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #3d8b40;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export default RefundModal;
