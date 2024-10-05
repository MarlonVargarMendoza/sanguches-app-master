import React from 'react';

import { useId } from 'react';

export function Filters({ filters = { minPrice: 0, category: 'all' }, onFilterChange }) {

    const minPriceFilterId = useId();
    const categoryFilterId = useId();
    // Función para cambiar el rango de precios
    const handleChangeMinPrice = (event) => {
        onFilterChange({ ...filters, minPrice: Number(event.target.value) });
    };

    const handleChangeCategory = (event) => {
        onFilterChange({ ...filters, category: event.target.value });
    };
    const handleCategoryClick = (categoryId) => {
        onFilterChange({ ...filters, category: categoryId });
    };
    const categorias = [
        { id: 'all', nombre: 'Todas' },
        { id: 7, nombre: 'Tradicional' },
        { id: 8, nombre: 'Sanguchito' },
        { id: 9, nombre: 'Desayuno' },
        { id: 10, nombre: 'Dona' },
        { id: 11, nombre: 'Pastel' },
        { id: 12, nombre: 'Otro' },
        { id: 13, nombre: 'Papas a la francesa' },
        { id: 14, nombre: 'Palos de yuca' },
    ];

    return (
        <section className='filters flex flex-col sm:flex-row w-full sm:w-3/4 lg:w-1/2 mx-auto mb-6 gap-4 px-4'>

            <div className='filter-item flex-1'>{/* filtro de precio */}
                <label htmlFor={minPriceFilterId} className='block text-gray-700 font-semibold mb-2'>
                    Precio a partir de:
                </label>
                <input
                    type='range'
                    id={minPriceFilterId}
                    min='0'
                    max='1000'
                    step='10'
                    onChange={handleChangeMinPrice}
                    value={filters.minPrice}
                    className='w-full accent-red-500 cursor-pointer'
                />
                <span className='block text-gray-700 mt-2'>${filters.minPrice}</span>
            </div>

            <div className='filter-item flex-1'>
                <label htmlFor={categoryFilterId} className='block text-gray-700 font-semibold mb-2'>
                    Categoría:
                </label>

                <select
                    id={categoryFilterId}
                    /*  onClick={(e) => handleCategoryClick(e.target.value)} // onClick en lugar de onChange */
                    onChange={handleChangeCategory}
                    value={filters.category}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-sm text-gray-900'
                >
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
}
