import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  flex-direction: column;
`;

const ContentContainer = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: var(--background-color);
`;

const BottomNavContainer = styled.div`
  width: 100%;
  border-top: 1px solid var(--border-color);
`;

function Layout() {
  return (
    <LayoutContainer>
      <Header />
      <MainContainer>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
        <BottomNavContainer>
          <Sidebar />
        </BottomNavContainer>
      </MainContainer>
    </LayoutContainer>
  );
}

export default Layout;
