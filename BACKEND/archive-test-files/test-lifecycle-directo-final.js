// Test directo del lifecycle hook - simulando lo que hace Strapi internamente
console.log('🔬 TEST DIRECTO DEL LIFECYCLE HOOK');
console.log('===================================');

// Cargar variables de entorno
require('dotenv').config();

// Simular el entorno de Strapi
global.strapi = {
  log: {
    info: (msg) => console.log('📝 [STRAPI INFO]:', msg),
    error: (msg, err) => console.log('❌ [STRAPI ERROR]:', msg, err),
    warn: (msg) => console.log('⚠️ [STRAPI WARN]:', msg)
  }
};

console.log('🔧 Variables de entorno:');
console.log('CALLMEBOT_API_KEY_1:', process.env.CALLMEBOT_API_KEY_1 ? '✅ Configurada' : '❌ NO configurada');
console.log('CALLMEBOT_API_KEY_2:', process.env.CALLMEBOT_API_KEY_2 ? '✅ Configurada' : '❌ NO configurada');

// Cargar el módulo lifecycle
let lifecycleModule;
try {
  lifecycleModule = require('../src/api/booking/content-types/booking/lifecycles.js');
  console.log('✅ Lifecycle module cargado exitosamente');
} catch (error) {
  console.error('❌ Error cargando lifecycle module:', error.message);
  process.exit(1);
}

// Verificar estructura del módulo
console.log('📋 Estructura del módulo:');
console.log('- Exports:', Object.keys(lifecycleModule));
console.log('- afterCreate existe:', typeof lifecycleModule.afterCreate);

// Crear datos de prueba que simulan una reserva real de Strapi
const mockEvent = {
  params: {
    data: {
      title: 'Test Directo Lifecycle',
      start: '2025-06-05',
      end: '2025-06-06',
      estado: 'Reservado',
      source: 'Landing page',
      name: 'Usuario Test Directo',
      email: 'test@directo.com',
      phone: '+52-555-777888',
      guest: '2',
      message: 'Test directo del sistema lifecycle'
    }
  },
  result: {
    id: 999,
    documentId: 'test-direct-id',
    title: 'Test Directo Lifecycle',
    start: '2025-06-05',
    end: '2025-06-06',
    estado: 'Reservado',
    source: 'Landing page',
    name: 'Usuario Test Directo',
    email: 'test@directo.com',
    phone: '+52-555-777888',
    guest: '2',
    message: 'Test directo del sistema lifecycle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
};

async function testDirectLifecycle() {
  console.log('\n🚀 EJECUTANDO LIFECYCLE HOOK DIRECTAMENTE...');
  console.log('==============================================');
  
  try {
    // Llamar al lifecycle hook directamente
    await lifecycleModule.afterCreate(mockEvent);
    
    console.log('\n✅ LIFECYCLE HOOK EJECUTADO EXITOSAMENTE');
    console.log('📝 Si viste los logs del WhatsApp arriba, ¡el sistema funciona!');
    console.log('📝 El problema es que Strapi no está ejecutando el hook automáticamente.');
    
  } catch (error) {
    console.error('\n❌ ERROR EN EL LIFECYCLE HOOK:');
    console.error(error);
  }
}

// Ejecutar el test
testDirectLifecycle();
