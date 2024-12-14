const WHATSAPP_NUMBER = import.meta.env.VITE_APP_WHATSAPP_NUMBER;

export class WhatsAppService {
    // Detectar el dispositivo/plataforma
    static getPlatform() {
        const userAgent = navigator.userAgent || navigator.vendor;
        
        if (/android/i.test(userAgent)) return 'ANDROID';
        if (/iPad|iPhone|iPod/.test(userAgent)) return 'IOS';
        return 'DESKTOP';
    }

    // Construir las URLs según la plataforma
    static getWhatsAppUrl(message, platform) {
        const encodedMessage = encodeURIComponent(message);
        const numberWithoutPlus = WHATSAPP_NUMBER.replace('+', '');
        
        switch (platform) {
            case 'ANDROID':
            case 'IOS':
                return `whatsapp://send?phone=${numberWithoutPlus}&text=${encodedMessage}`;
            default:
                return `https://wa.me/${numberWithoutPlus}?text=${encodedMessage}`;
        }
    }

    static async sendMessage(message) {
        if (!WHATSAPP_NUMBER || !message) {
            console.error('Datos de WhatsApp incompletos');
            return { success: false, error: 'Datos incompletos' };
        }

        try {
            const platform = this.getPlatform();
            const whatsappUrl = this.getWhatsAppUrl(message, platform);
            
            // Mantener referencia a la ventana principal
            const mainWindow = window;
            
            // Configuración para la ventana de WhatsApp
            const windowConfig = platform === 'DESKTOP' ? {
                width: 1000,
                height: 600,
                top: window.innerHeight / 2 - 300,
                left: window.innerWidth / 2 - 500,
                scrollbars: 'yes',
                resizable: 'yes'
            } : null;

            const windowFeatures = windowConfig ? 
                Object.entries(windowConfig)
                    .map(([key, value]) => `${key}=${value}`)
                    .join(',') : '';

            // Intentar abrir WhatsApp
            const whatsappWindow = platform === 'DESKTOP' ? 
                window.open(whatsappUrl, '_blank', windowFeatures) :
                window.open(whatsappUrl, '_blank');

            if (!whatsappWindow) {
                throw new Error('Ventana bloqueada');
            }

            // Manejar el enfoque de las ventanas
            if (platform === 'DESKTOP') {
                whatsappWindow.focus();
                
                // Programar el retorno del foco
                setTimeout(() => {
                    mainWindow.focus();
                }, 1000);
            }

            return { 
                success: true, 
                platform,
                message: `WhatsApp abierto en ${platform}`
            };

        } catch (error) {
            console.warn('Error al abrir WhatsApp:', error);
            
            // Intento de respaldo usando un enlace directo
            const backupLink = document.createElement('a');
            backupLink.href = this.getWhatsAppUrl(message, 'DESKTOP');
            backupLink.target = '_blank';
            backupLink.rel = 'noopener noreferrer';
            document.body.appendChild(backupLink);
            backupLink.click();
            document.body.removeChild(backupLink);

            return { 
                success: false, 
                error: error.message,
                fallbackUsed: true 
            };
        }
    }
}

export const sendToWhatsApp = (message) => WhatsAppService.sendMessage(message);