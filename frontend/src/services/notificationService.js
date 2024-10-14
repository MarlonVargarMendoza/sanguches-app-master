const WHATSAPP_NUMBER = import.meta.env.VITE_APP_WHATSAPP_NUMBER;

export const sendToWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl);
};