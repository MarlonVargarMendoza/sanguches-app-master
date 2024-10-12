// MobileNavMenu.jsx
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const MobileNavMenu = ({ isOpen, toggleMenu }) => (
  <div className="relative">
    <IconButton onClick={toggleMenu} aria-label="Toggle menu" className="text-white">
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </IconButton>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full right-0 bg-white w-64 shadow-lg mt-2 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MobileNavLink to="/menuSanguches" text="Menu" />
        {/*   <MobileNavLink to="/about" text="Nosotros" /> */}
          <MobileNavLink to="/Local" text="Local" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileNavLink = ({ to, text }) => (
  <motion.div
    whileHover={{ backgroundColor: '#FFC603' }}
    whileTap={{ scale: 0.95 }}
  >
    <Link to={to} className="block px-4 py-3 text-gray-800 font-medium hover:text-white transition-colors duration-300">
      {text}
    </Link>
  </motion.div>
);

export default React.memo(MobileNavMenu);