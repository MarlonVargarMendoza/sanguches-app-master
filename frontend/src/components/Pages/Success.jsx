import React, { useEffect, useState } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import { runFireworks } from '../../lib/utils/confetti';
import styles from '../../style';
import Button from '../Button';
import Footer from '../Footer';
import Navbar from '../Navbar/Navbar';
const Success = () => {
    const location = useLocation();
    const [order, setOrder] = useState(null); // Initialize order state

    useEffect(() => {
        // Attempt to get order details from localStorage or URL query parameters
        const storedOrder = localStorage.getItem('order');
        const queryParams = new URLSearchParams(location.search);
        const mensajeWhatsApp = queryParams.get('mensaje');

        if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
            localStorage.clear();
        } else if (mensajeWhatsApp) {
            // If order details were passed via URL, use them
            setOrder({ mensajeWhatsApp }); // Adjust structure as needed
        }

        runFireworks();
    }, [location.search]); 

    const handleWhatsAppShare = () => {
        if (order && order.mensajeWhatsApp) {
            const encodedMessage = encodeURIComponent(order.mensajeWhatsApp);
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }
    };

    return (
        <>
            <Navbar />
            <div className='success-wrapper cancel-wrapper bg-white py-[200px]'>
                <div className='success cancel w-[370px] mx-auto mt-[100px] p-6 h-[350px]'>
                    <p className='icon flex justify-center'>
                        <BsBagCheckFill className='text-green-500 text-[60px] '/>
                    </p>
                    <h2 className={`${styles.paddingY}  text-black text-[17px flex justify-center`}>Gracias por tu pedido!</h2>
                    <p className='text-black description text-[16px] font-semibold text-center my-2 mt-6'>
                        Si tienes preguntas, envía un email a 
                        <a href="mailto:order@example.com" className="email ml-1 text-red-500">
                            order@example.com
                        </a>
                    </p>

                    {/* Conditional WhatsApp Share button */}
                    {order && order.mensajeWhatsApp && (
                        <div className="btn-container w-[300px] mx-auto mt-4">
                            <Button buttonText='Compartir en WhatsApp' onClick={handleWhatsAppShare} />
                        </div>
                    )}

                    <div className="btn-container w-[300px] mx-auto mt-4">
                        <Link to='/menuSanguches'>
                            <Button buttonText='Continuar comprando' />
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Success;