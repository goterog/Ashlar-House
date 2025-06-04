/**
 * Service para notificaciones WhatsApp en Ashlar House
 * Integra con CallMeBot API
 */

'use strict';

/**
 * booking service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::booking.booking', ({ strapi }) => ({
  
  // Método para enviar notificaciones WhatsApp
  async sendWhatsAppNotification(booking) {
    try {
      strapi.log.info(`📱 Enviando notificaciones WhatsApp para booking ID: ${booking.id}`);
      
      // Formatear mensaje según los requisitos
      const startDate = new Date(booking.start);
      const endDate = new Date(booking.end);
      
      // Verificar si es un solo día (comparar fechas sin tiempo)
      const isSingleDay = startDate.toDateString() === endDate.toDateString();
      
      let message = '';
      
      if (booking.estado === 'Bloqueado') {
        message = isSingleDay 
          ? `Se ha ${booking.estado.toLowerCase()} el día ${this.formatDate(booking.start)} desde ${booking.source || 'Otra'}`
          : `Se han ${booking.estado.toLowerCase()} los días ${this.formatDate(booking.start)} al ${this.formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
      } else if (booking.estado === 'Reservado') {
        message = isSingleDay 
          ? `Se ha ${booking.estado.toLowerCase()} el día ${this.formatDate(booking.start)} desde ${booking.source || 'Otra'}`
          : `Se han ${booking.estado.toLowerCase()} los días ${this.formatDate(booking.start)} al ${this.formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
        
        // Añadir datos del cliente si existen (solo para reservas)
        const clientData = [];
        if (booking.name) clientData.push(`Nombre: ${booking.name}`);
        if (booking.guest) clientData.push(`Número de huéspedes: ${booking.guest}`);
        if (booking.phone) clientData.push(`Teléfono: ${booking.phone}`);
        if (booking.email) clientData.push(`E-mail: ${booking.email}`);
        if (booking.message) clientData.push(`Mensaje del huésped: ${booking.message}`);
        
        if (clientData.length > 0) {
          message += '\n\nCon los siguientes datos de reservación:\n' + clientData.join('\n');
        }
      }
      
      // Solo enviar notificación si el estado es Bloqueado o Reservado
      if (booking.estado === 'Bloqueado' || booking.estado === 'Reservado') {
        // Lista de números a notificar
        const phoneNumbers = ['+5218119936655', '+5218111755533'];
        
        // Enviar a ambos números
        const promises = phoneNumbers.map(phoneNumber => 
          this.sendWhatsAppMessage(phoneNumber, message)
        );
        
        const results = await Promise.allSettled(promises);
        
        // Log de resultados
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            strapi.log.info(`✅ WhatsApp enviado exitosamente a ${phoneNumbers[index]}`);
          } else {
            strapi.log.error(`❌ Error enviando WhatsApp a ${phoneNumbers[index]}:`, result.reason);
          }
        });
        
        strapi.log.info(`✅ Notificaciones WhatsApp procesadas para reserva ID: ${booking.id}`);
        return true;
      } else {
        strapi.log.info(`⚠️ Estado '${booking.estado}' no requiere notificación WhatsApp`);
        return false;
      }
      
    } catch (error) {
      strapi.log.error('❌ Error en sendWhatsAppNotification:', error);
      throw error;
    }
  },
  
  // Función para formatear fechas
  formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  },
  
  // Función para enviar mensaje WhatsApp usando CallMeBot API
  async sendWhatsAppMessage(phoneNumber, message) {
    try {
      // CallMeBot requiere que el número esté registrado previamente
      const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
      
      // Seleccionar la API key correcta según el número
      let apiKey;
      if (cleanPhoneNumber === '+5218119936655') {
        apiKey = process.env.CALLMEBOT_API_KEY_1;
      } else if (cleanPhoneNumber === '+5218111755533') {
        apiKey = process.env.CALLMEBOT_API_KEY_2;
      } else {
        throw new Error(`Número de teléfono no configurado: ${phoneNumber}`);
      }
      
      if (!apiKey) {
        throw new Error(`API key no configurada para el número ${phoneNumber}`);
      }
      
      // Para la URL, necesitamos el número sin el +
      const phoneForURL = cleanPhoneNumber.replace('+', '');
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneForURL}&text=${encodedMessage}&apikey=${apiKey}`;
      
      strapi.log.info(`🔔 Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
      
      // Usar fetch nativo en Node.js 18+
      const response = await fetch(url);
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }
      
      strapi.log.info(`✅ WhatsApp enviado exitosamente a ${phoneNumber}`);
      return responseText;
      
    } catch (error) {
      strapi.log.error(`❌ Error enviando WhatsApp a ${phoneNumber}:`, error.message);
      throw error;
    }
  }
}));
