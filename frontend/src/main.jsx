import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { FiltersProvider } from './context/filters.jsx';
import './index.css';
import { AppRoute } from './routes/AppRoute.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C8102E', // Color principal
    },
    secondary: {
      main: '#FFD700', // Color del hover
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: '#FFD700', // Usa el color definido en el tema
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <FiltersProvider>
          <AppRoute />
        </FiltersProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);