// filepath: c:\Users\Guillermo Otero\Cabaña Hanuman\BACKEND\test-with-verification.js
/**
 * Test completo con verificación de middleware
 * Crea una reserva y verifica que se envíen las notificaciones WhatsApp
 */

// Usar fetch nativo de Node.js 18+

async function testCompleteSystem() {
  console.log('🧪 Test completo del sistema WhatsApp...');
  
  try {
    // 1. Crear una reserva de prueba
    console.log('📤 Creando reserva de prueba...');
    
    const bookingData = {
      data: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 día
        estado: 'Reservado',
        source: 'Test Script',
        name: 'Juan Pérez',
        guest: '2',
        phone: '+52-811-123-4567',
        email: 'juan@example.com',
        message: 'Reserva de prueba para verificar notificaciones WhatsApp'
      }
    };

    const response = await fetch('http://localhost:1337/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Reserva creada exitosamente con ID: ${result.data.id}`);
    
    // 2. Esperar un momento para que el middleware procese
    console.log('⏳ Esperando procesamiento del middleware (5 segundos)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 3. Verificar que la reserva existe en la base de datos
    console.log('🔍 Verificando reserva en base de datos...');
    const verifyResponse = await fetch(`http://localhost:1337/api/bookings/${result.data.id}?populate=*`);
    
    if (verifyResponse.ok) {
      const booking = await verifyResponse.json();
      console.log(`📋 Reserva verificada: Estado=${booking.data.attributes.estado}, Nombre=${booking.data.attributes.name}`);
      
      // 4. Información para el usuario
      console.log('\n🎯 VERIFICACIÓN MANUAL REQUERIDA:');
      console.log('1. Revisa la consola de Strapi para ver los logs del middleware:');
      console.log('   - 🚀 MIDDLEWARE WHATSAPP ACTIVADO');
      console.log('   - 🎯 Detectada creación de booking');
      console.log('   - 📝 Booking creado con ID');
      console.log('   - 🔔 Enviando WhatsApp');
      console.log('   - ✅ WhatsApp enviado exitosamente');
      
      console.log('\n2. Revisa WhatsApp en los números:');
      console.log('   - +52-811-993-6655');
      console.log('   - +52-811-175-5533');
      
      console.log('\n3. El mensaje debería contener:');
      console.log(`   - "Se ha reservado el día ${new Date().toLocaleDateString('es-MX')}"`);
      console.log('   - "Nombre: Juan Pérez"');
      console.log('   - "Número de huéspedes: 2"');
      console.log('   - "Teléfono: +52-811-123-4567"');
      
      return {
        success: true,
        bookingId: result.data.id,
        booking: booking.data
      };
    } else {
      throw new Error('No se pudo verificar la reserva creada');
    }
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    return { success: false, error: error.message };
  }
}

// Ejecutar el test
testCompleteSystem()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Test completado. Revisa manualmente los logs de Strapi y WhatsApp.');
    } else {
      console.log('\n💥 Test falló:', result.error);
    }
  })
  .catch(error => {
    console.error('💥 Error inesperado:', error);
  });
