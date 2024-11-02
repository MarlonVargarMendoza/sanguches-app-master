import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollOptions = {
            top: 0,
            left: 0,
            behavior: 'smooth'
        };

        // Pequeño timeout para permitir que las animaciones de página se completen
        const timeoutId = setTimeout(() => {
            window.scrollTo(scrollOptions);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;