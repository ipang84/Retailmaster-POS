import React from 'react';
import styled from 'styled-components';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: 4px;
  padding: 8px 12px;
  width: 300px;
  
  svg {
    color: #999;
    margin-right: 8px;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: none;
  color: #555;
  margin-left: 8px;
  
  &:hover {
    background-color: var(--background-color);
  }
  
  svg {
    font-size: 20px;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  
  svg {
    font-size: 18px;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Logo>RetailMaster POS</Logo>
      
      <SearchBar>
        <FiSearch />
        <input type="text" placeholder="Search..." />
      </SearchBar>
      
      <HeaderActions>
        <IconButton>
          <FiBell />
        </IconButton>
        <UserAvatar>
          <FiUser />
        </UserAvatar>
      </HeaderActions>
    </HeaderContainer>
  );
}

export default Header;
