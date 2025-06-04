const https = require('https');
const { URL } = require('url');

// Función para enviar mensaje a CallMeBot
async function sendWhatsAppMessage(phoneNumber, message, apiKey) {
  return new Promise((resolve) => {
    try {
      console.log(`\n📱 Enviando mensaje a ${phoneNumber} con API key ${apiKey}`);
      console.log(`📝 Mensaje: ${message.substring(0, 100)}...`);
      
      const encodedMessage = encodeURIComponent(message);
      const urlString = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${apiKey}`;
      const url = new URL(urlString);
      
      console.log(`🔗 URL: ${urlString.substring(0, 100)}...`);
      
      const req = https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`📊 Status: ${res.statusCode}`);
          console.log(`📄 Response: ${data}`);
          
          if (res.statusCode === 200) {
            console.log(`✅ Mensaje enviado exitosamente a ${phoneNumber}`);
            resolve(true);
          } else {
            console.error(`❌ Error enviando mensaje a ${phoneNumber}: ${data}`);
            resolve(false);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(`❌ Error de conexión para ${phoneNumber}:`, error.message);
        resolve(false);
      });
      
      req.setTimeout(10000, () => {
        req.abort();
        console.error(`❌ Timeout para ${phoneNumber}`);
        resolve(false);
      });
      
    } catch (error) {
      console.error(`❌ Error general para ${phoneNumber}:`, error.message);
      resolve(false);
    }
  });
}

// Función para crear mensaje de prueba
function createTestMessage() {
  const today = new Date();
  const todayStr = today.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `🏠 *ASHLAR HOUSE - Nueva Reserva de Prueba*

📅 *Fecha:* ${todayStr}
🏷️ *Estado:* Reservado
👤 *Cliente:* Juan Pérez
📞 *Teléfono:* +52-81-1234-5678
📧 *Email:* test@example.com
🏠 *Propiedad:* Ashlar House
⏰ *Check-in:* ${todayStr}
⏰ *Check-out:* ${todayStr}
💰 *Total:* $150.00 USD

¡Nueva reserva confirmada! 🎉`;
}

async function testFullSystem() {
  console.log('🚀 Iniciando prueba completa del sistema WhatsApp\n');
  
  // Configuración de números y API keys
  const phoneNumbers = [
    { number: '+5218119936655', apiKey: '4639929', name: 'Número 1' },
    { number: '+5218111755533', apiKey: '1855584', name: 'Número 2' }
  ];
  
  const testMessage = createTestMessage();
  console.log('📝 Mensaje de prueba creado:', testMessage.substring(0, 200) + '...\n');
  
  let allSuccess = true;
  
  // Enviar a ambos números
  for (const config of phoneNumbers) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📱 Probando ${config.name}: ${config.number}`);
    console.log(`🔑 API Key: ${config.apiKey}`);
    console.log(`${'='.repeat(50)}`);
    
    const success = await sendWhatsAppMessage(config.number, testMessage, config.apiKey);
    if (!success) {
      allSuccess = false;
    }
    
    // Esperar 2 segundos entre envíos
    if (config !== phoneNumbers[phoneNumbers.length - 1]) {
      console.log('\n⏳ Esperando 2 segundos antes del siguiente envío...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (allSuccess) {
    console.log('🎉 ¡PRUEBA COMPLETA EXITOSA!');
    console.log('✅ Ambos números recibieron el mensaje correctamente');
    console.log('✅ Sistema listo para producción');
  } else {
    console.log('❌ PRUEBA FALLÓ');
    console.log('⚠️  Revisar configuración y API keys');
  }
  console.log('='.repeat(60));
}

// Ejecutar prueba
testFullSystem().catch(console.error);
