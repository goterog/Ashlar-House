/**
 * Script completo para probar el sistema de notificaciones WhatsApp
 * Este script:
 * 1. Verifica las variables de entorno
 * 2. Inicia Strapi
 * 3. Crea una reserva de prueba
 * 4. Verifica que se envíen las notificaciones WhatsApp
 */

const { spawn } = require('child_process');
// Para compatibilidad con node-fetch v3
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const fs = require('fs');

// Configuración
const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api/bookings`;

// Cargar variables de entorno
require('dotenv').config();

console.log('🚀 Iniciando prueba completa del sistema WhatsApp...\n');

// Verificar variables de entorno
function checkEnvironmentVariables() {
  console.log('📋 Verificando variables de entorno...');
  
  const requiredVars = ['CALLMEBOT_API_KEY_1', 'CALLMEBOT_API_KEY_2'];
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      console.log(`✅ ${varName}: ${process.env[varName].substring(0, 4)}****`);
    }
  });
  
  if (missing.length > 0) {
    console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ Todas las variables de entorno están configuradas\n');
}

// Función para esperar que Strapi esté listo
async function waitForStrapi(maxAttempts = 30) {
  console.log('⏳ Esperando que Strapi esté listo...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${STRAPI_URL}/_health`);
      if (response.ok) {
        console.log('✅ Strapi está listo!\n');
        return true;
      }
    } catch (error) {
      // Continuar esperando
    }
    
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('❌ Strapi no respondió después de varios intentos');
}

// Función para crear una reserva de prueba
async function createTestBooking() {
  console.log('📝 Creando reserva de prueba...');
    const bookingData = {
    data: {
      start: new Date().toISOString().split('T')[0], // Hoy
      end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mañana
      estado: 'Reservado', // Esto debería activar las notificaciones
      source: 'Airbnb', // Valor válido según validación
      name: 'Juan Pérez TEST WhatsApp',
      guest: '2', // String según validación
      phone: '+52-123-456-7890',
      email: 'test@example.com',
      message: 'Esta es una reserva de prueba para verificar el sistema WhatsApp'
    }
  };
  
  console.log('📤 Datos de la reserva:', JSON.stringify(bookingData, null, 2));
  
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
    console.log('✅ Reserva creada exitosamente:');
    console.log(`   ID: ${result.data.id}`);
    console.log(`   Estado: ${result.data.attributes.estado}`);
    console.log(`   Fechas: ${result.data.attributes.start} a ${result.data.attributes.end}`);
    
    return result.data;
    
  } catch (error) {
    console.error('❌ Error creando reserva:', error.message);
    throw error;
  }
}

// Función para probar las APIs de WhatsApp directamente
async function testWhatsAppAPIs() {
  console.log('\n📱 Probando APIs de WhatsApp directamente...');
  
  const testMessage = `🧪 PRUEBA SISTEMA: ${new Date().toLocaleString('es-MX')} - Sistema WhatsApp funcionando correctamente`;
  
  const phones = [
    { number: '+5218119936655', apiKey: process.env.CALLMEBOT_API_KEY_1 },
    { number: '+5218111755533', apiKey: process.env.CALLMEBOT_API_KEY_2 }
  ];
  
  for (const phone of phones) {
    try {
      const cleanPhone = phone.number.replace(/[-\s]/g, '');
      const encodedMessage = encodeURIComponent(testMessage);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMessage}&apikey=${phone.apiKey}`;
      
      console.log(`📤 Enviando a ${phone.number}...`);
      
      const response = await fetch(url);
      const responseText = await response.text();
      
      if (response.ok) {
        console.log(`✅ WhatsApp enviado exitosamente a ${phone.number}`);
      } else {
        console.log(`❌ Error enviando a ${phone.number}: ${responseText}`);
      }
      
      // Esperar un poco entre envíos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error con ${phone.number}: ${error.message}`);
    }
  }
}

// Función principal
async function main() {
  try {
    // Verificar variables de entorno
    checkEnvironmentVariables();
    
    // Probar APIs de WhatsApp primero
    await testWhatsAppAPIs();
    
    console.log('\n🔄 Iniciando Strapi...');
    
    // Iniciar Strapi
    const strapiProcess = spawn('npm', ['run', 'develop'], {
      cwd: path.join(__dirname),
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    // Manejar salida de Strapi
    strapiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server started') || output.includes('Welcome')) {
        console.log('🎉 Strapi iniciado correctamente');
      }
      // Solo mostrar logs importantes
      if (output.includes('MIDDLEWARE') || output.includes('WhatsApp') || output.includes('ERROR')) {
        console.log('[STRAPI]', output.trim());
      }
    });
    
    strapiProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('Warning') && !error.includes('warning')) {
        console.error('[STRAPI ERROR]', error.trim());
      }
    });
    
    // Esperar que Strapi esté listo
    await waitForStrapi();
    
    // Crear reserva de prueba
    const booking = await createTestBooking();
    
    console.log('\n✅ ¡Prueba completa finalizada!');
    console.log('📱 Revisa tus dispositivos WhatsApp para ver las notificaciones');
    console.log('\n💡 Presiona Ctrl+C para detener Strapi cuando termines');
    
    // Mantener el proceso activo
    process.on('SIGINT', () => {
      console.log('\n🛑 Deteniendo Strapi...');
      strapiProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main, createTestBooking, testWhatsAppAPIs };
