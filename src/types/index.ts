export interface Person {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
}

export interface Column {
  id: keyof Person;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface TableState {
  data: Person[];
  columns: Column[];
  searchTerm: string;
  sortField: keyof Person | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  rowsPerPage: number;
  editingRows: string[];
  isEditing: boolean;
  pendingChanges: Record<string, Partial<Person>>;
}

export interface RootState {
  table: TableState;
} 