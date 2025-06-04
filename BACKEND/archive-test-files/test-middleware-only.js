/**
 * Script optimizado para probar el middleware de WhatsApp
 * Asume que Strapi ya está corriendo en localhost:1337
 */

// Para compatibilidad con node-fetch v3
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require('dotenv').config();

const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api/bookings`;

console.log('🧪 PRUEBA MIDDLEWARE WHATSAPP (Con Strapi ya corriendo)\n');

async function createValidBooking() {
  console.log('📝 Creando reserva de prueba con datos válidos...');
    // Datos que cumplen con las validaciones de Strapi
  const bookingData = {
    data: {
      start: '2025-07-15', // Fecha en julio para evitar conflictos
      end: '2025-07-16',   // Un día después
      estado: 'Reservado', // Esto debe activar el middleware
      source: 'Landing page', // Cambiado según tu sugerencia
      name: 'Cliente Prueba WhatsApp Test',
      guest: '2', // String, no number
      phone: '+52-123-456-7890',
      email: 'test@whatsapp.com',
      message: 'Reserva de prueba para verificar notificaciones WhatsApp automáticas'
    }
  };
  
  console.log('📤 Enviando al API de Strapi...');
  console.log('🔍 Datos:', JSON.stringify(bookingData, null, 2));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
      const result = await response.json();
    console.log('\n✅ Reserva creada exitosamente:');
    console.log(`   📋 ID: ${result.data.id}`);
    
    // Verificar si los atributos existen antes de acceder
    if (result.data.attributes) {
      console.log(`   📅 Fechas: ${result.data.attributes.start} → ${result.data.attributes.end}`);
      console.log(`   📊 Estado: ${result.data.attributes.estado}`);
      console.log(`   👤 Cliente: ${result.data.attributes.name}`);
      console.log(`   📱 Huéspedes: ${result.data.attributes.guest}`);
      console.log(`   📍 Source: ${result.data.attributes.source}`);
    } else {
      console.log('   📋 Datos completos:', JSON.stringify(result.data, null, 2));
    };
    
    console.log('\n🔔 Si el middleware funciona correctamente, deberías recibir 2 notificaciones WhatsApp ahora...');
    console.log('📋 Revisa los logs de Strapi para ver la actividad del middleware');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Error creando reserva:', error.message);
    throw error;
  }
}

async function testBloqueadoBooking() {
  console.log('\n📝 Creando reserva con estado "Bloqueado"...');
    const bookingData = {
    data: {
      start: '2025-07-20', // Fechas en julio para evitar conflictos
      end: '2025-07-22',   // Rango de días para bloqueo
      estado: 'Bloqueado', // Estado diferente
      source: 'Otra',
      name: 'Bloqueo Mantenimiento Test',
      guest: '0', // Sin huéspedes para bloqueo
      phone: '',
      email: '',
      message: 'Bloqueo de prueba para verificar notificaciones'
    }
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
      const result = await response.json();
    console.log('✅ Bloqueo creado exitosamente:');
    console.log(`   📋 ID: ${result.data.id}`);
    
    // Verificar estructura de respuesta
    if (result.data.attributes) {
      console.log(`   📊 Estado: ${result.data.attributes.estado}`);
      console.log(`   📅 Fechas: ${result.data.attributes.start} → ${result.data.attributes.end}`);
    } else {
      console.log('   📋 Datos:', JSON.stringify(result.data, null, 2));
    };
    
    console.log('\n🔔 Debería llegar notificación de bloqueo...');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error creando bloqueo:', error.message);
  }
}

async function checkStrapi() {
  console.log('🔍 Verificando que Strapi esté corriendo...');
  
  try {
    const response = await fetch(`${STRAPI_URL}/_health`);
    if (response.ok) {
      console.log('✅ Strapi está funcionando correctamente\n');
      return true;
    } else {
      console.log('❌ Strapi responde pero con errores\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Strapi no está accesible en http://localhost:1337');
    console.log('💡 Asegúrate de que Strapi esté corriendo\n');
    return false;
  }
}

async function main() {
  try {
    // Verificar Strapi
    const strapiOk = await checkStrapi();
    
    if (!strapiOk) {
      console.log('❌ Inicia Strapi primero con: npm run develop');
      return;
    }
    
    // Crear reserva normal
    await createValidBooking();
    
    // Esperar un poco
    console.log('\n⏳ Esperando 3 segundos antes de la siguiente prueba...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Crear bloqueo
    await testBloqueadoBooking();
    
    console.log('\n🎉 ¡Pruebas completadas!');
    console.log('📱 Revisa tus teléfonos WhatsApp (+52-8119936655 y +52-8111755533)');
    console.log('📋 Revisa la consola de Strapi para ver los logs del middleware');
    console.log('\n🔍 Logs importantes a buscar en Strapi:');
    console.log('   - 🚀 MIDDLEWARE ACTIVADO');
    console.log('   - 🎯 Detectada creación de booking');
    console.log('   - 📝 Booking creado con ID');
    console.log('   - 🔔 Enviando WhatsApp');
    console.log('   - ✅ WhatsApp enviado exitosamente');
    
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error.message);
  }
}

// Ejecutar
main().catch(console.error);
