import { Box } from '@mui/material';
import React from 'react';
import styles from '../../style';
import Button from '../ui/Button';
import { CarouselTransition } from '../ui/CarouselTransition';


const Hero = () => {
  return (
    <Box className="h-screen bg-[#D2E6E4] relative flex items-center justify-center w-full md:pt-[150px] lg:pt-[180px] overflow-hidden]"
    >
      <CarouselTransition className="absolute top-0 left-0 w-full h-full object-cover " />
      <Box
        className="absolute sm:top-0 md:top-0 lg:top-20 left-0 w-full h-full  flex items-center justify-end z-10 pointer-events-none"
        data-aos="fade-up"
      >
        <Box
          className="text-right max-w-lg space-y-1 animate-fadeInUp relative"
        >
          <div className="flex flex-row items-center font-black pt-[9px] px-4 bg-discount-gradient rounded-[10px] mb-2">
            {/*   <img src={banner} alt="discount" className="w-[32px] h-[32px] bg-white rounded-full mr-2" />
           */}
            <p className={`${styles.paragraph} ml-2`}>
              <span className="text-white">¡Personaliza</span> tu {" "}
              <span className="text-white">sanguche</span> <span className="text-white">ahora!</span> {/* Emphasize "ahora" */}
            </p>
          </div>

          <div className="flex flex-row justify-between items-center w-full mt-8">
            <h1 className="flex-1 font-poppins font-black ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
              COMBO <br className="md:block hidden" />
              <span className="text-gradient">PARA PARCHAR</span> {" "}
            </h1>
            <div className="ss:flex hidden md:mr-4 mr-0"></div>
          </div>

          <div className="w-full pointer-events-auto ">
            <Button buttonText='Ver el menu' />
          </div>
          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            visita nuestro catálogo sanguches ©
          </p>
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
