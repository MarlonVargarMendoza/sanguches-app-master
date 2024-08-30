import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ buttonText }) => {
    return (
        <div className='flex items-center justify-center h-full'>
            <Link to='/menuSanguches'>
                <button type='button' className={`relative text-lg border-none py-4 px-16 font-poppins font-medium font-black text-[18px] text-primary bg-gold-gradient rounded-[10px] transition-all duration-500 ease-in-out uppercase tracking-wide hover:tracking-wider hover:text-white hover:bg-white`}>
                    {buttonText}
                    <i className="absolute inset-0 block">
                        <span className="relative z-10"></span>
                        <span className="absolute inset-0 transition-all duration-300 ease-in-out before:absolute before:top-[-2px] before:left-[80%] before:w-[10px] before:h-[2px] before:border before:border-white before:bg-[#272822] before:transition-all hover:before:left-[20%] hover:before:w-[15px] after:absolute after:bottom-[-2px] after:left-[20%] after:w-[10px] after:h-[2px] after:border after:border-white after:bg-[#272822] after:transition-all hover:after:left-[80%] hover:after:w-[15px]"></span>
                    </i>
                </button>
            </Link>
        </div>
    )
}

export default Button
