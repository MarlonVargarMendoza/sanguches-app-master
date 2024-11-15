import { TextField } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const CustomerDataSection = ({ personalId, onPersonalIdChange, error }) => {
    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo permite números
        onPersonalIdChange(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md mb-4"
        >
            <TextField
                fullWidth
                label="Número de Cédula"
                variant="outlined"
                value={personalId}
                onChange={handleChange}
                error={!!error}
                helperText={error} 
                placeholder="Ingresa tu número de cédula"
                required
                inputProps={{
                    maxLength: 12,
                    pattern: '[0-9]*'
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#C8151B',
                        }
                    }
                }}
            />
        </motion.div>
    );
};

export default CustomerDataSection;