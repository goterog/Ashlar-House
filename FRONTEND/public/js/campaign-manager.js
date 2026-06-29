/**
 * ASHLAR HOUSE - Campaign Manager
 * Sistema simplificado para gestión de campañas desde contact-message
 * Extrae listas de suscriptores y maneja envío de promociones
 */

class CampaignManager {
    constructor(config = {}) {
        this.strapiUrl = config.strapiUrl || 'http://localhost:1337';
        this.emailjsConfig = config.emailjsConfig || null;
        this.callmebotConfig = config.callmebotConfig || null;
    }

    /**
     * 📧 EXTRACCIÓN DE LISTAS DE SUSCRIPTORES
     */

    // Obtener todos los suscriptores de email
    async getEmailSubscribers() {
        try {
            const response = await fetch(
                `${this.strapiUrl}/api/contact-messages?filters[newsletter_email][$eq]=true&pagination[limit]=1000`
            );
            const data = await response.json();
            
            return data.data.map(contact => ({
                id: contact.id,
                name: contact.attributes?.name || contact.name,
                email: contact.attributes?.email || contact.email,
                phone: contact.attributes?.phone || contact.phone,
                createdAt: contact.attributes?.createdAt || contact.createdAt,
                source: 'contact-form'
            }));
        } catch (error) {
            console.error('❌ Error obteniendo suscriptores de email:', error);
            return [];
        }
    }

    // Obtener todos los suscriptores de WhatsApp
    async getWhatsAppSubscribers() {
        try {
            const response = await fetch(
                `${this.strapiUrl}/api/contact-messages?filters[newsletter_whatsapp][$eq]=true&pagination[limit]=1000`
            );
            const data = await response.json();
            
            return data.data.map(contact => ({
                id: contact.id,
                name: contact.attributes?.name || contact.name,
                email: contact.attributes?.email || contact.email,
                phone: contact.attributes?.phone || contact.phone,
                createdAt: contact.attributes?.createdAt || contact.createdAt,
                source: 'contact-form'
            }));
        } catch (error) {
            console.error('❌ Error obteniendo suscriptores de WhatsApp:', error);
            return [];
        }
    }

    // Obtener suscriptores de ambos canales
    async getAllSubscribers() {
        try {
            const response = await fetch(
                `${this.strapiUrl}/api/contact-messages?filters[$or][0][newsletter_email][$eq]=true&filters[$or][1][newsletter_whatsapp][$eq]=true&pagination[limit]=1000`
            );
            const data = await response.json();
            
            return data.data.map(contact => {
                const attrs = contact.attributes || contact;
                return {
                    id: contact.id,
                    name: attrs.name,
                    email: attrs.email,
                    phone: attrs.phone,
                    emailSubscribed: attrs.newsletter_email,
                    whatsappSubscribed: attrs.newsletter_whatsapp,
                    createdAt: attrs.createdAt,
                    source: 'contact-form'
                };
            });
        } catch (error) {
            console.error('❌ Error obteniendo todos los suscriptores:', error);
            return [];
        }
    }

    /**
     * 📊 ESTADÍSTICAS DE SUSCRIPTORES
     */
    async getSubscriberStats() {
        try {
            const [emailSubs, whatsappSubs, allContacts] = await Promise.all([
                this.getEmailSubscribers(),
                this.getWhatsAppSubscribers(),
                fetch(`${this.strapiUrl}/api/contact-messages?pagination[limit]=1000`).then(r => r.json())
            ]);

            return {
                totalContacts: allContacts.data.length,
                emailSubscribers: emailSubs.length,
                whatsappSubscribers: whatsappSubs.length,
                bothChannels: emailSubs.filter(email => 
                    whatsappSubs.some(wp => wp.email === email.email)
                ).length,
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }

    /**
     * 📤 EXPORTACIÓN DE LISTAS
     */

    // Exportar lista a CSV
    exportToCSV(subscribers, filename = 'suscriptores') {
        const headers = ['Nombre', 'Email', 'Teléfono', 'Email_Suscrito', 'WhatsApp_Suscrito', 'Fecha_Registro'];
        
        const csvContent = [
            headers.join(','),
            ...subscribers.map(sub => [
                `"${sub.name || ''}"`,
                `"${sub.email || ''}"`,
                `"${sub.phone || ''}"`,
                sub.emailSubscribed ? 'Sí' : 'No',
                sub.whatsappSubscribed ? 'Sí' : 'No',
                sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('es-MX') : ''
            ].join(','))
        ].join('\n');

        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    // Exportar para WhatsApp Business
    exportForWhatsAppBusiness(subscribers) {
        const whatsappFormat = subscribers
            .filter(sub => sub.phone && sub.whatsappSubscribed)
            .map(sub => `${sub.phone}`)
            .join('\n');

        const blob = new Blob([whatsappFormat], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `whatsapp_numbers_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
    }

    /**
     * 📧 ENVÍO DE CAMPAÑAS (Futuro desarrollo)
     * Estas funciones están preparadas para cuando implementes el sistema de campañas
     */

    // Plantilla para campaña de email
    async sendEmailCampaign(campaignData) {
        if (!this.emailjsConfig) {
            console.warn('⚠️ EmailJS no configurado para campañas');
            return { success: false, error: 'EmailJS no configurado' };
        }

        const subscribers = await this.getEmailSubscribers();
        console.log(`📧 Preparando campaña para ${subscribers.length} suscriptores de email`);
        
        // TODO: Implementar envío masivo con EmailJS
        // Nota: EmailJS tiene límites de envío, considerar alternativas para campañas masivas
        
        return { 
            success: true, 
            message: `Campaña preparada para ${subscribers.length} suscriptores`,
            subscribers: subscribers.length 
        };
    }

    // Plantilla para campaña de WhatsApp
    async sendWhatsAppCampaign(campaignData) {
        if (!this.callmebotConfig) {
            console.warn('⚠️ CallMeBot no configurado para campañas');
            return { success: false, error: 'CallMeBot no configurado' };
        }

        const subscribers = await this.getWhatsAppSubscribers();
        console.log(`📱 Preparando campaña para ${subscribers.length} suscriptores de WhatsApp`);
        
        // TODO: Implementar envío masivo con CallMeBot API
        // Nota: Respetar límites de velocidad de CallMeBot
        
        return { 
            success: true, 
            message: `Campaña preparada para ${subscribers.length} suscriptores`,
            subscribers: subscribers.length 
        };
    }

    /**
     * 🔍 FILTROS Y BÚSQUEDAS
     */

    // Filtrar suscriptores por fecha
    filterByDate(subscribers, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return subscribers.filter(sub => {
            const subDate = new Date(sub.createdAt);
            return subDate >= start && subDate <= end;
        });
    }

    // Buscar suscriptores por término
    searchSubscribers(subscribers, searchTerm) {
        const term = searchTerm.toLowerCase();
        return subscribers.filter(sub => 
            (sub.name && sub.name.toLowerCase().includes(term)) ||
            (sub.email && sub.email.toLowerCase().includes(term)) ||
            (sub.phone && sub.phone.includes(term))
        );
    }
}

/**
 * 🎛️ INTERFAZ DE GESTIÓN DE CAMPAÑAS
 */
class CampaignUI {
    constructor(containerId, campaignManager) {
        this.container = document.getElementById(containerId);
        this.manager = campaignManager;
        this.subscribers = [];
        this.filteredSubscribers = [];
    }

    async init() {
        if (!this.container) {
            console.error('❌ Contenedor de Campaign UI no encontrado');
            return;
        }

        await this.render();
        await this.loadData();
    }

    async render() {
        this.container.innerHTML = `
            <div class="campaign-manager bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    📊 Gestor de Campañas - Ashlar House
                </h2>
                
                <!-- Estadísticas -->
                <div id="stats-section" class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="stat-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div class="text-blue-600 dark:text-blue-400 text-2xl mb-2">👥</div>
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400" id="total-contacts">-</div>
                            <div class="text-sm text-blue-600 dark:text-blue-400">Total Contactos</div>
                        </div>
                        <div class="stat-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div class="text-green-600 dark:text-green-400 text-2xl mb-2">📧</div>
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400" id="email-subs">-</div>
                            <div class="text-sm text-green-600 dark:text-green-400">Suscriptores Email</div>
                        </div>
                        <div class="stat-card bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                            <div class="text-orange-600 dark:text-orange-400 text-2xl mb-2">📱</div>
                            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400" id="whatsapp-subs">-</div>
                            <div class="text-sm text-orange-600 dark:text-orange-400">Suscriptores WhatsApp</div>
                        </div>
                        <div class="stat-card bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div class="text-purple-600 dark:text-purple-400 text-2xl mb-2">🔗</div>
                            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400" id="both-channels">-</div>
                            <div class="text-sm text-purple-600 dark:text-purple-400">Ambos Canales</div>
                        </div>
                    </div>
                </div>

                <!-- Controles -->
                <div class="controls-section mb-6">
                    <div class="flex flex-wrap gap-4 mb-4">
                        <input type="text" id="search-input" placeholder="Buscar suscriptores..." 
                               class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        
                        <select id="filter-type" class="px-4 py-2 border rounded-lg">
                            <option value="all">Todos los suscriptores</option>
                            <option value="email">Solo Email</option>
                            <option value="whatsapp">Solo WhatsApp</option>
                            <option value="both">Ambos canales</option>
                        </select>
                        
                        <button id="export-csv" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            📊 Exportar CSV
                        </button>
                        
                        <button id="export-whatsapp" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            📱 Exportar WhatsApp
                        </button>
                        
                        <button id="refresh-data" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            🔄 Actualizar
                        </button>
                    </div>
                </div>

                <!-- Lista de suscriptores -->
                <div id="subscribers-list" class="border rounded-lg max-h-96 overflow-y-auto">
                    <div class="text-center p-8 text-gray-500">
                        Cargando suscriptores...
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Búsqueda
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            this.filterSubscribers();
        });

        // Filtro por tipo
        document.getElementById('filter-type')?.addEventListener('change', (e) => {
            this.filterSubscribers();
        });

        // Exportar CSV
        document.getElementById('export-csv')?.addEventListener('click', () => {
            this.manager.exportToCSV(this.filteredSubscribers, 'suscriptores_ashlar_house');
        });

        // Exportar WhatsApp
        document.getElementById('export-whatsapp')?.addEventListener('click', () => {
            this.manager.exportForWhatsAppBusiness(this.filteredSubscribers);
        });

        // Actualizar datos
        document.getElementById('refresh-data')?.addEventListener('click', () => {
            this.loadData();
        });
    }

    async loadData() {
        try {
            const [stats, subscribers] = await Promise.all([
                this.manager.getSubscriberStats(),
                this.manager.getAllSubscribers()
            ]);

            this.subscribers = subscribers;
            this.filteredSubscribers = subscribers;

            this.updateStats(stats);
            this.renderSubscribersList();
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
        }
    }

    updateStats(stats) {
        if (!stats) return;

        document.getElementById('total-contacts').textContent = stats.totalContacts;
        document.getElementById('email-subs').textContent = stats.emailSubscribers;
        document.getElementById('whatsapp-subs').textContent = stats.whatsappSubscribers;
        document.getElementById('both-channels').textContent = stats.bothChannels;
    }

    filterSubscribers() {
        const searchTerm = document.getElementById('search-input')?.value || '';
        const filterType = document.getElementById('filter-type')?.value || 'all';

        let filtered = this.subscribers;

        // Filtrar por tipo
        switch (filterType) {
            case 'email':
                filtered = filtered.filter(sub => sub.emailSubscribed);
                break;
            case 'whatsapp':
                filtered = filtered.filter(sub => sub.whatsappSubscribed);
                break;
            case 'both':
                filtered = filtered.filter(sub => sub.emailSubscribed && sub.whatsappSubscribed);
                break;
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = this.manager.searchSubscribers(filtered, searchTerm);
        }

        this.filteredSubscribers = filtered;
        this.renderSubscribersList();
    }

    renderSubscribersList() {
        const listContainer = document.getElementById('subscribers-list');
        
        if (this.filteredSubscribers.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center p-8 text-gray-500">
                    No se encontraron suscriptores con los filtros aplicados
                </div>
            `;
            return;
        }

        const subscribersHTML = this.filteredSubscribers.map(sub => `
            <div class="border-b p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-semibold text-gray-800 dark:text-white">
                            ${sub.name || 'Sin nombre'}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-300">
                            📧 ${sub.email} ${sub.phone ? `| 📱 ${sub.phone}` : ''}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                            Registro: ${new Date(sub.createdAt).toLocaleDateString('es-MX')}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        ${sub.emailSubscribed ? '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">📧 Email</span>' : ''}
                        ${sub.whatsappSubscribed ? '<span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">📱 WhatsApp</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = subscribersHTML;
    }
}

// Exportar para uso global
window.CampaignManager = CampaignManager;
window.CampaignUI = CampaignUI;
