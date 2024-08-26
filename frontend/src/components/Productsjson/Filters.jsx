import { useId } from 'react';
import { useFilters } from '../../hooks/useFilters.js';
import './Filters.css';

export function Filters() {
    const { filters, setFilters } = useFilters();

    const minPriceFilterId = useId();
    const categoryFilterId = useId();

    const handleChangeMinPrice = (event) => {
        setFilters(prevState => ({
            ...prevState,
            minPrice: event.target.value
        }));
    };

    const handleChangeCategory = (event) => {
        setFilters(prevState => ({
            ...prevState,
            category: event.target.value
        }));
    };

    return (
        <section className='filters p-4 bg-white p-4 rounded-lg shadow-md gap-4'>
            <div className='filter-item mb-4'>
                <label htmlFor={minPriceFilterId} className='text-gray-700 font-semibold'>Precio a partir de:</label>
                <input
                    type='range'
                    id={minPriceFilterId}
                    min='0'
                    max='1000'
                    onChange={handleChangeMinPrice}
                    value={filters.minPrice}
                    className='accent-red-500'
                />
                <span className='text-gray-700'>${filters.minPrice}</span>
            </div>

            <div className=''>
                <label htmlFor={categoryFilterId} className='text-gray-700 font-semibold'>Categoría:</label>
                <select
                    id={categoryFilterId}
                    onChange={handleChangeCategory}
                    className='border border-gray-300 rounded-md p-2'
                >
                    <option value='all'>Todas</option>
                    <option value='laptops'>Portátiles</option>
                    <option value='smartphones'>Celulares</option>
                </select>
            </div>
        </section>
    );
}
