/**
 * Booking controller personalizado con notificaciones WhatsApp
 * Extiende el controller por defecto para agregar notificaciones
 */

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  // Sobrescribir el método create para agregar notificaciones
  async create(ctx) {
    strapi.log.info('🎯 CONTROLLER CREATE ejecutado');
    console.log('🎯 CONTROLLER CREATE ejecutado');
    
    // Llamar al método create original
    const response = await super.create(ctx);
    
    strapi.log.info(`📋 Booking creado con ID: ${response.data.id}`);
    console.log(`📋 Booking creado con ID: ${response.data.id}`);
    
    try {
      // Obtener todos los detalles de la reserva
      const booking = await strapi.entityService.findOne('api::booking.booking', response.data.id, {
        populate: '*'
      });
      
      strapi.log.info(`📋 Booking obtenido en controller: Estado=${booking.estado}, Start=${booking.start}, End=${booking.end}`);
      console.log(`📋 Booking obtenido en controller: Estado=${booking.estado}, Start=${booking.start}, End=${booking.end}`);
      
      // Usar el service para enviar la notificación
      const bookingService = strapi.service('api::booking.booking');
      await bookingService.sendWhatsAppNotification(booking);
      
      strapi.log.info('✅ Notificación WhatsApp procesada desde controller');
      console.log('✅ Notificación WhatsApp procesada desde controller');
      
    } catch (error) {
      strapi.log.error('❌ Error en controller create:', error);
      console.error('❌ Error en controller create:', error);
    }
    
    return response;
  }
}));
