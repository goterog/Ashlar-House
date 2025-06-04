// Test directo del middleware - Creación de booking
console.log('🚀 Iniciando test del middleware WhatsApp...');

async function testMiddleware() {
  try {
    const bookingData = {
      data: {
        start: "2025-06-04T12:00:00.000Z",
        end: "2025-06-05T12:00:00.000Z",
        estado: "Reservado",
        source: "Test Middleware",
        name: "Pedro Prueba",
        guest: "2",
        phone: "+52-811-123-4567",
        email: "pedro@test.com",
        message: "Prueba del middleware desde Node.js"
      }
    };

    console.log('📤 Enviando datos del booking...');
    
    const response = await fetch('http://localhost:1337/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking creado exitosamente:');
      console.log(`   ID: ${result.data.id}`);
      console.log(`   Estado: ${result.data.estado}`);
      console.log(`   Fechas: ${result.data.start} - ${result.data.end}`);
      console.log('');
      console.log('🔍 Ahora revisa la consola de Strapi para ver los logs del middleware...');
    } else {
      const errorText = await response.text();
      console.log('❌ Error al crear booking:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMiddleware();
