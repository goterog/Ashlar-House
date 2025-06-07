/**
 * Simulación completa del sistema de notificaciones WhatsApp
 * Este script simula lo que haría Strapi cuando se crea una nueva reserva
 */

require('dotenv').config();

// Simular el objeto strapi.log
const strapi = {
  log: {
    info: (msg) => console.log(`ℹ️  [INFO] ${msg}`),
    error: (msg) => console.log(`❌ [ERROR] ${msg}`),
    warn: (msg) => console.log(`⚠️  [WARN] ${msg}`)
  }
};

// Función para formatear fechas (copiada del lifecycle)
function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función para enviar mensaje WhatsApp (copiada del lifecycle)
async function sendWhatsAppMessage(phoneNumber, message, apiKey) {
  return new Promise((resolve, reject) => {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
      
      if (!apiKey || apiKey === 'PENDIENTE_SEGUNDO_NUMERO') {
        strapi.log.warn(`API key no configurada para ${phoneNumber} - no se enviará notificación WhatsApp`);
        resolve();
        return;
      }
      
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      
      strapi.log.info(`Enviando WhatsApp a ${phoneNumber}: ${message.substring(0, 50)}...`);
      
      const https = require('https');
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            strapi.log.info(`WhatsApp enviado exitosamente a ${phoneNumber}`);
            resolve(data);
          } else {
            const error = new Error(`Error ${res.statusCode}: ${data}`);
            strapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        strapi.log.error(`Error enviando WhatsApp a ${phoneNumber}:`, error.message);
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.abort();
        const error = new Error('Timeout sending WhatsApp message');
        strapi.log.error(`Timeout enviando WhatsApp a ${phoneNumber}`);
        reject(error);
      });
      
    } catch (error) {
      strapi.log.error(`Error general enviando WhatsApp a ${phoneNumber}:`, error.message);
      reject(error);
    }
  });
}

// Función principal de notificación (copiada del lifecycle)
async function sendWhatsAppNotification(booking) {
  try {
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);
    
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
    
    const phoneNumbers = [
      { phone: '+5218119936655', apiKey: process.env.CALLMEBOT_API_KEY_1 },
      { phone: '+5218111755533', apiKey: process.env.CALLMEBOT_API_KEY_2 }
    ];
    
    const promises = phoneNumbers.map(config => 
      sendWhatsAppMessage(config.phone, message, config.apiKey)
    );
    
    await Promise.allSettled(promises);
    strapi.log.info(`Notificaciones WhatsApp procesadas para reserva ID: ${booking.id}`);
    
  } catch (error) {
    strapi.log.error('Error en sendWhatsAppNotification:', error);
    throw error;
  }
}

// Simulación del lifecycle hook
async function simulateBookingCreation(bookingData) {
  const event = { result: bookingData };
  
  try {
    if (bookingData.estado === 'Bloqueado' || bookingData.estado === 'Reservado') {
      await sendWhatsAppNotification(bookingData);
      strapi.log.info(`Notificación WhatsApp enviada para booking ID: ${bookingData.id}`);
    }
  } catch (error) {
    strapi.log.error('Error al enviar notificación WhatsApp:', error);
  }
}

// Datos de prueba
async function runTests() {
  console.log('🚀 SIMULACIÓN COMPLETA DEL SISTEMA ASHLAR HOUSE');
  console.log('===============================================\n');
  
  // Verificar configuración
  console.log('📋 CONFIGURACIÓN:');
  console.log(`API Key 1: ${process.env.CALLMEBOT_API_KEY_1 ? '✅ ' + process.env.CALLMEBOT_API_KEY_1 : '❌ No configurada'}`);
  console.log(`API Key 2: ${process.env.CALLMEBOT_API_KEY_2 ? '✅ ' + process.env.CALLMEBOT_API_KEY_2 : '❌ No configurada'}`);
  console.log();
  
  // Test 1: Reserva de un solo día
  console.log('📝 TEST 1: Reserva de un solo día');
  console.log('='.repeat(40));
  
  const singleDayBooking = {
    id: 1,
    estado: 'Reservado',
    start: '2025-06-04',
    end: '2025-06-04',
    source: 'Airbnb',
    name: 'Juan Ejemplo',
    guest: '2',
    phone: '+52-81-1234-5678',
    email: 'ejemplo@email.com',
    message: 'Esto es una prueba de reserva de un solo día'
  };
  
  await simulateBookingCreation(singleDayBooking);
  
  console.log('\n⏳ Esperando 5 segundos antes del siguiente test...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test 2: Bloqueo de múltiples días
  console.log('📝 TEST 2: Bloqueo de múltiples días');
  console.log('='.repeat(40));
  
  const multiDayBlocking = {
    id: 2,
    estado: 'Bloqueado',
    start: '2025-06-10',
    end: '2025-06-15',
    source: 'Ejemplo.com'
  };
  
  await simulateBookingCreation(multiDayBlocking);
  
  console.log('\n🏁 SIMULACIÓN COMPLETADA');
  console.log('========================');
  console.log('📱 Revisa WhatsApp en los próximos 1-3 minutos');
  console.log('✅ Si recibes los mensajes, el sistema está funcionando correctamente');
  console.log('🎉 ¡Ashlar House está listo para recibir notificaciones automáticas!');
}

// Ejecutar tests
runTests().catch(error => {
  console.error('\n💥 ERROR FATAL:', error.message);
  console.error(error.stack);
});
