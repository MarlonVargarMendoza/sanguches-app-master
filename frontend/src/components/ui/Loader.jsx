import React, { useEffect } from 'react';

const SanguchesLoader = () => {
    // Desactivar el scroll durante la animación
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div className="awwwards-loader">
            <div className="loader-content">
                <div className="loader-logo-container">
                    <img
                        src="/assets/logoSanguches.jpg"
                        alt="Sanguches"
                        className="loader-logo"
                    />
                </div>
                <div className="loader-progress">
                    <div className="loader-bar"></div>
                </div>
                <div className="loader-text">CARGANDO</div>
            </div>
        </div>
    );
};

export default SanguchesLoader;