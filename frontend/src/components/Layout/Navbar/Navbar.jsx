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
    <AppBar className={`transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <PromotionBanner />
      <Toolbar className="flex items-center xl:py-0 sm:py-0 sticky bg-[#FFC603] z-50">
        
        <div className="flex-1 flex justify-end">
          <Logo />
        </div>
        
        <div className="flex-1 flex justify-end items-center space-x-2">
        <div className="flex-1 flex justify-end">
          <DesktopNavLinks />
        </div>
          <div className="hidden md:block">
            <PersistentCart />
          </div>
          <div className="md:hidden flex items-center">
            <PersistentCart />
            <MobileNavMenu isOpen={isOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      </Toolbar>
      <Submenu />
      <NavbarStyles />
    </AppBar>
  );
};
const NavbarStyles = () => (
  <style jsx>{`
    .nav-link {
      position: relative;
      transition: color 0.3s ease-in-out;
    }
    .nav-link::after {
      content: '';
      position: absolute;
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