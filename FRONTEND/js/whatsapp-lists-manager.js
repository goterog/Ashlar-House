/**
 * GESTIÓN DE LISTAS DE WHATSAPP PARA CAMPAÑAS PROMOCIONALES
 * =======================================================
 * 
 * Este archivo proporciona herramientas para gestionar las listas de WhatsApp
 * de Ashlar House para campañas promocionales.
 * 
 * OPCIONES DISPONIBLES:
 * 1. Exportación manual de listas desde Strapi
 * 2. API endpoints para obtener suscriptores de WhatsApp
 * 3. Integración con herramientas de marketing externas
 * 
 * AUTOR: Sistema Ashlar House
 * FECHA: 2025-06-08
 */

// ==================== CONFIGURACIÓN ====================

const WHATSAPP_CONFIG = {
    // URL del backend Strapi
    STRAPI_URL: 'http://localhost:1337',
    
    // Configuración para exportación
    EXPORT_FORMATS: ['csv', 'json', 'txt'],
    
    // Filtros disponibles
    FILTERS: {
        ACTIVE_ONLY: true,
        DATE_RANGE: true,
        SOURCE_FILTER: true
    }
};

// ==================== FUNCIONES DE EXPORTACIÓN ====================

/**
 * Obtiene todos los suscriptores de WhatsApp desde contact-message
 */
async function getWhatsAppSubscribers(filters = {}) {
    try {
        console.log('📱 Obteniendo suscriptores de WhatsApp desde contact-message...');
        
        // Construir URL con filtros - ACTUALIZADO para usar contact-message
        let url = `${WHATSAPP_CONFIG.STRAPI_URL}/api/contact-messages?filters[newsletter_whatsapp][$eq]=true`;
        
        // Agregar filtros adicionales si se proporcionan
        if (filters.startDate) {
            url += `&filters[createdAt][$gte]=${filters.startDate}`;
        }
        if (filters.endDate) {
            url += `&filters[createdAt][$lte]=${filters.endDate}`;
        }
        if (filters.source) {
            url += `&filters[source][$eq]=${filters.source}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching subscribers: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`✅ Obtenidos ${result.data.length} suscriptores de WhatsApp`);
        
        return result.data;
        
    } catch (error) {
        console.error('❌ Error obteniendo suscriptores:', error);
        throw error;
    }
}

/**
 * Exporta la lista de suscriptores a CSV
 */
function exportToCSV(subscribers) {
    console.log('📄 Exportando a CSV...');
    
    const headers = ['Nombre', 'Email', 'Teléfono', 'Fecha Suscripción', 'Email Activo', 'WhatsApp Activo'];
    const csvContent = [
        headers.join(','),
        ...subscribers.map(sub => {
            const attrs = sub.attributes || sub;
            return [
                `"${attrs.name || ''}"`,
                attrs.email,
                `"${attrs.phone || ''}"`,
                new Date(attrs.createdAt).toLocaleDateString('es-MX'),
                attrs.newsletter_email ? 'Sí' : 'No',
                attrs.newsletter_whatsapp ? 'Sí' : 'No'
            ].join(',');
        })
    ].join('\\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `whatsapp_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Archivo CSV descargado');
}

/**
 * Exporta la lista en formato para WhatsApp Business
 */
function exportForWhatsAppBusiness(subscribers) {
    console.log('📱 Preparando lista para WhatsApp Business...');
    
    // Extraer solo los emails (WhatsApp Business puede usar emails como identificadores)
    const emailList = subscribers
        .filter(sub => sub.attributes.whatsapp_subscription)
        .map(sub => sub.attributes.email)
        .join('\\n');
    
    const blob = new Blob([emailList], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `whatsapp_emails_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Lista para WhatsApp Business descargada');
}

/**
 * Genera estadísticas de suscriptores
 */
function generateStats(subscribers) {
    const stats = {
        total: subscribers.length,
        bySource: {},
        byMonth: {},
        emailAndWhatsApp: 0,
        whatsAppOnly: 0
    };
    
    subscribers.forEach(sub => {
        const attr = sub.attributes;
        
        // Por fuente
        const source = attr.source || 'No especificado';
        stats.bySource[source] = (stats.bySource[source] || 0) + 1;
        
        // Por mes
        const month = new Date(attr.createdAt).toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long' 
        });
        stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
        
        // Tipos de suscripción
        if (attr.email_subscription && attr.whatsapp_subscription) {
            stats.emailAndWhatsApp++;
        } else if (attr.whatsapp_subscription && !attr.email_subscription) {
            stats.whatsAppOnly++;
        }
    });
    
    return stats;
}

// ==================== INTERFAZ PARA ADMINISTRADORES ====================

/**
 * Crea interfaz web para gestión de listas
 */
function createWhatsAppManagerUI() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="whatsapp-manager" style="
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            background: white;
            border: 2px solid #25D366;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
        ">
            <h3 style="margin: 0 0 15px 0; color: #25D366;">
                📱 Gestión WhatsApp Lists
            </h3>
            
            <div style="margin-bottom: 15px;">
                <label>Filtrar por fuente:</label>
                <select id="source-filter" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="">Todas las fuentes</option>
                    <option value="contact_form">Formulario de contacto</option>
                    <option value="footer_form">Footer (deprecated)</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Fecha desde:</label>
                <input type="date" id="start-date" style="width: 100%; padding: 5px; margin-top: 5px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label>Fecha hasta:</label>
                <input type="date" id="end-date" style="width: 100%; padding: 5px; margin-top: 5px;">
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="export-csv" style="
                    flex: 1;
                    background: #25D366;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                ">📄 Exportar CSV</button>
                
                <button id="export-whatsapp" style="
                    flex: 1;
                    background: #128C7E;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                ">📱 Para WhatsApp</button>
            </div>
            
            <button id="show-stats" style="
                width: 100%;
                background: #34495e;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                margin-bottom: 10px;
            ">📊 Ver Estadísticas</button>
            
            <div id="stats-display" style="
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                display: none;
                font-size: 14px;
            "></div>
            
            <button id="close-manager" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #ccc;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Event listeners
    document.getElementById('export-csv').addEventListener('click', handleExportCSV);
    document.getElementById('export-whatsapp').addEventListener('click', handleExportWhatsApp);
    document.getElementById('show-stats').addEventListener('click', handleShowStats);
    document.getElementById('close-manager').addEventListener('click', () => {
        document.body.removeChild(container);
    });
}

// ==================== HANDLERS ====================

async function handleExportCSV() {
    try {
        const filters = getUIFilters();
        const subscribers = await getWhatsAppSubscribers(filters);
        exportToCSV(subscribers);
    } catch (error) {
        alert('Error exportando CSV: ' + error.message);
    }
}

async function handleExportWhatsApp() {
    try {
        const filters = getUIFilters();
        const subscribers = await getWhatsAppSubscribers(filters);
        exportForWhatsAppBusiness(subscribers);
    } catch (error) {
        alert('Error exportando para WhatsApp: ' + error.message);
    }
}

async function handleShowStats() {
    try {
        const filters = getUIFilters();
        const subscribers = await getWhatsAppSubscribers(filters);
        const stats = generateStats(subscribers);
        
        const statsDisplay = document.getElementById('stats-display');
        statsDisplay.innerHTML = `
            <h4>📊 Estadísticas</h4>
            <p><strong>Total suscriptores WhatsApp:</strong> ${stats.total}</p>
            <p><strong>Email + WhatsApp:</strong> ${stats.emailAndWhatsApp}</p>
            <p><strong>Solo WhatsApp:</strong> ${stats.whatsAppOnly}</p>
            
            <h5>Por fuente:</h5>
            ${Object.entries(stats.bySource).map(([source, count]) => 
                `<p>• ${source}: ${count}</p>`
            ).join('')}
            
            <h5>Por mes:</h5>
            ${Object.entries(stats.byMonth).map(([month, count]) => 
                `<p>• ${month}: ${count}</p>`
            ).join('')}
        `;
        statsDisplay.style.display = 'block';
    } catch (error) {
        alert('Error generando estadísticas: ' + error.message);
    }
}

function getUIFilters() {
    return {
        source: document.getElementById('source-filter')?.value || '',
        startDate: document.getElementById('start-date')?.value || '',
        endDate: document.getElementById('end-date')?.value || ''
    };
}

// ==================== INICIALIZADOR ====================

// Para abrir el manager desde consola del navegador:
// createWhatsAppManagerUI()

console.log(`
🟢 WHATSAPP LISTS MANAGER CARGADO
=================================

Para gestionar las listas de WhatsApp, ejecuta:
createWhatsAppManagerUI()

Funciones disponibles:
• getWhatsAppSubscribers() - Obtener suscriptores
• exportToCSV() - Exportar a CSV 
• exportForWhatsAppBusiness() - Lista para WhatsApp Business
• generateStats() - Generar estadísticas

OPCIONES PARA CAMPAÑAS PROMOCIONALES:
=====================================

1. MANUAL/PEQUEÑA ESCALA:
   - Usar este manager para exportar listas
   - Enviar mensajes manualmente desde WhatsApp Business
   
2. AUTOMATIZADA/GRAN ESCALA:
   - Integrar con WhatsApp Business API
   - Usar herramientas como Twilio, MessageBird
   - Conectar con plataformas como Mailchimp, SendGrid
   
3. HÍBRIDA:
   - Exportar listas con este manager
   - Importar en herramientas de marketing externas
   - Automatizar envíos desde esas plataformas

RECOMENDACIÓN:
Para Ashlar House, comenzar con opción 1 (manual) 
y evaluar opción 3 (híbrida) si el volumen crece.
`);
