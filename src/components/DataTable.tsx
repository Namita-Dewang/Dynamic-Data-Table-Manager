'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Typography,
  Toolbar,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FileUpload as UploadIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  EditRounded as EditRoundedIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  setSearchTerm,
  setSortField,
  setCurrentPage,
  setRowsPerPage,
  deleteRow,
  setIsEditing,
  saveAllChanges,
  cancelAllChanges,
  toggleEditingRow,
  reorderColumns,
} from '../store/tableSlice';
import { Person } from '../types';
import ManageColumnsModal from './ManageColumnsModal';
import ImportExportModal from './ImportExportModal';
import EditableCell from './EditableCell';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ThemeToggle from './ThemeToggle';
import AddRowModal from './AddRowModal';
import DraggableColumnHeader from './DraggableColumnHeader';
import OptimizedTableRow from './TableRow';

export default function DataTable() {
  const dispatch = useDispatch();
  const {
    data,
    columns,
    searchTerm,
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
    editingRows,
    pendingChanges,
  } = useSelector((state: RootState) => state.table);

  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [addRowOpen, setAddRowOpen] = useState(false);



  // Filter and sort data
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const visibleColumns = useMemo(() => columns.filter(col => col.visible), [columns]);

  const handleSort = (field: keyof Person) => {
    dispatch(setSortField(field));
  };

  const handleDeleteRow = (id: string) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditRow = (id: string) => {
    setEditingRowId(id);
    dispatch(toggleEditingRow(id));
  };

  const handleExitEditMode = (rowId: string) => {
    setEditingRowId(null);
    dispatch(toggleEditingRow(rowId));
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      setRowToDelete(null);
    }
    setDeleteDialogOpen(false);
  };



  const handleSaveAll = () => {
    dispatch(saveAllChanges());
  };

  const handleCancelAll = () => {
    dispatch(cancelAllChanges());
  };

  const handleMoveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    dispatch(reorderColumns({ dragIndex, hoverIndex }));
  }, [dispatch]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* Toolbar */}
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, mr: 2 }}>
            Dynamic Data Table Manager
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            sx={{ minWidth: 300, mr: 2 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            ml: 'auto',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            
            <ThemeToggle />
            
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => setManageColumnsOpen(true)}
              size="medium"
            >
              Manage Columns
            </Button>
            
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setImportExportOpen(true)}
              size="medium"
            >
              Import/Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddRowOpen(true)}
              size="medium"
            >
              Add Row
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAll}
              size="medium"
              startIcon={<SaveIcon />}
              disabled={Object.keys(pendingChanges).length === 0}
              sx={{ 
                backgroundColor: Object.keys(pendingChanges).length > 0 ? '#4caf50' : '#ccc',
                '&:hover': { 
                  backgroundColor: Object.keys(pendingChanges).length > 0 ? '#388e3c' : '#ccc'
                }
              }}
            >
              Save All {Object.keys(pendingChanges).length > 0 && `(${Object.keys(pendingChanges).length})`}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelAll}
              size="medium"
              startIcon={<CancelIcon />}
              disabled={Object.keys(pendingChanges).length === 0}
              sx={{ 
                borderColor: Object.keys(pendingChanges).length > 0 ? '#f44336' : '#ccc',
                color: Object.keys(pendingChanges).length > 0 ? '#f44336' : '#ccc',
                '&:hover': { 
                  borderColor: Object.keys(pendingChanges).length > 0 ? '#d32f2f' : '#ccc',
                  color: Object.keys(pendingChanges).length > 0 ? '#d32f2f' : '#ccc',
                  backgroundColor: Object.keys(pendingChanges).length > 0 ? 'rgba(244, 67, 54, 0.08)' : 'transparent'
                }
              }}
            >
              Cancel All {Object.keys(pendingChanges).length > 0 && `(${Object.keys(pendingChanges).length})`}
            </Button>
          </Box>
        </Toolbar>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                {visibleColumns.map((column, index) => (
                  <DraggableColumnHeader
                    key={column.id}
                    column={column}
                    index={index}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onMoveColumn={handleMoveColumn}
                  />
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <OptimizedTableRow
                  key={row.id}
                  row={row}
                  visibleColumns={visibleColumns}
                  editingRowId={editingRowId}
                  onEditRow={handleEditRow}
                  onDeleteRow={handleDeleteRow}
                  onExitEditMode={handleExitEditMode}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage + 1))}
          onRowsPerPageChange={(e) => dispatch(setRowsPerPage(parseInt(e.target.value, 10)))}
        />
      </Paper>

      {/* Modals */}
      <ManageColumnsModal
        open={manageColumnsOpen}
        onClose={() => setManageColumnsOpen(false)}
      />
      
      <ImportExportModal
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
      />
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Row"
        content="Are you sure you want to delete this row? This action cannot be undone."
      />
      
      <AddRowModal
        open={addRowOpen}
        onClose={() => setAddRowOpen(false)}
      />
    </Box>
  );
} 