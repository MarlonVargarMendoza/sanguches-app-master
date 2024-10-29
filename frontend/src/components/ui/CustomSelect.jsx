import { useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

const CustomSelect = ({
    label,
    items = [],
    selectedItems = [],
    onChange,
    icon,
    priceDisplay = true
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getMaxDropdownHeight = () => {
        if (isMobile) return 'max-h-[40vh]';
        if (isTablet) return 'max-h-[40vh]';
        return 'max-h-[40vh]';
    };

    const filteredItems = items.filter(item =>
        (item.name || item.text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleItem = useCallback((itemId) => {
        const newSelection = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId];
        onChange(newSelection);
    }, [selectedItems, onChange]);

    return (
        <div className="w-full mb-4 relative">
            {/* Botón principal */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-[#FFC603] transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium text-gray-700">{label}</span>
                    {selectedItems.length > 0 && (
                        <span className="bg-[#FFC603] text-xs font-bold px-2 py-1 rounded-full">
                            {selectedItems.length}
                        </span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {/* Barra de búsqueda */}
                        <div className="sticky top-0 bg-white p-3 border-b z-10">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 pl-8 bg-gray-50 text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC603]"
                                />
                                <svg
                                    className="absolute left-2 top-2.5 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Lista de items */}
                        <div className={`${getMaxDropdownHeight()} overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFC603] scrollbar-track-gray-100`}>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ backgroundColor: 'rgba(255, 198, 3, 0.1)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-between p-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50"
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                className={selectedItems.includes(item.id) ? "text-[#FFC603]" : "text-gray-400"}
                                            >
                                                {selectedItems.includes(item.id) ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                )}
                                            </motion.div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.name || item.text}
                                                </span>
                                                {priceDisplay && item.price && (
                                                    <span className="text-xs text-gray-500">
                                                        +${item.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>

                        {/* Footer del dropdown */}
                        <div className="sticky bottom-0 p-3 bg-gray-50 flex justify-between items-center border-t">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Cerrar
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {selectedItems.length} seleccionados
                                </span>
                                {selectedItems.length > 0 && (
                                    <button
                                        onClick={() => onChange([])}
                                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        <X className="w-4 h-4" />
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tags seleccionados */}
            {selectedItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mt-2"
                >
                    {selectedItems.map((id) => {
                        const item = items.find(i => i.id === id);
                        return (
                            <motion.span
                                key={id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {item?.name || item?.text}
                                <X
                                    className="w-4 h-4 cursor-pointer hover:text-red-500"
                                    onClick={() => toggleItem(id)}
                                />
                            </motion.span>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export default CustomSelect;