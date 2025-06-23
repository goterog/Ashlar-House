// =====================================================
// CONFIGURACIÓN DE NEWSLETTER - FRONTEND
// =====================================================

// NOTA: Las credenciales de EmailJS ahora se manejan en el backend
// por seguridad. Solo configuraciones públicas aquí.

const NEWSLETTER_CONFIG = {
    // Configuración de Strapi (será automáticamente configurado para producción)
    STRAPI_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:1337' 
        : 'https://casa-hanuman-backend.onrender.com',
    
    // EmailJS se maneja desde el backend - NO incluir credenciales aquí
    
    // Configuración de mensajes
    MESSAGES: {
        success: '✅ ¡Gracias! Tu mensaje ha sido enviado correctamente.',
        subscribed: '✅ ¡Bienvenido! Te has suscrito exitosamente al newsletter.',
        error: '❌ Hubo un error. Por favor, inténtalo de nuevo.',
        emailError: '❌ Error al enviar el email. Por favor, verifica tu conexión.',
        validationError: '⚠️ Por favor, completa todos los campos requeridos.'    }
};

// Exportar configuración para uso en newsletter.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEWSLETTER_CONFIG;
} else {
    window.NEWSLETTER_CONFIG = NEWSLETTER_CONFIG;
}
