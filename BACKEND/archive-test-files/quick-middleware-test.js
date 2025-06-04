/**
 * Test rápido para verificar si el middleware está funcionando
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'http://localhost:1337/api/bookings';

async function quickTest() {
  console.log('🧪 Test rápido del middleware global...\n');
  
  const bookingData = {
    data: {
      start: '2025-07-25',
      end: '2025-07-26',
      estado: 'Reservado',
      source: 'Landing page',
      name: 'Test Middleware Global',
      guest: '1',
      phone: '+52-999-888-7777',
      email: 'test@middleware.com',
      message: 'Test para verificar middleware global'
    }
  };
  
  try {
    console.log('📤 Creando reserva...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Reserva creada con ID: ${result.data.id}`);
      console.log('\n🔍 Revisa la consola de Strapi para ver:');
      console.log('   - 🚀 MIDDLEWARE WHATSAPP ACTIVADO');
      console.log('   - 🎯 Detectada creación de booking');
      console.log('   - 📝 Booking creado con ID');
      console.log('   - 🔔 Enviando WhatsApp');
    } else {
      console.log('❌ Error:', await response.text());
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickTest();
