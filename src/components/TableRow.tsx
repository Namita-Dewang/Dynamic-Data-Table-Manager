'use client';

import React from 'react';
import { TableRow as MuiTableRow, TableCell, Box, IconButton } from '@mui/material';
import { EditRounded as EditRoundedIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Person } from '../types';
import EditableCell from './EditableCell';

interface TableRowProps {
  row: Person;
  visibleColumns: Array<{
    id: keyof Person;
    label: string;
    visible: boolean;
    sortable: boolean;
  }>;
  editingRowId: string | null;
  onEditRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
  onExitEditMode: (rowId: string) => void;
}

function TableRow({
  row,
  visibleColumns,
  editingRowId,
  onEditRow,
  onDeleteRow,
  onExitEditMode,
}: TableRowProps) {
  return (
    <MuiTableRow hover>
      {visibleColumns.map((column) => (
        <TableCell key={column.id}>
          <EditableCell
            value={row[column.id]}
            field={column.id}
            rowId={row.id}
            editingRowId={editingRowId}
            onExitEditMode={onExitEditMode}
          />
        </TableCell>
      ))}
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onEditRow(row.id)}
            sx={{ 
              color: editingRowId === row.id ? '#9c27b0' : '#666666',
              backgroundColor: editingRowId === row.id ? 'rgba(156, 39, 176, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: editingRowId === row.id ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)',
                color: '#9c27b0'
              }
            }}
            title="Edit Row"
          >
            <EditRoundedIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteRow(row.id)}
            sx={{ 
              color: '#666666',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336'
              }
            }}
            title="Delete Row"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </MuiTableRow>
  );
}

export default TableRow; 