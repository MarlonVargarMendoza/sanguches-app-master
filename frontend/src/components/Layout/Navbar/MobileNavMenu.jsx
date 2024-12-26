import LocationOnIcon from '@mui/icons-material/LocationOn'; // Importamos el icono de ubicación
import { IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const MobileNavMenu = () => (
  <div className="relative flex items-center">
    <IconButton
    >
      <motion.div
        transition={{ duration: 0.2 }}
      >
        <Link
          to="/local"
          className="block px-4 text-gray-800 font-medium border-gray-100
                 hover:text-[#C8151B] transition-colors duration-200"
        >
          <LocationOnIcon fontSize="small" />
        </Link>
      </motion.div>
    </IconButton>
  </div>
);


export default React.memo(MobileNavMenu);