import { AppBar, Box, Container, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import PersistentCart from '../../Cart/PersistentCart';
import DesktopNavLinks from './DesktopNavLinks';
import Logo from './Logo';
import MobileNavMenu from './MobileNavMenu';
import PromotionBanner from './PromotionBanner';
import Submenu from './Submenu';
import useScrollDetection from './useScrollDetection';

// Breakpoints constants
const BREAKPOINTS = {
  MOBILE: 'md',
  DESKTOP: 'lg'
};

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollDetection(10);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <AppBar
      className={`transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      sx={{
        bgcolor: '#FFC603',
        boxShadow: 'none'
      }}
    >
      <PromotionBanner />
      <NavigationContent 
        isMobile={isMobile} 
        isOpen={isOpen} 
        onToggle={toggleMenu} 
      />
    </AppBar>
  );
};

const NavigationContent = ({ isMobile, isOpen, onToggle }) => (
  <Box className="relative">
    {isMobile ? (
      <MobileNavigationBar isOpen={isOpen} onToggle={onToggle} />
    ) : (
      <DesktopNavigationBar />
    )}

    <AnimatePresence>
      {isOpen && isMobile && (
        <Submenu variant="mobile" onClose={onToggle} />
      )}
    </AnimatePresence>
  </Box>
);

const DesktopNavigationBar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(BREAKPOINTS.DESKTOP));

  return (
    <Container maxWidth="2xl" className="px-6">
      <Toolbar className="flex items-center h-20">
        <NavigationGrid isDesktop={isDesktop} />
      </Toolbar>
    </Container>
  );
};

const NavigationGrid = ({ isDesktop }) => (
  <div className="w-full grid grid-cols-3 items-center">
    {/* Logo section */}
    <motion.div
      className="flex items-center"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.3 }}
    >
      <Logo />
    </motion.div>

    {/* Submenu section */}
    <motion.div
      className="flex justify-center pr-20 gap-10"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Submenu />
    </motion.div>

    {/* Navigation links and cart */}
    <motion.div
      className="flex items-center justify-end gap-6  pl-20"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {isDesktop && <DesktopNavLinks />}
      <PersistentCart />
    </motion.div>
  </div>
);

const MobileNavigationBar = ({ isOpen, onToggle }) => (
  <Toolbar className="px-4">
    <div className="w-full flex items-center justify-between gap-4">
      <MenuToggleButton isOpen={isOpen} onToggle={onToggle} />
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>
      <div className="flex items-center gap-1">
        <MobileNavMenu />
        <PersistentCart />
      </div>
    </div>
  </Toolbar>
);

const MenuToggleButton = ({ isOpen, onToggle }) => (
  <IconButton
    onClick={onToggle}
    className="text-[#C8151B] hover:bg-[#C8151B]/5 transition-colors"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </IconButton>
);

const MobileMenuDrawer = ({ onClose }) => (
  <motion.div
    {...fadeInVariants}
    className="absolute top-full left-0 right-0 bg-white shadow-xl z-50"
  >
    <Box className="py-2">
      <Submenu variant="mobile" onSelect={onClose} />
    </Box>
  </motion.div>
);

export default Navbar;