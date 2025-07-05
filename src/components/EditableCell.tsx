'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addPendingChange, toggleEditingRow } from '../store/tableSlice';
import { Person } from '../types';

interface EditableCellProps {
  value: string | number | undefined;
  field: keyof Person;
  rowId: string;
  editingRowId?: string | null;
  onExitEditMode?: (rowId: string) => void;
}

function EditableCell({ value, field, rowId, editingRowId, onExitEditMode }: EditableCellProps) {
  const dispatch = useDispatch();
  const editingRows = useSelector((state: RootState) => state.table.editingRows);
  const pendingChanges = useSelector((state: RootState) => state.table.pendingChanges);
  const isRowEditing = editingRows.includes(rowId) || editingRowId === rowId;
  
  // Get the current value (including pending changes)
  const currentValue = pendingChanges[rowId]?.[field] !== undefined 
    ? pendingChanges[rowId][field] 
    : value;
  
  const [editValue, setEditValue] = useState(String(currentValue || ''));
  const [error, setError] = useState('');

  useEffect(() => {
    setEditValue(String(currentValue || ''));
    setError('');
  }, [currentValue]);

  const handleDoubleClick = () => {
    dispatch(toggleEditingRow(rowId));
  };

  const handleChange = (newValue: string) => {
    setEditValue(newValue);
    setError('');

    // Validation
    if (field === 'age') {
      const age = parseInt(newValue);
      if (isNaN(age) || age < 0 || age > 150) {
        setError('Age must be a number between 0 and 150');
        return;
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newValue && !emailRegex.test(newValue)) {
        setError('Please enter a valid email address');
        return;
      }
    }
  };

  const handleBlur = () => {
    if (error) return;

    let processedValue: string | number = editValue;
    
    // Type conversion based on field
    if (field === 'age') {
      processedValue = parseInt(editValue) || 0;
    }

    if (processedValue !== value) {
      dispatch(addPendingChange({ id: rowId, updates: { [field]: processedValue } }));
    }
    
    dispatch(toggleEditingRow(rowId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Save the value
      if (!error) {
        let processedValue: string | number = editValue;
        
        // Type conversion based on field
        if (field === 'age') {
          processedValue = parseInt(editValue) || 0;
        }

        if (processedValue !== value) {
          dispatch(addPendingChange({ id: rowId, updates: { [field]: processedValue } }));
        }
      }
      
      // Exit edit mode for the entire row
      if (onExitEditMode) {
        onExitEditMode(rowId);
      } else {
        dispatch(toggleEditingRow(rowId));
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(String(value || ''));
      setError('');
      if (onExitEditMode) {
        onExitEditMode(rowId);
      } else {
        dispatch(toggleEditingRow(rowId));
      }
    }
  };

  if (isRowEditing) {
    return (
      <TextField
        value={editValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        error={!!error}
        helperText={error}
        size="small"
        autoFocus
        fullWidth
        variant="outlined"
        sx={{ minWidth: 120 }}
      />
    );
  }

  return (
    <Box
      onDoubleClick={handleDoubleClick}
      sx={{
        cursor: 'pointer',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        '&:hover': { backgroundColor: 'action.hover' },
        backgroundColor: pendingChanges[rowId]?.[field] !== undefined ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
        border: pendingChanges[rowId]?.[field] !== undefined ? '1px solid #ffc107' : 'none',
        borderRadius: '4px',
        padding: pendingChanges[rowId]?.[field] !== undefined ? '4px' : '0',
      }}
    >
      {currentValue || ''}
    </Box>
  );
}

export default EditableCell; 