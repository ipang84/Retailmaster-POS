import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiDollarSign, FiCreditCard, FiSmartphone, FiCheck } from 'react-icons/fi';

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

const OrderSummarySection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    
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

const PaymentMethodSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
`;

const PaymentMethodTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PaymentMethodTab = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4a89dc' : 'transparent'};
  color: ${props => props.active ? '#4a89dc' : '#555'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    color: #4a89dc;
  }
`;

const CashPaymentSection = styled.div`
  margin-bottom: 24px;
  
  .amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .label {
      font-weight: 500;
      color: #333;
    }
    
    .amount-input {
      position: relative;
      
      input {
        width: 120px;
        padding: 10px 10px 10px 30px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        text-align: right;
        
        &:focus {
          outline: none;
          border-color: #4a89dc;
        }
      }
      
      .currency-symbol {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }
    }
  }
  
  .quick-amounts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
    
    button {
      padding: 10px;
      background-color: #f5f7fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background-color: #e9ecef;
      }
      
      &.exact {
        background-color: #e3f2fd;
        border-color: #90caf9;
        color: #1976d2;
        
        &:hover {
          background-color: #bbdefb;
        }
      }
    }
  }
  
  .change-calculation {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 12px 16px;
    
    .change-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      
      .label {
        color: #555;
      }
      
      .value {
        font-weight: 500;
        color: #333;
      }
      
      &.change-amount {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #ddd;
        font-weight: 600;
        
        .label, .value {
          font-size: 16px;
        }
        
        .value {
          color: #4a89dc;
        }
      }
    }
  }
`;

const CardPaymentSection = styled.div`
  margin-bottom: 24px;
  
  .card-type-selector {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    
    button {
      flex: 1;
      padding: 12px;
      background-color: #f5f7fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &.active {
        background-color: #e3f2fd;
        border-color: #90caf9;
        color: #1976d2;
      }
      
      &:hover {
        background-color: #e9ecef;
      }
    }
  }
  
  .card-info {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    
    p {
      margin: 0 0 8px;
      color: #555;
      font-size: 14px;
    }
    
    .card-instructions {
      display: flex;
      align-items: center;
      color: #1976d2;
      font-weight: 500;
      
      svg {
        margin-right: 8px;
      }
    }
  }
`;

const DigitalPaymentSection = styled.div`
  margin-bottom: 24px;
  
  .digital-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
    
    button {
      padding: 12px;
      background-color: #f5f7fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.active {
        background-color: #e3f2fd;
        border-color: #90caf9;
        color: #1976d2;
      }
      
      &:hover {
        background-color: #e9ecef;
      }
      
      img {
        height: 24px;
        margin-right: 8px;
      }
    }
  }
  
  .payment-instructions {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 16px;
    
    h4 {
      margin: 0 0 12px;
      font-size: 15px;
      font-weight: 600;
    }
    
    p {
      margin: 0 0 8px;
      color: #555;
      font-size: 14px;
    }
    
    .qr-placeholder {
      width: 150px;
      height: 150px;
      background-color: #e9ecef;
      border: 1px dashed #ced4da;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 16px auto;
      color: #6c757d;
      font-size: 12px;
    }
    
    .confirmation-checkbox {
      display: flex;
      align-items: center;
      margin-top: 16px;
      
      input {
        margin-right: 8px;
      }
      
      label {
        font-size: 14px;
        color: #333;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  
  button {
    padding: 12px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &.cancel {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        border-color: #999;
      }
    }
    
    &.complete {
      background-color: #4a89dc;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      
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
  }
`;

function CheckoutModal({ isOpen, onClose, orderTotal, subtotal, discount, tax, onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [cardType, setCardType] = useState('credit');
  const [digitalMethod, setDigitalMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('cash');
      setCashAmount('');
      setCardType('credit');
      setDigitalMethod('');
      setPaymentConfirmed(false);
    }
  }, [isOpen]);
  
  const handleCashAmountChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value;
    if (/^(\d*\.?\d{0,2})$/.test(value) || value === '') {
      setCashAmount(value);
    }
  };
  
  const handleQuickAmount = (amount) => {
    setCashAmount(amount.toString());
  };
  
  const calculateChange = () => {
    if (!cashAmount || isNaN(parseFloat(cashAmount))) {
      return 0;
    }
    
    const change = parseFloat(cashAmount) - orderTotal;
    return change > 0 ? change : 0;
  };
  
  const isPaymentValid = () => {
    if (paymentMethod === 'cash') {
      return cashAmount && parseFloat(cashAmount) >= orderTotal;
    } else if (paymentMethod === 'card') {
      return true; // Assuming card payment is always valid in this demo
    } else if (paymentMethod === 'digital') {
      return digitalMethod && paymentConfirmed;
    }
    return false;
  };
  
  const handleCompleteOrder = () => {
    const paymentDetails = {
      method: paymentMethod,
      amount: orderTotal,
      ...(paymentMethod === 'cash' && {
        cashReceived: parseFloat(cashAmount),
        change: calculateChange()
      }),
      ...(paymentMethod === 'card' && {
        cardType
      }),
      ...(paymentMethod === 'digital' && {
        provider: digitalMethod
      })
    };
    
    onCompleteOrder(paymentDetails);
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Checkout</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <OrderSummarySection>
            <h3>Order Summary</h3>
            <div className="summary-row">
              <div className="label">Subtotal</div>
              <div className="value">${subtotal.toFixed(2)}</div>
            </div>
            <div className="summary-row">
              <div className="label">Discount</div>
              <div className="value">-${discount.toFixed(2)}</div>
            </div>
            <div className="summary-row">
              <div className="label">Tax</div>
              <div className="value">${tax.toFixed(2)}</div>
            </div>
            <div className="summary-row total-row">
              <div className="label">Total</div>
              <div className="value">${orderTotal.toFixed(2)}</div>
            </div>
          </OrderSummarySection>
          
          <PaymentMethodSection>
            <h3>Payment Method</h3>
            <PaymentMethodTabs>
              <PaymentMethodTab 
                active={paymentMethod === 'cash'} 
                onClick={() => setPaymentMethod('cash')}
              >
                <FiDollarSign size={16} />
                Cash
              </PaymentMethodTab>
              <PaymentMethodTab 
                active={paymentMethod === 'card'} 
                onClick={() => setPaymentMethod('card')}
              >
                <FiCreditCard size={16} />
                Card
              </PaymentMethodTab>
              <PaymentMethodTab 
                active={paymentMethod === 'digital'} 
                onClick={() => setPaymentMethod('digital')}
              >
                <FiSmartphone size={16} />
                Digital Payment
              </PaymentMethodTab>
            </PaymentMethodTabs>
            
            {paymentMethod === 'cash' && (
              <CashPaymentSection>
                <div className="amount-row">
                  <div className="label">Cash Received:</div>
                  <div className="amount-input">
                    <span className="currency-symbol">$</span>
                    <input 
                      type="text" 
                      value={cashAmount} 
                      onChange={handleCashAmountChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="quick-amounts">
                  <button className="exact" onClick={() => handleQuickAmount(orderTotal)}>
                    Exact: ${orderTotal.toFixed(2)}
                  </button>
                  <button onClick={() => handleQuickAmount(20)}>$20</button>
                  <button onClick={() => handleQuickAmount(40)}>$40</button>
                  <button onClick={() => handleQuickAmount(50)}>$50</button>
                  <button onClick={() => handleQuickAmount(100)}>$100</button>
                  <button onClick={() => handleQuickAmount(Math.ceil(orderTotal / 10) * 10)}>
                    ${Math.ceil(orderTotal / 10) * 10}
                  </button>
                  <button onClick={() => handleQuickAmount(Math.ceil(orderTotal / 20) * 20)}>
                    ${Math.ceil(orderTotal / 20) * 20}
                  </button>
                  <button onClick={() => handleQuickAmount(Math.ceil(orderTotal))}>
                    ${Math.ceil(orderTotal)}
                  </button>
                </div>
                
                {cashAmount && parseFloat(cashAmount) >= orderTotal && (
                  <div className="change-calculation">
                    <div className="change-row">
                      <div className="label">Total Due:</div>
                      <div className="value">${orderTotal.toFixed(2)}</div>
                    </div>
                    <div className="change-row">
                      <div className="label">Cash Received:</div>
                      <div className="value">${parseFloat(cashAmount).toFixed(2)}</div>
                    </div>
                    <div className="change-row change-amount">
                      <div className="label">Change Due:</div>
                      <div className="value">${calculateChange().toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </CashPaymentSection>
            )}
            
            {paymentMethod === 'card' && (
              <CardPaymentSection>
                <div className="card-type-selector">
                  <button 
                    className={cardType === 'credit' ? 'active' : ''}
                    onClick={() => setCardType('credit')}
                  >
                    Credit Card
                  </button>
                  <button 
                    className={cardType === 'debit' ? 'active' : ''}
                    onClick={() => setCardType('debit')}
                  >
                    Debit Card
                  </button>
                </div>
                
                <div className="card-info">
                  <p>Please use the card terminal to process the payment.</p>
                  <p>Amount to charge: <strong>${orderTotal.toFixed(2)}</strong></p>
                  <div className="card-instructions">
                    <FiCheck size={16} />
                    Ready for payment
                  </div>
                </div>
              </CardPaymentSection>
            )}
            
            {paymentMethod === 'digital' && (
              <DigitalPaymentSection>
                <div className="digital-options">
                  <button 
                    className={digitalMethod === 'venmo' ? 'active' : ''}
                    onClick={() => setDigitalMethod('venmo')}
                  >
                    <img src="https://cdn1.venmo.com/marketing/images/branding/venmo-icon.svg" alt="Venmo" />
                    Venmo
                  </button>
                  <button 
                    className={digitalMethod === 'zelle' ? 'active' : ''}
                    onClick={() => setDigitalMethod('zelle')}
                  >
                    <img src="https://www.zellepay.com/sites/default/files/2018-06/ZelleLogo_0.svg" alt="Zelle" />
                    Zelle
                  </button>
                  <button 
                    className={digitalMethod === 'cashapp' ? 'active' : ''}
                    onClick={() => setDigitalMethod('cashapp')}
                  >
                    <img src="https://cash.app/assets/cash-app-logo.png" alt="Cash App" />
                    Cash App
                  </button>
                  <button 
                    className={digitalMethod === 'paypal' ? 'active' : ''}
                    onClick={() => setDigitalMethod('paypal')}
                  >
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" />
                    PayPal
                  </button>
                </div>
                
                {digitalMethod && (
                  <div className="payment-instructions">
                    <h4>{digitalMethod === 'venmo' ? 'Venmo' : digitalMethod === 'zelle' ? 'Zelle' : digitalMethod === 'cashapp' ? 'Cash App' : 'PayPal'} Payment</h4>
                    <p>Please send payment to the following account:</p>
                    <p><strong>Username:</strong> @your-business-name</p>
                    <p><strong>Amount:</strong> ${orderTotal.toFixed(2)}</p>
                    
                    <div className="qr-placeholder">
                      QR Code would appear here
                    </div>
                    
                    <div className="confirmation-checkbox">
                      <input 
                        type="checkbox" 
                        id="payment-confirmed" 
                        checked={paymentConfirmed}
                        onChange={() => setPaymentConfirmed(!paymentConfirmed)}
                      />
                      <label htmlFor="payment-confirmed">
                        I confirm that payment has been received
                      </label>
                    </div>
                  </div>
                )}
              </DigitalPaymentSection>
            )}
          </PaymentMethodSection>
          
          <ActionButtons>
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="complete" 
              disabled={!isPaymentValid()}
              onClick={handleCompleteOrder}
            >
              <FiCheck size={16} />
              Complete Order
            </button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CheckoutModal;
