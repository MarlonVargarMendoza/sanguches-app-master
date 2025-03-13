import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Componente Sheet de alta calidad inspirado en sitios premiados
 * Optimizado para performance y accesibilidad
 */
export const Sheet = ({
  children,
  isOpen,
  onClose,
  side = 'left',
  className = '',
  showCloseButton = true,
  preventScroll = true,
  maxWidth
}) => {
  // Referencia para detectar clics fuera del Sheet
  const sheetRef = useRef(null);
  
  // Control de la interacción con teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Prevenir scroll cuando el Sheet está abierto
  useEffect(() => {
    if (!preventScroll) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevenir saltos en el layout al bloquear scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, preventScroll]);

  // Configuración de animaciones según el lado
  const slideVariants = {
    left: {
      initial: { x: '-100%', opacity: 0.5 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 }
    },
    right: {
      initial: { x: '100%', opacity: 0.5 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 }
    },
    top: {
      initial: { y: '-100%', opacity: 0.5 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '-100%', opacity: 0 }
    },
    bottom: {
      initial: { y: '100%', opacity: 0.5 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '100%', opacity: 0 }
    }
  };

  // Configuración de posición según el lado
  const positionClasses = {
    left: 'top-0 left-0 h-full',
    right: 'top-0 right-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  // Props de estilo dinámicas basadas en el lado
  const dynamicProps = {
    style: {
      maxWidth: side === 'left' || side === 'right' 
        ? maxWidth || '85vw' 
        : '100%',
      maxHeight: side === 'top' || side === 'bottom'
        ? maxWidth || '85vh'
        : '100%'
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Contenido del Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            className={`
              fixed z-[9999] bg-white overflow-hidden
              ${positionClasses[side]} ${className}
              shadow-2xl
            `}
            variants={slideVariants[side]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 1
            }}
            {...dynamicProps}
          >
            {/* Contenedor interno con padding y scroll */}
            <div className="h-full flex flex-col overflow-hidden">
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full 
                            bg-gray-100 hover:bg-gray-200 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Cerrar"
                >
                  <X size={18} className="text-gray-700" />
                </button>
              )}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Sheet;