import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../assets/banner.png';
import styles from '../../style';


const Hero = () => {
  return (
    <Box
      className="h-screen bg-center bg-no-repeat bg-cover bg-[#D2E6E4] relative flex items-center justify-end px-8 md:px-16 lg:px-24"
      style={{ backgroundImage: `url(${banner})`, paddingTop: '175px' }}
    >
      <Box
        className="text-right max-w-lg space-y-1 animate-fadeInUp"
        data-aos="fade-left"
      >
        <div className="flex flex-row items-center py-[9px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={banner} alt="discount" className="w-[32px] h-[32px] bg-white rounded-full mr-2" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">Personaliza</span> tu {" "}
            <span className="text-white">sanguche</span> ahora!
          </p>
        </div>

        <Link to='/products'></Link>

        <div className="flex flex-row justify-between items-center w-full mt-8">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            COMBO <br className="sm:block hidden" />
            <span className="text-gradient">PARA PARCHAR</span> {" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0"></div>
        </div>

        <div className='flex items-center justify-center h-full'>
          <Link  to='/menuSanguches'>
          <button type='button' className={`relative text-lg border-none py-4 px-16 font-poppins font-medium text-[18px] text-primary bg-gold-gradient rounded-[10px] transition-all duration-500 ease-in-out uppercase tracking-wide hover:tracking-wider hover:text-white hover:bg-white`}>
            Ordena ahora!
            <i className="absolute inset-0 block">
              <span className="relative z-10"></span>
              <span className="absolute inset-0 transition-all duration-300 ease-in-out before:absolute before:top-[-2px] before:left-[80%] before:w-[10px] before:h-[2px] before:border before:border-white before:bg-[#272822] before:transition-all hover:before:left-[20%] hover:before:w-[15px] after:absolute after:bottom-[-2px] after:left-[20%] after:w-[10px] after:h-[2px] after:border after:border-white after:bg-[#272822] after:transition-all hover:after:left-[80%] hover:after:w-[15px]"></span>
            </i>
          </button>
          </Link>
        </div>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          visita nuestro catálogo sanguches ©
        </p>
      </Box>
    </Box>
  );
}

export default Hero;
