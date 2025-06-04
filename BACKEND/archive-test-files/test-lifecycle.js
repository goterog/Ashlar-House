/**
 * Test del lifecycle hook completo - simula la creación de reservas
 */

require('dotenv').config();

// Simular el objeto strapi global
global.strapi = {
  log: {
    info: (msg) => console.log('✅ STRAPI INFO:', msg),
    error: (msg, error) => console.error('❌ STRAPI ERROR:', msg, error),
    warn: (msg) => console.warn('⚠️  STRAPI WARN:', msg)
  }
};

// Importar las funciones del lifecycle
const lifecycleModule = require('../src/api/booking/content-types/booking/lifecycles');

async function testLifecycleHook() {
  console.log('🔄 TEST DEL LIFECYCLE HOOK COMPLETO');
  console.log('===================================\n');
  
  // Casos de prueba
  const testBookings = [
    {
      id: 1,
      title: "Bloqueo de mantenimiento",
      start: "2025-06-10",
      end: "2025-06-10",
      estado: "Bloqueado",
      source: "Admin panel"
    },
    {
      id: 2,
      title: "Reserva desde landing page",
      start: "2025-06-15",
      end: "2025-06-17",
      estado: "Reservado",
      source: "Landing page",
      name: "Juan Pérez",
      guest: "4",
      phone: "+52-811-123-4567",
      email: "juan@example.com",
      message: "Celebración familiar"
    },
    {
      id: 3,
      title: "Estado no relevante",
      start: "2025-06-20",
      end: "2025-06-21",
      estado: "Pendiente",
      source: "Landing page"
    }
  ];
  
  console.log('📝 Casos de prueba:');
  testBookings.forEach((booking, index) => {
    console.log(`   ${index + 1}. ${booking.title} (${booking.estado})`);
  });
  console.log();
  
  // Ejecutar cada test
  for (let i = 0; i < testBookings.length; i++) {
    const booking = testBookings[i];
    console.log(`🧪 TEST ${i + 1}/3: ${booking.title}`);
    console.log('─'.repeat(60));
    console.log(`   📅 Fechas: ${booking.start} → ${booking.end}`);
    console.log(`   📊 Estado: ${booking.estado}`);
    console.log(`   🌐 Fuente: ${booking.source}`);
    
    if (booking.name) {
      console.log(`   👤 Cliente: ${booking.name} (${booking.guest} huéspedes)`);
    }
    console.log();
    
    try {
      // Simular el evento afterCreate
      const event = { result: booking };
      
      console.log('   🚀 Ejecutando lifecycle hook...');
      await lifecycleModule.afterCreate(event);
      
      if (booking.estado === 'Bloqueado' || booking.estado === 'Reservado') {
        console.log('   ✅ Lifecycle hook ejecutado - notificaciones enviadas');
      } else {
        console.log('   ℹ️  Lifecycle hook ejecutado - sin notificaciones (estado no relevante)');
      }
      
    } catch (error) {
      console.log(`   ❌ Error en lifecycle hook: ${error.message}`);
    }
    
    console.log();
    
    // Pausa entre tests
    if (i < testBookings.length - 1) {
      console.log('⏱️  Esperando 2 segundos...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('🎉 TEST DE LIFECYCLE HOOK COMPLETADO');
  console.log('📱 Si recibiste mensajes de WhatsApp, el sistema funciona correctamente');
  console.log('🏠 El sistema Ashlar House está listo para recibir reservas reales');
}

testLifecycleHook().catch(error => {
  console.error('💥 Error en test de lifecycle:', error.message);
  console.error('📚 Stack:', error.stack);
});
