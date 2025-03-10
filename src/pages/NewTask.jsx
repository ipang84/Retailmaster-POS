import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    
    svg {
      margin-right: 8px;
    }
  }
  
  h1 {
    margin-left: 16px;
    font-size: 24px;
    font-weight: 600;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 800px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 16px;
  
  .date-input, .time-input {
    position: relative;
    flex: 1;
    
    input {
      padding-left: 36px;
    }
    
    svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background-color: #0055cc;
  }
`;

function NewTask() {
  return (
    <Container>
      <Header>
        <button className="back-button">
          <FiArrowLeft />
          Back
        </button>
        <h1>Create New Task</h1>
      </Header>
      
      <FormContainer>
        <FormGroup>
          <label>Task Title</label>
          <input type="text" placeholder="Enter task title" />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <label>Assign To</label>
            <select>
              <option value="">Select employee</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label>Priority</label>
            <select>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <label>Schedule</label>
          <DateTimeContainer>
            <div className="date-input">
              <FiCalendar />
              <input type="date" />
            </div>
            <div className="time-input">
              <FiClock />
              <input type="time" />
            </div>
          </DateTimeContainer>
        </FormGroup>
        
        <FormGroup>
          <label>Description</label>
          <textarea placeholder="Enter task details"></textarea>
        </FormGroup>
        
        <SubmitButton>Create Task</SubmitButton>
      </FormContainer>
    </Container>
  );
}

export default NewTask;
