import { useMediaQuery } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategoryStore } from '../../../stores/categoryStore';

const SCREEN_SIZES = {
  MOBILE: '(max-width: 640px)',
  TABLET: '(max-width: 1024px)',
};

const CATEGORIES = [
  { 
    id: 'menu',
    name: 'MENU', 
    category: 'all',
    description: 'Explora nuestra carta completa'
  },
  { 
    id: 'desayunos',
    name: 'DESAYUNOS', 
    category: '9',
    description: 'Comienza tu día con energía'
  },
  { 
    id: 'combos',
    name: 'COMBOS', 
    category: 'combo',
    description: 'Las mejores combinaciones'
  },
  { 
    id: 'bebidas',
    name: 'BEBIDAS', 
    category: 'bebidas',
    description: 'Refrescantes opciones'
  },
  {
    id: 'donas',
    name: 'DONAS', 
    category: 'donas',
    description: 'Donas para compartir'
  }
];

// Desktop & Tablet Menu Component
const SubMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setSelectedCategory } = useCategoryStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    const matchingCategory = CATEGORIES.find(cat => 
      currentPath === (cat.category === 'all' ? 'menuSanguches' : cat.id)
    );
    
    setActiveCategory(matchingCategory?.id || null);
    setIsVisible(!['/success', '/checkout'].includes(location.pathname));
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleCategoryClick = useCallback((category, id) => {
    setActiveCategory(id);
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);

    switch(category) {
      case 'combo':
        navigate('/combos');
        break;
      case 'bebidas':
        navigate('/bebidas');
        break;
      case 'donas':
        navigate('/donas');
        break;
      case 'all':
        navigate('/menuSanguches');
        break;
      default:
        navigate(`/menuSanguches?category=${category}`);
    }
  }, [navigate, setSelectedCategory]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative z-40 bg-[#FFC603]
        shadow-sm
      `}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-16">
          {!isMobile ? (
            <DesktopMenu
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={handleCategoryClick}
            />
          ) : (
            <MobileMenu
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={handleCategoryClick}
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(prev => !prev)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DesktopMenu = ({ categories, activeCategory, onSelect }) => (
  <nav className="relative flex items-center justify-center">
    <ul className="flex items-center gap-1">
      {categories.map(({ id, name, category, description }) => (
        <motion.li key={id} className="relative">
          <motion.button
            onClick={() => onSelect(category, id)}
            className={`
              relative px-6 py-2.5 text-sm font-medium tracking-wide
              transition-all duration-300 rounded-full font-poppins
              ${activeCategory === id 
                ? 'text-white bg-[#C8151B] shadow-md transform scale-105' 
                : 'text-gray-800 hover:bg-white/30 hover:text-[#C8151B]'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {name}
            
            {/* Badge para item activo */}
            {activeCategory === id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Tooltip mejorado */}
            <motion.div
              className={`
                absolute top-full left-1/2 -translate-x-1/2 mt-3
                bg-[#C8151B] text-white text-xs px-4 py-2 rounded-lg
                opacity-0 pointer-events-none whitespace-nowrap
                shadow-lg z-50
              `}
              animate={{ 
                opacity: activeCategory === id ? 1 : 0,
                y: activeCategory === id ? 0 : -10
              }}
              transition={{ duration: 0.2 }}
            >
              {description}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 
                border-4 border-transparent border-b-[#C8151B]" />
            </motion.div>
          </motion.button>
        </motion.li>
      ))}
    </ul>
  </nav>
);

const MobileMenu = ({ categories, activeCategory, onSelect, isOpen, onToggle }) => (
  <div className="w-full md:hidden">
    <div className="flex items-center justify-between px-4">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <motion.div 
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="text-[#C8151B]"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </button>
      
      {activeCategory && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-[#C8151B]"
        >
          {CATEGORIES.find(cat => cat.id === activeCategory)?.name}
        </motion.span>
      )}
    </div>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute left-0 right-0 top-full bg-white shadow-lg"
        >
          <nav className="p-2">
            {categories.map(({ id, name, category, description }) => (
              <motion.button
                key={id}
                onClick={() => onSelect(category, id)}
                className={`
                  w-full text-left p-4 rounded-xl mb-1 transition-all duration-200
                  ${activeCategory === id 
                    ? 'bg-[#FFC603] text-[#C8151B] font-medium shadow-md' 
                    : 'hover:bg-gray-50 text-gray-700' }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg font-medium">{name}</span>
                <p className="text-sm mt-1 opacity-80">{description}</p>
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default React.memo(SubMenu);