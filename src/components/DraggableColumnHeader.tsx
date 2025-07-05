'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { TableCell, Box, Chip } from '@mui/material';
import { Person } from '../types';

interface DraggableColumnHeaderProps {
  column: {
    id: string;
    label: string;
    visible: boolean;
    sortable: boolean;
  };
  index: number;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Person) => void;
  onMoveColumn: (dragIndex: number, hoverIndex: number) => void;
}

export default function DraggableColumnHeader({
  column,
  index,
  sortField,
  sortDirection,
  onSort,
  onMoveColumn,
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLTableCellElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  }, [index]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Debounce the isOver state to reduce re-renders
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    dragTimeoutRef.current = setTimeout(() => {
      setIsOver(true);
    }, 10);
  }, []);

  const handleDragLeave = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(() => {
      setIsOver(false);
    }, 50);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== index) {
      onMoveColumn(dragIndex, index);
    }
  }, [index, onMoveColumn]);

  const handleSort = useCallback(() => {
    if (column.sortable) {
      onSort(column.id as keyof Person);
    }
  }, [column.sortable, column.id, onSort]);

  // Memoize computed styles to prevent unnecessary recalculations
  const cellStyles = useMemo(() => ({
    cursor: column.sortable ? 'pointer' : 'default',
    '&:hover': column.sortable ? { backgroundColor: 'action.hover' } : {},
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? 'rgba(156, 39, 176, 0.1)' : 'transparent',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    '&::before': isOver ? {
      content: '""',
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: '3px',
      backgroundColor: '#9c27b0',
    } : {},
    '&:hover .drag-handle': {
      opacity: 1,
    },
  }), [column.sortable, isDragging, isOver]);

  const dragHandleStyles = useMemo(() => ({
    cursor: 'grab',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.3,
    transition: 'opacity 0.2s ease',
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
    '&:active': { cursor: 'grabbing' },
    userSelect: 'none' as const,
  }), []);

  // Memoize the sort chip to prevent unnecessary re-renders
  const sortChip = useMemo(() => {
    if (sortField === column.id) {
      return (
        <Chip
          label={sortDirection === 'asc' ? '↑' : '↓'}
          size="small"
          color="primary"
        />
      );
    }
    return null;
  }, [sortField, column.id, sortDirection]);

  return (
    <TableCell
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sortDirection={sortField === column.id ? sortDirection : false}
      onClick={handleSort}
      sx={cellStyles}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          className="drag-handle"
          sx={dragHandleStyles}
        >
          ⋮⋮
        </Box>
        {column.label}
        {sortChip}
      </Box>
    </TableCell>
  );
} 