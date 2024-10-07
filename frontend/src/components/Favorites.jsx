import React from 'react';
import { Link } from 'react-router-dom';
import banner from '/assets/banner.png';

const images = [
  { src: banner, alt: 'Sándwich Favorito 1', text: 'Sándwich 1' },
  { src: banner, alt: 'Sándwich Favorito 2', text: 'Sándwich 2' },
  { src: banner, alt: 'Sándwich Favorito 3', text: 'Sándwich 3' },
  { src: banner, alt: 'Sándwich Favorito 4', text: 'Sándwich 4', link: '/somepath' },
];

const Favorites = () => {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="text-center py-4" style={{ background: 'linear-gradient(to right, #FFC603, #C8151B)' }}>
        <h1 className="text-4xl font-poppins font-semibold text-black">
          SANGUCHES
          <br />
          <span className="text-white">FAVORITOS</span>
        </h1>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row flex-wrap border-2 border-[#C8151B] rounded overflow-hidden shadow-[0_0_15px_rgba(200,21,27,0.3)]">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex-1 min-w-[100%] sm:min-w-[300px] h-[300px] sm:h-full cursor-pointer flex justify-center items-center transition-all duration-300 ease-in-out border-b-2 sm:border-b-0 sm:border-r-2 border-[#C8151B] hover:flex-[2]"
            style={{ backgroundColor: 'rgba(255, 198, 3, 0.1)' }}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="absolute inset-0 object-cover w-full h-full brightness-90 hover:brightness-100 transition-all duration-300"
            />
            {image.link ? (
              <Link to={image.link} className="z-10 relative">
                <p className="text-lg font-semibold text-white relative z-10 p-4 bg-[#C8151B] bg-opacity-80 rounded transition-all duration-300 hover:bg-opacity-100">{image.text}</p>
              </Link>
            ) : (
              <p className="text-lg font-semibold text-white relative z-10 p-4 bg-[#C8151B] bg-opacity-80 rounded transition-all duration-300 hover:bg-opacity-100">{image.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;