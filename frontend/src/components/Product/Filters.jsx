import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material';
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
        { id: 'all', nombre: 'Todas' },
        { id: 7, nombre: 'Tradicional' },
        { id: 8, nombre: 'Sanguchito' },
        { id: 9, nombre: 'Desayuno' },
        { id: 10, nombre: 'Dona' },
        { id: 11, nombre: 'Pastel' },
        { id: 12, nombre: 'Otro' },
        { id: 13, nombre: 'Papas a la francesa' },
        { id: 14, nombre: 'Palos de yuca' },
    ];

    return (
        <motion.section 
            className='filters flex flex-col sm:flex-row w-full sm:w-3/4 lg:w-1/2 mx-auto mb-6 gap-4 px-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box className='filter-item flex-1'>
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

            <FormControl className='filter-item flex-1'>
                <InputLabel id="category-select-label">Categoría</InputLabel>
                <Select
                    labelId="category-select-label"
                    value={filters.category}
                    onChange={handleChangeCategory}
                    label="Categoría"
                >
                    {categorias.map(categoria => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </motion.section>
    );
}

export default Filters;