import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiChevronRight, 
  FiDollarSign, 
  FiCalendar, 
  FiTrendingUp, 
  FiShoppingBag, 
  FiBox,
  FiCreditCard,
  FiRefreshCw,
  FiFileText,
  FiUsers,
  FiPackage,
  FiTool,
  FiSearch,
  FiFilter,
  FiDownload,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { getInventoryLogs, getReasonTypes } from '../services/inventoryLogService';
import { getProductById } from '../services/productService';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const ReportCategoryContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    margin-right: 16px;
    background-color: ${props => props.iconBg || '#e6f7ff'};
    color: ${props => props.iconColor || '#0066ff'};
  }
  
  .content {
    flex: 1;
  }
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .description {
    font-size: 14px;
    color: #666;
  }
`;

const ReportItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 16px;
    color: ${props => props.iconColor || '#666'};
  }
  
  .title {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
  
  .arrow {
    color: #ccc;
  }
`;

const ReportContent = styled.div`
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .search-input {
    position: relative;
    flex: 1;
    margin-right: 16px;
    
    input {
      width: 100%;
      padding: 10px 16px 10px 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
    
    svg {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  .date-input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: #0055cc;
    }
  }
  
  &.secondary {
    background-color: #f0f9ff;
    color: var(--primary-color);
    border: none;
    
    &:hover {
      background-color: #e0f0ff;
    }
  }
`;

const LogsTable = styled.div`
  width: 100%;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #f9f9f9;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      
      .sort-icon {
        margin-left: 4px;
        vertical-align: middle;
      }
    }
    
    tr:hover td {
      background-color: #f5f5f5;
    }
    
    .quantity-change {
      font-weight: 500;
      
      &.increase {
        color: #2e7d32;
      }
      
      &.decrease {
        color: #d32f2f;
      }
    }
    
    .reason-tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.purchase {
        background-color: #e3f2fd;
        color: #1976d2;
      }
      
      &.sale {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      &.return {
        background-color: #fff8e1;
        color: #f57f17;
      }
      
      &.damage {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      &.adjustment {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }
      
      &.count {
        background-color: #e8eaf6;
        color: #3f51b5;
      }
      
      &.transfer {
        background-color: #e0f2f1;
        color: #00796b;
      }
      
      &.other {
        background-color: #f5f5f5;
        color: #616161;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #ccc;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto;
  }
`;

function Reports() {
  // State to track which categories are expanded (all expanded by default)
  const [expandedCategories, setExpandedCategories] = useState({
    sales: true,
    finances: true,
    inventory: true,
    customers: true
  });

  // State for active report
  const [activeReport, setActiveReport] = useState(null);
  
  // State for inventory logs
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReasonType, setSelectedReasonType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Load inventory logs when inventory update report is selected
  useEffect(() => {
    if (activeReport === 'inventory-movement') {
      loadInventoryLogs();
    }
  }, [activeReport]);
  
  // Filter logs when search or filters change
  useEffect(() => {
    if (!inventoryLogs.length) return;
    
    let filtered = [...inventoryLogs];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.productName.toLowerCase().includes(term) || 
        (log.productSku && log.productSku.toLowerCase().includes(term)) ||
        (log.referenceNumber && log.referenceNumber.toLowerCase().includes(term))
      );
    }
    
    // Apply reason type filter
    if (selectedReasonType !== 'all') {
      filtered = filtered.filter(log => log.reasonType === selectedReasonType);
    }
    
    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate + 'T23:59:59').getTime(); // End of the selected day
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() <= end);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'quantityChange':
          aValue = a.quantityChange;
          bValue = b.quantityChange;
          break;
        case 'newQuantity':
          aValue = a.newQuantity;
          bValue = b.newQuantity;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredLogs(filtered);
  }, [inventoryLogs, searchTerm, selectedReasonType, startDate, endDate, sortField, sortDirection]);
  
  const loadInventoryLogs = () => {
    const logs = getInventoryLogs();
    setInventoryLogs(logs);
    setFilteredLogs(logs);
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  // Handle report selection
  const handleReportSelect = (reportId) => {
    setActiveReport(reportId);
    
    // Reset filters when changing reports
    setSearchTerm('');
    setSelectedReasonType('all');
    setStartDate('');
    setEndDate('');
  };
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get reason types for filter
  const reasonTypes = getReasonTypes();
  
  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <FiArrowUp className="sort-icon" size={12} /> : 
      <FiArrowDown className="sort-icon" size={12} />;
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Reports</Title>
      </PageHeader>
      
      {!activeReport ? (
        <>
          {/* Sales Reports Category */}
          <ReportCategoryContainer>
            <CategoryHeader 
              iconBg="#e6f7ff" 
              iconColor="#0066ff"
              onClick={() => toggleCategory('sales')}
            >
              <div className="icon-container">
                <FiDollarSign size={20} />
              </div>
              <div className="content">
                <div className="title">Sales</div>
                <div className="description">Make business decisions by comparing sales across products, supplier, and more.</div>
              </div>
              <FiChevronRight 
                className="arrow" 
                style={{ 
                  transform: expandedCategories.sales ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </CategoryHeader>
            
            {expandedCategories.sales && (
              <>
                <ReportItem iconColor="#0066ff" onClick={() => handleReportSelect('daily-sales')}>
                  <div className="icon">
                    <FiCalendar />
                  </div>
                  <div className="title">Daily Detailed Sales</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#0066ff" onClick={() => handleReportSelect('sales-over-time')}>
                  <div className="icon">
                    <FiTrendingUp />
                  </div>
                  <div className="title">Sales over time</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#0066ff" onClick={() => handleReportSelect('sales-by-vendor')}>
                  <div className="icon">
                    <FiShoppingBag />
                  </div>
                  <div className="title">Sales by vendor</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#0066ff" onClick={() => handleReportSelect('sales-by-product')}>
                  <div className="icon">
                    <FiBox />
                  </div>
                  <div className="title">Sales by product</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
              </>
            )}
          </ReportCategoryContainer>
          
          {/* Finances Reports Category */}
          <ReportCategoryContainer>
            <CategoryHeader 
              iconBg="#e6fff0" 
              iconColor="#00cc66"
              onClick={() => toggleCategory('finances')}
            >
              <div className="icon-container">
                <FiDollarSign size={20} />
              </div>
              <div className="content">
                <div className="title">Finances</div>
                <div className="description">View your store's finances including sales, returns, taxes, and payment.</div>
              </div>
              <FiChevronRight 
                className="arrow" 
                style={{ 
                  transform: expandedCategories.finances ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </CategoryHeader>
            
            {expandedCategories.finances && (
              <>
                <ReportItem iconColor="#00cc66" onClick={() => handleReportSelect('payment-type')}>
                  <div className="icon">
                    <FiCreditCard />
                  </div>
                  <div className="title">Payment type</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#00cc66" onClick={() => handleReportSelect('returns')}>
                  <div className="icon">
                    <FiRefreshCw />
                  </div>
                  <div className="title">Returns</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#00cc66" onClick={() => handleReportSelect('taxes')}>
                  <div className="icon">
                    <FiFileText />
                  </div>
                  <div className="title">Taxes</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
              </>
            )}
          </ReportCategoryContainer>
          
          {/* Inventory Reports Category */}
          <ReportCategoryContainer>
            <CategoryHeader 
              iconBg="#fff0e6" 
              iconColor="#ff6600"
              onClick={() => toggleCategory('inventory')}
            >
              <div className="icon-container">
                <FiPackage size={20} />
              </div>
              <div className="content">
                <div className="title">Inventory</div>
                <div className="description">Track inventory levels, movements, and valuation across your store.</div>
              </div>
              <FiChevronRight 
                className="arrow" 
                style={{ 
                  transform: expandedCategories.inventory ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </CategoryHeader>
            
            {expandedCategories.inventory && (
              <>
                <ReportItem iconColor="#ff6600" onClick={() => handleReportSelect('inventory-valuation')}>
                  <div className="icon">
                    <FiBox />
                  </div>
                  <div className="title">Inventory Valuation</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#ff6600" onClick={() => handleReportSelect('inventory-movement')}>
                  <div className="icon">
                    <FiTrendingUp />
                  </div>
                  <div className="title">Inventory Movement</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#ff6600" onClick={() => handleReportSelect('stock-turnover')}>
                  <div className="icon">
                    <FiRefreshCw />
                  </div>
                  <div className="title">Stock Turnover</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#ff6600" onClick={() => handleReportSelect('low-stock')}>
                  <div className="icon">
                    <FiFileText />
                  </div>
                  <div className="title">Low Stock Report</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
              </>
            )}
          </ReportCategoryContainer>
          
          {/* Customers Reports Category */}
          <ReportCategoryContainer>
            <CategoryHeader 
              iconBg="#e6e6ff" 
              iconColor="#6666ff"
              onClick={() => toggleCategory('customers')}
            >
              <div className="icon-container">
                <FiUsers size={20} />
              </div>
              <div className="content">
                <div className="title">Customers</div>
                <div className="description">Analyze customer behavior, purchase history, and loyalty metrics.</div>
              </div>
              <FiChevronRight 
                className="arrow" 
                style={{ 
                  transform: expandedCategories.customers ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </CategoryHeader>
            
            {expandedCategories.customers && (
              <>
                <ReportItem iconColor="#6666ff" onClick={() => handleReportSelect('customer-purchase-history')}>
                  <div className="icon">
                    <FiUsers />
                  </div>
                  <div className="title">Customer Purchase History</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#6666ff" onClick={() => handleReportSelect('customer-acquisition')}>
                  <div className="icon">
                    <FiTrendingUp />
                  </div>
                  <div className="title">Customer Acquisition</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#6666ff" onClick={() => handleReportSelect('customer-retention')}>
                  <div className="icon">
                    <FiRefreshCw />
                  </div>
                  <div className="title">Customer Retention</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
                
                <ReportItem iconColor="#6666ff" onClick={() => handleReportSelect('customer-lifetime-value')}>
                  <div className="icon">
                    <FiDollarSign />
                  </div>
                  <div className="title">Customer Lifetime Value</div>
                  <FiChevronRight className="arrow" />
                </ReportItem>
              </>
            )}
          </ReportCategoryContainer>
        </>
      ) : (
        // Active Report View
        <ReportCategoryContainer>
          <CategoryHeader 
            iconBg="#fff0e6" 
            iconColor="#ff6600"
            onClick={() => setActiveReport(null)}
            style={{ cursor: 'pointer' }}
          >
            <div className="icon-container">
              <FiPackage size={20} />
            </div>
            <div className="content">
              <div className="title">
                {activeReport === 'inventory-movement' && 'Inventory Movement'}
                {activeReport === 'inventory-valuation' && 'Inventory Valuation'}
                {activeReport === 'low-stock' && 'Low Stock Report'}
                {activeReport === 'stock-turnover' && 'Stock Turnover'}
                {/* Add other report titles as needed */}
              </div>
              <div className="description">
                {activeReport === 'inventory-movement' && 'Track all inventory quantity changes with detailed information.'}
                {activeReport === 'inventory-valuation' && 'View the current value of your inventory.'}
                {activeReport === 'low-stock' && 'Products that are below their minimum stock levels.'}
                {activeReport === 'stock-turnover' && 'Analyze how quickly products are selling.'}
                {/* Add other report descriptions as needed */}
              </div>
            </div>
            <FiChevronRight 
              className="arrow" 
              style={{ 
                transform: 'rotate(270deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </CategoryHeader>
          
          <ReportContent>
            {activeReport === 'inventory-movement' && (
              <>
                <SearchContainer>
                  <div className="search-input">
                    <FiSearch />
                    <input 
                      type="text" 
                      placeholder="Search by product name, SKU, or reference number..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ActionButton className="secondary">
                    <FiDownload />
                    Export
                  </ActionButton>
                </SearchContainer>
                
                <FilterContainer>
                  <select 
                    value={selectedReasonType}
                    onChange={(e) => setSelectedReasonType(e.target.value)}
                  >
                    <option value="all">All Reasons</option>
                    {reasonTypes.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.name}</option>
                    ))}
                  </select>
                  
                  <input 
                    type="date" 
                    className="date-input"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  
                  <input 
                    type="date" 
                    className="date-input"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FilterContainer>
                
                {filteredLogs.length > 0 ? (
                  <LogsTable>
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('timestamp')}>
                            Date/Time {renderSortIcon('timestamp')}
                          </th>
                          <th onClick={() => handleSort('productName')}>
                            Product {renderSortIcon('productName')}
                          </th>
                          <th onClick={() => handleSort('previousQuantity')}>
                            Previous Stock {renderSortIcon('previousQuantity')}
                          </th>
                          <th onClick={() => handleSort('quantityChange')}>
                            Change {renderSortIcon('quantityChange')}
                          </th>
                          <th onClick={() => handleSort('newQuantity')}>
                            New Stock {renderSortIcon('newQuantity')}
                          </th>
                          <th onClick={() => handleSort('reasonType')}>
                            Reason {renderSortIcon('reasonType')}
                          </th>
                          <th onClick={() => handleSort('userName')}>
                            User {renderSortIcon('userName')}
                          </th>
                          <th>Reference</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map(log => (
                          <tr key={log.id}>
                            <td>{formatDate(log.timestamp)}</td>
                            <td>
                              {log.productName}
                              {log.productSku && <span style={{ color: '#777', fontSize: '12px', display: 'block' }}>
                                SKU: {log.productSku}
                              </span>}
                            </td>
                            <td>{log.previousQuantity}</td>
                            <td className={`quantity-change ${log.quantityChange > 0 ? 'increase' : 'decrease'}`}>
                              {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                            </td>
                            <td>{log.newQuantity}</td>
                            <td>
                              <span className={`reason-tag ${log.reasonType}`}>
                                {reasonTypes.find(r => r.id === log.reasonType)?.name || log.reasonType}
                              </span>
                            </td>
                            <td>{log.userName}</td>
                            <td>{log.referenceNumber || '-'}</td>
                            <td>{log.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </LogsTable>
                ) : (
                  <EmptyState>
                    <div className="icon"><FiPackage /></div>
                    <div className="title">No inventory logs found</div>
                    <div className="description">
                      {inventoryLogs.length === 0 
                        ? "There are no inventory updates recorded yet. Updates will appear here when you make changes to your inventory."
                        : "No logs match your current filters. Try adjusting your search or filters to see more results."}
                    </div>
                  </EmptyState>
                )}
              </>
            )}
            
            {/* Add other report content as needed */}
            {activeReport !== 'inventory-movement' && (
              <EmptyState>
                <div className="icon"><FiFileText /></div>
                <div className="title">Report Coming Soon</div>
                <div className="description">
                  This report is currently under development and will be available soon.
                </div>
              </EmptyState>
            )}
          </ReportContent>
        </ReportCategoryContainer>
      )}
    </PageContainer>
  );
}

export default Reports;
