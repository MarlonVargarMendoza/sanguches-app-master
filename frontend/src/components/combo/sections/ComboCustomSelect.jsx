import { useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Beer, Gift, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

const typeIcons = {
    drinks: <Beer className="w-5 h-5" />,
    accompaniments: <Gift className="w-5 h-5" />
};

const sectionLabels = {
    drinks: "Selecciona tu Bebida",
    accompaniments: "Selecciona tu Acompañamiento"
};

export const ComboCustomSelect = ({
    type,
    items = [],
    selectedItem,
    onSelect,
    required = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        (item.text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = useCallback((item) => {
        onSelect(item);
        setIsOpen(false);
    }, [onSelect]);

    const clearSelection = useCallback((e) => {
        e.stopPropagation();
        onSelect(null);
    }, [onSelect]);

    // Altura máxima del dropdown basada en el viewport
    const getMaxDropdownHeight = () => {
        if (isMobile) return 'max-h-[40vh]';
        return 'max-h-[50vh]';
    };

    // Formatear el precio para mostrar
    const formatPrice = (price) => {
        if (!price) return '';
        return `$${Number(price).toFixed(2)}`;
    };

    return (
        <div className="w-full mb-4 relative">
            {/* Botón principal */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 bg-white rounded-lg border-2 
          ${isOpen ? 'border-[#FFC603]' : 'border-gray-100'} 
          ${required && !selectedItem ? 'border-red-200 hover:border-red-300' : 'hover:border-[#FFC603]'}
          transition-all duration-300`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-center gap-3">
                    {typeIcons[type]}
                    <span className="font-medium text-gray-700">
                        {selectedItem ? selectedItem.text?.split('-->')[0]?.trim() : sectionLabels[type]}
                    </span>
                    {required && !selectedItem && (
                        <span className="text-xs font-semibold text-red-500">*Requerido</span>
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
                        <div className="sticky top-0 bg-white p-3 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-gray-700 p-2 pl-8 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC603]"
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
                        <div className={`${getMaxDropdownHeight()} overflow-y-auto`}>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id || item.value}
                                        whileHover={{ backgroundColor: 'rgba(255, 198, 3, 0.1)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center justify-between p-3 cursor-pointer border-b border-gray-50
                      ${selectedItem?.id === item.id ? 'bg-[#FFC603]/10' : ''}`}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                className={selectedItem?.id === item.id ? "text-[#FFC603]" : "text-gray-400"}
                                            >
                                                {selectedItem?.id === item.id ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    </svg>
                                                )}
                                            </motion.div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.text?.split('-->')[0]?.trim()}
                                                </span>
                                                {item.combo_price && (
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        Precio combo: {formatPrice(item.combo_price)}
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

                        {/* Footer */}
                        <div className="sticky bottom-0 p-3 bg-gray-50 flex justify-between items-center border-t">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Cerrar
                            </button>
                            {selectedItem && (
                                <button
                                    onClick={clearSelection}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <X className="w-4 h-4" />
                                    Limpiar selección
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ComboCustomSelect;