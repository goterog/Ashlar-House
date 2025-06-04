/**
 * Simulación completa del lifecycle para debug
 */

console.log('🔍 SIMULACIÓN DEL LIFECYCLE HOOK');
console.log('=====================================');

// Cargar configuración
require('dotenv').config();

// Simular el objeto strapi con logging
global.strapi = {
  log: {
    info: (...args) => console.log('📘 [INFO]', ...args),
    error: (...args) => console.log('❌ [ERROR]', ...args),
    warn: (...args) => console.log('⚠️  [WARN]', ...args)
  }
};

console.log('✅ Variables de entorno cargadas');
console.log('✅ Mock de Strapi creado');

// Cargar el lifecycle
let lifecycle;
try {
  lifecycle = require('../src/api/booking/content-types/booking/lifecycles.js');
  console.log('✅ Lifecycle hook cargado correctamente');
} catch (error) {
  console.log('❌ Error cargando lifecycle:', error.message);
  process.exit(1);
}

// Crear datos de prueba
const testBooking = {
  id: 999,
  estado: 'Reservado',
  start: new Date().toISOString(),
  end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
  source: 'Airbnb',
  name: 'Juan Pérez',
  guest: 2,
  phone: '+52-81-1234-5678',
  email: 'test@example.com',
  message: 'Reserva de prueba para verificar el sistema'
};

console.log('\\n📝 Datos de prueba creados:');
console.log(JSON.stringify(testBooking, null, 2));

// Simular el evento
const event = {
  result: testBooking
};

console.log('\\n🚀 Ejecutando lifecycle hook...');
console.log('=====================================');

// Ejecutar el hook
lifecycle.afterCreate(event)
  .then(() => {
    console.log('\\n🎉 ¡LIFECYCLE EJECUTADO EXITOSAMENTE!');
    console.log('📱 Si todo está configurado correctamente, deberías recibir');
    console.log('   mensajes de WhatsApp en ambos números en 1-3 minutos.');
    console.log('\\n📞 Números configurados:');
    console.log('   - +52-81-1993-6655 (API Key:', process.env.CALLMEBOT_API_KEY_1 + ')');
    console.log('   - +52-81-1175-5533 (API Key:', process.env.CALLMEBOT_API_KEY_2 + ')');
  })
  .catch(error => {
    console.log('\\n💥 ERROR EN EL LIFECYCLE:');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  });
