import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Finances from './pages/Finances';
import Reports from './pages/Reports';
import Payouts from './pages/Payouts';
import Settings from './pages/Settings';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import NewOrder from './pages/NewOrder';
import NewTask from './pages/NewTask';
import LowStockAlert from './components/LowStockAlert';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<NewOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="finances" element={<Finances />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tasks/new" element={<NewTask />} />
        </Route>
      </Routes>
      <LowStockAlert />
    </Router>
  );
}

export default App;
