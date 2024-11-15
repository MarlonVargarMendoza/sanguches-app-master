import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

const QuantityAndCartControls = ({
    quantity,
    handleQuantityChange,
    handleAddToCart,
    isEditing,
    disabled = false
}) => {
    return (
        <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box className="flex items-center bg-gray-100 rounded-full p-2">
                <Tooltip title="Disminuir cantidad" arrow>
                    <span>
                        <IconButton
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1 || disabled}
                            className="text-gray-600 hover:text-[#C8151B] disabled:text-gray-400"
                        >
                            <Minus className="w-4 h-4" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Typography className="mx-4 font-bold text-gray-700 min-w-[2ch] text-center">
                    {quantity}
                </Typography>

                <Tooltip title="Aumentar cantidad" arrow>
                    <IconButton
                        onClick={() => handleQuantityChange(1)}
                        disabled={disabled}
                        className="text-gray-600 hover:text-[#FFC603] disabled:text-gray-400"
                    >
                        <Plus className="w-4 h-4" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Button
                onClick={handleAddToCart}
                variant="contained"
                disabled={disabled}
                className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white flex-grow sm:flex-grow-0 sm:min-w-[200px]"
                startIcon={<ShoppingCart className="w-5 h-5" />}
            >
                {isEditing ? 'Actualizar combo' : 'Añadir al carrito'}
            </Button>
        </motion.div>
    );
};

export default QuantityAndCartControls;