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

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
`;

const SettingsNav = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const NavItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-left: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  background-color: ${props => props.active ? '#f5f9ff' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#555'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SettingsContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    font-size: 14px;
    outline: none;
    
    &:focus {
      border-color: var(--primary-color);
    }
  }
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 12px;
`;

function Settings() {
  return (
    <div>
      <PageHeader>
        <Title>Settings</Title>
      </PageHeader>
      
      <SettingsContainer>
        <SettingsNav>
          <NavItem active>Store Information</NavItem>
          <NavItem>User Management</NavItem>
          <NavItem>Payment Methods</NavItem>
          <NavItem>Tax Settings</NavItem>
          <NavItem>Email Templates</NavItem>
          <NavItem>Notifications</NavItem>
          <NavItem>Integrations</NavItem>
          <NavItem>Appearance</NavItem>
        </SettingsNav>
        
        <SettingsContent>
          <SectionTitle>Store Information</SectionTitle>
          
          <FormGroup>
            <label>Store Name</label>
            <input type="text" defaultValue="1XB Mobile Repair" />
          </FormGroup>
          
          <FormGroup>
            <label>Store Email</label>
            <input type="email" defaultValue="ixb770mobile@gmail.com" />
          </FormGroup>
          
          <FormGroup>
            <label>Phone Number</label>
            <input type="tel" placeholder="Enter store phone number" />
          </FormGroup>
          
          <FormGroup>
            <label>Address</label>
            <textarea placeholder="Enter store address"></textarea>
          </FormGroup>
          
          <FormGroup>
            <label>Business Hours</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>Monday</div>
              <input type="time" defaultValue="09:00" />
              <input type="time" defaultValue="17:00" />
            </div>
          </FormGroup>
          
          <SaveButton>Save Changes</SaveButton>
        </SettingsContent>
      </SettingsContainer>
    </div>
  );
}

export default Settings;
