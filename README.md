# Dynamic Data Table Manager

A comprehensive data table manager built with Next.js 14, Redux Toolkit, and Material UI. Features dynamic columns, sorting, filtering, inline editing, and CSV import/export functionality.

## 🚀 Features -

### Core Features
- **Table View**: Display data with Name, Email, Age, Role columns
- **Sorting**: ASC/DESC toggle on column headers
- **Global Search**: Search across all fields
- **Pagination**: 10 rows per page (configurable)
- **Dynamic Columns**: Add/remove columns via modal
- **Column Persistence**: Column visibility saved to localStorage
- **Import/Export**: CSV import with validation, export visible columns

### Bonus Features
- **Inline Row Editing**: Double-click to edit fields with validation
- **Row Actions**: Edit and delete rows with confirmation
- **Theme Toggle**: Light/Dark mode using MUI theming
- **Responsive Design**: Works on all screen sizes
- **Data Validation**: Email format, age range validation

## 🛠️ Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Redux Persist** for data persistence
- **Material UI (MUI v5+)** for UI components
- **PapaParse** for CSV parsing
- **FileSaver.js** for CSV export
- **React Hook Form** for form handling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-table-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Basic Table Operations
- **Search**: Use the search bar to filter data across all fields
- **Sort**: Click column headers to sort (toggle ASC/DESC)
- **Pagination**: Navigate through pages using the pagination controls

### Managing Columns
1. Click "Manage Columns" button
2. Toggle column visibility using checkboxes
3. Add new columns with custom IDs and labels
4. Changes are automatically reflected in the table

### Import/Export Data
1. Click "Import/Export" button
2. **Import**: Upload a CSV file with columns: name, email, age, role, department, location
3. **Export**: Download current table data as CSV (only visible columns)

### Inline Editing
1. Click "Edit Mode" button to enable editing
2. Double-click any cell to edit inline
3. Press Enter to save, Escape to cancel
4. Use "Save All" or "Cancel All" buttons for bulk operations

### Row Actions
- **Delete**: Click the trash icon to delete a row (with confirmation)
- **Edit**: Double-click cells when in edit mode

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DataTable.tsx      # Main table component
│   ├── EditableCell.tsx   # Inline editing component
│   ├── ManageColumnsModal.tsx # Column management modal
│   ├── ImportExportModal.tsx  # CSV import/export modal
│   ├── DeleteConfirmationDialog.tsx # Delete confirmation
│   └── ThemeToggle.tsx    # Theme toggle component
├── store/                 # Redux store
│   ├── store.ts           # Store configuration
│   └── tableSlice.ts      # Table state management
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── providers/             # Context providers
    └── Providers.tsx      # Redux and theme providers
```

## 🔧 Configuration

### Adding New Columns
1. Open the "Manage Columns" modal
2. Enter a unique column ID (e.g., "salary")
3. Enter a display label (e.g., "Salary")
4. Click "Add Column"

### CSV Import Format
Your CSV file should have these columns:
```csv
name,email,age,role,department,location
John Doe,john@example.com,30,Developer,Engineering,New York
```

### Customizing Theme
The app supports light/dark themes. Theme preference is saved to localStorage.

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Features Implemented

✅ **Core Requirements**
- Table view with default columns (Name, Email, Age, Role)
- Column sorting (ASC/DESC toggle)
- Global search functionality
- Client-side pagination (10 rows per page)
- Dynamic column management
- Column visibility persistence
- CSV import with validation
- CSV export (visible columns only)

✅ **Bonus Features**
- Inline row editing with validation
- Row actions (delete with confirmation)
- Theme toggle (Light/Dark mode)
- Responsive design
- Data validation (email format, age range)

The application is now ready to use! 🎊
