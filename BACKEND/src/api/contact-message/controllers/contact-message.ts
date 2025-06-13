/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-message.contact-message', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Crear el mensaje de contacto primero
      const response = await super.create(ctx);
      
      // Extraer datos para el email
      const { name, email, subject, message, newsletter_email, newsletter_whatsapp } = ctx.request.body.data;
        // SISTEMA HÍBRIDO: Backend guarda datos, Frontend envía emails
      // No enviamos emails desde el backend - EmailJS se encarga desde el frontend
      console.log('📝 Mensaje de contacto guardado en backend');
      
      // SISTEMA UNIFICADO: Solo guardamos en contact-message
      // La suscripción al newsletter se maneja con los campos newsletter_email y newsletter_whatsapp
      // No creamos entradas separadas en newsletter-subscriber
      
      console.log('✅ Mensaje de contacto guardado. Sistema unificado activo.');
      if (newsletter_email || newsletter_whatsapp) {
        const subscriptions = [];
        if (newsletter_email) subscriptions.push('Email');
        if (newsletter_whatsapp) subscriptions.push('WhatsApp');
        console.log(`📧 Suscripción registrada: ${subscriptions.join(' y ')}`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error en contact-message controller:', error);
      throw error;
    }
  }
}));
