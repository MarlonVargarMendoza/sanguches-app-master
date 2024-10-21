const WHATSAPP_NUMBER = import.meta.env.VITE_APP_WHATSAPP_NUMBER;

export const sendToWhatsApp = (message) => {
    if (!WHATSAPP_NUMBER) {
        console.error('Número de WhatsApp no disponible');
        return;
    }

    if (!message) {
        console.error('Mensaje no disponible');
        return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl);
};