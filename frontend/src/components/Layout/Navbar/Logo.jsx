import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/assets/logo.svg';

const Logo = () => (
  <Link to="/" className="logo flex items-center justify-center transition-transform duration-300 hover:scale-105">
    <img src={logo} alt="logo" className="logo w-40 h-auto sm:w-48" />
  </Link>
);

export default React.memo(Logo);