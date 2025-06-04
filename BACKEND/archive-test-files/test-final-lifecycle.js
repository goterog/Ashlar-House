// Test final del sistema de lifecycle hooks
console.log('🚀 Test Final - Lifecycle Hooks WhatsApp');
console.log('=========================================');

async function testLifecycleHooks() {
  try {
    console.log('📡 Verificando conexión con Strapi...');
    
    // Primer intento: verificar que Strapi esté corriendo
    let healthCheck;
    try {
      healthCheck = await fetch('http://localhost:1337/api/bookings?pagination[limit]=1');
      if (!healthCheck.ok) {
        throw new Error(`HTTP ${healthCheck.status}`);
      }
      console.log('✅ Strapi está corriendo correctamente');
    } catch (error) {
      console.log('❌ Strapi no está corriendo o no responde');
      console.log('   Por favor inicia Strapi con: npm run develop');
      return;
    }

    console.log('');
    console.log('📤 Creando nueva reserva para probar lifecycle hooks...');
    
    const bookingData = {
      data: {
        start: "2025-06-05T12:00:00.000Z",
        end: "2025-06-06T12:00:00.000Z",
        estado: "Reservado",
        source: "Test Lifecycle",
        name: "Ana González",
        guest: "4",
        phone: "+52-811-555-7777",
        email: "ana@test.com",
        message: "Prueba final del sistema de lifecycle hooks"
      }
    };

    const response = await fetch('http://localhost:1337/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Reserva creada exitosamente:');
      console.log(`   📝 ID: ${result.data.id}`);
      console.log(`   📅 Fechas: ${result.data.start} - ${result.data.end}`);
      console.log(`   📊 Estado: ${result.data.estado}`);
      console.log(`   👤 Cliente: ${result.data.name}`);
      console.log('');
      console.log('🔍 IMPORTANTE: Revisa la consola de Strapi para ver:');
      console.log('   - "🚀 WhatsApp Bootstrap - Configurando lifecycle hooks..."');
      console.log('   - "🎯 LIFECYCLE HOOK EJECUTADO - Nueva reserva creada!"');
      console.log('   - "📋 Booking obtenido: Reservado ..."');
      console.log('   - "📱 Enviando notificaciones WhatsApp..."');
      console.log('   - "✅ Notificación WhatsApp enviada exitosamente"');
      console.log('');
      console.log('📱 Si ves esos mensajes, el sistema está funcionando y deberías recibir WhatsApp');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Error al crear la reserva:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('❌ Error en el test:', error.message);
  }
}

console.log('Iniciando test en 2 segundos...');
setTimeout(testLifecycleHooks, 2000);
