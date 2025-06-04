// Test manual del lifecycle hook con logging mejorado
console.log('🧪 TESTING ENHANCED LIFECYCLE HOOK');
console.log('====================================');

// Simular el environment de Strapi
require('dotenv').config();
global.strapi = {
  log: {
    info: (msg) => console.log('📝 [STRAPI INFO]:', msg),
    error: (msg, err) => console.log('❌ [STRAPI ERROR]:', msg, err),
    warn: (msg) => console.log('⚠️ [STRAPI WARN]:', msg)
  }
};

// Cargar el módulo lifecycle
const lifecycleModule = require('../src/api/booking/content-types/booking/lifecycles.js');

// Mock event para simular una nueva reserva
const mockReservation = {
  result: {
    id: 123,
    estado: 'Reservado',
    start: '2025-06-04T10:00:00.000Z',
    end: '2025-06-05T10:00:00.000Z',
    source: 'Landing page',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+52-555-1234567',
    guest: '2',
    message: 'Reserva de prueba para verificar WhatsApp'
  }
};

console.log('\n📋 Simulando creación de reserva...');
console.log('Datos de la reserva:', JSON.stringify(mockReservation.result, null, 2));

async function testLifecycle() {
  try {
    console.log('\n🔄 Ejecutando lifecycle afterCreate...');
    await lifecycleModule.afterCreate(mockReservation);
    console.log('\n✅ Test completado exitosamente');
  } catch (error) {
    console.log('\n❌ Error durante el test:', error.message);
    console.log(error.stack);
  }
}

testLifecycle();
