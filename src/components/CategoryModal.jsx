import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { addCategory, updateCategory } from '../services/categoryService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  
  &.cancel {
    background: none;
    border: 1px solid #ddd;
    color: #333;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  &.save {
    background-color: #4a89dc;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3b7dd8;
    }
    
    &:disabled {
      background-color: #a0bfed;
      cursor: not-allowed;
    }
  }
`;

function CategoryModal({ isOpen, onClose, category = null, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [category, isOpen]);
  
  const handleSubmit = () => {
    const categoryData = {
      name,
      description
    };
    
    if (category && category.id) {
      // Update existing category
      updateCategory(category.id, categoryData);
    } else {
      // Add new category
      addCategory(categoryData);
    }
    
    if (onSave) {
      onSave();
    }
    
    onClose();
  };
  
  const isFormValid = name.trim() !== '';
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{category ? 'Edit Category' : 'Create Category'}</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <label>Category Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Enter category name"
              autoFocus
            />
          </FormGroup>
          
          <FormGroup>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter category description"
            ></textarea>
          </FormGroup>
        </ModalBody>
        
        <ModalFooter>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="save" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {category ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CategoryModal;
