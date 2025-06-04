/**
 * Script de demo para mostrar cómo funciona el sistema de notificaciones
 * Este script simula la creación de reservas y muestra los mensajes que se enviarían
 */

require('dotenv').config();

console.log('🏠 ASHLAR HOUSE - Demo del Sistema de Notificaciones WhatsApp');
console.log('===========================================================\n');

// Simular el objeto strapi global
global.strapi = {
  log: {
    info: (msg) => console.log('✅ INFO:', msg),
    error: (msg, error) => console.error('❌ ERROR:', msg, error),
    warn: (msg) => console.warn('⚠️  WARN:', msg)
  }
};

// Función para formatear fechas
function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Función que simula el envío de WhatsApp (para demo)
async function demoWhatsAppMessage(phoneNumber, message) {
  console.log(`📱 WhatsApp → ${phoneNumber}`);
  console.log('━'.repeat(50));
  console.log(message);
  console.log('━'.repeat(50));
  
  // Simular respuesta exitosa
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`✅ Mensaje enviado exitosamente a ${phoneNumber}\n`);
      resolve('success');
    }, 500);
  });
}

// Función principal de notificaciones (adaptada para demo)
async function demoWhatsAppNotification(booking) {
  try {
    console.log(`🔔 Procesando notificación para reserva ID: ${booking.id}`);
    console.log(`   Estado: ${booking.estado}`);
    console.log(`   Fechas: ${booking.start} → ${booking.end}`);
    console.log(`   Origen: ${booking.source}\n`);
    
    // Formatear mensaje según los requisitos
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);
    
    // Verificar si es un solo día
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
      
      // Añadir datos del cliente si existen
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
    
    // Lista de números a notificar
    const phoneNumbers = ['521-811-993-6655', '521-811-175-5533'];
    
    // Enviar a ambos números (demo)
    for (const phoneNumber of phoneNumbers) {
      await demoWhatsAppMessage(phoneNumber, message);
    }
    
    console.log(`🎉 Notificaciones procesadas para reserva ID: ${booking.id}\n`);
    
  } catch (error) {
    console.error('❌ Error en demo:', error);
  }
}

// Datos de ejemplo para diferentes escenarios
const demoBookings = [
  {
    id: 1,
    title: "Bloqueo fin de semana",
    start: "2025-06-14",
    end: "2025-06-15",
    estado: "Bloqueado",
    source: "Landing page"
  },
  {
    id: 2, 
    title: "Reserva familiar",
    start: "2025-06-20",
    end: "2025-06-20",
    estado: "Reservado",
    source: "Airbnb",
    name: "María González",
    guest: "4",
    phone: "+52-811-987-6543",
    email: "maria@example.com",
    message: "Celebración de aniversario"
  },
  {
    id: 3,
    title: "Reserva semana completa",
    start: "2025-07-01",
    end: "2025-07-07",
    estado: "Reservado", 
    source: "Landing page",
    name: "Carlos Ramírez",
    guest: "6",
    phone: "+52-811-123-4567",
    email: "carlos.ramirez@email.com"
  }
];

async function runDemo() {
  console.log('🚀 Iniciando demostración del sistema...\n');
  
  // Verificar configuración
  console.log('⚙️  CONFIGURACIÓN:');
  console.log(`   CallMeBot API Key: ${process.env.CALLMEBOT_API_KEY ? '✅ Configurado' : '⚠️  No configurado'}`);
  console.log(`   Fecha actual: ${new Date().toLocaleDateString('es-MX')}`);
  console.log(`   Números destino: 521-811-993-6655, 521-811-175-5533\n`);
  
  if (!process.env.CALLMEBOT_API_KEY || process.env.CALLMEBOT_API_KEY === 'your_callmebot_api_key_here') {
    console.log('📋 NOTA: Para activar las notificaciones reales:');
    console.log('   1. Envía "I allow callmebot to send me messages" al +34 613 00 20 27');
    console.log('   2. Actualiza CALLMEBOT_API_KEY en el archivo .env');
    console.log('   3. Reinicia el servidor Strapi\n');
  }
  
  // Ejecutar demos
  for (let i = 0; i < demoBookings.length; i++) {
    const booking = demoBookings[i];
    console.log(`📝 DEMO ${i + 1}/3: ${booking.title}`);
    console.log('─'.repeat(60));
    
    await demoWhatsAppNotification(booking);
    
    // Pausa entre demos
    if (i < demoBookings.length - 1) {
      console.log('⏱️  Esperando 2 segundos...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('✨ DEMO COMPLETADO');
  console.log('📖 Para más información consulta: WHATSAPP-SETUP.md');
  console.log('🚀 Para implementar en producción: IMPLEMENTACION-WHATSAPP.md');
}

// Ejecutar demo
runDemo().catch(console.error);
