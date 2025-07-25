import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Instagram, MapPin, Menu, Phone, X } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../../stores/categoryStore";
import { Sheet } from "../../ui/Sheet";

// Configuración reutilizable
const COMPONENT_CONFIG = {
  CATEGORIES: [
    { id: "menu", name: "MENU", category: "all", description: "Explora nuestra carta completa", icon: "🍔" },
    { id: "desayunos", name: "DESAYUNOS", category: "9", description: "Comienza tu día con energía", icon: "☕" },
    { id: "combos", name: "COMBOS", category: "combo", description: "Las mejores combinaciones", icon: "🥪" },
    { id: "bebidas", name: "BEBIDAS", category: "bebidas", description: "Refrescantes opciones", icon: "🥤" },
    { id: "donas", name: "DONAS", category: "donas", description: "Donas para compartir", icon: "🍩" },
  ],
  CONTACT: [
    { icon: <MapPin size={18} />, text: "Nuestras ubicaciones", path: "/local" },
    { icon: <Phone size={18} />, text: "Contáctanos", path: "/contacto" },
    { icon: <Instagram size={18} />, text: "Síguenos en Instagram", path: "https://instagram.com/" },
  ],
  PATHS: {
    combo: "/combos",
    bebidas: "/bebidas",
    donas: "/donas",
    all: "/menuSanguches",
    default: (category) => `/menuSanguches?category=${category}`
  },
  ANIMATION: {
    category: {
      hidden: { opacity: 0, x: -20 },
      visible: i => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }),
      exit: { opacity: 0, x: -10 }
    },
    contact: {
      hidden: { opacity: 0, y: 10 },
      visible: i => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.3 + i * 0.1, duration: 0.4 }
      })
    }
  }
};

const AnimatedItem = ({ children, variants, index, ...props }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={variants}
    {...props}
  >
    {children}
  </motion.div>
);

const MobileNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const { setSelectedCategory } = useCategoryStore();
  const menuRef = useRef(null);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  const handleCategoryClick = useCallback((category, id) => {
    setActiveCategory(id);
    setSelectedCategory(category);
    setIsOpen(false);

    const path = COMPONENT_CONFIG.PATHS[category] || COMPONENT_CONFIG.PATHS.default(category);
    navigate(path);
  }, [navigate, setSelectedCategory]);

  const getButtonClass = useCallback((isActive) => `
    w-full text-left p-4 flex items-center group transition-all duration-300
    focus:outline-none ${isActive ? 'bg-[#FFC603]/20 font-medium' : 'hover:bg-gray-50'}
  `, []);

  const memoizedCategories = useMemo(() => (
    COMPONENT_CONFIG.CATEGORIES.map((item, index) => (
      <AnimatedItem key={item.id} variants={COMPONENT_CONFIG.ANIMATION.category} index={index}>
        <button
          onClick={() => handleCategoryClick(item.category, item.id)}
          className={getButtonClass(activeCategory === item.id)}
        >
          <span className="mr-3 text-xl">{item.icon}</span>
          <div className="flex-1">
            <span className={`block text-base font-semibold ${activeCategory === item.id ? 'text-[#C8151B]' : 'text-gray-800'}`}>
              {item.name}
            </span>
            <span className="block text-sm text-gray-500 mt-0.5">{item.description}</span>
          </div>
          <ChevronRight size={18} className={`text-gray-400 transition-transform ${activeCategory === item.id ? 'translate-x-1 text-[#C8151B]' : ''} group-hover:translate-x-1`} />
        </button>
      </AnimatedItem>
    ))
  ), [activeCategory, getButtonClass, handleCategoryClick]);

  const memoizedContacts = useMemo(() => (
    COMPONENT_CONFIG.CONTACT.map((item, index) => (
      <AnimatedItem key={item.path} variants={COMPONENT_CONFIG.ANIMATION.contact} index={index}>
        <Link
          to={item.path}
          className="flex items-center text-[#C8151B] font-medium hover:text-[#FFC603] transition-colors"
          onClick={toggleMenu}
        >
          <span className="mr-2">{item.icon}</span>
          <span>{item.text}</span>
        </Link>
      </AnimatedItem>
    ))
  ), [toggleMenu]);

  return (
    <div className="relative overflow-hidden" ref={menuRef}>
      <IconButton onClick={toggleMenu} aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          <Menu size={24} className="text-[#C8151B]" />
        </motion.div>
      </IconButton>

      <Sheet
        isOpen={isOpen}
        onClose={toggleMenu}
        side="left"
        maxWidth="320px"
        className="flex flex-col"
        showCloseButton={false}
      >
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <img src= 'assets/logo.svg' alt="logo" className="" />

{/*           <h2 className="text-xl font-bold text-[#C8151B] font-poppins tracking-wide">Categorías</h2>
 */}          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-0">
          <nav>
          <h2 className="text-xl p-2 font-bold text-[#C8151B] font-poppins tracking-wide">Categorías</h2>
            <ul className="space-y-1">
              <AnimatePresence>{memoizedCategories}</AnimatePresence>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
          {memoizedContacts}
          <motion.div
            className="mt-8 text-xs text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            © {new Date().getFullYear()} Sanguches. Todos los derechos reservados.
          </motion.div>
        </div>
      </Sheet>
    </div>
  );
};

export default React.memo(MobileNavMenu);