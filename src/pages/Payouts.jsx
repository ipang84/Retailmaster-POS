import React from 'react';
import styled from 'styled-components';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const PayoutsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .icon {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .description {
    color: #666;
    max-width: 400px;
    margin-bottom: 24px;
  }
  
  button {
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
  }
`;

function Payouts() {
  return (
    <div>
      <PageHeader>
        <Title>Payouts</Title>
      </PageHeader>
      
      <PayoutsContainer>
        <EmptyState>
          <div className="icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <div className="title">No payouts yet</div>
          <div className="description">
            Complete transactions to see your payouts history.
          </div>
          <button>Set Up Payment Method</button>
        </EmptyState>
      </PayoutsContainer>
    </div>
  );
}

export default Payouts;
