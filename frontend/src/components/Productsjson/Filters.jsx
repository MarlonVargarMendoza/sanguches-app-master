import { useId, useState } from 'react';
import { useFilters } from '../../hooks/useFilters.js';

export function Filters() {
    const { filters, setFilters } = useFilters();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const minPriceFilterId = useId();
    const categoryFilterId = useId();

    const handleChangeMinPrice = (event) => {
        setFilters(prevState => ({
            ...prevState,
            minPrice: event.target.value
        }));
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setFilters(prevState => ({
            ...prevState,
            category: category
        }));
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    return (
        <section className='filters-container flex flex-col sm:flex-row w-full sm:w-3/4 lg:w-1/2 mx-auto mb-0 gap-4 sm:gap-6 px-4 sm:px-12'>
            <div className='filter-item flex-2 w-full mb-4 sm:mb-0'>
                <label htmlFor={minPriceFilterId} className='block text-gray-700 font-semibold mb-2'>
                    Precio a partir de:
                </label>
                <input
                    type='range'
                    id={minPriceFilterId}
                    min='0'
                    max='1000'
                    onChange={handleChangeMinPrice}
                    value={filters.minPrice}
                    className='w-full accent-red-500 cursor-pointer'
                />
                <span className='block text-gray-700 mt-2'>${filters.minPrice}</span>
            </div>

            <div className='filter-item flex-2 w-full relative inline-block text-left'>
                <label htmlFor={categoryFilterId} className='block text-gray-700 font-semibold mb-2'>
                    Categoría:
                </label>
                <div className="relative">
                    <button
                        type="button"
                        className="w-full px-3 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:bg-[#FFD33D] flex justify-between items-center"
                        id={categoryFilterId}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                        onClick={toggleDropdown}
                    >
                        {selectedCategory === 'all' ? 'Selecciona una categoría' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                        <svg
                            className={`h-5 w-5 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby={categoryFilterId}>
                                <li onClick={() => handleSelectCategory('all')} className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFC603] ${selectedCategory === 'all' ? 'bg-[#FFC603]' : ''}`} role="menuitem">Todas</li>
                                <li onClick={() => handleSelectCategory('laptops')} className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFC603] ${selectedCategory === 'laptops' ? 'bg-[#FFC603]' : ''}`} role="menuitem">Sanduches</li>
                                <li onClick={() => handleSelectCategory('smartphones')} className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#FFC603] ${selectedCategory === 'smartphones' ? 'bg-[#FFD33D]' : ''}`} role="menuitem">Sanguchitos</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
