import { motion } from 'framer-motion';
import React from 'react';

const PromotionBanner = () => (
  <motion.div
    className="bg-[#C8151B] text-white py-1 md:1 sm:py-1 overflow-hidden"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="flex items-center justify-center text-sm"
      animate={{ x: ['100%', '-100%'] }}
      transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
    >
      <span className="font-semibold">🚀 Sangudays Especial:</span>
      <span className="font-bold bg-white text-[#C8151B] px-1 py-0.5 rounded-full mx-1">$22.900</span>
      <span className="italic">Mejores ingredientes, mejor sabor</span>
    </motion.div>
  </motion.div>
);

export default React.memo(PromotionBanner);