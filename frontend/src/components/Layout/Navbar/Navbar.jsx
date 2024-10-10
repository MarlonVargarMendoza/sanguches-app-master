import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PersistentCart from '../../Cart/PersistentCart';
import logo from '/assets/logo.svg';


// Custom hook for scroll detection
const useScrollDetection = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

// Sub-components
const PromotionBanner = () => (
  <motion.div
    className="bg-[#C8151B] text-white p-2 overflow-hidden"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="flex items-center justify-center"
      animate={{ x: ['100%', '-100%'] }}
      transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
    >
      <span className="text-lg font-bold mr-4">🚀 Sangudays Especial:</span>
      <span className="text-xl font-extrabold">$22.900</span>
      <span className="ml-4 text-sm">Mejores ingredientes, mejor sabor</span>
    </motion.div>
  </motion.div>
);

const Logo = () => (
  <Link to="/" className="logo flex items-center transition-transform duration-300 hover:scale-105">
    <img src={logo} alt="logo" className="logo w-40 h-auto sm:w-48" />
  </Link>
);

const DesktopNavLinks = () => (
  <div id='navbarend' className="all hidden md:flex space-x-12">
    <div id="navlinks" className="all">
      <div className='left'>
        <Link to='/' className="nav-link text-white hover:text-red-400 font-bold">
          <AutoAwesomeIcon />
          <br />
          Home
        </Link>
      </div>

      <div className="center">
        <div className="explainer"><span>Home</span></div>
        <Link to="/menuSanguches" className="nav-link text-white hover:text-red-400 font-bold">
          <FastfoodIcon />
          <span>Menu</span>
        </Link>
      </div>

      <div className="right">
        <Link to='/Local' className='nav-link text-white hover:text-red-400 font-bold'>
          <IconButton aria-label="show menu items" color="inherit">
            <MenuBookIcon />
          </IconButton>
          Local
        </Link>
      </div>
    </div>
  </div>
);

const MobileNavMenu = ({ isOpen, toggleMenu }) => (
  <>
    <div className="md:hidden ml-4 strong">
      <IconButton onClick={toggleMenu} aria-label="Menu">
        <svg
          className="w-6 h-6 text-[#b01027]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </IconButton>
    </div>
    {isOpen && (
      <div id="mobile-menu" className="md:hidden bg-white">
        <Link to='/menuSanguches' className="block px-4 py-2 text-black font-bold hover:bg-red-400 text-shadow">
          Menu
        </Link>
        <a href="#" className="block px-4 py-2 text-black font-bold hover:bg-red-400 color-black text-shadow">
          Combos
        </a>
        <a href="#" className="block px-4 py-2 text-black font-bold hover:bg-red-400">
          Nosotros
        </a>
        <Link to='/Local' className="block px-4 py-2 text-black font-bold hover:bg-red-400">
          Local
        </Link>
      </div>
    )}
  </>
);

const Submenu = () => (
  <motion.div
    className="bg-white shadow-lg"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <nav>
        <ul className="flex space-x-6">
          {['DESAYUNOS', 'SANGUCHES', 'ANTOJOS'].map((item, index) => (
            <motion.li
              key={item}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item === 'SANGUCHES' ? '/menuSanguches' : '#'}
                className="text-lg font-bold text-gray-800 hover:text-[#C8151B] transition-colors duration-300"
              >
                {item}
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFC603]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div
        className="flex items-center text-gray-600"
        whileHover={{ scale: 1.05 }}
      >
        <AvTimerIcon className="mr-2 text-[#C8151B]" />
        <span className="text-sm font-medium">Entrega en 45 min</span>
      </motion.div>
    </div>
  </motion.div>
);


// Main Navbar component
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollDetection(10);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <AppBar className={`transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <PromotionBanner />
      <Toolbar className="flex justify-between items-center xl:py-0 sm:py-0 sticky bg-[#FFC603] z-50">
        <div className="w-full flex justify-center items-center">
          <Logo />
        </div>
        <DesktopNavLinks />
        <PersistentCart />
        <MobileNavMenu isOpen={isOpen} toggleMenu={toggleMenu} />
      </Toolbar>
      <Submenu />

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
    </AppBar>
  );
};

export default Navbar;