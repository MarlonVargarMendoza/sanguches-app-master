import { useMediaQuery, useTheme } from '@mui/material';
import gsap from 'gsap';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'react-use';
import PersistentCart from '../../Cart/PersistentCart';
import DesktopNavLinks from './DesktopNavLinks';
import Logo from './Logo';
import MobileNavMenu from './MobileNavMenu';
import PromotionBanner from './PromotionBanner';
import Submenu from './Submenu';

const BREAKPOINTS = { MOBILE: 'md', DESKTOP: 'lg' };

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => isOpen && setIsOpen(false), [isOpen]);

  useEffect(() => {
    if (currentScrollY === 0) {
        // Topmost position: show navbar without floating-nav
        setIsNavVisible(true);
        navRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
        // Scrolling down: hide navbar and apply floating-nav
        setIsNavVisible(false);
        navRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
        // Scrolling up: show navbar with floating-nav
        setIsNavVisible(true);
        navRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
}, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, [isNavVisible]);

  return (
    <nav 
      ref={navRef}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        bg-[#FFC603] 
        ${currentScrollY > 0 ? 'shadow-lg' : ''}
        ${isMobile ? 'h-14' : ''}
      `}
    >
      {!isMobile && <PromotionBanner />}
      <div className="max-w-[2560px] mx-auto">
        <div className={`
          flex items-center justify-between
          ${isMobile ? 'h-14 px-2' : 'h-20 px-6'}
        `}>
          {isMobile ? (
            <MobileNav isOpen={isOpen} onToggle={toggleMenu} />
          ) : (
            <DesktopNav />
          )}
        </div>
      </div>
    </nav>
  );
};

const MobileNav = React.memo(({ isOpen, onToggle }) => (
  <>
    <MobileNavMenu isOpen={isOpen} onToggle={onToggle} />
    <div className="flex-1 flex justify-center scale-90">
      <Logo />
    </div>
    <PersistentCart />
  </>
));

const DesktopNav = React.memo(() => {
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up(BREAKPOINTS.DESKTOP));
  
  return (
    <div className="w-full grid grid-cols-3 items-center px-4">
      <Logo />
      <div className="flex justify-center">
        <Submenu />
      </div>
      <div className="flex items-center justify-end gap-4">
        {isDesktop && <DesktopNavLinks />}
        <PersistentCart />
      </div>
    </div>
  );
});

MobileNav.displayName = 'MobileNav';
DesktopNav.displayName = 'DesktopNav';

export default React.memo(Navbar);