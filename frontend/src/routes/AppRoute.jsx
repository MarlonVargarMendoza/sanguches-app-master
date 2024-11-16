import { AnimatePresence, motion } from 'framer-motion';
import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../components/Layout/Footer.jsx';
import Navbar from '../components/Layout/Navbar/Navbar.jsx';
import ScrollToTop from '../components/ui/ScrollToTop.jsx';
import { CartProvider } from '../context/cart.jsx';
import { FiltersProvider } from '../context/filters.jsx';
import './loader.css';

// Lazy-loaded components
const HomePage = lazy(() => import('../App'));
const CustomizeSandwiches = lazy(() => import('../components/Customize/Customize.jsx'));
const Menu = lazy(() => import('../components/Product/ProductsSanguches.jsx'));
const Local = lazy(() => import('../Pages/Local.jsx'));
const Success = lazy(() => import('../Pages/Success.jsx'));
const Checkout = lazy(() => import('../Pages/Checkout.jsx'));
const CombosContainer = lazy(() => import('../components/combo/CombosContainer.jsx'));
const ComboCustomize = lazy(() => import('../components/Customize/ComboCustomize.jsx'));
const Drinks = lazy(() => import('../components/Product/drinks/Drinks')
  .catch(error => {
    console.error('Error loading Drinks:', error);
    return { default: ErrorView };
  })
);
const Donuts = lazy(() => import('../components/Product/donuts/Donuts.jsx'));
// Enhanced loader component
const Loader = () => (
  <div className="loader-container">
    <div className="loader">
      <div className="justify-content-center jimu-primary-loading"></div>
    </div>
    <h2 className="loader-text">Cargando deliciosos sanguches...</h2>
  </div>
);

// Layout component
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Efecto para manejar el scroll en cambios de ruta
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    handleRouteChange();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop /> {/* Componente de scroll */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Page transition variants con manejo de scroll mejorado
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  in: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  out: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};
export const AppRoute = () => {
  const location = useLocation();

  return (
    <FiltersProvider>
      <CartProvider>
        <Layout>
          <AnimatePresence 
            mode="wait"
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Suspense fallback={<Loader />}>
              <Routes location={location} key={location.pathname}>
                {[
                  { path: "/", element: <HomePage /> },
                  { path: "/editaloTuMismo", element: <CustomizeSandwiches /> },
                  { path: "/combo/personaliza", element: <ComboCustomize /> },
                  { path: "/menuSanguches", element: <Menu /> },
                  { path: "/local", element: <Local /> },
                  { path: "/success", element: <Success /> },
                  { path: "/checkout", element: <Checkout /> },
                  { path: "/combos", element: <CombosContainer /> },
                  { path: "/bebidas", element: <Drinks /> }
                  ,{ path: "/donas", element: <Donuts /> }
                ].map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={{
                          type: 'tween',
                          ease: 'anticipate',
                          duration: 0.5
                        }}
                      >
                        {element}
                      </motion.div>
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Layout>
      </CartProvider>
    </FiltersProvider>
  );
};

export default AppRoute;