'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../../style';
import logo from '/assets/logo.svg';
const Footer = () => {
  const [isOpenNosotros, setIsOpenNosotros] = useState(false);
  const [isOpenServicio, setIsOpenServicio] = useState(false);
  const [isOpenLegal, setIsOpenLegal] = useState(false);

  const toggleNosotros = () => setIsOpenNosotros(!isOpenNosotros);
  const toggleServicio = () => setIsOpenServicio(!isOpenServicio);
  const toggleLegal = () => setIsOpenLegal(!isOpenLegal);

  return (
    <>
      <div className={` ${styles.paddingX} flex flex-col md:flex-row justify-between items-center md:space-x-6 bg-[#FFC603] py-6`}>
        {/* Sección Nosotros */}
        <div className="mb-4 md:mb-0 flex flex-col items-center cursor-pointer" onClick={toggleNosotros}>
          <div className="flex items-center">
            <h3 className="text-black text-lg font-semibold">NOSOTROS</h3>
            <ExpandMoreIcon className={`text-black transform transition-transform ${isOpenNosotros ? 'rotate-180' : ''}`} />
          </div>
          {isOpenNosotros && (
            <div className={`${styles.paragraph2, styles.paddingX, styles.paddingY} mt-2 text-center text-black`}>
              <p>Somos una empresa dedicada a la creación de los mejores sándwiches gourmet.</p>
              <p>Visítanos en nuestras múltiples sucursales en toda Colombia.</p>
              <a href="/Local" className='text-decoration-200'> Ver sede</a>
            </div>
          )}
        </div>

        {/* Sección Servicio al Cliente */}
        <div className="mb-4 md:mb-0 flex flex-col items-center cursor-pointer" onClick={toggleServicio}>
          <div className="flex items-center">
            <h3 className="text-black text-lg font-semibold">SERVICIO AL CLIENTE</h3>
            <ExpandMoreIcon className={`text-black transform transition-transform ${isOpenServicio ? 'rotate-180' : ''}`} />
          </div>
          {isOpenServicio && (
            <div className={`${styles.paragraph2, styles.paddingX, styles.paddingY} mt-2 text-center text-black`}>
              <p>Estamos aquí para ayudarte con cualquier duda o problema.</p>
              <p>Contáctanos a través de nuestro centro de soporte 24/7.</p>
            </div>
          )}
        </div>
        {/* Sección Información Legal */}
        <div className="mb-4 md:mb-0 flex flex-col items-center cursor-pointer" onClick={toggleLegal}>
          <div className="flex items-center">
            <h3 className="text-black text-lg font-semibold">INFORMACIÓN LEGAL</h3>
            <ExpandMoreIcon className={`text-black transform transition-transform ${isOpenLegal ? 'rotate-180' : ''}`} />
          </div>
          {isOpenLegal && (
            <div className={`${styles.paragraph2, styles.paddingX, styles.paddingY} mt-2 text-center text-black`}>
              <p>Aquí puedes encontrar todos nuestros términos y condiciones.</p>
              <p>También puedes revisar nuestra política de privacidad y protección de datos.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-[#f5e4c1] ">
      
        <div className="container mx-auto px-4 text-center md:text-left">
         

          {/*  Redes sociales */}
          <div className="flex justify-center space-x-4 py-6">
            <a href="#" aria-label="Instagram" className="text-[#AB131B] hover:text-orange-600">
              <FaInstagram size={24} />
            </a>
            <a href="#" aria-label="Twitter" className="text-[#AB131B] hover:text-orange-600">
              <FaTwitter size={24} />
            </a>
            <a href="#" aria-label="Facebook" className="text-[#AB131B] hover:text-orange-600">
              <FaFacebookF size={24} />
            </a>
            <a href="#" aria-label="Whatsapp" className="text-[#AB131B] hover:text-orange-600">
              <FaWhatsapp size={24} />
            </a>
          </div>

          <div className="w-full flex justify-center items-center">
            <Link to="/" className="logo flex items-center">
              <img src={logo} alt="logo" className=" logo w-40 h-auto sm:w-48" />
            </Link>
          </div>
          {/* Sección inferior: Información */}
          <div className="text-center text-sm text-gray-700 py-4 border-t border-gray-300">
            <p>Calle 10# 25a-467 Medellin, Teléfono: (2)3127255 Correo: <a href="mailto:serviciocliente@ejemplo.com" className="text-[#ab131b] hover:underline">serviciocliente@sanguches.com</a></p>
            <p>© 2024 Todos los Derechos Reservados</p>
          </div>
        </div>

      </footer>
    </>

  );
};

export default Footer;
