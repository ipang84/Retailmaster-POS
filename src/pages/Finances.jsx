import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiPercent, 
  FiChevronRight,
  FiFilter,
  FiCreditCard,
  FiHome
} from 'react-icons/fi';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #002855;
`;

const DateFilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

const DateFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateFilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background-color: ${props => props.bgColor || '#f0f7ff'};
  border-radius: 8px;
  padding: 20px;
  
  .icon {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: ${props => props.iconColor || '#0066ff'};
    font-size: 20px;
  }
  
  .value {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 14px;
    color: #666;
  }
`;

const SectionContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  .payment-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: ${props => props.iconBg || '#e6f7ff'};
      color: ${props => props.iconColor || '#0066ff'};
      font-size: 20px;
    }
    
    .details {
      .name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      
      .description {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  .payment-amount {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
    
    .chevron {
      color: #999;
    }
  }
`;

const StoreItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  
  .store-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #fff0e6;
      color: #ff6600;
      font-size: 20px;
    }
    
    .details {
      .name {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      
      .description {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  .store-amount {
    font-weight: 600;
    color: #333;
  }
`;

function Finances() {
  const [startDate, setStartDate] = useState('03/07/2025');
  const [endDate, setEndDate] = useState('03/07/2025');

  return (
    <PageContainer>
      <PageHeader>
        <Title>Finance</Title>
      </PageHeader>
      
      <DateFilterContainer>
        <DateFilterGroup>
          <DateFilterLabel>Start Date</DateFilterLabel>
          <DateInput 
            type="text" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </DateFilterGroup>
        
        <DateFilterGroup>
          <DateFilterLabel>End Date</DateFilterLabel>
          <DateInput 
            type="text" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </DateFilterGroup>
      </DateFilterContainer>
      
      <MetricsContainer>
        <MetricCard bgColor="#f0f7ff" iconColor="#0066ff">
          <div className="icon">
            <FiDollarSign />
          </div>
          <div className="value">$0.00</div>
          <div className="label">Total revenue from all sales</div>
        </MetricCard>
        
        <MetricCard bgColor="#f0fff0" iconColor="#00cc66">
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="value">$0.00</div>
          <div className="label">Revenue minus cost of goods sold</div>
        </MetricCard>
        
        <MetricCard bgColor="#f5f0ff" iconColor="#6633cc">
          <div className="icon">
            <FiPercent />
          </div>
          <div className="value">0.00%</div>
          <div className="label">Profit as percentage of revenue</div>
        </MetricCard>
      </MetricsContainer>
      
      <div className="sections-grid">
        <div className="section-row">
          <SectionContainer>
            <SectionHeader>
              <div className="title">Payment Breakdown</div>
            </SectionHeader>
            
            <PaymentItem iconBg="#e6ffe6" iconColor="#00cc66">
              <div className="payment-info">
                <div className="icon">
                  <FiDollarSign />
                </div>
                <div className="details">
                  <div className="name">Cash Payments</div>
                  <div className="description">Total cash transactions</div>
                </div>
              </div>
              <div className="payment-amount">
                $0.00
                <FiChevronRight className="chevron" />
              </div>
            </PaymentItem>
            
            <PaymentItem iconBg="#e6f0ff" iconColor="#0066cc">
              <div className="payment-info">
                <div className="icon">
                  <FiCreditCard />
                </div>
                <div className="details">
                  <div className="name">Card Payments</div>
                  <div className="description">Total card transactions</div>
                </div>
              </div>
              <div className="payment-amount">
                $0.00
                <FiChevronRight className="chevron" />
              </div>
            </PaymentItem>
          </SectionContainer>
          
          <SectionContainer>
            <SectionHeader>
              <div className="title">Sales by Category</div>
              <div className="actions">
                <FilterButton>
                  <FiFilter />
                  Filter
                </FilterButton>
              </div>
            </SectionHeader>
            
            {/* Empty state or will be populated with categories */}
          </SectionContainer>
        </div>
        
        <SectionContainer>
          <SectionHeader>
            <div className="title">Store Location</div>
          </SectionHeader>
          
          <StoreItem>
            <div className="store-info">
              <div className="icon">
                <FiHome />
              </div>
              <div className="details">
                <div className="name">Main Store</div>
                <div className="description">Current location net sales</div>
              </div>
            </div>
            <div className="store-amount">
              $0.00
            </div>
          </StoreItem>
        </SectionContainer>
      </div>
    </PageContainer>
  );
}

export default Finances;
