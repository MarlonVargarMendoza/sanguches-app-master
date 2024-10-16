import AvTimerIcon from '@mui/icons-material/AvTimer';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, IconButton, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'DESAYUNOS', category: '9' },
  { name: 'SANGUCHES', category: 'all' },
  { name: 'ANTOJOS', category: ['10', '11', '12', '13', '14'] }
];

const Submenu = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCategoryClick = useCallback((category) => {
    if (category === 'all') {
      navigate('/menuSanguches');
    } else if (Array.isArray(category)) {
      const categoryString = category.join(',');
      navigate(`/menuSanguches?categories=${categoryString}`);
    } else {
      navigate(`/menuSanguches?category=${category}`);
    }
    if (isMobile) setIsDrawerOpen(false);
  }, [navigate, isMobile]);

  return (
    <motion.div
      className="bg-white shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {isMobile ? (
          <>
            <IconButton onClick={() => setIsDrawerOpen(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <List>
                {CATEGORIES.map((item) => (
                  <ListItem button key={item.name} onClick={() => handleCategoryClick(item.category)}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <nav>
            <ul className="flex space-x-6">
              {CATEGORIES.map((item) => (
                <CategoryButton key={item.name} item={item} onClick={handleCategoryClick} />
              ))}
            </ul>
          </nav>
        )}
        <DeliveryTime />
      </div>
    </motion.div>
  );
};

const CategoryButton = React.memo(({ item, onClick }) => (
  <motion.li
    className="relative"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <button
      onClick={() => onClick(item.category)}
      className="text-base sm:text-lg font-bold text-gray-800 hover:text-[#C8151B] transition-colors duration-300"
    >
      {item.name}
    </button>
    <motion.div
      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFC603]"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
    />
  </motion.li>
));

const DeliveryTime = React.memo(() => (
  <motion.div
    className="flex items-center text-gray-600 bg-[#FFC603] px-3 py-1 rounded-full"
    whileHover={{ scale: 1.05 }}
  >
    <AvTimerIcon className="mr-2 text-[#C8151B]" />
    <span className="text-xs sm:text-sm font-medium">Entrega en 45 min</span>
  </motion.div>
));

export default React.memo(Submenu);