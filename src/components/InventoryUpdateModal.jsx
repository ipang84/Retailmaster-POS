import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { getReasonTypes } from '../services/inventoryLogService';

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

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
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
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  .helper-text {
    font-size: 12px;
    color: #777;
    margin-top: 4px;
  }
  
  .error-text {
    font-size: 12px;
    color: #d32f2f;
    margin-top: 4px;
  }
`;

const InventorySummary = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  
  .product-name {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .inventory-change {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .label {
      width: 120px;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      
      &.increase {
        color: #2e7d32;
      }
      
      &.decrease {
        color: #d32f2f;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    
    &.cancel {
      background-color: white;
      color: #666;
      border: 1px solid #ddd;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }
    
    &.submit {
      background-color: var(--primary-color);
      color: white;
      border: none;
      
      &:hover {
        background-color: #0055cc;
      }
    }
  }
`;

function InventoryUpdateModal({ isOpen, onClose, product, quantityChange, onConfirm }) {
  const [reasonType, setReasonType] = useState('adjustment');
  const [notes, setNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errors, setErrors] = useState({});
  
  const reasonTypes = getReasonTypes();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!reasonType) {
      newErrors.reasonType = 'Please select a reason for this update';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm({
        reasonType,
        notes,
        referenceNumber
      });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Inventory Update Reason</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </ModalHeader>
        
        <InventorySummary>
          <div className="product-name">{product.name}</div>
          <div className="inventory-change">
            <div className="label">Current Stock:</div>
            <div className="value">{product.currentStock}</div>
          </div>
          <div className="inventory-change">
            <div className="label">Change:</div>
            <div className={`value ${quantityChange > 0 ? 'increase' : quantityChange < 0 ? 'decrease' : ''}`}>
              {quantityChange > 0 ? `+${quantityChange}` : quantityChange}
            </div>
          </div>
          <div className="inventory-change">
            <div className="label">New Stock:</div>
            <div className="value">{product.currentStock + quantityChange}</div>
          </div>
        </InventorySummary>
        
        <FormGroup>
          <label htmlFor="reasonType">Reason for Update*</label>
          <select 
            id="reasonType"
            value={reasonType}
            onChange={(e) => setReasonType(e.target.value)}
          >
            {reasonTypes.map(reason => (
              <option key={reason.id} value={reason.id}>{reason.name}</option>
            ))}
          </select>
          {errors.reasonType && <div className="error-text">{errors.reasonType}</div>}
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="referenceNumber">Reference Number</label>
          <input 
            type="text" 
            id="referenceNumber" 
            placeholder="Order #, Invoice #, etc."
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
          <div className="helper-text">Optional: Add a reference number for this update</div>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="notes">Notes</label>
          <textarea 
            id="notes" 
            placeholder="Add any additional details about this inventory update"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </FormGroup>
        
        <ButtonGroup>
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handleSubmit}>Confirm Update</button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default InventoryUpdateModal;
