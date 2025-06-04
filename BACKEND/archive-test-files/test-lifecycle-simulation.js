// Script para probar el sistema de notificaciones WhatsApp
// Este script simula la creación de una reserva y ejecuta el lifecycle hook

const https = require('https');

// Datos de configuración (mismos que en el .env)
const CALLMEBOT_API_KEY_1 = '4639929';
const CALLMEBOT_API_KEY_2 = '1855584';

// Simular el objeto strapi.log
const strapi = {
  log: {
    info: (msg) => console.log('ℹ️ ', msg),
    warn: (msg) => console.log('⚠️ ', msg),
    error: (msg, error) => console.log('❌', msg, error || '')
  }
};

// Función para enviar mensaje WhatsApp (copia del lifecycle)
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

// Función principal de notificación (copia del lifecycle)
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
      { phone: '+5218119936655', apiKey: CALLMEBOT_API_KEY_1 },
      { phone: '+5218111755533', apiKey: CALLMEBOT_API_KEY_2 }
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

function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Datos de prueba
async function testBookingNotifications() {
  console.log('🧪 PRUEBA DEL SISTEMA DE NOTIFICACIONES WHATSAPP');
  console.log('='.repeat(50));
  
  // Prueba 1: Reserva de un día
  console.log('\n📝 Prueba 1: Reserva de un día');
  const booking1 = {
    id: 'test-001',
    estado: 'Reservado',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    source: 'Airbnb',
    name: 'María González',
    guest: 2,
    phone: '+52-81-1234-5678',
    email: 'maria@example.com',
    message: 'Llegamos por la tarde'
  };
  
  try {
    await sendWhatsAppNotification(booking1);
    console.log('✅ Prueba 1 completada');
  } catch (error) {
    console.log('❌ Prueba 1 falló:', error.message);
  }
  
  // Esperar 3 segundos antes de la siguiente prueba
  console.log('\n⏳ Esperando 3 segundos...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Prueba 2: Bloqueo de múltiples días
  console.log('\n📝 Prueba 2: Bloqueo de múltiples días');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  
  const booking2 = {
    id: 'test-002',
    estado: 'Bloqueado',
    start: tomorrow.toISOString(),
    end: dayAfter.toISOString(),
    source: 'Booking.com'
  };
  
  try {
    await sendWhatsAppNotification(booking2);
    console.log('✅ Prueba 2 completada');
  } catch (error) {
    console.log('❌ Prueba 2 falló:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 PRUEBAS COMPLETADAS');
  console.log('Revisa tu WhatsApp para confirmar que llegaron los mensajes');
  console.log('='.repeat(50));
}

// Ejecutar pruebas
testBookingNotifications().catch(console.error);
