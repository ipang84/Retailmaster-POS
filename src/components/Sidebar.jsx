import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, FiShoppingBag, FiUsers, FiTag, 
  FiPackage, FiDollarSign, FiPieChart, 
  FiCreditCard, FiSettings
} from 'react-icons/fi';

const SidebarContainer = styled.nav`
  width: 100%;
  background-color: white;
  overflow-x: auto;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
`;

const NavItem = styled.li`
  margin: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  color: var(--text-light);
  font-weight: 500;
  transition: all 0.2s;
  font-size: 12px;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &.active {
    color: var(--primary-color);
    
    svg {
      color: var(--primary-color);
    }
  }
  
  svg {
    margin-bottom: 4px;
    font-size: 20px;
    color: var(--text-light);
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/" end>
            <FiHome />
            Home
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/orders">
            <FiShoppingBag />
            Orders
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/customers">
            <FiUsers />
            Customers
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/products">
            <FiTag />
            Products
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/inventory">
            <FiPackage />
            Inventory
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/finances">
            <FiDollarSign />
            Finance
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/reports">
            <FiPieChart />
            Reports
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/settings">
            <FiSettings />
            Settings
          </StyledNavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
}

export default Sidebar;
