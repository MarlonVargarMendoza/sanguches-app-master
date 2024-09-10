import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/cart.jsx'; // Importa el CartProvider
import { FiltersProvider } from './context/filters.jsx';
import './index.css';
import { AppRoute } from './routes/AppRoute.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#FFD700',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: '#FFD700',
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
          <CartProvider> {/* Envuelve el AppRoute con CartProvider */}
            <AppRoute />
          </CartProvider>
        </FiltersProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
