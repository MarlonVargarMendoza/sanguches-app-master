import clsx from "clsx";
import React from "react";


export const Sheet = ({ isOpen, onClose, children, side = "left", className }) => {
    return (
        <>
            {/* Fondo oscuro */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-50 z-40 h-full"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Contenido del Sheet */}
            <div
                className={clsx(
                    "fixed bg-white z-50 transition-transform transform",
                    side === "left" && "top-0 left-0 h-full w-full max-w-sm",
                    side === "right" && "top-0 right-0 h-full w-4/5 max-w-sm",
                    side === "top" && "top-0 left-0 w-full h-3/5 max-h-screen",
                    side === "bottom" && "bottom-0 left-0 w-full h-3/5 max-h-screen",
                    isOpen ? "translate-x-0 translate-y-0" : side === "left" ? "-translate-x-full" : side === "right" ? "translate-x-full" : side === "top" ? "-translate-y-full" : "translate-y-full",
                    className
                )}
            >
                {children}
            </div>
        </>
    );
};
