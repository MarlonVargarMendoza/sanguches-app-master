import React, { useState } from 'react';
import Map from '../Pages/Map';

const Local = () => {
    const [locations] = useState([
        { name: 'Animal (Sede 1 Floresta)', address: 'Carrera 84 45124.050032. Medellin, Antioquia Colombia' },
        { name: 'Animal (Sede 4 Provenza)', address: 'Carrera 36 8A-53, 050021. Medellín. Antioquia, Colombia' },
        { name: 'Animal (Sede 5 Cristo Rey)', address: 'Carrera 516 #3 Sur-46 050024 Medellin Antioquia, Colombia' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    return (
        <>
            <div className='flex flex-col min-h-screen'>
                <div className="bg-[#F5F5F5] pt-[220px] relative text-gray-800 flex-grow">
                 

                    {/* Layout principal con flex para pantallas grandes */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h1 className="text-4xl font-bold text-center text-[#ab131b] mb-6">¡Encuéntranos!</h1>

                        {/* Flex para dividir el contenido y el mapa */}
                        <div className="flex flex-col lg:flex-row lg:space-x-6">

                            {/* Sección de información y búsqueda */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <input
                                    type="text"
                                    placeholder="Ingresa tu dirección o busca por nombre"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-3 border border-[#ab131b] rounded-lg mb-4 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#FFC603]"
                                />

                                <ul className="list-none">
                                    {filteredLocations.map((location) => (
                                        <li
                                            key={location.name}
                                            className={`p-4 border border-[#FFC603] rounded-lg cursor-pointer shadow-md transition-colors duration-300 ${selectedLocation === location ? 'bg-[#FFC603] text-black' : 'bg-white hover:bg-gray-100'
                                                }`}
                                            onClick={() => handleLocationSelect(location)}
                                            aria-label={`Seleccionar ${location.name}`}
                                        >
                                            <h2 className="text-xl font-semibold">{location.name}</h2>
                                            <p className="text-gray-600">{location.address}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sección del mapa */}
                            <div className="w-full lg:w-1/2 flex-grow mt-8 lg:mt-0">
                                <div className="w-full h-full">
                                    <Map
                                        locations={filteredLocations}
                                        selectedLocation={selectedLocation}
                                        onLocationSelect={handleLocationSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
        </>
    );
};

export default Local;
