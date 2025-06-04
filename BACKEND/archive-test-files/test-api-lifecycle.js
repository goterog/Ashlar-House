// Test para verificar si lifecycle hooks funcionan con operaciones de API
console.log('🧪 TESTING API LIFECYCLE HOOKS');
console.log('====================================');

const fetch = require('node-fetch');

async function testAPIBooking() {
  const bookingData = {
    data: {
      title: 'Test API Lifecycle',
      start: '2025-06-05',
      end: '2025-06-06',
      estado: 'Reservado',
      source: 'Landing page',
      name: 'Test User API',
      email: 'test@api.com',
      phone: '+52-555-123456',
      guest: '2',
      message: 'Test desde API para verificar lifecycle hooks'
    }
  };

  try {
    console.log('📤 Enviando POST a /api/bookings...');
    console.log('Datos:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('http://localhost:1337/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking creado:', result.data.id);
      console.log('📋 Estado:', result.data.estado);
      console.log('\n⏰ Esperando logs del lifecycle hook en la consola de Strapi...');
      console.log('Deberías ver: 🚀🚀🚀 LIFECYCLE HOOK EJECUTADO! 🚀🚀🚀');
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

testAPIBooking();
