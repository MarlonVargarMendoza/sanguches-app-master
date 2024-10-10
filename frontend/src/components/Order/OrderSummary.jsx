// src/components/Order/OrderSummary.jsx
import { Box, Divider, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const OrderSummary = ({ items, total }) => (
  <Box className="bg-white p-6 rounded-lg shadow-md">
    <Typography variant="h5" className="mb-4 font-semibold text-[#C8151B]">
      Resumen del pedido
    </Typography>
    <Divider className="mb-4" />
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Box className="flex justify-between mb-3">
          <Typography variant="body1" className="font-medium">
            {item.name} x{item.quantity}
          </Typography>
          <Typography variant="body1" className="font-bold">
            ${(item.basePrice * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      </motion.div>
    ))}
    <Divider className="my-4" />
    <Box className="flex justify-between">
      <Typography variant="h6" className="font-bold">
        Total
      </Typography>
      <Typography variant="h6" className="font-bold text-[#C8151B]">
        ${total.toFixed(2)}
      </Typography>
    </Box>
  </Box>
);

export default OrderSummary;