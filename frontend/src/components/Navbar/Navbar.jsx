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
              🚀 Disfruta nuestras sangudays por tan sólo $22.900 ¡sanguches mejores ingredientes, mejor pizza
            </div>
          </div>
        </div>
        <Toolbar className="flex justify-between items-center xl:py-0 sm:py-0 sticky bg-[#FFC603] z-50  ">
          <div className="w-full flex justify-center items-center">
            <Link to="/" className="logo flex items-center">
              <img src={logo} alt="logo" className=" logo w-40 h-auto sm:w-48" />
            </Link>
          </div>

          {/* Enlaces de navegación para pantallas grandes */}
          <div id='navbarend' className="all hidden md:flex space-x-12">
            <div id="navlinks" className=" all ">
              <div className='left'>
                <Link to='/' className="text-white hover:text-red-400 font-bold">
                  <AutoAwesomeIcon />
                  <br />
                  Home
                </Link>
              </div>

              <div className="center">
                <div className="explainer"><span>Home</span></div>
                <a href="/menuSanguches" className="text-white hover:text-red-400 font-bold ">
                  <FastfoodIcon />
                  <span>Menu</span>
                </a>
              </div>

              <div className="right">
                <Link to='/Local' className='text-white hover:text-red-400 font-bold'>
                  <IconButton aria-label="show menu items" color="inherit">
                    <MenuBookIcon />
                  </IconButton>
                  Local
                </Link>
              </div>
            </div>

          </div>

          {/* Enlaces de navegación para pantallas pequeñas */}{/* 

          <a href="/Local" className="text-black hover:text-red-400 ml-auto px-3 font-black  text-xl text-shadow ">LOCAL</a> */}

          {/* Botón del menú  para pantallas pequeñas */}
          <div className="md:hidden ml-4 strong">
            <IconButton onClick={toggleMenu} aria-label="Menu" >
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
                ></path>
              </svg>
            </IconButton>
          </div>

        </Toolbar>

        {/* Add class for animation */}
        <div className="z-10 py-2 w-full bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden md:block md:overflow-hidden">
          <div className="flex justify-between items-center px-4" role="menu" aria-orientation="vertical">
            <nav> 
              <ul className="flex space-x-4"> 
                <li className={`text-xl text-black cursor-pointer hover:bg-[#FFC603] font-black text-shadow`} >BEBIDAS</li>
                <Link to='/menuSanguches' className={`text-xl text-black cursor-pointer hover:bg-[#FFC603] font-black  text-shadow`} >SANGUCHES</Link>
                <li className={`text-xl text-black cursor-pointer hover:bg-[#FFC603] font-black  text-shadow `}>COMBOS</li>
                <li className={`text-xl text-black cursor-pointer hover:bg-[#FFC603] font-black  text-shadow `}>ANTOJOS</li>
              </ul>
            </nav>
            <div className="flex items-center"> {/* Wrap delivery time in a flex container for vertical centering */}
              <AvTimerIcon className="mr-2" />
              <span className="text-sm text-black ">Tiempo de entrega 45 min</span>
            </div>
          </div>
        </div>
        {/* Menú desplegable para pantallas pequeñas */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden ">
            <br />
            <br />
            <br />
            <a to='/menuSanguches' className="block px-4 py-2 text-black font-bold hover:bg-red-400  text-shadow">
              Menu
            </a>
            <a href="#" className="block px-4 py-2 text-black font-bold hover:bg-red-400 color-black text-shadow">
              Combos
            </a>
            <a href="#" className="block px-4 py-2 text-black font-bold hover:bg-red-400">
              Nosotros
            </a>
            <a href="#" className="block px-4 py-2 text-black font-bold hover:bg-red-400">
              Local
            </a>

          </div>
        )}
      </AppBar>
    );
  };

  export default Navbar;
