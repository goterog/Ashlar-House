/**
 * Test simple de WhatsApp usando https nativo de Node.js
 */

require('dotenv').config();
const https = require('https');
const { URL } = require('url');

// Función para enviar mensaje usando https nativo
function sendWhatsAppMessage(phoneNumber, message, apiKey) {
  return new Promise((resolve, reject) => {
    console.log(`📱 Enviando a ${phoneNumber} con API key ${apiKey}`);
    
    const encodedMessage = encodeURIComponent(message);
    const urlString = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
    const url = new URL(urlString);
    
    console.log(`🔗 URL: ${urlString.substring(0, 100)}...`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Ashlar-House/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📄 Response: ${data}`);
        
        if (res.statusCode === 200) {
          console.log('✅ Mensaje enviado exitosamente');
          resolve({ success: true, response: data });
        } else {
          console.log('❌ Error en el envío');
          resolve({ success: false, response: data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      reject(error);
    });
    
    req.on('timeout', () => {
      console.log('❌ Timeout de conexión');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

async function testWhatsApp() {
  console.log('🚀 Test simple de WhatsApp - Ashlar House\n');
  
  // Verificar configuración
  const apiKey1 = process.env.CALLMEBOT_API_KEY_1;
  const apiKey2 = process.env.CALLMEBOT_API_KEY_2;
  
  console.log(`API Key 1: ${apiKey1 ? '✅ ' + apiKey1 : '❌ No configurada'}`);
  console.log(`API Key 2: ${apiKey2 ? '✅ ' + apiKey2 : '❌ No configurada'}\n`);
  
  if (!apiKey1) {
    console.log('❌ No se puede continuar sin API Key 1');
    return;
  }
  
  // Mensaje de prueba
  const mensaje = `🏠 *ASHLAR HOUSE - Test del Sistema*

📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
⏰ Hora: ${new Date().toLocaleTimeString('es-ES')}
🔧 Estado: Prueba del sistema de notificaciones

✅ Sistema funcionando correctamente!`;
  
  console.log('📝 Mensaje a enviar:');
  console.log(mensaje);
  console.log('\n' + '='.repeat(50));
  
  // Test con el primer número
  try {
    console.log('\n📞 Probando primer número: +5218119936655');
    const result1 = await sendWhatsAppMessage('+5218119936655', mensaje, apiKey1);
    
    if (result1.success) {
      console.log('🎉 ¡Primer número OK!');
    } else {
      console.log('⚠️  Problema con primer número');
    }
  } catch (error) {
    console.log(`❌ Error con primer número: ${error.message}`);
  }
  
  // Esperar 3 segundos entre envíos
  console.log('\n⏳ Esperando 3 segundos...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test con el segundo número si tenemos API key
  if (apiKey2) {
    try {
      console.log('\n📞 Probando segundo número: +5218111755533');
      const result2 = await sendWhatsAppMessage('+5218111755533', mensaje, apiKey2);
      
      if (result2.success) {
        console.log('🎉 ¡Segundo número OK!');
      } else {
        console.log('⚠️  Problema con segundo número');
      }
    } catch (error) {
      console.log(`❌ Error con segundo número: ${error.message}`);
    }
  } else {
    console.log('\n⏭️  Saltando segundo número (no hay API key)');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completado');
  console.log('📲 Revisa WhatsApp en 1-3 minutos');
  console.log('='.repeat(50));
}

// Ejecutar test
testWhatsApp().catch(error => {
  console.error('\n💥 ERROR:', error.message);
});
