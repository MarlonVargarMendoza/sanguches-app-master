import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { CarouselTransition } from '../../ui/CarouselTransition';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  // Breakpoint específico para MacBook Air
  const isMacBook = useMediaQuery('(min-width: 1280px) and (max-width: 1440px)');

  const getHeroStyles = useCallback(() => {
    const baseStyles = {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      backgroundColor: '#FFF9C4',
    };

    // Ajustes específicos para MacBook Air
    if (isMacBook) {
      return {
        ...baseStyles,
        height: 'calc(100vh - 64px)', // Ajuste específico para MacBook
        paddingTop: '64px',
        '& .carousel-container': {
          height: '100%',
          '& img': {
            objectFit: 'cover',
            objectPosition: 'center center',
            width: '100%',
            height: '100%',
            transform: 'scale(1.0)', // Ligero scale para evitar bordes blancos
          }
        }
      };
    }

    if (isMobile) {
      return {
        ...baseStyles,
        height: 'calc(100vh - 340px)',
        paddingTop: '75px',
        '& .carousel-container': {
          height: '100%',
          '& img': {
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%'
          }
        }
      };
    }

    if (isTablet) {
      return {
        ...baseStyles,
        height: 'calc(100vh - 100px)',
        paddingTop: '100px',
        '& .carousel-container': {
          height: '100%'
        }
      };
    }

    return {
      ...baseStyles,
      height: isDesktop ? 'calc(100vh - 0px)' : 'calc(100vh - 0px)',
      paddingTop: isDesktop ? '100px' : '185px',
      '& .carousel-container': {
        height: '100%',
        maxWidth: '1920px',
        margin: '0 auto'
      }
    };
  }, [isMobile, isTablet, isDesktop, isMacBook]);

  return (
    <Box 
      sx={getHeroStyles()}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="carousel-container relative w-full h-full border-b-8 border-[#FFC603]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CarouselTransition />
        
        {/* Overlay optimizado para MacBook */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: isMacBook ? '40%' : '30%', // Mayor altura para MacBook
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
            '@media (min-width: 1280px) and (max-width: 1440px)': {
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)'
            }
          }}
        />
      </motion.div>
    </Box>
  );
};

export default React.memo(Hero);