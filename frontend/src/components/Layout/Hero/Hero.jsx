import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { CarouselTransition } from '../../ui/CarouselTransition';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <Box
      className={`relative overflow-hidden ${isMobile
          ? 'h-[calc(140vh-320px)] pt-[160px]'
          : isTablet
            ? 'h-[calc(100vh-100px)] pt-[150px]'
            : isDesktop
              ? 'h-[calc(100vh-0px)] pt-[190px]'
              : 'h-[calc(100vh-0px)] pt-[185px]'
        }`}
    >

      <motion.div
        className=" h-full w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 5, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CarouselTransition className="absolute inset-0 w-full h-full" />

      </motion.div>
    </Box>
  );
}

export default React.memo(Hero);