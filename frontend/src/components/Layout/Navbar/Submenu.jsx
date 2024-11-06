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
    category: '10',
    description: 'Donas para compartir'
  }
];

// Desktop & Tablet Menu Component
const DesktopMenu = ({ categories, activeCategory, onSelect }) => (
  <div className="hidden md:block">
    <nav className="relative flex items-center">
      <ul className="flex items-center gap-2 lg:gap-4">
        {categories.map(({ id, name, category, description }) => (
          <motion.li key={id} className="relative">
            <motion.button
              onClick={() => onSelect(category, id)}
              className={`
                relative px-4 py-2 text-base lg:text-lg font-medium
                transition-all duration-300 rounded-full
                ${activeCategory === id ? 
                  'text-black bg-[#FFC603] shadow-lg' : 
                  'text-gray-700 hover:bg-gray-100'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {name}
              
              {/* Tooltip */}
              <motion.div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-2
                  bg-black text-white text-xs px-3 py-1.5 rounded-lg
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
                  border-4 border-transparent border-b-black" />
              </motion.div>
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </nav>
  </div>
);

// Mobile Menu Component
const MobileMenu = ({ categories, activeCategory, onSelect, isOpen, onToggle }) => (
  <div className="md:hidden">
    <div className="flex items-center justify-between">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-xl"
        >
          <nav className="p-2">
            {categories.map(({ id, name, category, description }) => (
              <motion.button
                key={id}
                onClick={() => onSelect(category, id)}
                className={`
                  w-full text-left p-4 rounded-xl mb-1
                  transition-all duration-200
                  ${activeCategory === id ? 
                    'bg-[#FFC603] text-black font-medium' : 
                    'hover:bg-gray-50'
                  }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{name}</span>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SubMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setSelectedCategory } = useCategoryStore();
  
  const isMobile = useMediaQuery(SCREEN_SIZES.MOBILE);
  
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
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-start">
            {/* Logo o branding podría ir aquí */}
            
            {/* Menús */}
            <div className="flex-1">
              <DesktopMenu
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelect={handleCategoryClick}
              />
              <MobileMenu
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelect={handleCategoryClick}
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(prev => !prev)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(SubMenu);