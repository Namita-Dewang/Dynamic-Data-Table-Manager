'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store, persistor } from '../store/store';
import { ThemeProvider, useTheme } from './ThemeContext';

interface ProvidersProps {
  children: React.ReactNode;
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#9c27b0', // Purple
      },
      secondary: {
        main: '#7b1fa2', // Darker purple
      },
    },
    components: {
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#424242',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#9c27b0',
            color: '#ffffff',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            minHeight: '36px',
            boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#7b1fa2',
              boxShadow: '0 4px 8px rgba(156, 39, 176, 0.3)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)',
            },
            '&.MuiButton-outlined': {
              backgroundColor: 'transparent',
              color: '#9c27b0',
              borderColor: '#9c27b0',
              borderWidth: '2px',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.08)',
                borderColor: '#7b1fa2',
                color: '#7b1fa2',
              },
            },
            '&.MuiButton-contained': {
              '&.MuiButton-containedPrimary': {
                backgroundColor: '#9c27b0',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
} 