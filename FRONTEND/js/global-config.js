// =====================================================
// CONFIGURACIÓN GLOBAL DINÁMICA - ASHLAR HOUSE
// =====================================================

window.ASHLAR_CONFIG = {
    // Detectar automáticamente el entorno
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:1337'
        : 'https://ashlar-house-production.up.railway.app',
    
    // URLs específicas
    STRAPI_URL: function() {
        return this.API_URL;
    },
    
    // Endpoints de API
    ENDPOINTS: {
        BOOKINGS: '/api/bookings',
        CONTACT: '/api/contact-messages',
        NEWSLETTER: '/api/newsletter-subscribers',
        HERO: '/api/heros',
        CAROUSEL: '/api/carousels',
        MAP_LOCATIONS: '/api/map-locations'
    },
    
    // Configuración de desarrollo
    IS_DEVELOPMENT: window.location.hostname === 'localhost',
    IS_PRODUCTION: window.location.hostname !== 'localhost',
    
    // Funciones de utilidad
    getApiUrl: function(endpoint = '') {
        return this.API_URL + endpoint;
    },
    
    // Log solo en desarrollo
    log: function(...args) {
        if (this.IS_DEVELOPMENT) {
            console.log('[ASHLAR]', ...args);
        }
    }
};

// Alias para compatibilidad con archivos existentes
window.API_CONFIG = window.ASHLAR_CONFIG;

// Log de configuración en desarrollo
if (window.ASHLAR_CONFIG.IS_DEVELOPMENT) {
    console.log('🏠 Ashlar House - Configuración cargada:', {
        Environment: window.ASHLAR_CONFIG.IS_DEVELOPMENT ? 'Development' : 'Production',
        API_URL: window.ASHLAR_CONFIG.API_URL,
        Hostname: window.location.hostname
    });
}
