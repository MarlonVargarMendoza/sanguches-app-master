// OrderSummary.jsx
import { Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import priceUtils from '../../../utils/priceUtils';
const OrderSummary = ({ items, total }) => (
    <Box className="bg-white p-6 rounded-lg shadow-md">
        <Typography variant="h5" className="mb-4 font-semibold text-black">
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
                <Box className="mb-3">
                    <Box className="flex justify-between">
                        <Typography variant="body1" className="font-medium">
                            {item.name} x{item.quantity}
                        </Typography>
                        <Typography variant="body1" className="font-bold">
                            ${(item.basePrice * item.quantity)}
                        </Typography>
                    </Box>
                    {item.customizations && (
                        <List dense>
                            {item.customizations.additions?.length > 0 && (
                                <ListItem>
                                    <ListItemText
                                        secondary={`Adiciones: ${item.customizations.additions.map(a => a.text || a.name).join(', ')}`}
                                    />
                                </ListItem>
                            )}
                            {item.customizations.sauces?.length > 0 && (
                                <ListItem>
                                    <ListItemText
                                        secondary={`Salsas: ${item.customizations.sauces.map(s => s.text || s.name).join(', ')}`}
                                    />
                                </ListItem>
                            )}
                            {item.customizations.drinks?.length > 0 && (
                                <ListItem>
                                    <ListItemText
                                        secondary={`Bebidas: ${item.customizations.drinks.map(d => d.text || d.name).join(', ')}`}
                                    />
                                </ListItem>
                            )}
                            {item.customizations.accompaniments?.length > 0 && (
                                <ListItem>
                                    <ListItemText
                                        secondary={`Acompañamientos: ${item.customizations.accompaniments.map(a => a.text || a.name).join(', ')}`}
                                    />
                                </ListItem>
                            )}
                        </List>
                    )}
                </Box>
            </motion.div>
        ))}
        <Divider className="my-4" />
        <Box className="flex justify-between">
            <Typography variant="h6" className="font-bold">
                Total
            </Typography>
            <Typography variant="h6" className="font-bold text-[#C8151B]">
                
                {priceUtils(total)}
            </Typography>
        </Box>
    </Box>
);

export default OrderSummary;