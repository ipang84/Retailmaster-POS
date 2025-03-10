import React, { useState, useEffect } from 'react';
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

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 500px;
  max-width: 95%;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

const DenominationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DenominationLabel = styled.div`
  font-weight: 500;
  color: var(--primary-color);
  font-size: 15px;
  width: 60px;
`;

const CountInput = styled.input`
  width: 80px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: center;
  font-size: 15px;
  margin: 0 15px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const AmountDisplay = styled.div`
  color: #666;
  font-size: 14px;
  min-width: 60px;
`;

const DenominationSection = styled.div`
  margin-bottom: 20px;
`;

const DenominationColumns = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const DenominationColumn = styled.div`
  flex: 1;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
`;

const TotalLabel = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 16px;
`;

const TotalAmount = styled.div`
  font-weight: 600;
  color: var(--primary-color);
  font-size: 18px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  
  &.cancel {
    background-color: white;
    color: #333;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  &.start {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: #0055cc;
    }
  }
`;

function RegisterSessionModal({ isOpen, onClose }) {
  // Denominations
  const billDenominations = [
    { id: '1', value: 1, label: '$1' },
    { id: '5', value: 5, label: '$5' },
    { id: '10', value: 10, label: '$10' },
    { id: '20', value: 20, label: '$20' },
    { id: '50', value: 50, label: '$50' },
    { id: '100', value: 100, label: '$100' },
  ];
  
  const coinDenominations = [
    { id: '1.00', value: 1.00, label: '$1.00' },
    { id: '0.25', value: 0.25, label: '$0.25' },
    { id: '0.10', value: 0.10, label: '$0.10' },
    { id: '0.05', value: 0.05, label: '$0.05' },
    { id: '0.01', value: 0.01, label: '$0.01' },
  ];

  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Initialize counts
    const initialCounts = {};
    [...billDenominations, ...coinDenominations].forEach(denom => {
      if (denom.id) {
        initialCounts[denom.id] = 0;
      }
    });
    setCounts(initialCounts);
  }, []);

  useEffect(() => {
    // Calculate total
    let sum = 0;
    Object.keys(counts).forEach(id => {
      const denom = [...billDenominations, ...coinDenominations].find(d => d.id === id);
      if (denom) {
        sum += denom.value * counts[id];
      }
    });
    setTotal(sum);
  }, [counts]);

  const handleCountChange = (id, value) => {
    const newValue = parseInt(value, 10) || 0;
    setCounts(prev => ({
      ...prev,
      [id]: newValue >= 0 ? newValue : 0
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Start Register Session</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <DenominationColumns>
          <DenominationColumn>
            <SectionTitle>Bills</SectionTitle>
            {billDenominations.map(denom => (
              <DenominationRow key={denom.id}>
                <DenominationLabel>{denom.label} ×</DenominationLabel>
                <CountInput 
                  type="number" 
                  value={counts[denom.id] || 0}
                  onChange={(e) => handleCountChange(denom.id, e.target.value)}
                  min="0"
                />
                <AmountDisplay>= ${((denom.value * (counts[denom.id] || 0)).toFixed(2))}</AmountDisplay>
              </DenominationRow>
            ))}
          </DenominationColumn>
          
          <DenominationColumn>
            <SectionTitle>Coins</SectionTitle>
            {coinDenominations.map(denom => (
              <DenominationRow key={denom.id}>
                <DenominationLabel>${denom.value.toFixed(2)} ×</DenominationLabel>
                <CountInput 
                  type="number" 
                  value={counts[denom.id] || 0}
                  onChange={(e) => handleCountChange(denom.id, e.target.value)}
                  min="0"
                />
                <AmountDisplay>= ${((denom.value * (counts[denom.id] || 0)).toFixed(2))}</AmountDisplay>
              </DenominationRow>
            ))}
          </DenominationColumn>
        </DenominationColumns>
        
        <TotalSection>
          <TotalLabel>Total Cash</TotalLabel>
          <TotalAmount>${total.toFixed(2)}</TotalAmount>
        </TotalSection>
        
        <ActionButtons>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button className="start">
            Start Session
          </Button>
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default RegisterSessionModal;
