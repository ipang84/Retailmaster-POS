import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

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
  max-width: 500px;
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

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  input, textarea, select {
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
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }

  .input-row {
    display: flex;
    gap: 12px;
    
    > div {
      flex: 1;
    }
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
    
    &.save {
      background-color: #4a89dc;
      color: white;
      border: none;
      
      &:hover {
        background-color: #3b7dd8;
      }
    }
  }
`;

function CustomerModal({ isOpen, onClose, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [customerType, setCustomerType] = useState('individual');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create customer object
    const customer = {
      id: `customer-${Date.now()}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      customerType,
      companyName: customerType === 'business' ? companyName : '',
      notes,
      createdAt: new Date().toISOString(),
      orders: 0,
      amountSpent: 0
    };
    
    // Pass the customer to parent component
    onSave(customer);
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setCustomerType('individual');
    setCompanyName('');
    setNotes('');
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Create New Customer</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Customer Type</label>
              <select 
                value={customerType} 
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </FormGroup>
            
            {customerType === 'business' && (
              <FormGroup>
                <label htmlFor="companyName">Company Name *</label>
                <input 
                  type="text" 
                  id="companyName" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  required={customerType === 'business'}
                />
              </FormGroup>
            )}
            
            <FormGroup>
              <div className="input-row">
                <div>
                  <label htmlFor="firstName">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="phone">Phone *</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <div className="input-row">
                <div>
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="zipCode">Zip Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormGroup>
            
            <ButtonGroup>
              <button type="button" className="cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save">
                Save Customer
              </button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CustomerModal;
