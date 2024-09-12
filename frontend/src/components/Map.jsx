// components/Map.jsx
import React from 'react';

function Map() {
    const iframeSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25816.465835100567!2d-75.575806188199!3d6.251081631715492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428fecb4dff77%3A0x2e5a7e51ab929892!2sPlaza%20Botero!5e0!3m2!1ses!2sus!4v1726065241882!5m2!1ses!2sus";

    return (
        <iframe
            src={iframeSrc}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de la tienda" // Asegúrate de agregar un título descriptivo para accesibilidad
        />
    );
}

export default Map;