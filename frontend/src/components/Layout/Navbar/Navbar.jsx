import { AppBar, Toolbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import PersistentCart from '../../Cart/PersistentCart';
import DesktopNavLinks from './DesktopNavLinks';
import Logo from './Logo';
import MobileNavMenu from './MobileNavMenu';
import PromotionBanner from './PromotionBanner';
import Submenu from './Submenu';
import useScrollDetection from './useScrollDetection';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollDetection(10);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <AppBar className={`transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
    sx={{ minHeight: { xs: '48px', sm: '56px' } }}
    >
      <PromotionBanner />
      <Toolbar className="flex items-center z-50 px-2 sm:px-4 sticky bg-[#FFC603] "
        sx={{ minHeight: { xs: '48px', sm: '56px' } }}
      >

        <div className="flex-1 flex justify-end h-8 sm:h-10">
          <Logo />
        </div>

        <div className="flex-1 flex justify-end items-center gap-1">
          <div className="hidden md:block">
            <DesktopNavLinks />
          </div>
          <div className="hidden md:block">
            <PersistentCart />
          </div>
          <div className="flex items-center md:hidden">
            
            <MobileNavMenu isOpen={isOpen} toggleMenu={toggleMenu} />
            <PersistentCart />
          </div>
        </div>
      </Toolbar>
      <Submenu />
      <NavbarStyles />
    </AppBar>
  );
};
const NavbarStyles = () => (
  <style> {`
    .nav-link {
      position: relative;
      transition: color 0.3s ease-in-out;
    }
    .nav-link::after {
      content: '';
      position: absolute;>
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 50%;
      background-color: #C8151B;
      transition: all 0.3s ease-in-out;
    }
    .nav-link:hover::after {
      width: 100%;
      left: 0;
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      animation: marquee 20s linear infinite;
    }
  `}</style>
);

export default Navbar;