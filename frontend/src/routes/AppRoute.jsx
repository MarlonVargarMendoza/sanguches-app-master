import { AnimatePresence, motion } from 'framer-motion';
import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../components/Layout/Footer.jsx';
import Navbar from '../components/Layout/Navbar/Navbar.jsx';
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
const CombosContainer = lazy(() => import('../components/Product/CombosContainer.jsx'));
const ComboCustomize = lazy(() => import('../components/Customize/ComboCustomize.jsx'));

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
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export const AppRoute = () => {
  const location = useLocation();

  return (
    <FiltersProvider>
      <CartProvider>
        <Layout>
          <AnimatePresence mode="wait">
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
                  { path: "/combos", element: <CombosContainer /> }
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
                        transition={pageTransition}
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