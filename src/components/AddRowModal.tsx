'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addRow } from '../store/tableSlice';
import { Person } from '../types';

interface AddRowModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddRowModal({ open, onClose }: AddRowModalProps) {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.table.data);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    role: '',
    department: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 150) {
        newErrors.age = 'Age must be a number between 0 and 150';
      }
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const maxId = Math.max(...data.map(row => parseInt(row.id)), 0);
    const newId = String(maxId + 1);
    
    const newRow: Person = {
      id: newId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: parseInt(formData.age),
      role: formData.role.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
    };

    dispatch(addRow(newRow));
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      role: '',
      department: '',
      location: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Row</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
          
          <TextField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            error={!!errors.age}
            helperText={errors.age}
            fullWidth
            required
            inputProps={{ min: 0, max: 150 }}
          />
          
          <TextField
            label="Role"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
            fullWidth
            required
          />
          
          <TextField
            label="Department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            error={!!errors.department}
            helperText={errors.department}
            fullWidth
            required
          />
          
          <TextField
            label="Location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.name || !formData.email || !formData.age || !formData.role || !formData.department || !formData.location}
        >
          Add Row
        </Button>
      </DialogActions>
    </Dialog>
  );
} 