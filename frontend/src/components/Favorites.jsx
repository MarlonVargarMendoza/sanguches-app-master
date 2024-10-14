import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import banner from '/assets/banner.png';

const images = [
  { src: banner, alt: 'Sándwich Favorito 1', text: 'El Clásico', description: 'Nuestro sándwich más icónico' },
  { src: banner, alt: 'Sándwich Favorito 2', text: 'El Picante', description: 'Para los amantes del sabor intenso' },
  { src: banner, alt: 'Sándwich Favorito 3', text: 'El Vegetariano', description: 'Delicioso y saludable' },
  { src: banner, alt: 'Sándwich Favorito 4', text: 'El Especial', description: 'La creación del chef', link: '/menuSanguches' },
];

const Favorites = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFC603] to-[#C8151B] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-white text-center mb-12"
        >
          SANGUCHES FAVORITOS
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition duration-300"
            >
              <div className="relative h-64">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{image.text}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{image.description}</p>
                {image.link ? (
                  <Link 
                    to={image.link}
                    className="inline-block bg-[#C8151B] text-white font-bold py-2 px-4 rounded hover:bg-[#FFC603] hover:text-black transition duration-300"
                  >
                    Ver más
                  </Link>
                ) : (
                  <button className="bg-[#C8151B] text-white font-bold py-2 px-4 rounded hover:bg-[#FFC603] hover:text-black transition duration-300">
                    Ordenar ahora
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Favorites;