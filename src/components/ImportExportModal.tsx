'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setData } from '../store/tableSlice';
import { Person } from '../types';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

interface ImportExportModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ImportExportModal({ open, onClose }: ImportExportModalProps) {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.table);
  
  const [tabValue, setTabValue] = useState(0);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setImportError('');
    setImportSuccess('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setImportError('Error parsing CSV file. Please check the format.');
          return;
        }

        const importedData: Person[] = (results.data as unknown as Record<string, string>[])
          .filter((row) => row.name && row.email) // Basic validation
          .map((row, index) => ({
            id: String(index + 1),
            name: row.name || '',
            email: row.email || '',
            age: parseInt(row.age) || 0,
            role: row.role || '',
            department: row.department || '',
            location: row.location || '',
          }));

        if (importedData.length === 0) {
          setImportError('No valid data found in the CSV file.');
          return;
        }

        dispatch(setData(importedData));
        setImportSuccess(`Successfully imported ${importedData.length} rows.`);
        setImportError('');
      },
      error: (error) => {
        setImportError(`Error reading file: ${error.message}`);
      },
    });
  };

  const handleExport = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const headers = visibleColumns.map(col => col.label);
    
    const csvData = [
      headers,
      ...data.map(row => 
        visibleColumns.map(col => row[col.id] || '')
      )
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table-data.csv');
  };

  const handleClose = () => {
    setTabValue(0);
    setImportError('');
    setImportSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import/Export Data</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Import CSV" />
            <Tab label="Export CSV" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Import CSV File
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a CSV file with columns: name, email, age, role, department, location
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-file-upload">
              <Button variant="contained" component="span">
                Choose CSV File
              </Button>
            </label>
          </Box>

          {importError && <Alert severity="error" sx={{ mb: 2 }}>{importError}</Alert>}
          {importSuccess && <Alert severity="success" sx={{ mb: 2 }}>{importSuccess}</Alert>}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Export CSV File
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Export current table data to CSV format. Only visible columns will be included.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Visible columns: {columns.filter(col => col.visible).map(col => col.label).join(', ')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Total rows: {data.length}
            </Typography>
          </Box>

          <Button variant="contained" onClick={handleExport}>
            Export to CSV
          </Button>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 