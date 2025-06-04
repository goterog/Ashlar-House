/**
 * Script de prueba para el sistema de notificaciones WhatsApp
 * Simula la creación de una reserva para probar el lifecycle hook
 */

require('dotenv').config();

// Simular el objeto strapi global
global.strapi = {
  log: {
    info: (msg) => console.log('ℹ️ INFO:', msg),
    error: (msg, error) => console.error('❌ ERROR:', msg, error),
    warn: (msg) => console.warn('⚠️ WARN:', msg)
  }
};

// Importar las funciones del lifecycle
const lifecycles = require('../src/api/booking/content-types/booking/lifecycles.js');

// Datos de prueba para diferentes escenarios
const testBookings = [
  {
    id: 1,
    title: "Test Bloqueado",
    start: "2025-06-10",
    end: "2025-06-10",
    estado: "Bloqueado",
    source: "Landing page"
  },
  {
    id: 2,
    title: "Test Reservado Simple",
    start: "2025-06-12",
    end: "2025-06-12",
    estado: "Reservado",
    source: "Airbnb",
    name: "Juan Pérez",
    guest: "2",
    phone: "+52-811-123-4567",
    email: "juan@example.com",
    message: "Vacaciones familiares"
  },
  {
    id: 3,
    title: "Test Múltiples Días",
    start: "2025-06-15",
    end: "2025-06-18",
    estado: "Reservado",
    source: "Landing page",
    name: "María González",
    guest: "4",
    phone: "+52-811-987-6543",
    email: "maria@example.com"
  }
];

async function runTests() {
  console.log('🚀 Iniciando pruebas del sistema de notificaciones WhatsApp\n');
  
  // Verificar variables de entorno
  console.log('📋 Verificando configuración:');
  console.log(`   CALLMEBOT_API_KEY: ${process.env.CALLMEBOT_API_KEY ? '✅ Configurado' : '❌ No configurado'}\n`);
  
  if (!process.env.CALLMEBOT_API_KEY || process.env.CALLMEBOT_API_KEY === 'your_callmebot_api_key_here') {
    console.log('⚠️  ADVERTENCIA: CallMeBot API key no está configurada correctamente.');
    console.log('   Las notificaciones no se enviarán, pero se mostrarán los mensajes que se enviarían.\n');
  }
  
  // Ejecutar pruebas
  for (let i = 0; i < testBookings.length; i++) {
    const booking = testBookings[i];
    console.log(`📝 Prueba ${i + 1}: ${booking.title}`);
    console.log(`   Estado: ${booking.estado}`);
    console.log(`   Fechas: ${booking.start} al ${booking.end}`);
    console.log(`   Source: ${booking.source}`);
    
    try {
      // Simular el evento afterCreate
      await lifecycles.afterCreate({ result: booking });
      console.log('   ✅ Prueba completada\n');
    } catch (error) {
      console.error(`   ❌ Error en prueba: ${error.message}\n`);
    }
    
    // Pausa entre pruebas para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('✨ Todas las pruebas completadas');
  console.log('\n📖 Para configurar CallMeBot correctamente, consulta WHATSAPP-SETUP.md');
}

// Función helper para pausa
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Ejecutar las pruebas
runTests().catch(console.error);
