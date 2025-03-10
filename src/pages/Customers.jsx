import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiSearch, FiChevronLeft, FiMoreHorizontal, FiDownload, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import CustomerModal from '../components/CustomerModal';
import { getCustomers, addCustomer } from '../services/customerService';

const PageContainer = styled.div`
  padding: 24px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  text-decoration: none;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #666;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  ${props => props.primary ? `
    background-color: #4a89dc;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3b7dd8;
    }
  ` : `
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 280px;
  padding: 10px 16px 10px 40px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a89dc;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const CustomersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  
  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
    color: #666;
    font-size: 14px;
  }
  
  th:first-child {
    width: 40px;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #eee;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
  
  td {
    padding: 12px 16px;
    font-size: 14px;
    color: #333;
  }
  
  td.actions {
    text-align: center;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

function Customers() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Load customers on component mount and when localStorage changes
  useEffect(() => {
    loadCustomers();
    
    // Listen for storage events to update customer list when changes occur in other tabs/components
    const handleStorageChange = (e) => {
      if (e.key === 'customers') {
        loadCustomers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Load customers from service
  const loadCustomers = () => {
    const customers = getCustomers();
    setCustomerList(customers);
    setFilteredCustomers(customers);
  };
  
  // Filter customers when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customerList);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = customerList.filter(customer => 
        customer.fullName.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.companyName && customer.companyName.toLowerCase().includes(query))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customerList]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleAddCustomer = (customerData) => {
    // Add the customer using the service
    const newCustomer = addCustomer(customerData);
    
    // Update the local state
    setCustomerList([...customerList, newCustomer]);
    
    // Close the modal
    setShowAddModal(false);
    
    // Trigger a custom event to notify other components about the change
    window.dispatchEvent(new Event('customerDataChanged'));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      <PageHeader>
        <HeaderLeft>
          <BackButton to="/">
            <FiChevronLeft size={20} />
          </BackButton>
          <Title>Customers</Title>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton>
            <FiDownload />
            Import
          </ActionButton>
          <ActionButton>
            <FiUpload />
            Export
          </ActionButton>
          <ActionButton primary onClick={() => setShowAddModal(true)}>
            <FiPlus />
            Add Customer
          </ActionButton>
        </HeaderActions>
      </PageHeader>
      
      <SearchContainer>
        <FiSearch size={16} />
        <SearchInput 
          type="text" 
          placeholder="Search customers" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <CustomersTable>
        <TableHeader>
          <tr>
            <th>
              <Checkbox 
                type="checkbox" 
                checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Company</th>
            <th>Created At</th>
            <th>Orders</th>
            <th>Amount Spent</th>
            <th></th>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>
                  <Checkbox 
                    type="checkbox" 
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                  />
                </td>
                <td>{customer.fullName}</td>
                <td>{customer.phone || 'N/A'}</td>
                <td>{customer.email || 'N/A'}</td>
                <td>{customer.companyName || 'N/A'}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>{customer.orders || 0}</td>
                <td>${customer.amountSpent || '0.00'}</td>
                <td className="actions">
                  <MoreButton>
                    <FiMoreHorizontal size={18} />
                  </MoreButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '24px' }}>
                No customers found. Add a new customer or adjust your search.
              </td>
            </tr>
          )}
        </TableBody>
      </CustomersTable>
      
      <CustomerModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCustomer}
      />
    </PageContainer>
  );
}

export default Customers;
