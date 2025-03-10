import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bgColor || 'white'};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .icon {
    font-size: 32px;
    margin-bottom: 16px;
    color: var(--primary-color);
  }
  
  .title {
    font-weight: 600;
    font-size: 16px;
  }
`;

function ActionCard({ to, icon, title, bgColor }) {
  return (
    <CardContainer to={to} bgColor={bgColor}>
      <div className="icon">{icon}</div>
      <div className="title">{title}</div>
    </CardContainer>
  );
}

export default ActionCard;
