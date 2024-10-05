import React, { useEffect, useState } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Navbar/Navbar';
import { runFireworks } from '../lib/utils/confetti';
import styles from '../style';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderDetails = queryParams.get('orderDetails');

        if (orderDetails) {
            setOrder(JSON.parse(decodeURIComponent(orderDetails)));
            localStorage.removeItem('cart'); // Clear the cart after successful order
            runFireworks();
        } else {
            // If no order details, redirect to home
            navigate('/');
        }
    }, [location.search, navigate]);

    const handleWhatsAppShare = () => {
        if (order && order.whatsappMessage) {
            const encodedMessage = encodeURIComponent(order.whatsappMessage);
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }
    };

    if (!order) {
        return null; // or a loading spinner
    }

    return (
        <>
            <Navbar />
            <div className='success-wrapper bg-white py-[200px]'>
                <div className='success w-[370px] mx-auto mt-[100px] p-6 h-[350px]'>
                    <p className='icon flex justify-center'>
                        <BsBagCheckFill className='text-green-500 text-[60px]' />
                    </p>
                    <h2 className={`${styles.paddingY} text-black text-[17px] flex justify-center`}>
                        Gracias por tu pedido!
                    </h2>
                    <p className='text-black description text-[16px] font-semibold text-center my-2 mt-6'>
                        Si tienes preguntas, envía un email a
                        <a href="mailto:order@example.com" className="email ml-1 text-red-500">
                            order@example.com
                        </a>
                    </p>

                    <div className="btn-container w-[300px] mx-auto mt-4">
                        <Button buttonText='Compartir en WhatsApp' onClick={handleWhatsAppShare} />
                    </div>

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
};

export default Success;