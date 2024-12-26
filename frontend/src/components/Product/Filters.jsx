import { Box, Chip, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCategoryStore } from '../../stores/categoryStore';

const CATEGORIES = [
    { id: 'all', name: 'Sanguches y sanguchitos', icon: '🥪', color: '#FFC603' },
    { id: 7, name: 'Sanguches', icon: '🍔', color: '#FF9B9B' },
    { id: 8, name: 'Sanguchitos', icon: '🥖', color: '#FFB084' },
    { id: 9, name: 'Desayunos', icon: '☕', color: '#AED9E0' },
    { id: 10, name: 'Donas', icon: '🍩', color: '#FFA8E2' },
    { id: 11, name: 'Pasteles', icon: '🍰', color: '#B5EAD7' },
    { id: 12, name: 'Otros', icon: '✨', color: '#C7CEEA' }
];

const SelectIcon = React.memo(({ ownerState = {} }) => {
    const isOpen = Boolean(ownerState?.open);

    return (
        <motion.div
            initial={false}
            animate={{
                rotate: isOpen ? 180 : 0,
                originY: 0.55  // Ajusta el punto de rotación
            }}
            transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1] // Transición suave tipo Material Design
            }}
        >
            <ChevronDown
                size={24}
                className={`text-gray-500 transform ${isOpen ? 'text-[#FFC603]' : ''}`}
                style={{
                    strokeWidth: 2.5,
                    transformOrigin: 'center'
                }}
            />
        </motion.div>
    );
});

SelectIcon.displayName = 'SelectIcon';


export function Filters({ filters = { category: 'all' }, onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { selectedCategory, setSelectedCategory } = useCategoryStore();

    useEffect(() => {
        // Sincronizar el estado cuando cambia desde el submenu
        if (selectedCategory !== filters.category) {
            onFilterChange({ ...filters, category: selectedCategory });
        }
    }, [selectedCategory]);

    const handleChangeCategory = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        onFilterChange({ ...filters, category: newCategory });
    };

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            className="w-full max-w-md "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='mb-2'>
                <Typography
                    variant="h6"
                    className="text-gray-800 font-bold"
                >
                    Explorar Categorías
                </Typography>
            </div>

            <FormControl fullWidth >
                <Select
                    value={filters.category}
                    onChange={handleChangeCategory}
                    IconComponent={SelectIcon}
                    className="bg-white rounded-lg font-medium text-sm"
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E7EB',
                            borderWidth: '2px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFC603',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFC603',
                        },
                        '& .MuiSelect-select': {
                            padding: '16px',
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 400,
                                borderRadius: '12px',
                                mt: 1,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                '& .MuiList-root': {
                                    padding: '8px',
                                }
                            }
                        }
                    }}
                >
                    <Box className="sticky top-0 p-2 bg-white z-10">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                className="w-full bg-transparent border-none outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </Box>

                    {filteredCategories.map((categoria) => (
                        <MenuItem
                            key={categoria.id}
                            value={categoria.id}
                            className="rounded-lg my-1 hover:bg-gray-50"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{categoria.icon}</span>
                                    <span>{categoria.name}</span>
                                </div>
                                <Chip
                                    size="small"
                                    label={filters.category === categoria.id ? 'Seleccionado' : ''}
                                    sx={{
                                        backgroundColor: categoria.color,
                                        visibility: filters.category === categoria.id ? 'visible' : 'hidden',
                                        '& .MuiChip-label': { color: '#000' }
                                    }}
                                />
                            </div>
                        </MenuItem>
                    ))}

                    {filteredCategories.length === 0 && (
                        <Box className="p-4 text-center text-gray-500">
                            No se encontraron categorías
                        </Box>
                    )}
                </Select>
            </FormControl>

            {/* Chips de categorías populares */}
            <Box className="flex flex-wrap gap-2 mt-4">
                {CATEGORIES.slice(0, 4).map((cat) => (
                    <motion.div
                        key={cat.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Chip
                            label={cat.name}
                            icon={<span className="ml-2">{cat.icon}</span>}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                onFilterChange({ ...filters, category: cat.id });
                            }}
                            sx={{
                                backgroundColor: filters.category === cat.id ? '#FFC603' : '#F3F4F6',
                                '&:hover': { backgroundColor: '#FFE082' },
                                transition: 'all 0.2s'
                            }}
                        />
                    </motion.div>
                ))}
            </Box>
        </motion.div>
    );
}

export default Filters;