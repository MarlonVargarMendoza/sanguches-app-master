import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  // Función para manejar el clic en el ícono del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  return (

    <AppBar className=" ">
      <div className="promotions bg-gold-gradient text-black-gradient p-1 text-center overflow-hidden">
        <div className="scrolling-text whitespace-nowrap"> {/* Add class for animation */}
          <div className="inline-block font-semibold">
            ¡NUEVOS COMBOS SANGUCHE Y POLLO BBQ POR SOLO $20.900!
          </div>
        </div>
      </div>
      <Toolbar className="flex justify-between items-center xl:py-0 sm:py-0  ">
        <div className="w-full flex py-6 justify-between items-center ">
          <Link to="/" className="logo flex items-center">
            <img src={logo} alt="logo" className=" logo w-40 h-auto sm:w-48" />
          </Link>
        </div>

        {/* Enlaces de navegación para pantallas grandes */}
        <div id='navbarend' className="all hidden md:flex space-x-12">
          <div id="navlinks" className=" all ">
            <div className='left'>
              <Link to='/editaloTuMismo' className="text-white hover:text-red-400">
                <AutoAwesomeIcon />
                <br />
                Editalo
              </Link>
            </div>

            <div className="center">
              <div className="explainer"><span>Menu</span></div>
              <a href="#" className="text-white hover:text-red-400 ">
                <FastfoodIcon />
                <span>Combos</span>
              </a>
            </div>

            <div className="right">
              <Link to='/menuSanguches' className='text-white hover:text-red-400'>
                <IconButton aria-label="show menu items" color="inherit">
                  <MenuBookIcon />
                </IconButton>
                Menu
              </Link>
            </div>
          </div>

        </div>

        {/* Enlaces de navegación para pantallas pequeñas */}

        <a href="#" className="text-white hover:text-red-400 ml-auto px-3 ">Local</a>

        {/* Botón del menú  para pantallas pequeñas */}
        <div className="md:hidden ml-4">
          <IconButton onClick={toggleMenu} aria-label="Menu" color="inherit">
            <svg
              className="w-6 h-6 text-white"
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
              ></path>
            </svg>
          </IconButton>
        </div>

      </Toolbar>
      <div className=" bg-white p-1 text-center overflow-hidden">
        {/* Add class for animation */}
        <div className="absolute right-0 z-10 mt-2 w-full rounded-md bg-[#f5f5f5] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="flex py-1 justify-between items-center" role="menu" aria-orientation="vertical">
            <li className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFD33D]`} >Granizados</li>
            <li className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFD33D]`} >Sanduches</li>
            <li className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFD33D] `}>Combos</li>
            <div className="text-right pr-4"> {/* Wrapper for right side item, text aligned to right with padding */}
              <span className="text-sm text-gray-700"><AvTimerIcon />Tiempo de entrega 45 min</span>
            </div>
          </ul>
        </div>
      </div>    {/* Menú desplegable para pantallas pequeñas */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden ">
          <a to='/menuSanguches' className="block px-4 py-2 text-white hover:bg-red-400">
            Menu
          </a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-red-400">
            Combos
          </a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-red-400">
            Nosotros
          </a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-red-400">
            Local
          </a>

        </div>
      )}
    </AppBar>
  );
};

export default Navbar;
