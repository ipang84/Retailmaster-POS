// Inventory Log Service
// Handles inventory update logs storage, retrieval, and manipulation

// Initialize logs from localStorage or use empty array
const initializeLogs = () => {
  const storedLogs = localStorage.getItem('inventoryLogs');
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  
  // If no stored logs, return empty array
  return [];
};

// Get all inventory logs
export const getInventoryLogs = () => {
  return initializeLogs();
};

// Add new inventory log
export const addInventoryLog = (logData) => {
  const logs = getInventoryLogs();
  
  // Create new log entry with timestamp
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...logData
  };
  
  // Add to logs array
  logs.unshift(newLog); // Add to beginning of array for chronological order (newest first)
  
  // Save to localStorage
  localStorage.setItem('inventoryLogs', JSON.stringify(logs));
  
  return newLog;
};

// Get logs for a specific product
export const getLogsByProductId = (productId) => {
  const logs = getInventoryLogs();
  return logs.filter(log => log.productId === productId);
};

// Get logs by date range
export const getLogsByDateRange = (startDate, endDate) => {
  const logs = getInventoryLogs();
  
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    return logTime >= start && logTime <= end;
  });
};

// Get logs by user
export const getLogsByUser = (userId) => {
  const logs = getInventoryLogs();
  return logs.filter(log => log.userId === userId);
};

// Get logs by reason type
export const getLogsByReasonType = (reasonType) => {
  const logs = getInventoryLogs();
  return logs.filter(log => log.reasonType === reasonType);
};

// Clear all logs (for testing or maintenance)
export const clearLogs = () => {
  localStorage.removeItem('inventoryLogs');
  return true;
};

// Get reason types (for filtering)
export const getReasonTypes = () => {
  return [
    { id: 'purchase', name: 'Purchase' },
    { id: 'sale', name: 'Sale' },
    { id: 'return', name: 'Return' },
    { id: 'damage', name: 'Damage/Loss' },
    { id: 'adjustment', name: 'Inventory Adjustment' },
    { id: 'count', name: 'Physical Count' },
    { id: 'transfer', name: 'Transfer' },
    { id: 'other', name: 'Other' }
  ];
};

// Get summary statistics for inventory logs
export const getInventoryLogStats = () => {
  const logs = getInventoryLogs();
  
  // Initialize stats
  const stats = {
    totalLogs: logs.length,
    totalIncrease: 0,
    totalDecrease: 0,
    byReasonType: {},
    recentActivity: logs.slice(0, 5) // Get 5 most recent logs
  };
  
  // Calculate stats
  logs.forEach(log => {
    // Count increases and decreases
    if (log.quantityChange > 0) {
      stats.totalIncrease += log.quantityChange;
    } else {
      stats.totalDecrease += Math.abs(log.quantityChange);
    }
    
    // Count by reason type
    if (!stats.byReasonType[log.reasonType]) {
      stats.byReasonType[log.reasonType] = 0;
    }
    stats.byReasonType[log.reasonType]++;
  });
  
  return stats;
};
