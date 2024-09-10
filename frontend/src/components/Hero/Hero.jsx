import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../assets/banner.png';
import { Button } from '../../components';
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
        <div className="flex flex-row items-center font-black py-[9xpx] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={banner} alt="discount" className="w-[32px] h-[32px] bg-white rounded-full mr-2" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">Personaliza</span> tu {" "}
            <span className="text-white">sanguche</span> ahora!
          </p>
        </div>

        <Link to='/products'></Link>

        <div className="flex flex-row justify-between items-center w-full mt-8">
          <h1 className="flex-1 font-poppins font-black ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            COMBO <br className="sm:block hidden" />
            <span className="text-gradient">PARA PARCHAR</span> {" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0"></div>
        </div>

      <Button buttonText='Ordenar ahora' />

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          visita nuestro catálogo sanguches ©
        </p>
      </Box>
    </Box>
  );
}

export default Hero;
