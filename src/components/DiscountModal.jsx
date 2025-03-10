import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiPercent, FiDollarSign } from 'react-icons/fi';

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
  max-width: 450px;
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

const DiscountTypeSelector = styled.div`
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const TypeButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.active ? '#4a89dc' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#4a89dc' : '#f5f5f5'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
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
  }
  
  .input-group {
    position: relative;
    display: flex;
    align-items: center;
    
    input {
      padding-left: ${props => props.type === 'percentage' ? '10px' : '30px'};
      padding-right: ${props => props.type === 'percentage' ? '30px' : '10px'};
    }
    
    .icon {
      position: absolute;
      color: #666;
      font-size: 14px;
      
      &.left {
        left: 10px;
      }
      
      &.right {
        right: 10px;
      }
    }
  }
  
  .helper-text {
    margin-top: 6px;
    font-size: 12px;
    color: #666;
  }
  
  .discount-preview {
    margin-top: 8px;
    font-size: 14px;
    color: #4a89dc;
    font-weight: 500;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  
  button {
    padding: 10px 16px;
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
    
    &.apply {
      background-color: #4a89dc;
      color: white;
      border: none;
      
      &:hover {
        background-color: #3b7dd8;
      }
    }
  }
`;

function DiscountModal({ isOpen, onClose, onApplyDiscount, subtotal }) {
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'fixed'
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  
  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setDiscountValue(''); // Reset value when changing type
  };
  
  const handleDiscountValueChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    if (/^(\d*\.?\d*)$/.test(value) || value === '') {
      setDiscountValue(value);
    }
  };
  
  const calculateDiscountAmount = () => {
    if (!discountValue || isNaN(parseFloat(discountValue))) {
      return 0;
    }
    
    if (discountType === 'percentage') {
      const percentage = parseFloat(discountValue);
      if (percentage > 100) return subtotal; // Cap at 100%
      return (subtotal * percentage) / 100;
    } else {
      const amount = parseFloat(discountValue);
      return amount > subtotal ? subtotal : amount; // Cap at subtotal
    }
  };
  
  const handleApplyDiscount = () => {
    if (!discountValue || isNaN(parseFloat(discountValue))) {
      return;
    }
    
    const discountAmount = calculateDiscountAmount();
    
    onApplyDiscount({
      type: discountType,
      value: parseFloat(discountValue),
      amount: discountAmount,
      reason: discountReason
    });
    
    // Reset form and close modal
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setDiscountType('percentage');
    setDiscountValue('');
    setDiscountReason('');
  };
  
  if (!isOpen) return null;
  
  const discountAmount = calculateDiscountAmount();
  const formattedDiscountAmount = discountAmount.toFixed(2);
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Add Discount</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <DiscountTypeSelector>
            <TypeButton 
              active={discountType === 'percentage'} 
              onClick={() => handleDiscountTypeChange('percentage')}
            >
              <FiPercent size={16} />
              Percentage
            </TypeButton>
            <TypeButton 
              active={discountType === 'fixed'} 
              onClick={() => handleDiscountTypeChange('fixed')}
            >
              <FiDollarSign size={16} />
              Fixed Amount
            </TypeButton>
          </DiscountTypeSelector>
          
          <FormGroup type={discountType}>
            <label htmlFor="discountValue">
              {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </label>
            <div className="input-group">
              {discountType === 'fixed' && (
                <span className="icon left">$</span>
              )}
              <input 
                type="text"
                id="discountValue" 
                value={discountValue} 
                onChange={handleDiscountValueChange}
                placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              />
              {discountType === 'percentage' && (
                <span className="icon right">%</span>
              )}
            </div>
            <div className="helper-text">
              {discountType === 'percentage' 
                ? 'Enter a percentage between 0 and 100' 
                : `Enter an amount between $0 and $${subtotal.toFixed(2)}`}
            </div>
            {discountValue && !isNaN(parseFloat(discountValue)) && (
              <div className="discount-preview">
                Discount: ${formattedDiscountAmount}
              </div>
            )}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="discountReason">Reason (Optional)</label>
            <input 
              type="text" 
              id="discountReason" 
              value={discountReason} 
              onChange={(e) => setDiscountReason(e.target.value)}
              placeholder="e.g., Loyalty discount, Damaged item, etc."
            />
          </FormGroup>
          
          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="apply"
              onClick={handleApplyDiscount}
              disabled={!discountValue || isNaN(parseFloat(discountValue))}
            >
              Apply Discount
            </button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DiscountModal;
