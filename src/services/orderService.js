// orderService.js
import { updateInventoryStock } from './productService';
import { addInventoryLog } from './inventoryLogService';

const ORDERS_STORAGE_KEY = 'retailmaster_orders';
const REFUNDS_STORAGE_KEY = 'retailmaster_refunds';

// Get all orders from localStorage
export const getOrders = () => {
  const ordersData = localStorage.getItem(ORDERS_STORAGE_KEY);
  return ordersData ? JSON.parse(ordersData) : [];
};

// Save an order to localStorage and update inventory
export const saveOrder = (order) => {
  // First, deduct items from inventory
  deductInventoryForOrder(order);
  
  // Then save the order
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return order;
};

// Deduct inventory for all items in an order
const deductInventoryForOrder = (order) => {
  if (!order.items || order.items.length === 0) return;
  
  // Process each item in the order
  order.items.forEach(item => {
    // Skip custom items that don't have inventory tracking
    if (item.id && !item.id.startsWith('custom-')) {
      // Deduct the quantity from inventory (negative value to reduce stock)
      updateInventoryStock(item.id, -item.quantity);
      
      // Log the inventory change
      addInventoryLog({
        productId: item.id,
        productName: item.name,
        quantityChange: -item.quantity,
        reasonType: 'sale',
        reason: `Sale - Order #${order.id}`,
        userId: 'system', // In a real app, this would be the logged-in user
        notes: `Automatic deduction from order ${order.id}`
      });
    }
  });
};

// Get order by ID
export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
};

// Delete order
export const deleteOrder = (orderId) => {
  const orders = getOrders();
  const updatedOrders = orders.filter(order => order.id !== orderId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
};

// Get all refunds
export const getRefunds = () => {
  const refundsData = localStorage.getItem(REFUNDS_STORAGE_KEY);
  return refundsData ? JSON.parse(refundsData) : [];
};

// Process a refund
export const processRefund = async (refundData) => {
  // Get the original order
  const order = getOrderById(refundData.orderId);
  if (!order) {
    throw new Error(`Order with ID ${refundData.orderId} not found`);
  }
  
  // Update inventory for refunded items if condition is 'new'
  const inventoryUpdates = [];
  const inventoryErrors = [];
  
  for (const item of refundData.items) {
    if (item.condition === 'new' && !item.id.startsWith('custom-')) {
      try {
        // Only return to inventory if condition is 'new' and not a custom item
        const result = updateInventoryStock(item.id, item.quantity);
        
        if (result) {
          console.log(`Successfully returned ${item.quantity} units of ${item.name} to inventory`);
          inventoryUpdates.push(`${item.quantity} x ${item.name}`);
          
          // Log the inventory change
          addInventoryLog({
            productId: item.id,
            productName: item.name,
            quantityChange: item.quantity,
            reasonType: 'return',
            reason: `Return - Refund from Order #${order.id}`,
            userId: 'system',
            notes: `Item returned in new condition from refund of order ${order.id}`
          });
        } else {
          console.error(`Failed to update inventory for ${item.name}`);
          inventoryErrors.push(`Failed to update inventory for ${item.name}`);
        }
      } catch (error) {
        console.error(`Error updating inventory for ${item.name}:`, error);
        inventoryErrors.push(`Error updating ${item.name}: ${error.message}`);
      }
    }
  }
  
  // Update the order with refund information
  const orders = getOrders();
  const updatedOrders = orders.map(o => {
    if (o.id === order.id) {
      // Add refund information to the order
      const refundInfo = {
        id: `REF-${Date.now()}`,
        timestamp: refundData.timestamp,
        amount: refundData.amount,
        items: refundData.items,
        method: refundData.method,
        note: refundData.note
      };
      
      // Add refund to the order's refunds array or create it if it doesn't exist
      const updatedOrder = {
        ...o,
        refunds: o.refunds ? [...o.refunds, refundInfo] : [refundInfo],
      };
      
      // Determine if this is a full or partial refund
      const isFullRefund = isOrderFullyRefunded(updatedOrder);
      updatedOrder.status = isFullRefund ? 'refunded' : 'partial-refunded';
      
      // Add a note about the refund to the order notes
      let refundNote = `Refund processed on ${new Date(refundData.timestamp).toLocaleString()}. Amount: $${refundData.amount.toFixed(2)}. ${refundData.note}`;
      
      // Add inventory update information to the note
      if (inventoryUpdates.length > 0) {
        refundNote += `\n\nItems returned to inventory: ${inventoryUpdates.join(', ')}`;
      }
      
      // Add any errors to the note
      if (inventoryErrors.length > 0) {
        refundNote += `\n\nInventory update issues: ${inventoryErrors.join(', ')}`;
      }
      
      updatedOrder.notes = updatedOrder.notes 
        ? `${updatedOrder.notes}\n\n${refundNote}` 
        : refundNote;
      
      return updatedOrder;
    }
    return o;
  });
  
  // Save updated orders
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  
  // Save refund to refunds history
  const refunds = getRefunds();
  refunds.push({
    id: `REF-${Date.now()}`,
    orderId: order.id,
    customer: order.customer,
    timestamp: refundData.timestamp,
    amount: refundData.amount,
    items: refundData.items,
    method: refundData.method,
    note: refundData.note
  });
  localStorage.setItem(REFUNDS_STORAGE_KEY, JSON.stringify(refunds));
  
  // Return the refund data with inventory update information
  return {
    ...refundData,
    inventoryUpdated: inventoryUpdates.length > 0,
    inventoryErrors: inventoryErrors.length > 0 ? inventoryErrors : null
  };
};

// Check if an order is fully refunded
const isOrderFullyRefunded = (order) => {
  if (!order.refunds || order.refunds.length === 0) return false;
  
  // Create a map to track refunded quantities for each item
  const refundedQuantities = {};
  
  // Sum up all refunded quantities by item ID
  order.refunds.forEach(refund => {
    refund.items.forEach(item => {
      if (!refundedQuantities[item.id]) {
        refundedQuantities[item.id] = 0;
      }
      refundedQuantities[item.id] += item.quantity;
    });
  });
  
  // Check if all items in the original order have been fully refunded
  for (const orderItem of order.items) {
    const refundedQty = refundedQuantities[orderItem.id] || 0;
    if (refundedQty < orderItem.quantity) {
      return false; // At least one item is not fully refunded
    }
  }
  
  return true; // All items are fully refunded
};

// Get refunds for a specific order
export const getRefundsByOrderId = (orderId) => {
  const refunds = getRefunds();
  return refunds.filter(refund => refund.orderId === orderId);
};
