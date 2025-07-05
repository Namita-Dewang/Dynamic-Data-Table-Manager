'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setColumns, addColumn } from '../store/tableSlice';
import { Column, Person } from '../types';

interface ManageColumnsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ManageColumnsModal({ open, onClose }: ManageColumnsModalProps) {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.table.columns);
  
  const [newColumnId, setNewColumnId] = useState('');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [error, setError] = useState('');

  const handleToggleColumn = (columnId: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    dispatch(setColumns(updatedColumns));
  };

  const handleAddColumn = () => {
    if (!newColumnId.trim() || !newColumnLabel.trim()) {
      setError('Both column ID and label are required');
      return;
    }

    if (columns.some(col => col.id === newColumnId)) {
      setError('Column ID already exists');
      return;
    }

    const newColumn: Column = {
      id: newColumnId as keyof Person,
      label: newColumnLabel,
      visible: true,
      sortable: true,
    };

    dispatch(addColumn(newColumn));
    setNewColumnId('');
    setNewColumnLabel('');
    setError('');
  };

  const handleClose = () => {
    setNewColumnId('');
    setNewColumnLabel('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Show/Hide Columns
        </Typography>
        <Box sx={{ mb: 3 }}>
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.id)}
                />
              }
              label={column.label}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Add New Column
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Column ID"
            value={newColumnId}
            onChange={(e) => setNewColumnId(e.target.value)}
            placeholder="e.g., salary"
            size="small"
          />
          <TextField
            label="Column Label"
            value={newColumnLabel}
            onChange={(e) => setNewColumnLabel(e.target.value)}
            placeholder="e.g., Salary"
            size="small"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            variant="contained"
            onClick={handleAddColumn}
            disabled={!newColumnId.trim() || !newColumnLabel.trim()}
          >
            Add Column
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 