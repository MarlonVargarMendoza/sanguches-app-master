import React, { useEffect, useState } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { runFireworks } from '../../lib/utils/confetti';
import Button from '../Button';
import Navbar from '../Navbar/Navbar';

const success = () => {
    const [order, setOrder] = useState();
    useEffect(() => {
        localStorage.clear();
        runFireworks();
    }, []);

    return (
        <>
            <Navbar />
            <div className='success-wrapper cancel-wrapper bg-white min-h-[80vh]'>
                <div className='success cancel w-[370px] mx-auto mt-[100px] p-6 h-[350px]'>
                    <p className='icon'>
                        <BsBagCheckFill />
                    </p>
                    <h2 className="text-black text-[17px]">Gracias por tu pedido!</h2>
                    <p className='email-msg text-[16px] text-black font-semibold text-center my-2 mt-6'>
                        revisa el correo
                        <a href="mailto:order@example.com" className="email ml-1 text-red-500">
                            order@example.com
                        </a>
                    </p>
                    <p className='text-black description text-[16px] font-semibold text-center my-2 mt-6'>
                        Si tienes preguntas email
                        <a href="mailto:order@example.com" className="email ml-1 text-red-500">
                            order@example.com
                        </a>
                    </p>

                    <div className="btn-container w-[300px] mx-auto">
                        <Link to='/menuSanguches'>
                            <Button buttonText='Continuar comprando' />
                        </Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export default success