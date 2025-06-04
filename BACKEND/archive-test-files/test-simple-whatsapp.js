/**
 * Script simple para probar el middleware de WhatsApp
 * Crea una reserva directamente y verifica las notificaciones
 */

// Para compatibilidad con node-fetch v3
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require('dotenv').config();

const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api/bookings`;

console.log('🧪 PRUEBA SIMPLE DEL SISTEMA WHATSAPP\n');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log(`✅ CALLMEBOT_API_KEY_1: ${process.env.CALLMEBOT_API_KEY_1 ? 'Configurada' : 'NO CONFIGURADA'}`);
console.log(`✅ CALLMEBOT_API_KEY_2: ${process.env.CALLMEBOT_API_KEY_2 ? 'Configurada' : 'NO CONFIGURADA'}\n`);

async function testWhatsAppDirect() {
  console.log('📱 Probando API WhatsApp directamente...\n');
  
  const testMessage = `🧪 PRUEBA DIRECTA: ${new Date().toLocaleString('es-MX')} - Test sistema WhatsApp`;
  
  const phones = [
    { number: '+5218119936655', apiKey: process.env.CALLMEBOT_API_KEY_1, name: 'Teléfono 1' },
    { number: '+5218111755533', apiKey: process.env.CALLMEBOT_API_KEY_2, name: 'Teléfono 2' }
  ];
  
  for (const phone of phones) {
    try {
      const cleanPhone = phone.number.replace(/[-\s]/g, '');
      const encodedMessage = encodeURIComponent(testMessage);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMessage}&apikey=${phone.apiKey}`;
      
      console.log(`📤 Enviando a ${phone.name} (${phone.number})...`);
      
      const response = await fetch(url);
      const responseText = await response.text();
      
      if (response.ok) {
        console.log(`✅ ${phone.name}: WhatsApp enviado exitosamente`);
        console.log(`   Respuesta: ${responseText}`);
      } else {
        console.log(`❌ ${phone.name}: Error ${response.status}`);
        console.log(`   Respuesta: ${responseText}`);
      }
      
      console.log(''); // Línea en blanco
      
    } catch (error) {
      console.log(`❌ ${phone.name}: Error - ${error.message}\n`);
    }
  }
}

async function checkStrapiStatus() {
  console.log('🔍 Verificando estado de Strapi...');
  
  try {
    const response = await fetch(`${STRAPI_URL}/_health`);
    if (response.ok) {
      console.log('✅ Strapi está ejecutándose correctamente\n');
      return true;
    } else {
      console.log('❌ Strapi responde pero con errores\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Strapi no está ejecutándose o no es accesible');
    console.log('💡 Asegúrate de ejecutar: npm run develop');
    console.log('💡 O ejecuta: node test-complete-system.js para iniciar automáticamente\n');
    return false;
  }
}

async function createTestReservation() {
  console.log('📝 Creando reserva de prueba...');
  
  const bookingData = {
    data: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'Reservado', // Esto debe activar el middleware
      source: 'Otra', // Cambiado: debe ser uno de los valores válidos
      name: 'Usuario Prueba WhatsApp',
      guest: '2', // Cambiado: debe ser string, no number
      phone: '+52-123-456-7890',
      email: 'test@prueba.com',
      message: 'Reserva de prueba para verificar notificaciones WhatsApp'
    }
  };
  
  try {
    console.log('📤 Enviando datos al API...');
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
    console.log('✅ Reserva creada exitosamente:');
    console.log(`   📋 ID: ${result.data.id}`);
    console.log(`   📅 Fechas: ${result.data.attributes.start} → ${result.data.attributes.end}`);
    console.log(`   📊 Estado: ${result.data.attributes.estado}`);
    console.log(`   👤 Cliente: ${result.data.attributes.name}\n`);
    
    console.log('🔔 Si el middleware funciona correctamente, deberías recibir notificaciones WhatsApp ahora...');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error creando reserva:', error.message);
    throw error;
  }
}

async function main() {
  try {
    // 1. Probar WhatsApp directamente
    await testWhatsAppDirect();
    
    // 2. Verificar Strapi
    const strapiOk = await checkStrapiStatus();
    
    if (strapiOk) {
      // 3. Crear reserva de prueba
      await createTestReservation();
      
      console.log('\n🎉 ¡Prueba completada!');
      console.log('📱 Revisa tus teléfonos para confirmar las notificaciones');
      console.log('📋 Revisa los logs de Strapi para ver la actividad del middleware');
    } else {
      console.log('\n⚠️  Inicia Strapi primero para probar el middleware completo');
    }
    
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error.message);
  }
}

// Ejecutar
main().catch(console.error);
