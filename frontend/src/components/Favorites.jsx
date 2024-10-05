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
      <div className="text-center py-4 bg-gold-gradient">
        <h1 className="text-4xl font-poppins font-semibold text-primary">
          SANGUCHES
          <br />
          <span className="text-white">FAVORITOS</span>
        </h1>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row flex-wrap border-2 border-black rounded overflow-hidden shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex-1 min-w-[100%] sm:min-w-[300px] h-[300px] sm:h-full cursor-pointer flex justify-center items-center transition-all duration-300 ease-in-out border-b-2 sm:border-b-0 sm:border-r-2 border-black hover:flex-[2]"
            style={{ backgroundColor: '#778da99f' }}
          >
            <img src={image.src} alt={image.alt} className="absolute inset-0 object-cover w-full h-full brightness-75" />
            {image.link ? (
              <Link to={image.link}>
                <p className="text-lg font-semibold text-white relative z-10 p-4 bg-black bg-opacity-50 rounded">{image.text}</p>
              </Link>
            ) : (
              <p className="text-lg font-semibold text-white relative z-10 p-4 bg-black bg-opacity-50 rounded">{image.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
