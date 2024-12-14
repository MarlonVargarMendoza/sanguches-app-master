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
    
    try {
        // Codificar el mensaje correctamente para la URL
        const encodedMessage = encodeURIComponent(message);
        
        // Usar el formato universal de WhatsApp URL
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
        
        // Abrir en una nueva ventana con configuraciones específicas
        const windowFeatures = 'noopener,noreferrer';
        const newWindow = window.open(whatsappUrl, '_blank', windowFeatures);
        
        // Verificar si la ventana se abrió correctamente
        if (newWindow) {
            newWindow.focus();
        } else {
            // Fallback por si el pop-up está bloqueado
            window.location.href = whatsappUrl;
        }
        
        return true;
    } catch (error) {
        console.error('Error al abrir WhatsApp:', error);
        return false;
    }
};