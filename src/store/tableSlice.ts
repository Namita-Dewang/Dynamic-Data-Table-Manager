import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableState, Person, Column } from '../types';

const initialColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true },
  { id: 'email', label: 'Email', visible: true, sortable: true },
  { id: 'age', label: 'Age', visible: true, sortable: true },
  { id: 'role', label: 'Role', visible: true, sortable: true },
  { id: 'department', label: 'Department', visible: false, sortable: true },
  { id: 'location', label: 'Location', visible: false, sortable: true },
];

const initialData: Person[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer', department: 'Engineering', location: 'New York' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'Designer', department: 'Design', location: 'San Francisco' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'Manager', department: 'Management', location: 'Chicago' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', age: 28, role: 'Developer', department: 'Engineering', location: 'Boston' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, role: 'Designer', department: 'Design', location: 'Los Angeles' },
  { id: '6', name: 'Diana Davis', email: 'diana@example.com', age: 29, role: 'Developer', department: 'Engineering', location: 'Seattle' },
  { id: '7', name: 'Eve Miller', email: 'eve@example.com', age: 31, role: 'Manager', department: 'Management', location: 'Austin' },
  { id: '8', name: 'Frank Garcia', email: 'frank@example.com', age: 27, role: 'Designer', department: 'Design', location: 'Miami' },
  { id: '9', name: 'Grace Lee', email: 'grace@example.com', age: 33, role: 'Developer', department: 'Engineering', location: 'Denver' },
  { id: '10', name: 'Henry Taylor', email: 'henry@example.com', age: 26, role: 'Manager', department: 'Management', location: 'Portland' },
];

const initialState: TableState = {
  data: initialData,
  columns: initialColumns,
  searchTerm: '',
  sortField: null,
  sortDirection: 'asc',
  currentPage: 1,
  rowsPerPage: 10,
  editingRows: [],
  isEditing: false,
  pendingChanges: {},
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Person[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<Person>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; updates: Partial<Person> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.updates };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    reorderColumns: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      
      // Early return if indices are the same
      if (dragIndex === hoverIndex) return;
      
      // Optimize array operations
      const newColumns = [...state.columns];
      const [draggedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      state.columns = newColumns;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSortField: (state, action: PayloadAction<keyof Person | null>) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 1;
    },
    toggleEditingRow: (state, action: PayloadAction<string>) => {
      const index = state.editingRows.indexOf(action.payload);
      if (index !== -1) {
        state.editingRows.splice(index, 1);
      } else {
        state.editingRows.push(action.payload);
      }
    },
    setEditingRows: (state, action: PayloadAction<string[]>) => {
      state.editingRows = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    addPendingChange: (state, action: PayloadAction<{ id: string; updates: Partial<Person> }>) => {
      const { id, updates } = action.payload;
      if (!state.pendingChanges[id]) {
        state.pendingChanges[id] = {};
      }
      state.pendingChanges[id] = { ...state.pendingChanges[id], ...updates };
    },
    saveAllChanges: (state) => {
      // Apply all pending changes to the actual data
      Object.entries(state.pendingChanges).forEach(([id, updates]) => {
        const index = state.data.findIndex(row => row.id === id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updates };
        }
      });
      // Clear pending changes and editing state
      state.pendingChanges = {};
      state.isEditing = false;
      state.editingRows = [];
    },
    cancelAllChanges: (state) => {
      // Clear all pending changes and editing state
      state.pendingChanges = {};
      state.isEditing = false;
      state.editingRows = [];
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  toggleColumnVisibility,
  addColumn,
  reorderColumns,
  setSearchTerm,
  setSortField,
  setCurrentPage,
  setRowsPerPage,
  toggleEditingRow,
  setEditingRows,
  setIsEditing,
  addPendingChange,
  saveAllChanges,
  cancelAllChanges,
} = tableSlice.actions;

export default tableSlice.reducer; 