'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightModeRounded as LightIcon, DarkModeRounded as DarkIcon } from '@mui/icons-material';
import { useTheme } from '../providers/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <DarkIcon /> : <LightIcon />}
      </IconButton>
    </Tooltip>
  );
} 