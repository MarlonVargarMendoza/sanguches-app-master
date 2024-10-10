import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ buttonText, to = '/menuSanguches' }) => {
    return (
        <div className='flex items-center justify-center h-full'>
            <Link to={to}>
                <button 
                    type='button' 
                    className={`
                        relative text-lg border-none py-4 px-16 
                        font-poppins font-black text-[18px] 
                        text-black bg-[#FFC603] 
                        rounded-[10px] transition-all duration-500 ease-in-out 
                        uppercase tracking-wide hover:tracking-wider 
                        hover:text-white hover:bg-[#C8151B]
                        focus:outline-none focus:ring-2 focus:ring-[#C8151B] focus:ring-opacity-50
                    `}
                >
                    {buttonText}
                    <i className="absolute inset-0 block">
                        <span className="relative z-10"></span>
                        <span className="
                            absolute inset-0 transition-all duration-300 ease-in-out
                            before:absolute before:top-[-2px] before:left-[80%] before:w-[10px] before:h-[2px] 
                            before:border before:border-[#C8151B] before:bg-[#C8151B] before:transition-all 
                            hover:before:left-[20%] hover:before:w-[15px] 
                            after:absolute after:bottom-[-2px] after:left-[20%] after:w-[10px] after:h-[2px] 
                            after:border after:border-[#C8151B] after:bg-[#C8151B] after:transition-all 
                            hover:after:left-[80%] hover:after:w-[15px]
                        "></span>
                    </i>
                </button>
            </Link>
        </div>
    );
};

export default Button;