import { useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
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
    const matchingCategory = CATEGORIES.find((cat) =>
      currentPath === (cat.category === 'all' ? 'menuSanguches' : cat.id)
    );

    setActiveCategory(matchingCategory?.id || null);
    setIsVisible(!['/success', '/checkout'].includes(location.pathname));
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleCategoryClick = useCallback(
    (category, id) => {
      setActiveCategory(id);
      setSelectedCategory(category);
      setIsMobileMenuOpen(false); // Cierra el menú automáticamente
  
      switch (category) {
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
    },
    [navigate, setSelectedCategory]
  );
  

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-40 bg-[#FFC603] shadow-sm"
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
              onToggle={() => setIsMobileMenuOpen((prev) => !prev)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};


const DesktopMenu = ({ categories, activeCategory, onSelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <nav className="relative flex items-center justify-center">
      <ul className="flex items-center gap-1">
        {categories.map(({ id, name, category, description }) => (
          <motion.li key={id} className="relative">
            <motion.button
              onClick={() => onSelect(category, id)}
              onMouseEnter={() => setHoveredCategory(id)} // Al entrar el cursor
              onMouseLeave={() => setHoveredCategory(null)} // Al salir el cursor
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
              
              {/* Indicador para categoría activa */}
              {activeCategory === id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-3
                  bg-[#C8151B] text-white text-xs px-4 py-2 rounded-lg
                  pointer-events-none whitespace-nowrap shadow-lg z-50
                  ${hoveredCategory === id ? 'opacity-100' : 'opacity-0'}
                `}
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: hoveredCategory === id ? 1 : 0,
                  y: hoveredCategory === id ? 0 : -10 
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
};

const MobileMenu = ({ categories, activeCategory, onSelect, onToggle }) => (
  <div className="w-full md:hidden">
    <div className="absolute left-0 right-0 top-full bg-white shadow-lg">
      <nav className="p-2">
        {categories.map(({ id, name, category, description }) => (
          <motion.button
            key={id}
            onClick={() => {
              onSelect(category, id); // Selecciona la categoría
              onToggle(); // Cierra el menú automáticamente
            }}
            className={`
              w-full text-left p-4 rounded-xl mb-1 transition-all duration-200
              ${activeCategory === id 
                ? 'bg-[#FFC603] text-[#C8151B] font-medium shadow-md' 
                : 'hover:bg-gray-50 text-gray-700'}
            `}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-medium">{name}</span>
            <p className="text-sm mt-1 opacity-80">{description}</p>
          </motion.button>
        ))}
      </nav>
    </div>
  </div>
);



export default React.memo(SubMenu);