import { motion } from 'framer-motion';
import React from 'react';

const PromotionBanner = () => (
  <motion.div
    className="bg-[#C8151B] text-white h-7 overflow-hidden"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="flex items-center gap-2 justify-center text-xs sm:text-sm whitespace-nowrap px-4"
      animate={{ x: ['100%', '-100%'] }}
      transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
    >
      <span className="font-semibold inline-flex items-center">
        🚀 Sangudays <span className="hidden sm:inline ml-1">Especial:</span>
      </span>
      <span className="font-bold bg-white text-[#C8151B] px-2 py-0.5 rounded-full">
        $22.900
      </span>
      <span className="italic truncate max-w-[150px] sm:max-w-none">
        Mejores ingredientes, mejor sabor
      </span>
    </motion.div>
  </motion.div>
);

export default React.memo(PromotionBanner);