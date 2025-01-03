import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../../stores/categoryStore";
import { Sheet } from "../../ui/Sheet";

const CATEGORIES = [
  { id: "menu", name: "MENU", category: "all", description: "Explora nuestra carta completa" },
  { id: "desayunos", name: "DESAYUNOS", category: "9", description: "Comienza tu día con energía" },
  { id: "combos", name: "COMBOS", category: "combo", description: "Las mejores combinaciones" },
  { id: "bebidas", name: "BEBIDAS", category: "bebidas", description: "Refrescantes opciones" },
  { id: "donas", name: "DONAS", category: "donas", description: "Donas para compartir" },
];

const MobileNavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedCategory } = useCategoryStore();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedCategory(category);
      setIsMenuOpen(false);

      switch (category) {
        case "combo":
          navigate("/combos");
          break;
        case "bebidas":
          navigate("/bebidas");
          break;
        case "donas":
          navigate("/donas");
          break;
        case "all":
          navigate("/menuSanguches");
          break;
        default:
          navigate(`/menuSanguches?category=${category}`);
      }
    },
    [navigate, setSelectedCategory]
  );

  return (
    <div className="relative">
      {/* Botón de apertura */}
      <IconButton onClick={toggleMenu}>
        <MenuIcon fontSize="small" className="text-[#C8151B]" />
      </IconButton>

      {/* Sheet */}
      <Sheet isOpen={isMenuOpen} onClose={toggleMenu} side="left">
        <div className="p-4 border-b border-gray-100 h-full">
          <h3 className="text-lg font-bold text-[#C8151B]">Categorías</h3>
        </div>

        <nav className="py-2 bg-white ">
          {CATEGORIES.map(({ id, name, category, description }) => (
            <button
              key={id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left px-4 py-3 hover:bg-[#FFC603]/10 transition-colors duration-200"
            >
              <span className="block text-base font-semibold text-gray-800">{name}</span>
              <span className="block text-sm text-gray-600 mt-1">{description}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-b border-gray-100 bg-white h-full">
          <Link
            to="/local"
            className="flex items-center space-x-2 text-[#C8151B] font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            <LocationOnIcon fontSize="small" />
            <span>Nuestras ubicaciones</span>
          </Link>
        </div>
      </Sheet>
    </div>
  );
};

export default React.memo(MobileNavMenu);
