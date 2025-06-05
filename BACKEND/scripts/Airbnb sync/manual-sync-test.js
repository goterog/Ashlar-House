// manual-sync-test.js
// Script para probar manualmente la sincronización (simulando el cron)
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api/bookings';

async function triggerManualSync() {
  console.log('🔄 TRIGGER MANUAL SYNC - SIMULANDO CRON JOB');
  console.log('==========================================\n');

  try {
    // Verificar conexión a Strapi
    console.log('🔌 Verificando conexión a Strapi...');
    const healthCheck = await axios.get('http://localhost:1337/admin');
    console.log('✅ Strapi está funcionando\n');

    // Crear un booking de prueba para disparar el lifecycle hook
    console.log('📝 Creando booking de prueba para verificar sistema...');
    
    const testBooking = {
      data: {
        title: 'Test Sync Manual',
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
        estado: 'Reservado',
        source: 'Landing page', 
        name: 'Test Usuario',
        email: 'test@manual.com',
        phone: '+52-555-123456',
        guest: '2',
        message: 'Test manual de sincronización',
        UID: `MANUAL-TEST-${Date.now()}`
      }
    };

    const response = await axios.post(STRAPI_URL, testBooking);
    console.log('✅ Booking de prueba creado:', response.data.data.id);
    console.log('📱 Si el sistema está configurado correctamente, deberías ver logs de WhatsApp en la consola de Strapi');
    
    console.log('\n🎯 RESUMEN:');
    console.log('- ✅ Strapi funcionando');
    console.log('- ✅ Booking de prueba creado');
    console.log('- 🔄 El cron job automático se ejecutará cada 3 horas');
    console.log('- 📱 Los lifecycle hooks deberían enviar WhatsApp automáticamente');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 SOLUCIÓN:');
      console.log('1. Asegúrate de que Strapi esté funcionando: npm run develop');
      console.log('2. Verifica que esté en http://localhost:1337');
    }
  }
}

triggerManualSync();
