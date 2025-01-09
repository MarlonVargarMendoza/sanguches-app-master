// MenuButton.jsx
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../stores/categoryStore";
import Button from "./Button";

const MenuButton = memo(() => {
    const navigate = useNavigate();
    const { setSelectedCategory, resetCategory } = useCategoryStore();

    const handleClick = useCallback(() => {
        // Primero resetear el estado global
        setSelectedCategory('all');
        // Navegar a la ruta base con replace para evitar historial
        navigate('/menuSanguches', { 
            replace: true,
            state: { forceReset: true } // Flag para forzar reseteo
        });
    }, [navigate, setSelectedCategory]);

    return <Button buttonText="Ver menu completo" onClick={handleClick} />;
});

export default MenuButton;