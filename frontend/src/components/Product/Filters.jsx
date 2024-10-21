import { Box, FormControl, MenuItem, Select, Slider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React from 'react';

export function Filters({ filters = { minPrice: 0, category: 'all' }, onFilterChange }) {
    const handleChangeMinPrice = (event, newValue) => {
        onFilterChange({ ...filters, minPrice: Number(newValue) });
    };

    const handleChangeCategory = (event) => {
        onFilterChange({ ...filters, category: event.target.value });
    };

    const categorias = [
        { id: 'all', nombre: 'Todos los sanguches' },
        { id: 7, nombre: 'Sanguches tradicionales' },
        { id: 8, nombre: 'Sanguchitos' },
        { id: 9, nombre: 'Desayunos' },
        { id: 10, nombre: 'Donas' },
        { id: 11, nombre: 'Pasteles' },
        { id: 12, nombre: 'Otros' },
    ];

    return (
        <motion.div 
            className='filters flex flex-col w-full gap-6'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box className='filter-item'>
                <Typography variant="subtitle1" className='text-gray-700 font-semibold mb-2'>
                    Categoría
                </Typography>
                <FormControl fullWidth>
                    <Select
                        value={filters.category}
                        onChange={handleChangeCategory}
                        displayEmpty
                    >
                        {categorias.map(categoria => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box className='filter-item'>
                <Typography variant="subtitle1" className='text-gray-700 font-semibold mb-2'>
                    Precio a partir de:
                </Typography>
                <Slider
                    value={filters.minPrice}
                    onChange={handleChangeMinPrice}
                    valueLabelDisplay="auto"
                    step={1000}
                    marks
                    min={0}
                    max={50000}
                    sx={{
                        color: '#FFC603',
                        '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${alpha('#FFC603', 0.16)}`,
                            },
                            '&.Mui-active': {
                                boxShadow: `0px 0px 0px 14px ${alpha('#FFC603', 0.16)}`,
                            },
                        },
                    }}
                />
                <Typography variant="body2" className='text-gray-700 mt-2'>
                    ${filters.minPrice}
                </Typography>
            </Box>
        </motion.div>
    );
}

export default Filters;