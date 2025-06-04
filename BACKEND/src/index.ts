// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 WhatsApp Bootstrap - Configurando lifecycle hooks...');
    
    // Escuchar eventos del entity service
    strapi.db.lifecycles.subscribe({
      models: ['api::booking.booking'],
      async afterCreate(event) {
        console.log('🎯 LIFECYCLE HOOK EJECUTADO - Nueva reserva creada!');
        console.log('📝 Booking ID:', event.result.id);
        
        try {
          // Obtener los detalles completos de la reserva
          const booking = await strapi.entityService.findOne('api::booking.booking', event.result.id, {
            populate: '*'
          });
          
          console.log('📋 Booking obtenido:', booking.estado, booking.start, booking.end);
          
          // Enviar notificación WhatsApp
          await sendWhatsAppNotification(booking, strapi);
          console.log('✅ Notificación WhatsApp enviada exitosamente');
          
        } catch (error) {
          console.error('❌ Error en lifecycle hook:', error);
        }
      }
    });
  },
};

// Función para enviar WhatsApp usando CallMeBot API
async function sendWhatsAppNotification(booking: any, strapi: any): Promise<void> {
  try {
    // Formatear mensaje según los requisitos
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);
    
    // Verificar si es un solo día (comparar fechas sin tiempo)
    const isSingleDay = startDate.toDateString() === endDate.toDateString();
    
    let message = '';
    
    if (booking.estado === 'Bloqueado') {
      message = isSingleDay 
        ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
        : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
    } else if (booking.estado === 'Reservado') {
      message = isSingleDay 
        ? `Se ha ${booking.estado.toLowerCase()} el día ${formatDate(booking.start)} desde ${booking.source || 'Otra'}`
        : `Se han ${booking.estado.toLowerCase()} los días ${formatDate(booking.start)} al ${formatDate(booking.end)} desde ${booking.source || 'Otra'}`;
      
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
      console.log(`📱 Enviando notificaciones WhatsApp para booking ID: ${booking.id}`);
      
      // Lista de números a notificar
      const phoneNumbers = ['+5218119936655', '+5218111755533'];
      
      // Enviar a ambos números
      const promises = phoneNumbers.map(phoneNumber => 
        sendWhatsAppMessage(phoneNumber, message, strapi)
      );
      
      await Promise.allSettled(promises);
      console.log(`✅ Notificaciones WhatsApp procesadas para reserva ID: ${booking.id}`);
    } else {
      console.log(`⚠️ Estado '${booking.estado}' no requiere notificación WhatsApp`);
    }
    
  } catch (error) {
    console.error('❌ Error en sendWhatsAppNotification:', error);
    throw error;
  }
}

// Función para formatear fechas
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit' as const, 
    month: '2-digit' as const, 
    year: 'numeric' as const 
  };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función para enviar mensaje WhatsApp usando CallMeBot API
async function sendWhatsAppMessage(phoneNumber: string, message: string, strapi: any): Promise<string> {
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
    
    console.log(`🔔 Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
    
    // Usar fetch nativo en Node.js 18+
    const response = await fetch(url);
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }
    
    console.log(`✅ WhatsApp enviado exitosamente a ${phoneNumber}`);
    return responseText;
    
  } catch (error) {
    console.error(`❌ Error enviando WhatsApp a ${phoneNumber}:`, error.message);
    throw error;
  }
}
