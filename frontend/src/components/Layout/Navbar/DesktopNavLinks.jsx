import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { IconButton } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNavLinks = () => (
  <div id='navbarend' className="all hidden  space-x-12">
    <div id="navlinks" className="all">
      <NavLink to='/' icon={<AutoAwesomeIcon />} text="Home" />
      <NavLink to="/menuSanguches" icon={<FastfoodIcon />} text="Menu" />
      <NavLink to='/Local' icon={<MenuBookIcon />} text="Local" />
    </div>
  </div>
);

const NavLink = ({ to, icon, text }) => (
  <div className={text === 'Menu' ? 'center' : text === 'Home' ? 'left' : 'right'}>
    {text === 'Menu' && <div className="explainer"><span>Home</span></div>}
    <Link to={to} className="nav-link text-white hover:text-red-400 font-bold">
      {text !== 'Local' ? icon : (
        <IconButton aria-label="show menu items" color="inherit">
          {icon}
        </IconButton>
      )}
      <br />
      {text}
    </Link>
  </div>
);

export default React.memo(DesktopNavLinks);